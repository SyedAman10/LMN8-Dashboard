import { query } from './db';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ADMIN_EMAIL = 'amanullahnaqvi@gmail.com';
const BULK_THRESHOLD = 10;
const BULK_WINDOW_MINUTES = 5;

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.CRISIS_SMTP_HOST || 'smtpout.secureserver.net',
    port: parseInt(process.env.SMTP_PORT || process.env.CRISIS_SMTP_PORT || '465'),
    secure: (process.env.SMTP_SECURE || process.env.CRISIS_SMTP_SECURE) === 'true',
    auth: {
      user: process.env.SMTP_USER || process.env.CRISIS_SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.CRISIS_SMTP_PASS,
    },
  });
}

async function sendAdminAlert(subject, body) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"LMN8 Security" <${process.env.SMTP_USER || process.env.CRISIS_SMTP_USER || 'noreply@lmn8.com'}>`,
      to: ADMIN_EMAIL,
      subject,
      html: body,
    });
    console.log(`[ACCESS ALERT] Email sent to admin: ${subject}`);
    return true;
  } catch (err) {
    console.error('[ACCESS ALERT] Email failed:', err.message);
    return false;
  }
}

export async function logClinicianAccess({
  clinicianId,
  clinicianEmail,
  clinicianName,
  patientId,
  patientName,
  patientEmail,
  action,
}) {
  try {
    const violationType = await detectViolation(clinicianId, patientId);

    await query(
      `INSERT INTO clinician_access_log
       (clinician_id, clinician_email, clinician_name, patient_id, patient_name, patient_email, action, violation_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [clinicianId, clinicianEmail, clinicianName, patientId, patientName, patientEmail || '', action, violationType]
    );

    if (violationType === 'wrong_patient') {
      await sendAdminAlert(
        `⚠️ SECURITY: Clinician accessed wrong patient's data`,
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#dc2626;">Wrong Patient Access Detected</h2>
          <p>A clinician accessed a patient that is not assigned to them.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p><strong>Clinician:</strong> ${clinicianName} (${clinicianEmail})</p>
          <p><strong>Patient:</strong> ${patientName} (${patientEmail || 'N/A'})</p>
          <p><strong>Action:</strong> ${action}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>`
      );
    }

    const isBulk = await checkBulkAccess(clinicianId);
    if (isBulk) {
      await sendAdminAlert(
        `⚠️ SECURITY: Bulk patient data access by clinician`,
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#dc2626;">Bulk Patient Access Detected</h2>
          <p>A clinician has accessed ${BULK_THRESHOLD}+ patients in the last ${BULK_WINDOW_MINUTES} minutes — possible bulk export.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p><strong>Clinician:</strong> ${clinicianName} (${clinicianEmail})</p>
          <p><strong>Latest patient:</strong> ${patientName} (${patientEmail || 'N/A'})</p>
          <p><strong>Action:</strong> ${action}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>`
      );
    }
  } catch (err) {
    console.error('[ACCESS LOG] Failed to log access:', err.message);
  }
}

async function detectViolation(clinicianId, patientId) {
  try {
    const result = await query(
      `SELECT id FROM patients WHERE id = $1 AND user_id = $2`,
      [patientId, clinicianId]
    );
    if (result.rows.length === 0) {
      return 'wrong_patient';
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function checkBulkAccess(clinicianId) {
  try {
    const result = await query(
      `SELECT COUNT(DISTINCT patient_id) as cnt FROM clinician_access_log
       WHERE clinician_id = $1
       AND created_at > NOW() - INTERVAL '${BULK_WINDOW_MINUTES} minutes'`,
      [clinicianId]
    );
    return parseInt(result.rows[0]?.cnt || '0') >= BULK_THRESHOLD;
  } catch (e) {
    return false;
  }
}

export async function getAccessLogs(limit = 100) {
  try {
    const result = await query(
      `SELECT * FROM clinician_access_log ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (e) {
    return [];
  }
}
