import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// POST - Reset password with token
export async function POST(request) {
  try {
    const body = await request.json();
    const { resetToken, newPassword } = body;

    // Validate input
    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 401 }
      );
    }

    // Check if token is for student password reset
    if (decoded.type !== 'student_password_reset') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the password
    const result = await query(
      `UPDATE student_users
       SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND is_active = true
       RETURNING id, username`,
      [passwordHash, decoded.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Generate new login token
    const loginToken = jwt.sign(
      {
        studentId: decoded.studentId,
        userId: decoded.userId,
        username: decoded.username,
        type: 'student'
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      token: loginToken,
      username: user.username
    });

  } catch (error) {
    console.error('Student reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
