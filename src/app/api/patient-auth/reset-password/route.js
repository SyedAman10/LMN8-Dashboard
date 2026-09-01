import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// POST - Reset password using OTP (email + otp + newPassword)
export async function POST(request) {
  try {
    console.log('🔐 Patient Reset Password (OTP) API called');
    const body = await request.json();
    const { email, otp, newPassword } = body;

    console.log('📝 Password reset attempt for email');

    // Validate input
    if (!email || !otp || !newPassword) {
      console.log('❌ Missing email, otp or password');
      return NextResponse.json({ error: 'Email, otp and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Find the OTP record
    const otpResult = await query(`SELECT * FROM password_reset_otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1`, [email]);
    const otpRow = otpResult.rows[0];
    if (!otpRow) {
      console.log('❌ No OTP found for email');
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Check expiry
    const now = new Date();
    if (new Date(otpRow.expires_at) < now) {
      console.log('❌ OTP expired');
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Verify OTP
    const valid = await bcrypt.compare(otp, otpRow.otp_hash);
    if (!valid) {
      console.log('❌ OTP verification failed');
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Find patient user by email
    const userResult = await query(
      `SELECT pu.id as user_id, pu.patient_id, pu.username
       FROM patient_users pu
       JOIN patients p ON pu.patient_id = p.id
       WHERE p.email = $1 AND pu.is_active = true LIMIT 1`,
      [email]
    );
    const userRow = userResult.rows[0];
    if (!userRow) {
      console.log('❌ User not found for email');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    const updateResult = await query(`UPDATE patient_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username`, [passwordHash, userRow.user_id]);
    if (updateResult.rows.length === 0) {
      console.log('❌ Failed to update password');
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Consume OTP (delete)
    await query(`DELETE FROM password_reset_otps WHERE id = $1`, [otpRow.id]);

    console.log('✅ Password updated successfully for user:', updateResult.rows[0].username);

    return NextResponse.json({ success: true, message: 'Password reset successfully' });

  } catch (error) {
    console.error('❌ Patient reset-password error:', error);
    console.error(error.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

