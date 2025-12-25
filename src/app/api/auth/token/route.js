import { NextResponse } from 'next/server';
import { getUserBySession } from '@/lib/auth';
import jwt from 'jsonwebtoken';

// GET - Get JWT token for client-side use
// This allows the frontend to get a JWT token to send to external backend
// If user has a valid session, generate a JWT token for them
export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user from session
    const user = await getUserBySession(sessionToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Generate JWT token for backend API calls
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'user'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return the JWT token so frontend can use it for backend API calls
    return NextResponse.json({
      token: jwtToken
    });

  } catch (error) {
    console.error('Get token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

