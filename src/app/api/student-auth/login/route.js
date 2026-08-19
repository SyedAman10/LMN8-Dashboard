import { NextResponse } from 'next/server';
import { authenticateStudent } from '@/lib/studentAuth';
import jwt from 'jsonwebtoken';

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

    const authResult = await authenticateStudent(username, password);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        studentId: authResult.student.id,
        userId: authResult.user.id,
        username: authResult.user.username,
        type: 'student'
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
      { expiresIn: '1d' }
    );

    const responseData = {
      success: true,
      message: 'Login successful',
      token: token,
      student: authResult.student,
      user: authResult.user
    };

    const response = NextResponse.json(responseData);

    response.cookies.set('student_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return response;

  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
