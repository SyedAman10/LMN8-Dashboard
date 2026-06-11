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

    const clinicResult = await query(
      `SELECT c.*, u.full_name AS clinician_name, u.email AS clinician_email, u.id AS clinician_id, u.is_active AS clinician_active
       FROM clinics c
       LEFT JOIN users u ON u.clinic_id = c.id AND u.role = 'clinician'
       WHERE c.id = $1`,
      [params.id]
    );

    if (clinicResult.rows.length === 0) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const row = clinicResult.rows[0];

    const staffResult = await query(
      `SELECT cs.id, cs.first_name, cs.last_name, cs.email, cs.phone, cs.role, cs.is_active,
              cs.can_view_dashboard, cs.can_view_patients, cs.can_edit_patients, cs.can_delete_patients,
              cs.can_view_sessions, cs.can_view_integration, cs.can_view_resources,
              cs.can_view_reports, cs.can_create_reports, cs.can_edit_reports, cs.can_delete_reports,
              cs.can_view_locations, cs.can_view_settings,
              cs.created_at, cs.last_login
       FROM clinician_staff cs
       WHERE cs.clinic_id = $1 AND cs.is_active = true
       ORDER BY cs.created_at DESC`,
      [params.id]
    );

    const patientResult = await query(
      `SELECT p.id, p.name, p.email, p.phone, p.diagnosis, p.therapist, p.status, p.total_sessions, p.sessions_completed, p.created_at
       FROM patients p
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [row.clinician_id]
    );

    return NextResponse.json({
      clinic: {
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
        createdAt: row.created_at,
        updatedAt: row.updated_at
      },
      staff: staffResult.rows.map(s => ({
        id: s.id,
        firstName: s.first_name,
        lastName: s.last_name,
        email: s.email,
        phone: s.phone,
        role: s.role,
        isActive: s.is_active,
        permissions: {
          can_view_dashboard: s.can_view_dashboard,
          can_view_patients: s.can_view_patients,
          can_edit_patients: s.can_edit_patients,
          can_delete_patients: s.can_delete_patients,
          can_view_sessions: s.can_view_sessions,
          can_view_integration: s.can_view_integration,
          can_view_resources: s.can_view_resources,
          can_view_reports: s.can_view_reports,
          can_create_reports: s.can_create_reports,
          can_edit_reports: s.can_edit_reports,
          can_delete_reports: s.can_delete_reports,
          can_view_locations: s.can_view_locations,
          can_view_settings: s.can_view_settings
        },
        createdAt: s.created_at,
        lastLogin: s.last_login
      })),
      patients: patientResult.rows.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        diagnosis: p.diagnosis,
        therapist: p.therapist,
        status: p.status,
        totalSessions: p.total_sessions,
        sessionsCompleted: p.sessions_completed,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    console.error('Get clinic detail error:', error);
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
    const { name, address, city, state, zipCode, phone, email, website, status } = body;

    const result = await query(
      `UPDATE clinics SET name = COALESCE($1, name), address = COALESCE($2, address), city = COALESCE($3, city),
        state = COALESCE($4, state), zip_code = COALESCE($5, zip_code), phone = COALESCE($6, phone),
        email = COALESCE($7, email), website = COALESCE($8, website), status = COALESCE($9, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [name || null, address || null, city || null, state || null, zipCode || null, phone || null, email || null, website || null, status || null, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      message: 'Clinic updated successfully',
      clinic: {
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
        updatedAt: row.updated_at
      }
    });
  } catch (error) {
    console.error('Update clinic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const clinicResult = await query(`SELECT id FROM clinics WHERE id = $1`, [params.id]);
    if (clinicResult.rows.length === 0) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    await query(`UPDATE clinics SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [params.id]);

    await query(`UPDATE users SET is_active = false WHERE clinic_id = $1 AND role = 'clinician'`, [params.id]);

    return NextResponse.json({ message: 'Clinic deactivated successfully' });
  } catch (error) {
    console.error('Delete clinic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
