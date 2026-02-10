import { NextResponse } from 'next/server';
import { getUserBySession } from '@/lib/auth';

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getUserBySession(sessionToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const fullName = user.full_name || '';
    const [firstName, ...restNames] = fullName.trim().split(/\s+/);
    const lastName = restNames.join(' ');

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: firstName || '',
        lastName: lastName || '',
        fullName: fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
