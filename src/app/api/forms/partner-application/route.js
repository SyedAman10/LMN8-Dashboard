import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendPartnerApplicationAdminEmail, sendPartnerApplicationConfirmationEmail } from '@/lib/formEmails';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name', 'email', 'role', 'clinicName', 'clinicLocation', 
      'phone', 'patientsPerMonth', 'currentSystems', 'challenges', 
      'vision', 'timeline'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save to database
    const result = await query(
      `INSERT INTO partner_applications 
       (name, email, role, clinic_name, clinic_website, clinic_location, phone, 
        patients_per_month, current_systems, challenges, vision, timeline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING id, created_at`,
      [
        data.name,
        data.email,
        data.role,
        data.clinicName,
        data.clinicWebsite || null,
        data.clinicLocation,
        data.phone,
        data.patientsPerMonth,
        data.currentSystems,
        data.challenges,
        data.vision,
        data.timeline
      ]
    );

    // Send admin notification email (high priority)
    const adminEmailResult = await sendPartnerApplicationAdminEmail(data);
    
    // Send user confirmation email
    const userEmailResult = await sendPartnerApplicationConfirmationEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Partner application submitted successfully',
      id: result.rows[0].id,
      emailsSent: {
        admin: adminEmailResult.success,
        user: userEmailResult.success
      }
    });

  } catch (error) {
    console.error('Error processing partner application:', error);
    return NextResponse.json(
      { error: 'Failed to submit partner application', details: error.message },
      { status: 500 }
    );
  }
}

