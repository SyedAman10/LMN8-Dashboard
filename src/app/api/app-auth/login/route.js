import { NextResponse } from 'next/server';
import { authenticatePatient } from '@/lib/patientAuth';
import { authenticateStudent } from '@/lib/studentAuth';
import jwt from 'jsonwebtoken';

// Unified login endpoint for the mobile app
// Tries patient auth first, then student auth
export async function POST(request) {
  try {
    const body = await request.json();
    const username = (body.username || '').trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';

    // 1. Try patient authentication first
    const patientResult = await authenticatePatient(username, password);

    if (patientResult.success) {
      const token = jwt.sign(
        {
          patientId: patientResult.patient.id,
          userId: patientResult.user.id,
          username: patientResult.user.username,
          type: 'patient'
        },
        jwtSecret,
        { expiresIn: '1d' }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        userType: 'patient',
        patient: patientResult.patient,
        student: null,
        user: patientResult.user
      });

      response.cookies.set('app_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return response;
    }

    // 2. Try student authentication
    const studentResult = await authenticateStudent(username, password);

    if (studentResult.success) {
      const token = jwt.sign(
        {
          studentId: studentResult.student.id,
          userId: studentResult.user.id,
          username: studentResult.user.username,
          type: 'student'
        },
        jwtSecret,
        { expiresIn: '1d' }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        userType: 'student',
        patient: null,
        student: studentResult.student,
        user: studentResult.user
      });

      response.cookies.set('app_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return response;
    }

    // 3. Both failed
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Unified login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
