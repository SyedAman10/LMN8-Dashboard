import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get('student_token')?.value;

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

    if (decoded.type !== 'student') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

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

  } catch (error) {
    console.error('Get student info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
