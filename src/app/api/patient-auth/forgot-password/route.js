import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/lib/email';

// POST - Request password reset
export async function POST(request) {
  try {
    console.log('🔐 Forgot Password API called');
    const body = await request.json();
    const { username, email } = body;

    console.log('📝 Password reset request for:', { username, email });

    // Validate input - require either username or email
    if (!username && !email) {
      console.log('❌ No username or email provided');
      return NextResponse.json(
        { error: 'Username or email is required' },
        { status: 400 }
      );
    }

    // Find the patient user by username or email
    let patientUser;
    if (username) {
      console.log('🔍 Looking up patient by username:', username);
      const result = await query(
        `SELECT pu.id as user_id, pu.patient_id, pu.username, p.email, p.name
         FROM patient_users pu
         JOIN patients p ON pu.patient_id = p.id
         WHERE pu.username = $1 AND pu.is_active = true`,
        [username]
      );
      patientUser = result.rows[0];
    } else {
      console.log('🔍 Looking up patient by email:', email);
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
    // This prevents username/email enumeration attacks
    if (!patientUser) {
      console.log('⚠️ User not found, but returning success for security');
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that information, a password reset link has been sent.'
      });
    }

    console.log('✅ Patient found:', { userId: patientUser.user_id, patientId: patientUser.patient_id });

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      {
        userId: patientUser.user_id,
        patientId: patientUser.patient_id,
        username: patientUser.username,
        type: 'password_reset'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🎫 Reset token generated:', resetToken.substring(0, 30) + '...');

    // Send password reset email
    console.log('📧 Sending password reset email...');
    const emailResult = await sendPasswordResetEmail(
      patientUser.email,
      resetToken,
      patientUser.username
    );

    if (emailResult.success) {
      console.log('✅ Password reset email sent successfully');
    } else {
      console.warn('⚠️ Failed to send email, but continuing:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that information, a password reset link has been sent.',
      // For mobile app - include the token directly
      // In production, this would be sent via email only
      resetToken: resetToken,
      username: patientUser.username,
      email: patientUser.email
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

