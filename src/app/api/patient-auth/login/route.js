import { NextResponse } from 'next/server';
import { authenticatePatient } from '@/lib/patientAuth';
import jwt from 'jsonwebtoken';

// Patient login endpoint
export async function POST(request) {
  try {
    console.log('🔐 Patient Login API called');
    const body = await request.json();
    const { username, password } = body;
    console.log('📝 Login attempt for username:', username);

    // Validate input
    if (!username || !password) {
      console.log('❌ Validation failed: missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate patient
    console.log('🔍 Authenticating patient...');
    const authResult = await authenticatePatient(username, password);

    if (!authResult.success) {
      console.log('❌ Authentication failed:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    console.log('✅ Authentication successful for patient ID:', authResult.patient.id);

    // Create JWT token for patient
    console.log('🎫 Creating JWT token...');
    const token = jwt.sign(
      {
        patientId: authResult.patient.id,
        userId: authResult.user.id,
        username: authResult.user.username,
        type: 'patient'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token created:', token.substring(0, 50) + '...');

    // Return token in response body for mobile app and set cookie for web
    const responseData = {
      success: true,
      message: 'Login successful',
      token: token, // Include token in response for mobile apps
      patient: authResult.patient,
      user: authResult.user
    };

    console.log('📤 Sending response with token:', {
      success: responseData.success,
      hasToken: !!responseData.token,
      tokenLength: responseData.token?.length,
      patientId: responseData.patient.id
    });

    const response = NextResponse.json(responseData);

    // Also set as HTTP-only cookie for web browsers
    response.cookies.set('patient_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ Response prepared and returning...');
    return response;

  } catch (error) {
    console.error('❌ Patient login error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
