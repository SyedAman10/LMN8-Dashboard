import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || auth.user?.role !== 'lmn8_admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const result = await query(
      `SELECT * FROM clinician_access_log ORDER BY created_at DESC LIMIT 200`
    );

    return NextResponse.json({ logs: result.rows });
  } catch (err) {
    console.error('[ACCESS LOGS API] Error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
