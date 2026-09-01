import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// POST - Reset password using OTP (email + otp + newPassword) for students
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, otp and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Find the latest OTP record for this email
    const otpResult = await query(`SELECT * FROM password_reset_otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1`, [email]);
    const otpRow = otpResult.rows[0];
    if (!otpRow) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const now = new Date();
    if (new Date(otpRow.expires_at) < now) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const valid = await bcrypt.compare(otp, otpRow.otp_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Find student user by email
    const userResult = await query(
      `SELECT su.id as user_id, su.student_id, su.username
       FROM student_users su
       JOIN students s ON su.student_id = s.id
       WHERE s.email = $1 AND su.is_active = true LIMIT 1`,
      [email]
    );
    const userRow = userResult.rows[0];
    if (!userRow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    const updateResult = await query(`UPDATE student_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username`, [passwordHash, userRow.user_id]);
    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Consume OTP
    await query(`DELETE FROM password_reset_otps WHERE id = $1`, [otpRow.id]);

    return NextResponse.json({ success: true, message: 'Password reset successfully' });

  } catch (error) {
    console.error('Student reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
