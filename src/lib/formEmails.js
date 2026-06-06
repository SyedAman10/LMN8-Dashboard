import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

const darkModeBase = `
  @media (prefers-color-scheme: dark) {
    body { background-color: #0d1117 !important; color: #e6edf3 !important; }
    .container { background-color: #0d1117 !important; }
    .content { background-color: #161b22 !important; color: #e6edf3 !important; }
    .field { background-color: #21262d !important; border: 1px solid #30363d !important; }
    .label { color: #5bc0be !important; }
    .value { color: #e6edf3 !important; }
    .value a { color: #5bc0be !important; }
    .action-box { background-color: #21262d !important; color: #e6edf3 !important; }
    .section h3 { color: #e6edf3 !important; }
    .highlight-box { background-color: #21262d !important; color: #e6edf3 !important; }
    .message-box { background-color: #21262d !important; }
    p { color: #e6edf3 !important; }
    li { color: #e6edf3 !important; }
    strong { color: #e6edf3 !important; }
  }
`;

// Admin notification for demo request
export const sendDemoRequestAdminEmail = async (data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('Email configuration missing.');
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    const emailTemplate = {
      from: `"LMN8 Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🎯 New Demo Request from ${data.clinicName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #5bc0be; margin-bottom: 5px; }
            .value { color: #333; }
            .action-box { margin-top: 20px; padding: 15px; background: #e8f5f5; border-left: 4px solid #5bc0be; border-radius: 5px; color: #333; }
            ${darkModeBase}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎯 New Demo Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone wants to see LMN8 in action!</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Clinic Name</div>
                <div class="value">${data.clinicName}</div>
              </div>
              <div class="field">
                <div class="label">Phone</div>
                <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
              </div>
              <div class="action-box">
                <strong>Action Required:</strong> Reach out to schedule their demo!
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(emailTemplate);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending demo request admin email:', error);
    return { success: false, error: error.message };
  }
};

// User confirmation for demo request
export const sendDemoRequestConfirmationEmail = async (data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    const emailTemplate = {
      from: `"LMN8" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Your LMN8 Demo Request - We'll Be In Touch Soon`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; color: #5bc0be; margin-bottom: 10px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { color: #5bc0be; font-weight: bold; }
            .field { padding: 20px; background: white; border-radius: 5px; margin: 20px 0; border-left: 4px solid #5bc0be; }
            .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            ${darkModeBase}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LMN8</div>
              <h1 style="margin: 0; color: white;">Demo Request Received</h1>
            </div>
            <div class="content">
              <p>Hi <span class="highlight">${data.name}</span>,</p>
              <p>Thank you for your interest in LMN8! We've received your demo request for <strong>${data.clinicName}</strong>.</p>
              <p>One of our team members will reach out to you within <strong>24 hours</strong> to schedule a personalized demonstration of how LMN8 can ensure no ketamine therapy patient experiences abandonment during their most vulnerable moments.</p>
              <div class="field">
                <p style="margin: 0;"><strong>What to expect in your demo:</strong></p>
                <ul style="margin-top: 10px; margin-bottom: 0; padding-left: 20px;">
                  <li>See how LMN8 achieves 96% integration completion</li>
                  <li>Understand our zero-failure commitment</li>
                  <li>Discover how we preserve therapeutic presence</li>
                </ul>
              </div>
              <p>In the meantime, if you have any questions, feel free to reply to this email.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>The LMN8 Team</strong></p>
              <p class="footer"><em>Technology built to heal, not replace.</em></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(emailTemplate);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending demo confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Admin notification for contact form
export const sendContactAdminEmail = async (data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    const emailTemplate = {
      from: `"LMN8 Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📬 New Contact Form Submission: ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #5bc0be; margin-bottom: 5px; }
            .value { color: #333; }
            .message-box { background: white; padding: 20px; border-radius: 5px; margin-top: 15px; border-left: 4px solid #5bc0be; }
            ${darkModeBase}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📬 New Contact Message</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${data.subject}</div>
              </div>
              <div class="message-box">
                <div class="label">Message</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(emailTemplate);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending contact admin email:', error);
    return { success: false, error: error.message };
  }
};

// User confirmation for contact form
export const sendContactConfirmationEmail = async (data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    const emailTemplate = {
      from: `"LMN8" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `We Received Your Message - LMN8`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; color: #5bc0be; margin-bottom: 10px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { color: #5bc0be; font-weight: bold; }
            .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            ${darkModeBase}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LMN8</div>
              <h1 style="margin: 0; color: white;">Message Received</h1>
            </div>
            <div class="content">
              <p>Hi <span class="highlight">${data.name}</span>,</p>
              <p>Thank you for reaching out to us. We've received your message regarding "<strong>${data.subject}</strong>" and our team will review it shortly.</p>
              <p>We typically respond within <strong>24-48 hours</strong>. If your inquiry is urgent, feel free to reply to this email with additional details.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>The LMN8 Team</strong></p>
              <p class="footer"><em>Technology built to heal, not replace.</em></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(emailTemplate);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Admin notification for partner application
export const sendPartnerApplicationAdminEmail = async (data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    const emailTemplate = {
      from: `"LMN8 Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🌟 New Founding Partner Application from ${data.clinicName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .badge { display: inline-block; background: #5bc0be; color: #0b132b; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #0b132b; margin-top: 0; }
            .field { margin-bottom: 12px; padding: 12px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #5bc0be; margin-bottom: 5px; font-size: 14px; }
            .value { color: #333; }
            .highlight-box { background: #f0fafa; padding: 20px; border-radius: 5px; border-left: 4px solid #5bc0be; margin: 20px 0; }
            .action-box { margin-top: 30px; padding: 20px; background: #e8f5f5; border-left: 4px solid #5bc0be; border-radius: 5px; color: #333; }
            ${darkModeBase}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="badge">FOUNDING PARTNER APPLICATION</div>
              <h1 style="margin: 10px 0 0 0; color: white;">🌟 High-Value Lead</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in becoming a Founding Partner!</p>
            </div>
            <div class="content">
              <div class="section">
                <h3>Contact Information</h3>
                <div class="field">
                  <div class="label">Name &amp; Role</div>
                  <div class="value">${data.name} - ${data.role}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Phone</div>
                  <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
                </div>
              </div>
              <div class="section">
                <h3>Clinic Information</h3>
                <div class="field">
                  <div class="label">Clinic Name</div>
                  <div class="value">${data.clinicName}</div>
                </div>
                <div class="field">
                  <div class="label">Location</div>
                  <div class="value">${data.clinicLocation}</div>
                </div>
                ${data.clinicWebsite ? `
                <div class="field">
                  <div class="label">Website</div>
                  <div class="value"><a href="${data.clinicWebsite}" target="_blank">${data.clinicWebsite}</a></div>
                </div>` : ''}
                <div class="field">
                  <div class="label">Patients per Month</div>
                  <div class="value">${data.patientsPerMonth}</div>
                </div>
              </div>
              <div class="section">
                <h3>Current Systems</h3>
                <div class="field">
                  <div class="value">${data.currentSystems.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              <div class="section">
                <h3>Integration Challenges</h3>
                <div class="field">
                  <div class="value">${data.challenges.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              <div class="highlight-box">
                <h3 style="color: #0b132b; margin-top: 0;">Why This Resonates</h3>
                <div class="value">${data.vision.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="field">
                <div class="label">Implementation Timeline</div>
                <div class="value">${data.timeline}</div>
              </div>
              <div class="action-box">
                <strong>🎯 Priority Action:</strong> This is a Founding Partner application — respond within 24 hours!
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(emailTemplate);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending partner application admin email:', error);
    return { success: false, error: error.message };
  }
};

// User confirmation for partner application
export const sendPartnerApplicationConfirmationEmail = async (data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    const emailTemplate = {
      from: `"LMN8" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Your Founding Partnership Application - Under Review`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; color: #5bc0be; margin-bottom: 10px; }
            .badge { display: inline-block; background: #5bc0be; color: #0b132b; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 15px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { color: #5bc0be; font-weight: bold; }
            .field { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #5bc0be; }
            .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            ${darkModeBase}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LMN8</div>
              <h1 style="margin: 0; color: white;">Application Received</h1>
              <div class="badge">FOUNDING PARTNER</div>
            </div>
            <div class="content">
              <p>Dear <span class="highlight">${data.name}</span>,</p>
              <p>Thank you for your interest in becoming a Founding Partner of LMN8. Your application for <strong>${data.clinicName}</strong> demonstrates a commitment to therapeutic excellence that aligns perfectly with our mission.</p>
              <div class="field">
                <p style="margin: 0;"><strong>What Happens Next:</strong></p>
                <ul style="margin-top: 10px; margin-bottom: 0; padding-left: 20px;">
                  <li>Our team will carefully review your application within 3-5 business days</li>
                  <li>We'll reach out to discuss your vision and explore alignment</li>
                  <li>If selected, we'll schedule a detailed conversation about the partnership</li>
                </ul>
              </div>
              <p><em>We review each application thoughtfully and consider not just technical fit, but cultural and mission alignment as well. This partnership is intentionally limited to clinics that share our vision for therapeutic presence technology.</em></p>
              <p style="margin-top: 30px;">If you have any questions in the meantime, please don't hesitate to reach out.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>The LMN8 Founding Team</strong></p>
              <p class="footer"><em>Technology built to heal, not replace.</em></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(emailTemplate);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending partner confirmation email:', error);
    return { success: false, error: error.message };
  }
};
