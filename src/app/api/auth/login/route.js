import { NextResponse } from 'next/server';
import { validateUser, createUserSession } from '@/lib/auth';
import { initDatabase } from '@/lib/db';

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

    // Set session cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
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
