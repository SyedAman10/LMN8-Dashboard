import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { sendHomeworkStatusNotification } from '@/lib/email';
import jwt from 'jsonwebtoken';

function getAppTokenPayload(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : request.cookies.get('app_token')?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');
  } catch (error) {
    return null;
  }
}

// GET - list homework items. Accepts ?patientId= to filter by patient or ?studentId= to filter by student
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const studentId = url.searchParams.get('studentId');

    const appUser = getAppTokenPayload(request);
    const auth = appUser ? null : await getAuthUser(request);

    // App users may only fetch homework assigned to their own patient/student record.
    // Dashboard users may only fetch homework assigned by their own clinic/college account.
    if (patientId) {
      if (appUser && (appUser.type !== 'patient' || String(appUser.patientId) !== String(patientId))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (!appUser && !auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      if (!appUser && auth.user?.role === 'lmn8_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

      const result = await query(
        appUser
          ? `SELECT * FROM assigned_homework WHERE patient_id = $1 ORDER BY created_at DESC`
          : `SELECT * FROM assigned_homework WHERE patient_id = $1 AND assigned_by = $2 ORDER BY created_at DESC`,
        appUser ? [patientId] : [patientId, auth.clinicianId]
      );

      return NextResponse.json({ homeworks: result.rows });
    }

    if (studentId) {
      if (appUser && (appUser.type !== 'student' || String(appUser.studentId) !== String(studentId))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (!appUser && !auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      if (!appUser && auth.user?.role === 'lmn8_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

      const result = await query(
        appUser
          ? `SELECT * FROM assigned_homework WHERE student_id = $1 ORDER BY created_at DESC`
          : `SELECT * FROM assigned_homework WHERE student_id = $1 AND assigned_by = $2 ORDER BY created_at DESC`,
        appUser ? [studentId] : [studentId, auth.clinicianId]
      );

      return NextResponse.json({ homeworks: result.rows });
    }

    // If no patientId/studentId provided, require dashboard auth and return homeworks created by the user.
    if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const userId = auth.user?.id || auth.clinicianId || auth.staffId || auth.id;
    const result = await query(
      `SELECT * FROM assigned_homework WHERE assigned_by = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json({ homeworks: result.rows });
  } catch (error) {
    console.error('Get homework error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - create a new homework assignment
export async function POST(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { patientId, studentId, title, type, content, audioUrl, transcript } = body;

    if (!patientId && !studentId) {
      return NextResponse.json({ error: 'patientId or studentId is required' }, { status: 400 });
    }

    const userId = auth.user?.id || auth.clinicianId || auth.staffId || auth.id;
    const result = await query(
      `INSERT INTO assigned_homework (assigned_by, patient_id, student_id, title, type, content, audio_url, transcript)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, patientId || null, studentId || null, title || null, type || 'text', content || null, audioUrl || null, transcript || null]
    );

    return NextResponse.json({ homework: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create homework error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH - update homework status (completed / not_understood)
export async function PATCH(request) {
  try {
    const auth = await getAuthUser(request);
    const appUser = auth ? null : getAppTokenPayload(request);
    if (!auth && !appUser) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    if (!['completed', 'not_understood'].includes(status)) {
      return NextResponse.json({ error: 'Invalid homework status' }, { status: 400 });
    }

    if (appUser?.type === 'patient') {
      const owner = await query(
        `SELECT id FROM assigned_homework WHERE id = $1 AND patient_id = $2`,
        [id, appUser.patientId]
      );
      if (owner.rows.length === 0) return NextResponse.json({ error: 'Homework not found' }, { status: 404 });
    } else if (appUser?.type === 'student') {
      const owner = await query(
        `SELECT id FROM assigned_homework WHERE id = $1 AND student_id = $2`,
        [id, appUser.studentId]
      );
      if (owner.rows.length === 0) return NextResponse.json({ error: 'Homework not found' }, { status: 404 });
    }

    // Not understood records a summary but remains pending until it is completed.
    const homeworkStatus = status === 'not_understood' ? 'assigned' : status;
    const result = await query(
      `UPDATE assigned_homework SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [homeworkStatus, id]
    );

    const updated = result.rows[0];
    if (!updated) return NextResponse.json({ error: 'Homework not found' }, { status: 404 });

    // Save a concise summary of the status change for the assigner to view in the UI
    try {
      const homeworkDetails = updated.content || updated.transcript || '';




      const summaryText = `Homework: ${updated.title || 'Untitled homework'}${homeworkDetails ? `\n${homeworkDetails.slice(0, 400)}` : ''}`;

      await query(
        `INSERT INTO homework_summaries (homework_id, assigner_id, patient_id, student_id, status, summary) VALUES ($1, $2, $3, $4, $5, $6)`,
        [updated.id, updated.assigned_by || null, updated.patient_id || null, updated.student_id || null, status, summaryText]
      );
    } catch (summaryErr) {
      console.error('Failed to save homework summary:', summaryErr.message);
    }

    // If HW_SUMMARIES_ONLY is enabled, do not send email notifications. Summaries will be shown in the UI instead.
    const summariesOnly = (process.env.HW_SUMMARIES_ONLY === 'true');
    if (!summariesOnly) {
      try {
        const assigner = await query(`SELECT id, email, full_name FROM users WHERE id = $1`, [updated.assigned_by]);
        const assignerRow = assigner.rows[0];
        if (assignerRow?.email) {
          await sendHomeworkStatusNotification(assignerRow.email, assignerRow.full_name || 'Clinician', updated.patient_id ? `Patient #${updated.patient_id}` : 'Student', updated.title || '', status);
        }
      } catch (notifyErr) {
        console.error('Failed to send homework status notification:', notifyErr.message);
      }
    } else {
      console.log('HW_SUMMARIES_ONLY enabled - skipped sending email notification for homework status change.');
    }

    return NextResponse.json({ homework: updated });
  } catch (error) {
    console.error('Update homework error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}


