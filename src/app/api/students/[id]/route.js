import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const auth = await getAuthUser(request);

    if (!auth) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const studentId = Number(params?.id);
    if (!Number.isInteger(studentId) || studentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT * FROM students WHERE id = $1 AND user_id = $2`,
      [studentId, auth.clinicianId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const student = result.rows[0];

    return NextResponse.json({
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
        updatedAt: student.updated_at
      }
    });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await getAuthUser(request);

    if (!auth) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const studentId = Number(params?.id);
    if (!Number.isInteger(studentId) || studentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      dateOfBirth,
      program,
      enrollmentYear,
      emergencyContact,
      emergencyPhone,
      notes,
      status
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Student name is required' },
        { status: 400 }
      );
    }

    const allowedStatuses = new Set(['active', 'inactive', 'graduated']);
    const normalizedStatus = allowedStatuses.has(String(status || '').toLowerCase())
      ? String(status).toLowerCase()
      : 'active';

    const updateResult = await query(
      `UPDATE students
       SET name = $1,
           email = $2,
           phone = $3,
           date_of_birth = $4,
           program = $5,
           enrollment_year = $6,
           emergency_contact = $7,
           emergency_phone = $8,
           notes = $9,
           status = $10,
           updated_at = NOW()
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [
        name,
        email || null,
        phone || null,
        dateOfBirth || null,
        program || null,
        enrollmentYear || null,
        emergencyContact || null,
        emergencyPhone || null,
        notes || null,
        normalizedStatus,
        studentId,
        auth.clinicianId
      ]
    );

    if (updateResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const updatedStudent = updateResult.rows[0];

    return NextResponse.json({
      message: 'Student updated successfully',
      student: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phone: updatedStudent.phone,
        dateOfBirth: updatedStudent.date_of_birth,
        program: updatedStudent.program,
        enrollmentYear: updatedStudent.enrollment_year,
        emergencyContact: updatedStudent.emergency_contact,
        emergencyPhone: updatedStudent.emergency_phone,
        status: updatedStudent.status,
        notes: updatedStudent.notes,
        createdAt: updatedStudent.created_at,
        updatedAt: updatedStudent.updated_at
      }
    });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
