import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';

function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return request.cookies.get('patient_token')?.value || request.cookies.get('token')?.value;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function POST(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const patientUserId = decoded?.userId || decoded?.id;
    if (!patientUserId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });

    const existing = await query(
      `SELECT id FROM community_likes WHERE post_id = $1 AND patient_user_id = $2`,
      [id, patientUserId]
    );

    let liked;
    if (existing.rows.length > 0) {
      await query(`DELETE FROM community_likes WHERE id = $1`, [existing.rows[0].id]);
      liked = false;
    } else {
      await query(`INSERT INTO community_likes (post_id, patient_user_id) VALUES ($1, $2)`, [id, patientUserId]);
      liked = true;
    }

    const countResult = await query(`SELECT COUNT(*) AS count FROM community_likes WHERE post_id = $1`, [id]);
    const likeCount = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({ success: true, data: { liked, likeCount } });
  } catch (err) {
    console.error('POST community like error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
