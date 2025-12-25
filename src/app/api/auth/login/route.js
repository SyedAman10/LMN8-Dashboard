import { NextResponse } from 'next/server';
import { validateUser, createUserSession } from '@/lib/auth';
import { initDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          details: 'Contact your administrator or check the setup documentation.'
        },
        { status: 500 }
      );
    }

    // Initialize database if needed
    await initDatabase();

    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate user credentials
    const user = await validateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create user session
    const sessionToken = await createUserSession(user.id);

    // Create JWT token for backend API calls
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'user'
      },
      process.env.JWT_SECRET || 'your-secret-key', // Fallback for development
      { expiresIn: rememberMe ? '7d' : '1d' }
    );

    // Set session cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token: jwtToken, // Include JWT token for backend API calls
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          licenseNumber: user.license_number
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for session management
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7 days or 1 day
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
