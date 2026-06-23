import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';

function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.substring(7);
  return request.cookies.get('patient_token')?.value || request.cookies.get('token')?.value;
}

function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

function getUserId(decoded) {
  return decoded?.patientId || decoded?.id || decoded?.user_id || decoded?.sub || null;
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = String(getUserId(decoded));
    if (!userId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const body = await request.json();
    const { sessionId } = body;
    if (!sessionId) return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });

    await query(
      `INSERT INTO patient_chat_sessions (patient_id, session_id)
       VALUES ($1, $2)
       ON CONFLICT (session_id) DO NOTHING`,
      [userId, sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Link session error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
