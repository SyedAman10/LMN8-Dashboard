import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, address, city, state, zipCode, phone, email, managerName, establishedDate, status } = body;

    if (!name || !address || !city) {
      return NextResponse.json({ error: 'Name, address, and city are required' }, { status: 400 });
    }

    const result = await query(
      `UPDATE locations SET
        name = $1, address = $2, city = $3, state = $4, zip_code = $5,
        phone = $6, email = $7, manager_name = $8, established_date = $9,
        status = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 AND clinician_id = $12
       RETURNING *`,
      [name, address, city, state || null, zipCode || null, phone || null, email || null, managerName || null, establishedDate || null, status || 'active', id, auth.clinicianId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const loc = result.rows[0];
    return NextResponse.json({
      message: 'Location updated successfully',
      location: {
        id: String(loc.id),
        name: loc.name,
        address: loc.address,
        city: loc.city,
        state: loc.state || '',
        zipCode: loc.zip_code || '',
        phone: loc.phone || '',
        email: loc.email || '',
        managerName: loc.manager_name || '',
        establishedDate: loc.established_date ? loc.established_date.toISOString().split('T')[0] : '',
        status: loc.status || 'active',
        staffCount: loc.staff_count || 0,
        patientCount: loc.patient_count || 0
      }
    });
  } catch (error) {
    console.error('Update location error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const result = await query(
      `DELETE FROM locations WHERE id = $1 AND clinician_id = $2 RETURNING id`,
      [id, auth.clinicianId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
