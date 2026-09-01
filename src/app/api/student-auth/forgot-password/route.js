import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendPatientOtpEmail } from '@/lib/email';

// POST - Request password reset (OTP flow for students)
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email } = body;

    if (!username && !email) {
      return NextResponse.json({ error: 'Username or email is required' }, { status: 400 });
    }

    // Find the student user by username or email
    let studentUser;
    if (username) {
      const result = await query(
        `SELECT su.id as user_id, su.student_id, su.username, s.email, s.name
         FROM student_users su
         JOIN students s ON su.student_id = s.id
         WHERE su.username = $1 AND su.is_active = true`,
        [username]
      );
      studentUser = result.rows[0];
    } else {
      const result = await query(
        `SELECT su.id as user_id, su.student_id, su.username, s.email, s.name
         FROM student_users su
         JOIN students s ON su.student_id = s.id
         WHERE s.email = $1 AND su.is_active = true`,
        [email]
      );
      studentUser = result.rows[0];
    }

    // Always return generic success for security
    if (!studentUser) {
      return NextResponse.json({ success: true, message: 'If an account exists with that information, a password reset email has been sent.' });
    }

    // Ensure password_reset_otps table exists
    await query(`
      CREATE TABLE IF NOT EXISTS password_reset_otps (
        id SERIAL PRIMARY KEY,
        user_type TEXT,
        user_id INTEGER,
        email TEXT,
        otp_hash TEXT,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Remove existing OTPs for this user/email
    await query(`DELETE FROM password_reset_otps WHERE user_id = $1 OR email = $2`, [studentUser.user_id, studentUser.email]);

    // Insert the hashed OTP
    await query(
      `INSERT INTO password_reset_otps (user_type, user_id, email, otp_hash, expires_at) VALUES ($1, $2, $3, $4, $5)`,
      ['student', studentUser.user_id, studentUser.email, otpHash, expiresAt]
    );

    // Send OTP email (reuse patient OTP email helper)
    const emailResult = await sendPatientOtpEmail(studentUser.email, otp, studentUser.username);
    if (!emailResult.success) console.warn('Failed to send student OTP email:', emailResult.error);

    return NextResponse.json({ success: true, message: 'If an account exists with that information, a password reset email has been sent.' });

  } catch (error) {
    console.error('Student forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
