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

async function getPatientClinicId(patientUserId) {
  const result = await query(
    `SELECT u.clinic_id FROM patient_users pu
     JOIN patients p ON pu.patient_id = p.id
     JOIN users u ON p.user_id = u.id
     WHERE pu.id = $1`,
    [patientUserId]
  );
  return result.rows[0]?.clinic_id;
}

async function getPatientName(patientUserId) {
  const result = await query(
    `SELECT p.name FROM patient_users pu
     JOIN patients p ON pu.patient_id = p.id
     WHERE pu.id = $1`,
    [patientUserId]
  );
  return result.rows[0]?.name || 'Anonymous';
}

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const patientUserId = decoded?.userId || decoded?.id;
    if (!patientUserId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const clinicId = await getPatientClinicId(patientUserId);
    if (!clinicId) return NextResponse.json({ error: 'Patient not linked to a clinic' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const countResult = await query(
      `SELECT COUNT(*) FROM community_posts cp
       JOIN patient_users pu ON cp.patient_user_id = pu.id
       JOIN patients p ON pu.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE u.clinic_id = $1`,
      [clinicId]
    );
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    const postsResult = await query(
      `SELECT cp.*, pu.username AS author_username, p.name AS author_name,
        (SELECT COUNT(*) FROM community_likes WHERE post_id = cp.id) AS like_count,
        (SELECT COUNT(*) FROM community_comments WHERE post_id = cp.id) AS comment_count,
        EXISTS(SELECT 1 FROM community_likes WHERE post_id = cp.id AND patient_user_id = $2) AS is_liked
       FROM community_posts cp
       JOIN patient_users pu ON cp.patient_user_id = pu.id
       JOIN patients p ON pu.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE u.clinic_id = $1
       ORDER BY cp.created_at DESC
       LIMIT $3 OFFSET $4`,
      [clinicId, patientUserId, limit, offset]
    );

    const posts = postsResult.rows.map(r => ({
      id: r.id,
      patientUserId: r.patient_user_id,
      authorName: r.author_name,
      authorUsername: r.author_username,
      content: r.content,
      likeCount: parseInt(r.like_count, 10),
      commentCount: parseInt(r.comment_count, 10),
      isLiked: r.is_liked,
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('GET community posts error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const patientUserId = decoded?.userId || decoded?.id;
    if (!patientUserId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO community_posts (patient_user_id, content) VALUES ($1, $2) RETURNING *`,
      [patientUserId, content.trim()]
    );

    const authorName = await getPatientName(patientUserId);

    return NextResponse.json({
      success: true,
      data: {
        id: result.rows[0].id,
        patientUserId: result.rows[0].patient_user_id,
        authorName,
        content: result.rows[0].content,
        likeCount: 0,
        commentCount: 0,
        isLiked: false,
        createdAt: result.rows[0].created_at,
      },
      message: 'Post created successfully',
    }, { status: 201 });
  } catch (err) {
    console.error('POST community post error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
