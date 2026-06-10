import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAuthUser } from '@/lib/auth';
import { createStaff, getStaffByClinician } from '@/lib/staffAuth';
import { sendStaffCredentialsEmail } from '@/lib/email';

export async function GET(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const staff = await getStaffByClinician(auth.clinicianId);
    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Get staff error:', error);
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
    const { firstName, lastName, email, phone, role, permissions } = body;

    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json({ error: 'First name, last name, email, and role are required' }, { status: 400 });
    }

    const result = await createStaff({
      clinicianId: auth.clinicianId,
      firstName,
      lastName,
      email,
      phone,
      role,
      permissions
    });

    const clinicianName = auth.type === 'clinician' ? (auth.user?.first_name || auth.user?.full_name || 'Clinician') : 'Clinician';
    const emailResult = await sendStaffCredentialsEmail(
      { firstName, lastName, email, phone },
      { password: result.plainPassword },
      clinicianName
    );

    return NextResponse.json({
      message: 'Staff created successfully',
      staff: result.staff,
      emailSent: emailResult.success,
      emailError: emailResult.error || null
    }, { status: 201 });
  } catch (error) {
    console.error('Create staff error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A staff member with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
