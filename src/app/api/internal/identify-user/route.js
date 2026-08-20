import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * POST /api/internal/identify-user
 * Internal endpoint called by luminate-backend to identify user type by email.
 *
 * Request body: { email: string }
 * Response: { user_type: "patient"|"student"|"default", data: {...} | null }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // 1. Check patients table
    const patientResult = await query(
      `SELECT p.name, p.diagnosis, p.medical_history, p.therapist,
              p.total_sessions, p.sessions_completed, p.status, p.notes,
              pu.last_login
       FROM patients p
       LEFT JOIN patient_users pu ON pu.patient_id = p.id AND pu.is_active = true
       WHERE p.email = $1 AND p.status = 'active'
       LIMIT 1`,
      [email]
    );

    if (patientResult.rows.length > 0) {
      const row = patientResult.rows[0];
      return NextResponse.json({
        user_type: 'patient',
        data: {
          name: row.name,
          diagnosis: row.diagnosis,
          medical_history: row.medical_history,
          therapist: row.therapist,
          total_sessions: row.total_sessions,
          sessions_completed: row.sessions_completed,
          status: row.status,
          notes: row.notes,
          last_login: row.last_login,
        },
      });
    }

    // 2. Check students table
    const studentResult = await query(
      `SELECT s.name, s.program, s.enrollment_year, s.status, s.notes,
              su.last_login
       FROM students s
       LEFT JOIN student_users su ON su.student_id = s.id AND su.is_active = true
       WHERE s.email = $1 AND s.status = 'active'
       LIMIT 1`,
      [email]
    );

    if (studentResult.rows.length > 0) {
      const row = studentResult.rows[0];
      return NextResponse.json({
        user_type: 'student',
        data: {
          name: row.name,
          program: row.program,
          enrollment_year: row.enrollment_year,
          status: row.status,
          notes: row.notes,
          last_login: row.last_login,
        },
      });
    }

    // 3. Not found in either table
    return NextResponse.json({
      user_type: 'default',
      data: null,
    });

  } catch (error) {
    console.error('[INTERNAL] identify-user error:', error);
    return NextResponse.json(
      { user_type: 'default', data: null },
      { status: 200 }
    );
  }
}
