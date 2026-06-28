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

export async function DELETE(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const patientUserId = decoded?.userId || decoded?.id;
    if (!patientUserId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });

    const post = await query(`SELECT * FROM community_posts WHERE id = $1`, [id]);
    if (post.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    if (post.rows[0].patient_user_id !== patientUserId) {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this post' }, { status: 403 });
    }

    await query(`DELETE FROM community_posts WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('DELETE community post error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
