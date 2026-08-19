import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserBySession } from '@/lib/auth';
import { hashPassword, generatePassword } from '@/lib/staffAuth';
import { sendCollegeCredentialsEmail } from '@/lib/email';
import crypto from 'crypto';

async function getAdminUser(request) {
  const sessionToken = request.cookies.get('session_token')?.value;
  if (!sessionToken) return null;
  const user = await getUserBySession(sessionToken);
  if (!user || user.role !== 'lmn8_admin') return null;
  const { hashed_password, ...safe } = user;
  return safe;
}

export async function GET(request) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT c.*, u.full_name AS college_user_name, u.email AS college_user_email, u.id AS college_user_id, u.is_active AS college_user_active,
              (SELECT COUNT(*) FROM students s WHERE s.user_id = u.id) AS student_count
       FROM colleges c
       LEFT JOIN users u ON u.college_id = c.id AND u.role = 'college'
       ORDER BY c.created_at DESC`
    );

    const colleges = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      phone: row.phone,
      email: row.email,
      website: row.website,
      status: row.status,
      studentGreetingName: row.student_greeting_name,
      collegeUserName: row.college_user_name || null,
      collegeUserEmail: row.college_user_email || null,
      collegeUserId: row.college_user_id || null,
      collegeUserActive: row.college_user_active || false,
      studentCount: parseInt(row.student_count) || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('Get colleges error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, city, state, zipCode, phone, email, website, studentGreetingName } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'College name and email are required' }, { status: 400 });
    }

    const existingUser = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const collegeResult = await query(
      `INSERT INTO colleges (name, address, city, state, zip_code, phone, email, website, student_greeting_name, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, address || null, city || null, state || null, zipCode || null, phone || null, email || null, website || null, studentGreetingName || 'Student', admin.id]
    );

    const college = collegeResult.rows[0];

    const collegePassword = generatePassword();
    const passwordHash = await hashPassword(collegePassword);
    const collegeUserId = crypto.randomUUID();
    const collegeName = name;
    const collegeEmail = email;

    await query(
      `INSERT INTO users (id, full_name, username, email, hashed_password, role, college_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
      [collegeUserId, collegeName, email.split('@')[0], email, passwordHash, 'college', college.id]
    );

    const adminName = admin.full_name || 'METAT8 Admin';
    const emailResult = await sendCollegeCredentialsEmail(
      { firstName: collegeName, lastName: '', email },
      { password: collegePassword },
      adminName,
      name
    );

    return NextResponse.json({
      message: 'College and college user created successfully',
      college: {
        id: college.id,
        name: college.name,
        address: college.address,
        city: college.city,
        state: college.state,
        zipCode: college.zip_code,
        phone: college.phone,
        email: college.email,
        website: college.website,
        status: college.status,
        studentGreetingName: college.student_greeting_name,
        collegeUserName: collegeName,
        collegeUserEmail: email,
        createdAt: college.created_at
      },
      emailSent: emailResult.success,
      emailError: emailResult.error || null
    }, { status: 201 });
  } catch (error) {
    console.error('Create college error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A college with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
