import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendContactAdminEmail, sendContactConfirmationEmail } from '@/lib/formEmails';

// Send emails in background without blocking response
async function sendEmailsInBackground(data) {
  try {
    Promise.allSettled([
      sendContactAdminEmail(data),
      sendContactConfirmationEmail(data)
    ]).then(results => {
      const [adminResult, userResult] = results;
      console.log('Contact email results:', {
        admin: adminResult.status === 'fulfilled' ? 'sent' : 'failed',
        user: userResult.status === 'fulfilled' ? 'sent' : 'failed'
      });
    });
  } catch (error) {
    console.error('Background email error (non-critical):', error);
  }
}

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

    // Send emails asynchronously without blocking
    sendEmailsInBackground(data);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: result.rows[0].id,
      emailsQueued: true
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form', details: error.message },
      { status: 500 }
    );
  }
}

