import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendDemoRequestAdminEmail, sendDemoRequestConfirmationEmail } from '@/lib/formEmails';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.clinicName || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const result = await query(
      `INSERT INTO demo_requests (name, email, clinic_name, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, created_at`,
      [data.name, data.email, data.clinicName, data.phone]
    );

    // Send admin notification email
    const adminEmailResult = await sendDemoRequestAdminEmail(data);
    
    // Send user confirmation email
    const userEmailResult = await sendDemoRequestConfirmationEmail(data);

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
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      { error: 'Failed to submit demo request', details: error.message },
      { status: 500 }
    );
  }
}

