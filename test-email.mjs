import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.CRISIS_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.CRISIS_SMTP_PORT || '587'),
  secure: process.env.CRISIS_SMTP_SECURE === 'true',
  auth: {
    user: process.env.CRISIS_SMTP_USER,
    pass: process.env.CRISIS_SMTP_PASS,
  },
});

const fromName = process.env.FROM_NAME || 'LMN8';
const fromEmail = process.env.FROM_EMAIL || process.env.CRISIS_SMTP_USER;

const result = await transporter.sendMail({
  from: `"${fromName}" <${fromEmail}>`,
  to: 'ranasubhanrajput6677@gmail.com',
  subject: 'LMN8 Email Test',
  text: 'This is a test email from LMN8.',
});

console.log('✅ Email sent:', result.messageId);
