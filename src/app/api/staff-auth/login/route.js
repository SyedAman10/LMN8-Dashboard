import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { authenticateStaff } from '@/lib/staffAuth';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const staff = await authenticateStaff(email, password);
    if (!staff) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const clinicianResult = await query(
      `SELECT full_name FROM users WHERE id = $1`,
      [staff.clinician_id]
    );
    const clinicianName = clinicianResult.rows[0]?.full_name || 'Clinician';

    let clinicName = null;
    if (staff.clinic_id) {
      const clinicResult = await query(`SELECT name FROM clinics WHERE id = $1`, [staff.clinic_id]);
      if (clinicResult.rows.length > 0) {
        clinicName = clinicResult.rows[0].name;
      }
    }

    const token = jwt.sign(
      {
        staffId: staff.id,
        clinicianId: staff.clinician_id,
        email: staff.email,
        role: staff.role,
        type: 'staff'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      token,
      staff: {
        id: staff.id,
        firstName: staff.first_name,
        lastName: staff.last_name,
        email: staff.email,
        role: staff.role,
        clinicianName,
        clinicName,
        permissions: {
          can_view_dashboard: staff.can_view_dashboard,
          can_view_patients: staff.can_view_patients,
          can_edit_patients: staff.can_edit_patients,
          can_delete_patients: staff.can_delete_patients,
          can_view_sessions: staff.can_view_sessions,
          can_view_integration: staff.can_view_integration,
          can_view_resources: staff.can_view_resources,
          can_view_reports: staff.can_view_reports,
          can_create_reports: staff.can_create_reports,
          can_edit_reports: staff.can_edit_reports,
          can_delete_reports: staff.can_delete_reports,
          can_view_locations: staff.can_view_locations,
          can_view_settings: staff.can_view_settings
        }
      }
    });

    response.cookies.set('staff_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Staff login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
