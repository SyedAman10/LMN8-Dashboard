import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// POST - Reset password with token for dashboard users (clinicians, colleges, admin)
export async function POST(request) {
  try {
    console.log('🔐 Dashboard Reset Password API called');
    const body = await request.json();
    const { resetToken, newPassword } = body;

    console.log('📝 Password reset attempt');

    // Validate input
    if (!resetToken || !newPassword) {
      console.log('❌ Missing token or password');
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
      console.log('✅ Reset token verified for user ID:', decoded.userId);
    } catch (error) {
      console.log('❌ Invalid or expired reset token:', error.message);
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 401 }
      );
    }

    // Check if token is for password reset
    if (decoded.type !== 'password_reset') {
      console.log('❌ Invalid token type:', decoded.type);
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

    console.log('🔒 Hashing new password...');

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    console.log('💾 Updating password in database...');

    // Update the password
    const result = await query(
      `UPDATE users
       SET hashed_password = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND is_active = true
       RETURNING id, email, full_name, role`,
      [passwordHash, decoded.userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found or inactive');
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    console.log('✅ Password updated successfully for user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
