import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserBySession } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getUserBySession(sessionToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const patientId = Number(params?.id);
    if (!Number.isInteger(patientId) || patientId <= 0) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      dateOfBirth,
      diagnosis,
      medicalHistory,
      emergencyContact,
      emergencyPhone,
      therapist,
      totalSessions,
      notes,
      status
    } = body;

    if (!name || !diagnosis || !medicalHistory) {
      return NextResponse.json(
        { error: 'Name, diagnosis, and medical history are required' },
        { status: 400 }
      );
    }

    if (!email || !String(email).trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedTotalSessions = Number(totalSessions);
    if (!Number.isInteger(normalizedTotalSessions) || normalizedTotalSessions < 1) {
      return NextResponse.json(
        { error: 'Total sessions must be at least 1' },
        { status: 400 }
      );
    }

    const allowedStatuses = new Set(['active', 'completed', 'paused']);
    const normalizedStatus = allowedStatuses.has(String(status || '').toLowerCase())
      ? String(status).toLowerCase()
      : 'active';

    const updateResult = await query(
      `UPDATE patients
       SET name = $1,
           email = $2,
           phone = $3,
           date_of_birth = $4,
           diagnosis = $5,
           medical_history = $6,
           emergency_contact = $7,
           emergency_phone = $8,
           therapist = $9,
           total_sessions = $10,
           notes = $11,
           status = $12,
           updated_at = NOW()
       WHERE id = $13 AND user_id = $14
       RETURNING *`,
      [
        name,
        String(email).trim(),
        phone || null,
        dateOfBirth || null,
        diagnosis,
        medicalHistory,
        emergencyContact || null,
        emergencyPhone || null,
        therapist || user.full_name || '',
        normalizedTotalSessions,
        notes || null,
        normalizedStatus,
        patientId,
        user.id
      ]
    );

    if (updateResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const updatedPatient = updateResult.rows[0];

    return NextResponse.json({
      message: 'Patient updated successfully',
      patient: {
        id: updatedPatient.id,
        name: updatedPatient.name,
        email: updatedPatient.email,
        phone: updatedPatient.phone,
        dateOfBirth: updatedPatient.date_of_birth,
        diagnosis: updatedPatient.diagnosis,
        medicalHistory: updatedPatient.medical_history,
        emergencyContact: updatedPatient.emergency_contact,
        emergencyPhone: updatedPatient.emergency_phone,
        therapist: updatedPatient.therapist,
        totalSessions: updatedPatient.total_sessions,
        sessionsCompleted: updatedPatient.sessions_completed,
        status: updatedPatient.status,
        notes: updatedPatient.notes,
        createdAt: updatedPatient.created_at,
        updatedAt: updatedPatient.updated_at
      }
    });
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
