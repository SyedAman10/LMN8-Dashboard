import { NextResponse } from 'next/server';
import { authenticatePatient } from '@/lib/patientAuth';
import jwt from 'jsonwebtoken';

// Patient login endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate patient
    const authResult = await authenticatePatient(username, password);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Create JWT token for patient
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

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      patient: authResult.patient,
      user: authResult.user
    });

    response.cookies.set('patient_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Patient login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
