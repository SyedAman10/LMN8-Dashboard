# 📧 Email Setup Guide - Luminate Clinician

This guide will help you set up the email system for sending welcome emails to patients after successful onboarding.

## 🚀 Quick Setup

### 1. **Environment Configuration**

First, make sure your `.env.local` file includes the email configuration:

```bash
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

### 2. **Gmail Setup (Recommended for Development)**

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled

#### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other" as the device and name it "Luminate Clinician"
4. Copy the generated 16-character password
5. Use this password as `EMAIL_APP_PASSWORD` in your `.env.local`

### 3. **Test Email Configuration**

Run the setup script to test your email configuration:

```bash
# Test email configuration
curl -X GET http://localhost:3001/api/test-email

# Send test welcome email
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test Patient"}'
```

## 🎨 Email Features

### **Welcome Email Template**
- **Professional Design**: Beautiful HTML template with gradients and animations
- **Personalized Content**: Patient name, therapist, and treatment details
- **Responsive Layout**: Works on all devices and email clients
- **Brand Consistency**: Matches the Luminate Clinician design language

### **Email Content Includes**
- ✅ Personalized greeting with patient name
- ✅ Treatment details (therapist, total sessions, status)
- ✅ Professional welcome message
- ✅ Call-to-action button for patient portal
- ✅ Contact information and support details
- ✅ Branded footer with company information

## 🔧 Technical Implementation

### **Email Service Architecture**
```javascript
// Email sending is non-blocking
// Patient creation succeeds even if email fails
const emailResult = await sendWelcomeEmail(patientData);
```

### **Error Handling**
- ✅ Email failures don't block patient creation
- ✅ Detailed error logging for debugging
- ✅ User-friendly error messages
- ✅ Graceful fallback when email is not configured

### **Security Features**
- ✅ App Password authentication (not regular password)
- ✅ Environment variable protection
- ✅ SMTP over TLS encryption
- ✅ No sensitive data in logs

## 🚀 Production Considerations

### **For Production, Consider:**
1. **SendGrid**: More reliable and scalable
2. **AWS SES**: Cost-effective for high volume
3. **Mailgun**: Developer-friendly API
4. **Postmark**: Transactional email specialist

### **Example SendGrid Configuration**
```javascript
// In src/lib/email.js
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
};
```

## 🧪 Testing

### **Test Email Configuration**
```bash
# Check if email is properly configured
GET /api/test-email

# Send test welcome email
POST /api/test-email
{
  "email": "test@example.com",
  "name": "Test Patient"
}
```

### **Test Patient Creation with Email**
1. Go to Dashboard → Add New Patient
2. Fill in patient details including email
3. Submit the form
4. Check console logs for email status
5. Verify email is received

## 📋 Troubleshooting

### **Common Issues**

#### 1. **"Email configuration missing"**
- **Solution**: Add `EMAIL_USER` and `EMAIL_APP_PASSWORD` to `.env.local`
- **Check**: Restart the development server after adding variables

#### 2. **"Invalid login" or "Authentication failed"**
- **Solution**: Use App Password, not regular Gmail password
- **Check**: 2FA must be enabled on Google account

#### 3. **"Connection timeout"**
- **Solution**: Check internet connection and firewall settings
- **Check**: Gmail SMTP settings are correct

#### 4. **"Email sent but not received"**
- **Solution**: Check spam folder
- **Check**: Verify email address is correct
- **Check**: Gmail sending limits (500 emails/day for free accounts)

### **Debug Steps**
1. Check console logs for detailed error messages
2. Test email configuration with `/api/test-email`
3. Verify environment variables are loaded correctly
4. Check Gmail account security settings

## 📊 Email Analytics (Future Enhancement)

### **Planned Features**
- 📈 Email delivery tracking
- 📊 Open rate monitoring
- 🔗 Click-through rate analysis
- 📧 Bounce handling and retry logic
- 📝 Email template A/B testing

## 🎯 Success Metrics

### **Current Implementation**
- ✅ Email sent successfully: Patient receives welcome email
- ✅ Email failed gracefully: Patient still created, error logged
- ✅ No email provided: Patient created without email attempt
- ✅ Professional template: Branded, responsive, informative

### **User Experience**
- 🎉 Immediate feedback: Success message shows email status
- 🔄 Real-time updates: Patient list updates instantly
- 📱 Mobile-friendly: Email works on all devices
- 🌐 Cross-platform: Works with all major email clients

## 🚀 Next Steps

1. **Set up your Gmail App Password**
2. **Update your `.env.local` file**
3. **Test the email configuration**
4. **Create a test patient with email**
5. **Verify the welcome email is received**

---

**Need Help?** Check the console logs for detailed error messages or contact the development team.

**Happy Emailing!** 📧✨
