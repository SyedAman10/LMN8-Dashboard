import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

// Get current patient information
export async function GET(request) {
  try {
    const token = request.cookies.get('patient_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if token is for patient
    if (decoded.type !== 'patient') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

    // Get patient details with profile fields
    const result = await query(
      `SELECT 
        p.id, p.name, p.email, p.phone, p.date_of_birth, p.diagnosis,
        p.medical_history, p.emergency_contact, p.emergency_phone,
        p.therapist, p.total_sessions, p.sessions_completed, p.status,
        p.notes, p.created_at, p.updated_at,
        pu.username, pu.last_login,
        pu.idol, pu.personality, pu.goals, pu.challenges,
        pu.communication_style, pu.interests, pu.values, pu.support_needs
       FROM patients p
       JOIN patient_users pu ON p.id = pu.patient_id
       WHERE p.id = $1 AND pu.is_active = true`,
      [decoded.patientId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const patient = result.rows[0];

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.date_of_birth,
        diagnosis: patient.diagnosis,
        medicalHistory: patient.medical_history,
        emergencyContact: patient.emergency_contact,
        emergencyPhone: patient.emergency_phone,
        therapist: patient.therapist,
        totalSessions: patient.total_sessions,
        sessionsCompleted: patient.sessions_completed,
        status: patient.status,
        notes: patient.notes,
        createdAt: patient.created_at,
        updatedAt: patient.updated_at,
        username: patient.username,
        lastLogin: patient.last_login,
        // Patient profile fields
        idol: patient.idol,
        personality: patient.personality,
        goals: patient.goals,
        challenges: patient.challenges,
        communicationStyle: patient.communication_style,
        interests: patient.interests,
        values: patient.values,
        supportNeeds: patient.support_needs
      }
    });

  } catch (error) {
    console.error('Get patient info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
