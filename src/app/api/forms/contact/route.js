import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendContactAdminEmail, sendContactConfirmationEmail } from '@/lib/formEmails';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const result = await query(
      `INSERT INTO contact_submissions (name, email, subject, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, created_at`,
      [data.name, data.email, data.subject, data.message]
    );

    // Send admin notification email
    const adminEmailResult = await sendContactAdminEmail(data);
    
    // Send user confirmation email
    const userEmailResult = await sendContactConfirmationEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: result.rows[0].id,
      emailsSent: {
        admin: adminEmailResult.success,
        user: userEmailResult.success
      }
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form', details: error.message },
      { status: 500 }
    );
  }
}

