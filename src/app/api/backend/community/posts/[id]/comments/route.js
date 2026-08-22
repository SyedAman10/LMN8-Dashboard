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

async function getAuthorName(patientUserId, studentUserId) {
  if (patientUserId) {
    const result = await query(
      `SELECT p.name FROM patient_users pu JOIN patients p ON pu.patient_id = p.id WHERE pu.id = $1`,
      [patientUserId]
    );
    return result.rows[0]?.name || 'Anonymous';
  }
  if (studentUserId) {
    const result = await query(
      `SELECT s.name FROM student_users su JOIN students s ON su.student_id = s.id WHERE su.id = $1`,
      [studentUserId]
    );
    return result.rows[0]?.name || 'Anonymous';
  }
  return 'Anonymous';
}

export async function GET(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });

    const comments = await query(
      `SELECT cc.*,
        COALESCE(p.name, s.name, 'Anonymous') AS author_name
       FROM community_comments cc
       LEFT JOIN patient_users pu ON cc.patient_user_id = pu.id
       LEFT JOIN patients p ON pu.patient_id = p.id
       LEFT JOIN student_users su ON cc.student_user_id = su.id
       LEFT JOIN students s ON su.student_id = s.id
       WHERE cc.post_id = $1
       ORDER BY cc.created_at ASC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: comments.rows.map(c => ({
        id: c.id,
        postId: c.post_id,
        patientUserId: c.patient_user_id,
        studentUserId: c.student_user_id,
        authorName: c.author_name,
        content: c.content,
        createdAt: c.created_at,
      })),
    });
  } catch (err) {
    console.error('GET comments error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const userType = decoded.type;
    const patientUserId = userType === 'patient' ? (decoded.userId || decoded.id) : null;
    const studentUserId = userType === 'student' ? (decoded.userId || decoded.id) : null;

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Comment content is required' }, { status: 400 });
    }

    const authorName = await getAuthorName(patientUserId, studentUserId);

    let result;
    if (userType === 'patient' && patientUserId) {
      result = await query(
        `INSERT INTO community_comments (post_id, patient_user_id, content) VALUES ($1, $2, $3) RETURNING *`,
        [id, patientUserId, content.trim()]
      );
    } else if (userType === 'student' && studentUserId) {
      result = await query(
        `INSERT INTO community_comments (post_id, student_user_id, content) VALUES ($1, $2, $3) RETURNING *`,
        [id, studentUserId, content.trim()]
      );
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.rows[0].id,
        postId: result.rows[0].post_id,
        patientUserId: result.rows[0].patient_user_id,
        studentUserId: result.rows[0].student_user_id,
        authorName,
        content: result.rows[0].content,
        createdAt: result.rows[0].created_at,
      },
      message: 'Comment added',
    }, { status: 201 });
  } catch (err) {
    console.error('POST comment error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
