# Form Submission System Documentation

## Overview

This document explains the complete form submission system for LMN8, including database storage, email notifications, and API endpoints.

## System Architecture

```
User submits form → API Route → Database Storage + Email Notifications
                                        ↓              ↓
                                    PostgreSQL    Admin Email
                                                  User Confirmation Email
```

## Forms Available

### 1. **Demo Request Form**
- **Location**: Landing page modal (`/`)
- **Purpose**: Schedule product demonstrations
- **Fields**:
  - Name
  - Email
  - Clinic Name
  - Phone
- **API Endpoint**: `POST /api/forms/demo-request`
- **Database Table**: `demo_requests`

### 2. **Contact Form**
- **Location**: Landing page modal (`/`)
- **Purpose**: General inquiries and questions
- **Fields**:
  - Name
  - Email
  - Subject
  - Message
- **API Endpoint**: `POST /api/forms/contact`
- **Database Table**: `contact_submissions`

### 3. **Founding Partner Application**
- **Location**: Dedicated page (`/founding-partner`)
- **Purpose**: Apply for founding partnership program
- **Fields**:
  - Personal: Name, Email, Role, Phone
  - Clinic: Clinic Name, Website, Location, Patients per Month
  - Systems: Current Systems, Challenges
  - Vision: Why this resonates, Implementation Timeline
- **API Endpoint**: `POST /api/forms/partner-application`
- **Database Table**: `partner_applications`

## Database Schema

### Table: `demo_requests`
```sql
CREATE TABLE demo_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  clinic_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `contact_submissions`
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `partner_applications`
```sql
CREATE TABLE partner_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  clinic_name VARCHAR(255) NOT NULL,
  clinic_website VARCHAR(500),
  clinic_location VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  patients_per_month VARCHAR(100) NOT NULL,
  current_systems TEXT NOT NULL,
  challenges TEXT NOT NULL,
  vision TEXT NOT NULL,
  timeline VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_review',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Email System

### Configuration Required

Set these environment variables in `.env.local`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-specific-password
```

**Note**: For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `EMAIL_APP_PASSWORD`

### Email Types

Each form submission triggers **two emails**:

#### 1. Admin Notification
- **Recipient**: Your configured `EMAIL_USER`
- **Purpose**: Notify you of new submissions
- **Contains**: All form data in formatted HTML
- **Subject Examples**:
  - `🎯 New Demo Request from [Clinic Name]`
  - `📬 New Contact Form Submission: [Subject]`
  - `🌟 New Founding Partner Application from [Clinic Name]`

#### 2. User Confirmation
- **Recipient**: Form submitter's email
- **Purpose**: Acknowledge receipt and set expectations
- **Contains**: 
  - Thank you message
  - Response timeline (24 hours for demos, 24-48 hours for contact, 3-5 days for partners)
  - Next steps information
- **Brand**: Professional LMN8 branded emails

## API Routes

### Demo Request API

**Endpoint**: `POST /api/forms/demo-request`

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john@clinic.com",
  "clinicName": "Smith Therapy Center",
  "phone": "(555) 123-4567"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Demo request submitted successfully",
  "id": 1,
  "emailsSent": {
    "admin": true,
    "user": true
  }
}
```

**Error Response** (400/500):
```json
{
  "error": "Missing required fields",
  "details": "..."
}
```

### Contact Form API

**Endpoint**: `POST /api/forms/contact`

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Integration Question",
  "message": "I would like to know more about..."
}
```

**Response**: Similar structure to demo request

### Partner Application API

**Endpoint**: `POST /api/forms/partner-application`

**Request Body**:
```json
{
  "name": "Dr. Sarah Johnson",
  "email": "sarah@clinic.com",
  "role": "Clinical Director",
  "clinicName": "Johnson Wellness Center",
  "clinicWebsite": "https://johnsonwellness.com",
  "clinicLocation": "Portland, OR",
  "phone": "(555) 987-6543",
  "patientsPerMonth": "50-100",
  "currentSystems": "We currently use...",
  "challenges": "Our main challenges are...",
  "vision": "This resonates because...",
  "timeline": "Within 3 months"
}
```

**Response**: Similar structure to demo request

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── forms/
│   │       ├── demo-request/
│   │       │   └── route.js          # Demo API endpoint
│   │       ├── contact/
│   │       │   └── route.js          # Contact API endpoint
│   │       └── partner-application/
│   │           └── route.js          # Partner API endpoint
│   └── founding-partner/
│       └── page.js                   # Partner application page
├── components/
│   └── pages/
│       └── LandingPage.js            # Demo & Contact forms
├── lib/
│   ├── db.js                         # Database connection
│   └── formEmails.js                 # Email templates & sending
└── scripts/
    └── create-form-tables.js         # Database setup script
```

