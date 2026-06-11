import { NextResponse } from 'next/server';
import { getUserBySession } from '@/lib/auth';
import { query } from '@/lib/db';

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

    let clinicName = null;
    if (user.clinic_id) {
      const clinicResult = await query(`SELECT name FROM clinics WHERE id = $1`, [user.clinic_id]);
      if (clinicResult.rows.length > 0) {
        clinicName = clinicResult.rows[0].name;
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: firstName || '',
        lastName: lastName || '',
        fullName: fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        clinicId: user.clinic_id,
        clinicName: clinicName,
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
