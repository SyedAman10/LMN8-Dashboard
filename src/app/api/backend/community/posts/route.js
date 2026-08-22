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

async function getClinicIdForPatient(patientUserId) {
  const result = await query(
    `SELECT u.clinic_id FROM patient_users pu
     JOIN patients p ON pu.patient_id = p.id
     JOIN users u ON p.user_id = u.id
     WHERE pu.id = $1`,
    [patientUserId]
  );
  return result.rows[0]?.clinic_id;
}

async function getCollegeIdForStudent(studentUserId) {
  const result = await query(
    `SELECT u.college_id FROM student_users su
     JOIN students s ON su.student_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE su.id = $1`,
    [studentUserId]
  );
  return result.rows[0]?.college_id;
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

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const userType = decoded.type;
    const patientUserId = userType === 'patient' ? (decoded.userId || decoded.id) : null;
    const studentUserId = userType === 'student' ? (decoded.userId || decoded.id) : null;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    if (userType === 'patient' && patientUserId) {
      const clinicId = await getClinicIdForPatient(patientUserId);
      if (!clinicId) return NextResponse.json({ error: 'Patient not linked to a clinic' }, { status: 400 });

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
        studentUserId: null,
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
    }

    if (userType === 'student' && studentUserId) {
      const collegeId = await getCollegeIdForStudent(studentUserId);
      if (!collegeId) return NextResponse.json({ error: 'Student not linked to a college' }, { status: 400 });

      const countResult = await query(
        `SELECT COUNT(*) FROM community_posts cp
         JOIN student_users su ON cp.student_user_id = su.id
         JOIN students s ON su.student_id = s.id
         JOIN users u ON s.user_id = u.id
         WHERE u.college_id = $1`,
        [collegeId]
      );
      const total = parseInt(countResult.rows[0]?.count || '0', 10);

      const postsResult = await query(
        `SELECT cp.*, su.username AS author_username, s.name AS author_name,
          (SELECT COUNT(*) FROM community_likes WHERE post_id = cp.id) AS like_count,
          (SELECT COUNT(*) FROM community_comments WHERE post_id = cp.id) AS comment_count,
          EXISTS(SELECT 1 FROM community_likes WHERE post_id = cp.id AND student_user_id = $2) AS is_liked
         FROM community_posts cp
         JOIN student_users su ON cp.student_user_id = su.id
         JOIN students s ON su.student_id = s.id
         JOIN users u ON s.user_id = u.id
         WHERE u.college_id = $1
         ORDER BY cp.created_at DESC
         LIMIT $3 OFFSET $4`,
        [collegeId, studentUserId, limit, offset]
      );

      const posts = postsResult.rows.map(r => ({
        id: r.id,
        patientUserId: null,
        studentUserId: r.student_user_id,
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
    }

    return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
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

    const userType = decoded.type;
    const patientUserId = userType === 'patient' ? (decoded.userId || decoded.id) : null;
    const studentUserId = userType === 'student' ? (decoded.userId || decoded.id) : null;

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    let result;
    if (userType === 'patient' && patientUserId) {
      result = await query(
        `INSERT INTO community_posts (patient_user_id, content) VALUES ($1, $2) RETURNING *`,
        [patientUserId, content.trim()]
      );
    } else if (userType === 'student' && studentUserId) {
      result = await query(
        `INSERT INTO community_posts (student_user_id, content) VALUES ($1, $2) RETURNING *`,
        [studentUserId, content.trim()]
      );
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    const authorName = await getAuthorName(patientUserId, studentUserId);

    return NextResponse.json({
      success: true,
      data: {
        id: result.rows[0].id,
        patientUserId: result.rows[0].patient_user_id,
        studentUserId: result.rows[0].student_user_id,
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
