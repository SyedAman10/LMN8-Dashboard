import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendDashboardPasswordResetEmail } from '@/lib/email';

// POST - Request password reset for dashboard users (clinicians, colleges, admin)
export async function POST(request) {
  try {
    console.log('🔐 Dashboard Forgot Password API called');
    const body = await request.json();
    const { email } = body;

    console.log('📝 Password reset request for email:', email);

    // Validate input
    if (!email) {
      console.log('❌ No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the user by email
    console.log('🔍 Looking up user by email:', email);
    const result = await query(
      `SELECT id, email, username, full_name, role
       FROM users
       WHERE email = $1 AND is_active = true`,
      [email]
    );

    const user = result.rows[0];

    // For security, always return success even if user not found
    // This prevents email enumeration attacks
    if (!user) {
      console.log('⚠️ User not found, but returning success for security');
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    }

    console.log('✅ User found:', { userId: user.id, role: user.role });

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'password_reset'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('🎫 Reset token generated');

    // Send password reset email
    console.log('📧 Sending password reset email...');
    const emailResult = await sendDashboardPasswordResetEmail(
      user.email,
      resetToken,
      user.full_name,
      user.role
    );

    if (emailResult.success) {
      console.log('✅ Password reset email sent successfully');
    } else {
      console.warn('⚠️ Failed to send email, but continuing:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.'
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
