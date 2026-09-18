import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { sendHomeworkStatusNotification } from '@/lib/email';

// GET - list homework items. Accepts ?patientId= to filter by patient
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const studentId = url.searchParams.get('studentId');

    // If filtering by patientId, return patient homework
    if (patientId) {
      const result = await query(
        `SELECT * FROM assigned_homework WHERE patient_id = $1 ORDER BY created_at DESC`,
        [patientId]
      );

      return NextResponse.json({ homeworks: result.rows });
    }

    // If filtering by studentId, return student homework
    if (studentId) {
      const result = await query(
        `SELECT * FROM assigned_homework WHERE student_id = $1 ORDER BY created_at DESC`,
        [studentId]
      );

      return NextResponse.json({ homeworks: result.rows });
    }

    // If no patientId provided, require auth and return homeworks created by the user
    const auth = await getAuthUser(request);
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
      [userId, patientId || null, studentId || null, title || null, type || 'text', content || null, null, transcript || null]
    );

    return NextResponse.json({ homework: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create homework error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH - update homework status (complete / not_understood)
export async function PATCH(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });

    // Update only allowed fields
    const result = await query(
      `UPDATE assigned_homework SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    const updated = result.rows[0];

    // Save a concise summary of the status change for the assigner to view in the UI
    try {
      const summaryLines = [];
      summaryLines.push(`Homework "${updated.title || ''}" updated to ${status}`);
      if (updated.transcript) summaryLines.push(`Transcript: ${updated.transcript.slice(0, 400)}`);
      summaryLines.push(`Updated at: ${new Date().toISOString()}`);
      const summaryText = summaryLines.join('\n');

      await query(
        `INSERT INTO homework_summaries (homework_id, assigner_id, patient_id, student_id, status, summary) VALUES ($1, $2, $3, $4, $5, $6)`,
        [updated.id, updated.assigned_by || null, updated.patient_id || null, updated.student_id || null, status, summaryText]
      );
    } catch (summaryErr) {
      console.error('Failed to save homework summary:', summaryErr.message);
    }

    // If HW_SUMMARIES_ONLY is enabled, do not send email notifications — summaries will be shown in the UI instead
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
      console.log('HW_SUMMARIES_ONLY enabled — skipped sending email notification for homework status change.');
    }

    return NextResponse.json({ homework: updated });
  } catch (error) {
    console.error('Update homework error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
