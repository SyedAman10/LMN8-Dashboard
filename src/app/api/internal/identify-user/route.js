import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * POST /api/internal/identify-user
 * Internal endpoint called by luminate-backend to identify user type by email.
 *
 * Request body: { email: string }
 * Response: { user_type: "patient"|"student"|"default" }
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
      `SELECT 1 FROM patients WHERE email = $1 AND status = 'active' LIMIT 1`,
      [email]
    );

    if (patientResult.rows.length > 0) {
      return NextResponse.json({ user_type: 'patient' });
    }

    // 2. Check students table
    const studentResult = await query(
      `SELECT 1 FROM students WHERE email = $1 AND status = 'active' LIMIT 1`,
      [email]
    );

    if (studentResult.rows.length > 0) {
      return NextResponse.json({ user_type: 'student' });
    }

    // 3. Not found in either table
    return NextResponse.json({ user_type: 'default' });

  } catch (error) {
    console.error('[INTERNAL] identify-user error:', error);
    return NextResponse.json({ user_type: 'default' });
  }
}
