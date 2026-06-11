import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserBySession } from '@/lib/auth';
import { hashPassword, generatePassword } from '@/lib/staffAuth';
import { sendClinicianCredentialsEmail } from '@/lib/email';
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
      `SELECT c.*, u.full_name AS clinician_name, u.email AS clinician_email, u.id AS clinician_id, u.is_active AS clinician_active,
              (SELECT COUNT(*) FROM clinician_staff cs WHERE cs.clinic_id = c.id AND cs.is_active = true) AS staff_count
       FROM clinics c
       LEFT JOIN users u ON u.clinic_id = c.id AND u.role = 'clinician'
       ORDER BY c.created_at DESC`
    );

    const clinics = result.rows.map(row => ({
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
      clinicianName: row.clinician_name || null,
      clinicianEmail: row.clinician_email || null,
      clinicianId: row.clinician_id || null,
      clinicianActive: row.clinician_active || false,
      staffCount: parseInt(row.staff_count) || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({ clinics });
  } catch (error) {
    console.error('Get clinics error:', error);
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
    const { name, address, city, state, zipCode, phone, email, website } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Clinic name and email are required' }, { status: 400 });
    }

    const existingUser = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const clinicResult = await query(
      `INSERT INTO clinics (name, address, city, state, zip_code, phone, email, website, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, address || null, city || null, state || null, zipCode || null, phone || null, email || null, website || null, admin.id]
    );

    const clinic = clinicResult.rows[0];

    const clinicianPassword = generatePassword();
    const passwordHash = await hashPassword(clinicianPassword);
    const clinicianId = crypto.randomUUID();
    const clinicianName = name;
    const clinicianEmail = email;

    await query(
      `INSERT INTO users (id, full_name, username, email, hashed_password, role, clinic_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
      [clinicianId, clinicianName, email.split('@')[0], email, passwordHash, 'clinician', clinic.id]
    );

    const adminName = admin.full_name || 'LMN8 Admin';
    const emailResult = await sendClinicianCredentialsEmail(
      { firstName: clinicianName, lastName: '', email },
      { password: clinicianPassword },
      adminName,
      name
    );

    return NextResponse.json({
      message: 'Clinic and clinician created successfully',
      clinic: {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        city: clinic.city,
        state: clinic.state,
        zipCode: clinic.zip_code,
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website,
        status: clinic.status,
        clinicianName: clinicianName,
        clinicianEmail: email,
        createdAt: clinic.created_at
      },
      emailSent: emailResult.success,
      emailError: emailResult.error || null
    }, { status: 201 });
  } catch (error) {
    console.error('Create clinic error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A clinic with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
