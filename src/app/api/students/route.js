import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, getUserBySession } from '@/lib/auth';
import { sendStudentCredentialsEmail } from '@/lib/email';
import { createStudentUser } from '@/lib/studentAuth';

// GET - Fetch all students for the authenticated college user
export async function GET(request) {
  try {
    const auth = await getAuthUser(request);

    if (!auth) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT * FROM students
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [auth.clinicianId]
    );

    return NextResponse.json({
      students: result.rows.map(student => ({
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
      }))
    });

  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new student
export async function POST(request) {
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
      notes
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Student name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO students (
        user_id, name, email, phone, date_of_birth, program,
        enrollment_year, emergency_contact, emergency_phone, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        user.id,
        name,
        email || null,
        phone || null,
        dateOfBirth || null,
        program || null,
        enrollmentYear || null,
        emergencyContact || null,
        emergencyPhone || null,
        notes || null
      ]
    );

    const newStudent = result.rows[0];

    const studentForResponse = {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone,
      dateOfBirth: newStudent.date_of_birth,
      program: newStudent.program,
      enrollmentYear: newStudent.enrollment_year,
      emergencyContact: newStudent.emergency_contact,
      emergencyPhone: newStudent.emergency_phone,
      status: newStudent.status,
      notes: newStudent.notes,
      createdAt: newStudent.created_at,
      updatedAt: newStudent.updated_at
    };

    let studentUserResult = null;
    let credentialsEmailResult = null;

    if (newStudent.email) {
      try {
        console.log('Creating student user account...');
        studentUserResult = await createStudentUser(newStudent.id, newStudent.name);

        if (studentUserResult.success) {
          console.log('Student user created:', studentUserResult.studentUser.username);

          console.log('Sending student credentials email...');
          credentialsEmailResult = await sendStudentCredentialsEmail(
            studentForResponse,
            {
              username: studentUserResult.studentUser.username,
              password: studentUserResult.studentUser.password
            }
          );
          console.log('Credentials email result:', credentialsEmailResult);
        } else {
          console.error('Failed to create student user:', studentUserResult.error);
        }
      } catch (error) {
        console.error('Student user creation failed (non-blocking):', error);
        studentUserResult = { success: false, error: error.message };
      }
    }

    const messages = [];
    if (studentUserResult?.success) {
      messages.push('Student user account created');
    } else if (studentUserResult?.error) {
      messages.push(`User account creation failed: ${studentUserResult.error}`);
    }

    if (credentialsEmailResult?.success) {
      messages.push('Login credentials sent via email');
    } else if (credentialsEmailResult?.error) {
      messages.push(`Credentials email failed: ${credentialsEmailResult.error}`);
    }

    if (!newStudent.email) {
      messages.push('No email provided - no user account or emails sent');
    }

    return NextResponse.json(
      {
        message: 'Student created successfully',
        student: studentForResponse,
        studentUserCreated: studentUserResult?.success || false,
        credentialsEmailSent: credentialsEmailResult?.success || false,
        details: messages.join('; '),
        hasEmail: !!newStudent.email
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
