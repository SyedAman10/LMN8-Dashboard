import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/lib/email';

// POST - Request password reset
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email } = body;

    // Validate input - require either username or email
    if (!username && !email) {
      return NextResponse.json(
        { error: 'Username or email is required' },
        { status: 400 }
      );
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

    // For security, always return success even if user not found
    if (!studentUser) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that information, a password reset link has been sent.'
      });
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      {
        userId: studentUser.user_id,
        studentId: studentUser.student_id,
        username: studentUser.username,
        type: 'student_password_reset'
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
      { expiresIn: '1h' }
    );

    // Send password reset email
    if (studentUser.email) {
      const emailResult = await sendPasswordResetEmail(
        studentUser.email,
        resetToken,
        studentUser.username
      );

      if (!emailResult.success) {
        console.warn('Failed to send student password reset email:', emailResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that information, a password reset link has been sent.',
      resetToken: resetToken,
      username: studentUser.username,
      email: studentUser.email
    });

  } catch (error) {
    console.error('Student forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
