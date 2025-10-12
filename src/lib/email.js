import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Email configuration
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, you might want to use SendGrid, AWS SES, or other services
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Use App Password for Gmail
    },
  });
};

// Password reset email template
export const createPasswordResetEmailTemplate = (email, resetToken, username) => {
  // In production, this would be a deep link to the mobile app
  // For now, we'll include the token
  const resetLink = `lumen8://reset-password?token=${resetToken}`;
  
  return {
    from: `"LMN8" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Request - LMN8`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - LMN8</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #5bc0be;
            margin-bottom: 10px;
          }
          .title {
            color: #ffffff;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .content {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .greeting {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 20px;
          }
          .warning-box {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
          }
          .warning-text {
            color: #fca5a5;
            font-size: 14px;
          }
          .token-box {
            background: rgba(6, 182, 212, 0.1);
            border: 2px solid #06b6d4;
            border-radius: 15px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .token-label {
            color: #06b6d4;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .token-value {
            color: #ffffff;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
            background: rgba(0, 0, 0, 0.3);
            padding: 10px;
            border-radius: 5px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4, #10b981);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .highlight {
            color: #06b6d4;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LMN8</div>
            <h1 class="title">Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p class="greeting">Hello <span class="highlight">${username}</span>,</p>
            
            <p style="color: #e2e8f0; margin-bottom: 20px;">
              We received a request to reset your password for your LMN8 account. 
              If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div class="warning-box">
              <div class="warning-text">
                <strong>⏰ Important:</strong> This reset link will expire in <strong>1 hour</strong> for security reasons.
              </div>
            </div>

            <p style="color: #e2e8f0; margin: 20px 0;">
              <strong>To reset your password:</strong>
            </p>
            
            <ol style="color: #e2e8f0; margin-left: 20px;">
              <li>Open the LMN8 mobile app</li>
              <li>Tap on "Forgot Password"</li>
              <li>Enter your reset token when prompted</li>
              <li>Create your new password</li>
            </ol>

            <div class="token-box">
              <div class="token-label">🔐 Your Reset Token</div>
              <div class="token-value">${resetToken}</div>
            </div>

            <p style="color: #e2e8f0; font-size: 14px; margin-top: 20px;">
              <strong>Security Tips:</strong>
            </p>
            <ul style="color: #94a3b8; font-size: 14px;">
              <li>Never share your reset token with anyone</li>
              <li>Choose a strong, unique password</li>
              <li>If you didn't request this, contact support immediately</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>© 2024 LMN8. All rights reserved.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 10px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - LMN8
      
      Hello ${username},
      
      We received a request to reset your password for your LMN8 account. 
      If you didn't make this request, you can safely ignore this email.
      
      ⏰ IMPORTANT: This reset link will expire in 1 hour for security reasons.
      
      To reset your password:
      1. Open the LMN8 mobile app
      2. Tap on "Forgot Password"
      3. Enter your reset token when prompted
      4. Create your new password
      
      Your Reset Token:
      ${resetToken}
      
      Security Tips:
      - Never share your reset token with anyone
      - Choose a strong, unique password
      - If you didn't request this, contact support immediately
      
      © 2024 LMN8. All rights reserved.
      This is an automated message. Please do not reply to this email.
    `
  };
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, username) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('Email configuration missing. Skipping password reset email.');
      return { success: false, error: 'Email configuration missing' };
    }

    console.log('📧 Sending password reset email to:', email);
    const transporter = createTransporter();
    const emailTemplate = createPasswordResetEmailTemplate(email, resetToken, username);
    
    const result = await transporter.sendMail(emailTemplate);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    
    return { 
      success: true, 
      messageId: result.messageId,
      message: 'Password reset email sent successfully'
    };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send password reset email'
    };
  }
};

// Welcome email template
export const createWelcomeEmailTemplate = (patient) => {
  const { name, email, therapist, totalSessions } = patient;
  
  return {
    from: `"Luminate Clinician" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Luminate Clinician - Your Treatment Journey Begins!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Luminate Clinician</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #06b6d4, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
          }
          .welcome-title {
            color: #ffffff;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .welcome-subtitle {
            color: #94a3b8;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .content {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .greeting {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 20px;
          }
          .info-section {
            background: rgba(6, 182, 212, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #06b6d4;
          }
          .info-title {
            color: #06b6d4;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .info-text {
            color: #e2e8f0;
            margin-bottom: 8px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4, #10b981);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .highlight {
            color: #06b6d4;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Luminate Clinician</div>
            <h1 class="welcome-title">Welcome to Your Treatment Journey!</h1>
            <p class="welcome-subtitle">Your personalized healthcare experience starts now</p>
          </div>
          
          <div class="content">
            <p class="greeting">Dear <span class="highlight">${name}</span>,</p>
            
            <p style="color: #e2e8f0; margin-bottom: 20px;">
              Welcome to Luminate Clinician! We're thrilled to have you as part of our healthcare family. 
              Your treatment journey has been carefully planned and personalized just for you.
            </p>
            
            <div class="info-section">
              <div class="info-title">📋 Your Treatment Details</div>
              <div class="info-text"><strong>Therapist:</strong> ${therapist || 'To be assigned'}</div>
              <div class="info-text"><strong>Total Sessions:</strong> ${totalSessions || 'To be determined'}</div>
              <div class="info-text"><strong>Status:</strong> <span class="highlight">Ready to Begin</span></div>
            </div>
            
            <p style="color: #e2e8f0; margin: 20px 0;">
              Our team is committed to providing you with the highest quality care and support throughout your treatment. 
              You'll receive regular updates about your progress and any important information about your sessions.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="cta-button">Access Your Patient Portal</a>
            </div>
            
            <p style="color: #e2e8f0; font-size: 14px; margin-top: 20px;">
              If you have any questions or need assistance, please don't hesitate to contact our support team. 
              We're here to help you every step of the way.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Luminate Clinician. All rights reserved.</p>
            <p>This email was sent to ${email}. If you believe this is an error, please contact us.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Luminate Clinician!
      
      Dear ${name},
      
      Welcome to Luminate Clinician! We're thrilled to have you as part of our healthcare family. 
      Your treatment journey has been carefully planned and personalized just for you.
      
      Your Treatment Details:
      - Therapist: ${therapist || 'To be assigned'}
      - Total Sessions: ${totalSessions || 'To be determined'}
      - Status: Ready to Begin
      
      Our team is committed to providing you with the highest quality care and support throughout your treatment. 
      You'll receive regular updates about your progress and any important information about your sessions.
      
      If you have any questions or need assistance, please don't hesitate to contact our support team. 
      We're here to help you every step of the way.
      
      Best regards,
      The Luminate Clinician Team
      
      © 2024 Luminate Clinician. All rights reserved.
    `
  };
};

// Send welcome email
export const sendWelcomeEmail = async (patient) => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('Email configuration missing. Skipping email send.');
      console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
      console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Missing');
      return { success: false, error: 'Email configuration missing' };
    }

    console.log('Attempting to send welcome email to:', patient.email);
    const transporter = createTransporter();
    const emailTemplate = createWelcomeEmailTemplate(patient);
    
    const result = await transporter.sendMail(emailTemplate);
    console.log('Welcome email sent successfully:', result.messageId);
    
    return { 
      success: true, 
      messageId: result.messageId,
      message: 'Welcome email sent successfully'
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send welcome email'
    };
  }
};

// Patient login credentials email template
export const createPatientCredentialsEmailTemplate = (patient, credentials) => {
  const { name, email, therapist } = patient;
  const { username, password } = credentials;
  
  return {
    from: `"Luminate Clinician" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Patient Portal Access - Luminate Clinician`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Patient Portal Access - Luminate Clinician</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #06b6d4, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
          }
          .title {
            color: #ffffff;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .subtitle {
            color: #94a3b8;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .content {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .greeting {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 20px;
          }
          .credentials-box {
            background: rgba(6, 182, 212, 0.1);
            border: 2px solid #06b6d4;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .credentials-title {
            color: #06b6d4;
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .credential-item {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .credential-label {
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .credential-value {
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4, #10b981);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .security-notice {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
          }
          .security-title {
            color: #ef4444;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .security-text {
            color: #fca5a5;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .highlight {
            color: #06b6d4;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Luminate Clinician</div>
            <h1 class="title">Your Patient Portal Access</h1>
            <p class="subtitle">Secure login credentials for your treatment journey</p>
          </div>
          
          <div class="content">
            <p class="greeting">Dear <span class="highlight">${name}</span>,</p>
            
            <p style="color: #e2e8f0; margin-bottom: 20px;">
              Welcome to your personalized patient portal! We've created secure login credentials 
              so you can access your treatment information, track your progress, and communicate 
              with your healthcare team.
            </p>
            
            <div class="credentials-box">
              <div class="credentials-title">🔐 Your Login Credentials</div>
              <div class="credential-item">
                <div class="credential-label">Username</div>
                <div class="credential-value">${username}</div>
              </div>
              <div class="credential-item">
                <div class="credential-label">Password</div>
                <div class="credential-value">${password}</div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="cta-button">Access Your Patient Portal</a>
            </div>
            
            <div class="security-notice">
              <div class="security-title">🔒 Security Notice</div>
              <div class="security-text">
                • Keep your login credentials secure and don't share them with anyone<br>
                • You can change your password after your first login<br>
                • If you suspect unauthorized access, contact us immediately<br>
                • These credentials are unique to your account
              </div>
            </div>
            
            <p style="color: #e2e8f0; margin: 20px 0;">
              <strong>Your Treatment Team:</strong><br>
              <span class="highlight">Therapist:</span> ${therapist || 'To be assigned'}<br>
              <span class="highlight">Status:</span> Active Treatment
            </p>
            
            <p style="color: #e2e8f0; font-size: 14px; margin-top: 20px;">
              If you have any questions or need assistance accessing your portal, 
              please don't hesitate to contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Luminate Clinician. All rights reserved.</p>
            <p>This email contains sensitive information. Please keep it secure.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Patient Portal Access - Luminate Clinician
      
      Dear ${name},
      
      Welcome to your personalized patient portal! We've created secure login credentials 
      so you can access your treatment information, track your progress, and communicate 
      with your healthcare team.
      
      Your Login Credentials:
      ======================
      Username: ${username}
      Password: ${password}
      
      Security Notice:
      - Keep your login credentials secure and don't share them with anyone
      - You can change your password after your first login
      - If you suspect unauthorized access, contact us immediately
      - These credentials are unique to your account
      
      Your Treatment Team:
      - Therapist: ${therapist || 'To be assigned'}
      - Status: Active Treatment
      
      If you have any questions or need assistance accessing your portal, 
      please don't hesitate to contact our support team.
      
      Best regards,
      The Luminate Clinician Team
      
      © 2024 Luminate Clinician. All rights reserved.
    `
  };
};

// Send patient login credentials email
export const sendPatientCredentialsEmail = async (patient, credentials) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('Email configuration missing. Skipping credentials email send.');
      return { success: false, error: 'Email configuration missing' };
    }

    console.log('Sending patient credentials email to:', patient.email);
    const transporter = createTransporter();
    const emailTemplate = createPatientCredentialsEmailTemplate(patient, credentials);
    
    const result = await transporter.sendMail(emailTemplate);
    console.log('Patient credentials email sent successfully:', result.messageId);
    
    return { 
      success: true, 
      messageId: result.messageId,
      message: 'Patient credentials email sent successfully'
    };
  } catch (error) {
    console.error('Error sending patient credentials email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send patient credentials email'
    };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    await transporter.verify();
    
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return { success: false, error: error.message };
  }
};
