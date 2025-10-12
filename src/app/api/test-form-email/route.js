import { NextResponse } from 'next/server';
import { sendDemoRequestConfirmationEmail } from '@/lib/formEmails';

// Test endpoint to verify email configuration
// Access via: http://localhost:3000/api/test-form-email
export async function GET() {
  try {
    // Test data
    const testData = {
      name: 'Test User',
      email: process.env.EMAIL_USER, // Sends to your own email for testing
      clinicName: 'Test Clinic',
      phone: '(555) 123-4567'
    };

    console.log('Testing email configuration...');
    console.log('Sending test email to:', testData.email);

    const result = await sendDemoRequestConfirmationEmail(testData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check your inbox.',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email configuration error',
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    }, { status: 500 });
  }
}

