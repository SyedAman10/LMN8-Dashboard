import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendDemoRequestAdminEmail, sendDemoRequestConfirmationEmail } from '@/lib/formEmails';

export async function POST(request) {
  try {
    // Parse request body
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!data.name || !data.email || !data.clinicName || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields', required: ['name', 'email', 'clinicName', 'phone'] },
        { status: 400 }
      );
    }

    // Save to database
    let result;
    try {
      result = await query(
        `INSERT INTO demo_requests (name, email, clinic_name, phone) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, created_at`,
        [data.name, data.email, data.clinicName, data.phone]
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error - please ensure database is set up', 
          details: dbError.message,
          hint: 'Run: npm run init-db or node src/scripts/create-form-tables.js'
        },
        { status: 500 }
      );
    }

    // Send admin notification email (non-blocking)
    let adminEmailResult = { success: false };
    try {
      adminEmailResult = await sendDemoRequestAdminEmail(data);
    } catch (emailError) {
      console.error('Error sending admin email (non-critical):', emailError);
    }
    
    // Send user confirmation email (non-blocking)
    let userEmailResult = { success: false };
    try {
      userEmailResult = await sendDemoRequestConfirmationEmail(data);
    } catch (emailError) {
      console.error('Error sending confirmation email (non-critical):', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      id: result.rows[0].id,
      emailsSent: {
        admin: adminEmailResult.success,
        user: userEmailResult.success
      }
    });

  } catch (error) {
    console.error('Unexpected error processing demo request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit demo request', 
        details: error.message,
        type: error.name
      },
      { status: 500 }
    );
  }
}

