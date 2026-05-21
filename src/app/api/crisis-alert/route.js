import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendCrisisAlert } from '@/lib/crisisEmail';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, content, source, patientName, patientEmail } = body;

    if (!content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If clinician email is provided directly, use it
    if (email) {
      console.log(`[CRISIS API] Received alert for clinician ${email} from ${source}`);
      const result = await sendCrisisAlert(email, name || 'Clinician', content, source || 'chat', patientName, patientEmail);
      console.log('[CRISIS API] Send result:', JSON.stringify(result));
      return NextResponse.json({ success: true, ...result });
    }

    // Otherwise, look up clinician from patient info
    if (patientEmail) {
      console.log(`[CRISIS API] Looking up clinician for patient ${patientEmail} from ${source}`);
      // Try lookup by patient email
      const result = await query(
        `SELECT u.email, u.full_name FROM users u
         JOIN patients p ON p.user_id = u.id
         WHERE p.email = $1
         LIMIT 1`,
        [patientEmail]
      );
      if (result.rows.length > 0) {
        const clinician = result.rows[0];
        const sendResult = await sendCrisisAlert(clinician.email, clinician.full_name || 'Clinician', content, source || 'chat', patientName || patientEmail, patientEmail);
        console.log('[CRISIS API] Send result:', JSON.stringify(sendResult));
        return NextResponse.json({ success: true, ...sendResult });
      }
      // Fallback: look up by patient_users username
      if (patientName) {
        const fallbackResult = await query(
          `SELECT u.email, u.full_name FROM users u
           JOIN patients p ON p.user_id = u.id
           JOIN patient_users pu ON pu.patient_id = p.id
           WHERE pu.username = $1
           LIMIT 1`,
          [patientName]
        );
        if (fallbackResult.rows.length > 0) {
          const clinician = fallbackResult.rows[0];
          const sendResult = await sendCrisisAlert(clinician.email, clinician.full_name || 'Clinician', content, source || 'chat', patientName, patientEmail);
          console.log('[CRISIS API] Send result:', JSON.stringify(sendResult));
          return NextResponse.json({ success: true, ...sendResult });
        }
      }
      return NextResponse.json({ error: 'No clinician found for patient' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Missing email or patientEmail' }, { status: 400 });
  } catch (err) {
    console.error('[CRISIS API] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
