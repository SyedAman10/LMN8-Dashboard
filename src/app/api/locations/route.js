import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const result = await query(
      `SELECT * FROM locations WHERE clinician_id = $1 ORDER BY created_at DESC`,
      [auth.clinicianId]
    );

    const locations = result.rows.map(row => ({
      id: String(row.id),
      name: row.name,
      address: row.address,
      city: row.city,
      state: row.state || '',
      zipCode: row.zip_code || '',
      phone: row.phone || '',
      email: row.email || '',
      managerName: row.manager_name || '',
      establishedDate: row.established_date ? row.established_date.toISOString().split('T')[0] : '',
      status: row.status || 'active',
      staffCount: row.staff_count || 0,
      patientCount: row.patient_count || 0
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, city, state, zipCode, phone, email, managerName, establishedDate, status } = body;

    if (!name || !address || !city) {
      return NextResponse.json({ error: 'Name, address, and city are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO locations (clinician_id, name, address, city, state, zip_code, phone, email, manager_name, established_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [auth.clinicianId, name, address, city, state || null, zipCode || null, phone || null, email || null, managerName || null, establishedDate || null, status || 'active']
    );

    const loc = result.rows[0];
    return NextResponse.json({
      message: 'Location created successfully',
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
    }, { status: 201 });
  } catch (error) {
    console.error('Create location error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