## Setup Instructions

### 1. Database Setup

Run the table creation script:

```bash
node src/scripts/create-form-tables.js
```

This creates all three tables with proper indexes.

### 2. Email Configuration

Add to `.env.local`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

### 3. Test the System

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Test each form:
   - Click "Schedule Your Demo" button
   - Fill out and submit
   - Check your email for both admin notification and user confirmation

## Accessing Form Submissions

### Via Database

Connect to your PostgreSQL database and query:

```sql
-- View all demo requests
SELECT * FROM demo_requests ORDER BY created_at DESC;

-- View all contact submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC;

-- View all partner applications
SELECT * FROM partner_applications ORDER BY created_at DESC;

-- Count submissions by status
SELECT status, COUNT(*) FROM demo_requests GROUP BY status;
```

### Recommended: Build an Admin Dashboard

You can create an admin page to view and manage submissions:

```
/admin/submissions
├── Demo Requests
├── Contact Forms
└── Partner Applications
```

Each with:
- List view with filters
- Detail view
- Status management
- Notes/comments
- Export functionality

## Status Management

Each table has a `status` field for tracking:

### Demo Requests
- `new` - Just submitted
- `contacted` - Initial contact made
- `scheduled` - Demo scheduled
- `completed` - Demo completed
- `converted` - Became a customer

### Contact Submissions
- `new` - Just submitted
- `in_progress` - Being addressed
- `responded` - Response sent
- `closed` - Issue resolved

### Partner Applications
- `pending_review` - Just submitted
- `under_review` - Being evaluated
- `approved` - Accepted as partner
- `declined` - Not a fit
- `waitlisted` - Future consideration

## Email Deliverability Tips

1. **Use a Professional Email Service**: For production, consider:
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Add SPF/DKIM Records**: Improve deliverability

3. **Monitor Bounce Rates**: Track email success

4. **Test Spam Filters**: Ensure emails reach inbox

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent spam
2. **CAPTCHA**: Add reCAPTCHA for public forms
3. **Input Validation**: Already implemented on API routes
4. **SQL Injection**: Using parameterized queries (safe)
5. **XSS Prevention**: Next.js handles this automatically

## Monitoring & Analytics

### Track These Metrics

1. **Submission Rates**
   - How many forms per day/week/month
   - Conversion rate from page visits to submissions

2. **Email Success Rates**
   - Percentage of emails delivered successfully
   - Bounce rates

3. **Response Times**
   - Time from submission to first response
   - Time to resolution

4. **Quality Scores**
   - Partner applications: approval rate
   - Demo requests: conversion to scheduled demos

## Troubleshooting

### Emails Not Sending

**Issue**: Emails fail silently

**Solutions**:
1. Check `.env.local` has correct credentials
2. Verify Gmail App Password (not regular password)
3. Check console for error messages
4. Test email config: Create test endpoint at `/api/test-email`

### Database Connection Errors

**Issue**: Form submission fails with database error

**Solutions**:
1. Verify `DATABASE_URL` in `.env.local`
2. Check Neon database is active
3. Verify tables exist: `node src/scripts/create-form-tables.js`
4. Check database logs

### Form Not Submitting

**Issue**: Form shows error or doesn't respond

**Solutions**:
1. Open browser console for error messages
2. Check network tab for failed API calls
3. Verify API routes are correctly deployed
4. Check request payload format

## Future Enhancements

### Recommended Additions

1. **Admin Dashboard**
   - View all submissions in one place
   - Manage status and add notes
   - Export to CSV

2. **Email Templates**
   - Customizable email templates
   - A/B testing for response rates

3. **Automation**
   - Auto-schedule demos based on calendar availability
   - Send follow-up emails automatically
   - Slack/Discord notifications for high-priority submissions

4. **Analytics**
   - Track form conversion rates
   - Monitor submission sources
   - Analyze user behavior

5. **CRM Integration**
   - Sync with Salesforce, HubSpot, etc.
   - Track full customer journey
   - Automated lead scoring

## Support

For issues or questions about this system:
1. Check the troubleshooting section above
2. Review error logs in console/terminal
3. Verify all environment variables are set
4. Contact technical support

---

**Last Updated**: October 2024
**Version**: 1.0.0
**Maintained By**: LMN8 Development Team

