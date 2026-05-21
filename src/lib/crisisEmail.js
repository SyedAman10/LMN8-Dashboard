import nodemailer from 'nodemailer';

function createCrisisTransporter() {
  return nodemailer.createTransport({
    host: process.env.CRISIS_SMTP_HOST,
    port: parseInt(process.env.CRISIS_SMTP_PORT || '465', 10),
    secure: process.env.CRISIS_SMTP_SECURE === 'true',
    auth: {
      user: process.env.CRISIS_SMTP_USER,
      pass: process.env.CRISIS_SMTP_PASS,
    },
  });
}

export async function sendCrisisAlertToClinician(clinicianEmail, clinicianName, content, source, patientName, patientEmail) {
  if (!process.env.CRISIS_SMTP_USER || !process.env.CRISIS_SMTP_PASS) {
    console.warn('[CRISIS EMAIL] SMTP not configured');
    return { success: false, error: 'SMTP not configured' };
  }
  try {
    const transporter = createCrisisTransporter();
    const patientInfo = patientName || patientEmail
      ? `<p style="background:#eef2ff;padding:12px;border-radius:8px;border-left:4px solid #6366f1;">
          <strong>Patient:</strong> ${patientName || 'Unknown'}<br>
          <strong>Email:</strong> ${patientEmail || 'N/A'}
        </p>`
      : '';
    const info = await transporter.sendMail({
      from: `"LMN8 Crisis Alert" <${process.env.CRISIS_SMTP_USER}>`,
      to: clinicianEmail,
      subject: 'LMN8 - CRISIS ALERT: Patient Needs Immediate Support',
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#dc2626;">Patient Crisis Alert</h2>
        <p>Hi ${clinicianName},</p>
        <p>One of your patients has ${source === 'chat' ? 'sent a message' : 'written a journal entry'} containing language that suggests they may be in crisis or having harmful thoughts.</p>
        ${patientInfo}
        <p style="background:#fef2f2;padding:16px;border-radius:8px;border-left:4px solid #dc2626;">
          <strong>Concerning ${source === 'chat' ? 'message' : 'entry'} detected:</strong><br>
          <em>"${content.substring(0, 200)}"</em>
        </p>
        <p style="font-weight:bold;color:#dc2626;">Please reach out to your patient as soon possible.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">This is an automated alert from LMN8. Please take appropriate action.</p>
      </div>`,
    });
    console.log(`[CRISIS EMAIL] Alert sent to clinician ${clinicianEmail} via ${process.env.CRISIS_SMTP_HOST} id=${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[CRISIS EMAIL] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendCrisisAlert(clinicianEmail, clinicianName, content, source, patientName, patientEmail) {
  return sendCrisisAlertToClinician(clinicianEmail, clinicianName, content, source, patientName, patientEmail);
}
