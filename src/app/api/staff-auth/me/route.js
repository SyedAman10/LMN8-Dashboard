import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getStaffById } from '@/lib/staffAuth';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get('staff_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (decoded.type !== 'staff') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 401 });
    }

    const staff = await getStaffById(decoded.staffId);
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const clinicianResult = await query(
      `SELECT full_name FROM users WHERE id = $1`,
      [staff.clinician_id]
    );
    const clinicianName = clinicianResult.rows[0]?.full_name || 'Clinician';

    return NextResponse.json({
      staff: {
        id: staff.id,
        firstName: staff.first_name,
        lastName: staff.last_name,
        email: staff.email,
        role: staff.role,
        clinicianName,
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
  } catch (error) {
    console.error('Staff me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
