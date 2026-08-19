import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserBySession } from '@/lib/auth';

async function getAdminUser(request) {
  const sessionToken = request.cookies.get('session_token')?.value;
  if (!sessionToken) return null;
  const user = await getUserBySession(sessionToken);
  if (!user || user.role !== 'lmn8_admin') return null;
  const { hashed_password, ...safe } = user;
  return safe;
}

export async function GET(request, { params }) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const collegeResult = await query(
      `SELECT c.*, u.full_name AS college_user_name, u.email AS college_user_email, u.id AS college_user_id, u.is_active AS college_user_active
       FROM colleges c
       LEFT JOIN users u ON u.college_id = c.id AND u.role = 'college'
       WHERE c.id = $1`,
      [params.id]
    );

    if (collegeResult.rows.length === 0) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const row = collegeResult.rows[0];

    const studentResult = await query(
      `SELECT s.id, s.name, s.email, s.phone, s.program, s.enrollment_year, s.status, s.created_at
       FROM students s
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT 50`,
      [row.college_user_id]
    );

    return NextResponse.json({
      college: {
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
        createdAt: row.created_at,
        updatedAt: row.updated_at
      },
      students: studentResult.rows.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        program: s.program,
        enrollmentYear: s.enrollment_year,
        status: s.status,
        createdAt: s.created_at
      }))
    });
  } catch (error) {
    console.error('Get college detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, city, state, zipCode, phone, email, website, status, studentGreetingName } = body;

    const result = await query(
      `UPDATE colleges SET name = COALESCE($1, name), address = COALESCE($2, address), city = COALESCE($3, city),
        state = COALESCE($4, state), zip_code = COALESCE($5, zip_code), phone = COALESCE($6, phone),
        email = COALESCE($7, email), website = COALESCE($8, website), status = COALESCE($9, status),
        student_greeting_name = COALESCE($10, student_greeting_name), updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 RETURNING *`,
      [name || null, address || null, city || null, state || null, zipCode || null, phone || null, email || null, website || null, status || null, studentGreetingName || null, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      message: 'College updated successfully',
      college: {
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
        updatedAt: row.updated_at
      }
    });
  } catch (error) {
    console.error('Update college error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const collegeResult = await query(`SELECT id FROM colleges WHERE id = $1`, [params.id]);
    if (collegeResult.rows.length === 0) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    await query(`UPDATE colleges SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [params.id]);
    await query(`UPDATE users SET is_active = false WHERE college_id = $1 AND role = 'college'`, [params.id]);

    return NextResponse.json({ message: 'College deactivated successfully' });
  } catch (error) {
    console.error('Delete college error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
