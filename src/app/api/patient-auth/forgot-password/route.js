import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendPatientOtpEmail } from '@/lib/email';

// POST - Request password reset (mobile app OTP flow)
export async function POST(request) {
  try {
    console.log('🔐 Patient Forgot Password (OTP) API called');
    const body = await request.json();
    const { username, email } = body;

    console.log('📝 Password reset request for:', { username, email });

    if (!username && !email) {
      console.log('❌ No username or email provided');
      return NextResponse.json({ error: 'Username or email is required' }, { status: 400 });
    }

    // Find the patient user by username or email
    let patientUser;
    if (username) {
      const result = await query(
        `SELECT pu.id as user_id, pu.patient_id, pu.username, p.email, p.name
         FROM patient_users pu
         JOIN patients p ON pu.patient_id = p.id
         WHERE pu.username = $1 AND pu.is_active = true`,
        [username]
      );
      patientUser = result.rows[0];
    } else {
      const result = await query(
        `SELECT pu.id as user_id, pu.patient_id, pu.username, p.email, p.name
         FROM patient_users pu
         JOIN patients p ON pu.patient_id = p.id
         WHERE p.email = $1 AND pu.is_active = true`,
        [email]
      );
      patientUser = result.rows[0];
    }

    // For security, always return success even if user not found
    if (!patientUser) {
      console.log('⚠️ Patient not found, returning generic success');
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
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Remove existing OTPs for this user/email
    await query(`DELETE FROM password_reset_otps WHERE user_id = $1 OR email = $2`, [patientUser.user_id, patientUser.email]);

    // Insert the hashed OTP
    await query(
      `INSERT INTO password_reset_otps (user_type, user_id, email, otp_hash, expires_at) VALUES ($1, $2, $3, $4, $5)`,
      ['patient', patientUser.user_id, patientUser.email, otpHash, expiresAt]
    );

    // Send OTP email
    const emailResult = await sendPatientOtpEmail(patientUser.email, otp, patientUser.username);
    if (emailResult.success) console.log('✅ OTP email sent');
    else console.warn('⚠️ Failed to send OTP email:', emailResult.error);

    return NextResponse.json({ success: true, message: 'If an account exists with that information, a password reset email has been sent.' });

  } catch (error) {
    console.error('❌ Patient forgot-password error:', error);
    console.error(error.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

