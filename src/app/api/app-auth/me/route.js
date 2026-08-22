import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

// Helper function to extract token from request
function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return request.cookies.get('app_token')?.value;
}

// Unified me endpoint — reads JWT type field, queries correct table
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (decoded.type === 'patient') {
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
        userType: 'patient',
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
    }

    if (decoded.type === 'student') {
      const result = await query(
        `SELECT
          s.id, s.name, s.email, s.phone, s.date_of_birth, s.program,
          s.enrollment_year, s.emergency_contact, s.emergency_phone,
          s.status, s.notes, s.created_at, s.updated_at,
          su.username, su.last_login,
          su.idol, su.personality, su.goals, su.challenges,
          su.communication_style, su.interests, su.values, su.support_needs
         FROM students s
         JOIN student_users su ON s.id = su.student_id
         WHERE s.id = $1 AND su.is_active = true`,
        [decoded.studentId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }

      const student = result.rows[0];

      return NextResponse.json({
        success: true,
        userType: 'student',
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          dateOfBirth: student.date_of_birth,
          program: student.program,
          enrollmentYear: student.enrollment_year,
          emergencyContact: student.emergency_contact,
          emergencyPhone: student.emergency_phone,
          status: student.status,
          notes: student.notes,
          createdAt: student.created_at,
          updatedAt: student.updated_at,
          username: student.username,
          lastLogin: student.last_login,
          idol: student.idol,
          personality: student.personality,
          goals: student.goals,
          challenges: student.challenges,
          communicationStyle: student.communication_style,
          interests: student.interests,
          values: student.values,
          supportNeeds: student.support_needs
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid token type' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Unified me endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
