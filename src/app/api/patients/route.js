import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserBySession } from '@/lib/auth';
import { sendWelcomeEmail, sendPatientCredentialsEmail } from '@/lib/email';
import { createPatientUser } from '@/lib/patientAuth';

// GET - Fetch all patients for the authenticated user
export async function GET(request) {
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

    // Get all patients for this user
    const result = await query(
      `SELECT * FROM patients 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      patients: result.rows.map(patient => ({
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
        updatedAt: patient.updated_at
      }))
    });

  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new patient
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
      diagnosis,
      medicalHistory,
      emergencyContact,
      emergencyPhone,
      therapist,
      totalSessions,
      notes,
      // New patient profile fields
      idol,
      personality,
      goals,
      challenges,
      communicationStyle,
      interests,
      values,
      supportNeeds
    } = body;

    // Validate required fields
    if (!name || !diagnosis || !medicalHistory) {
      return NextResponse.json(
        { error: 'Name, diagnosis, and medical history are required' },
        { status: 400 }
      );
    }

    // Create new patient
    const result = await query(
      `INSERT INTO patients (
        user_id, name, email, phone, date_of_birth, diagnosis, 
        medical_history, emergency_contact, emergency_phone, 
        therapist, total_sessions, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        user.id,
        name,
        email || null,
        phone || null,
        dateOfBirth || null,
        diagnosis,
        medicalHistory,
        emergencyContact || null,
        emergencyPhone || null,
        therapist || user.first_name + ' ' + user.last_name,
        totalSessions || 12,
        notes || null
      ]
    );

    const newPatient = result.rows[0];

    // Prepare patient data for email
    const patientForEmail = {
      id: newPatient.id,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      dateOfBirth: newPatient.date_of_birth,
      diagnosis: newPatient.diagnosis,
      medicalHistory: newPatient.medical_history,
      emergencyContact: newPatient.emergency_contact,
      emergencyPhone: newPatient.emergency_phone,
      therapist: newPatient.therapist,
      totalSessions: newPatient.total_sessions,
      sessionsCompleted: newPatient.sessions_completed,
      status: newPatient.status,
      notes: newPatient.notes,
      createdAt: newPatient.created_at,
      updatedAt: newPatient.updated_at
    };

    // Create patient user account and send credentials
    let patientUserResult = null;
    let credentialsEmailResult = null;
    let welcomeEmailResult = null;

    if (newPatient.email) {
      try {
        // Create patient user account
        console.log('Creating patient user account...');
        const additionalFields = {
          idol: idol || null,
          personality: personality || null,
          goals: goals || null,
          challenges: challenges || null,
          communicationStyle: communicationStyle || null,
          interests: interests || null,
          values: values || null,
          supportNeeds: supportNeeds || null
        };
        patientUserResult = await createPatientUser(newPatient.id, newPatient.name, additionalFields);
        
        if (patientUserResult.success) {
          console.log('Patient user created:', patientUserResult.patientUser.username);
          
          // Send credentials email
          console.log('Sending patient credentials email...');
          credentialsEmailResult = await sendPatientCredentialsEmail(
            patientForEmail, 
            {
              username: patientUserResult.patientUser.username,
              password: patientUserResult.patientUser.password
            }
          );
          console.log('Credentials email result:', credentialsEmailResult);
        } else {
          console.error('Failed to create patient user:', patientUserResult.error);
        }
      } catch (error) {
        console.error('Patient user creation failed (non-blocking):', error);
        patientUserResult = { success: false, error: error.message };
      }

      // Also send welcome email
      try {
        console.log('Sending welcome email...');
        welcomeEmailResult = await sendWelcomeEmail(patientForEmail);
        console.log('Welcome email result:', welcomeEmailResult);
      } catch (emailError) {
        console.error('Welcome email sending failed (non-blocking):', emailError);
        welcomeEmailResult = { success: false, error: emailError.message };
      }
    }

    // Prepare response messages
    const messages = [];
    if (patientUserResult?.success) {
      messages.push('Patient user account created');
    } else if (patientUserResult?.error) {
      messages.push(`User account creation failed: ${patientUserResult.error}`);
    }
    
    if (credentialsEmailResult?.success) {
      messages.push('Login credentials sent via email');
    } else if (credentialsEmailResult?.error) {
      messages.push(`Credentials email failed: ${credentialsEmailResult.error}`);
    }
    
    if (welcomeEmailResult?.success) {
      messages.push('Welcome email sent');
    } else if (welcomeEmailResult?.error) {
      messages.push(`Welcome email failed: ${welcomeEmailResult.error}`);
    }

    if (!newPatient.email) {
      messages.push('No email provided - no user account or emails sent');
    }

    return NextResponse.json(
      {
        message: 'Patient created successfully',
        patient: patientForEmail,
        patientUserCreated: patientUserResult?.success || false,
        credentialsEmailSent: credentialsEmailResult?.success || false,
        welcomeEmailSent: welcomeEmailResult?.success || false,
        details: messages.join('; '),
        hasEmail: !!newPatient.email
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
