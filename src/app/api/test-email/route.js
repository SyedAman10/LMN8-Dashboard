import { NextResponse } from 'next/server';
import { testEmailConfiguration, sendWelcomeEmail } from '@/lib/email';

// Test email configuration
export async function GET() {
  try {
    const result = await testEmailConfiguration();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email configuration is valid and ready to use'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: 'Email configuration is invalid'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Email test failed'
    }, { status: 500 });
  }
}

// Send test welcome email
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email and name are required'
      }, { status: 400 });
    }

    // Create a test patient object
    const testPatient = {
      id: 'test-123',
      name: name,
      email: email,
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      diagnosis: 'Test Diagnosis',
      medicalHistory: 'Test medical history',
      emergencyContact: 'Test Emergency Contact',
      emergencyPhone: '+1234567890',
      therapist: 'Dr. Test Therapist',
      totalSessions: 12,
      sessionsCompleted: 0,
      status: 'active',
      notes: 'This is a test patient for email testing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await sendWelcomeEmail(testPatient);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: 'Failed to send test email'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email send error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Test email send failed'
    }, { status: 500 });
  }
}
