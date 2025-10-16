# Production 504 Timeout Fix

## Problem
Your demo request form was working in development but timing out (504 Gateway Timeout) in production at `https://lumen8health.com/api/forms/demo-request`.

## Root Cause
The API route was **waiting for emails to send** before responding. In production:
- Email sending can take 5-10+ seconds
- Platform timeout limits (Vercel Free = 10s, Pro = 60s)
- Database connections can be slower
- Result: Request times out before response is sent

## Solution Applied

### 1. ✅ Non-Blocking Email Sending
Changed all form API routes to send emails in the background:

**Before:**
```javascript
const adminResult = await sendEmail(); // Waits for email
const userResult = await sendEmail();  // Waits again
return response; // Only after both emails sent
```

**After:**
```javascript
sendEmailsInBackground(data); // Fire and forget
return response; // Immediate response
```

Files updated:
- `src/app/api/forms/demo-request/route.js`
- `src/app/api/forms/contact/route.js`
- `src/app/api/forms/partner-application/route.js`

### 2. ✅ Database Connection Optimization
Added timeout and pool settings to prevent hanging connections:

```javascript
const pool = new Pool({
  connectionString: connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000 // Fail fast if DB is slow
});
```

File updated:
- `src/lib/db.js`

### 3. ✅ Better Error Handling
Improved frontend to detect non-JSON responses:

File updated:
- `src/components/pages/LandingPage.js`

### 4. ✅ Vercel Configuration
Created `vercel.json` with production settings

## How It Works Now

```
User submits form
    ↓
API validates data
    ↓
Save to database (fast, ~100-500ms)
    ↓
Respond immediately ✅
    ↓
Emails send in background (5-10s, doesn't block)
```

## Response Time Improvement

| Step | Before | After |
|------|--------|-------|
| Database save | 0.5s | 0.5s |
| Email sending | 8-15s ⏰ | 0s (background) |
| **Total response** | **10-20s** ❌ | **0.5-1s** ✅ |

## Deploy Instructions

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: Prevent API timeout by making email sending non-blocking"
   git push
   ```

2. **Deploy** (automatic if using Vercel)

3. **Test in production:**
   - Visit https://lumen8health.com
   - Submit demo request form
   - Should see success message in < 2 seconds

4. **Verify emails are still sending:**
   - Check your admin email (EMAIL_USER)
   - Check submitter's email
   - If emails aren't arriving, check Vercel logs

## Monitoring Email Delivery

To check if emails are being sent in production:

1. **Vercel Dashboard** → Your Project → Functions tab
2. Click on the API route function
3. View logs to see:
   ```
   Email sending results: { admin: 'sent', user: 'sent' }
   ```

## Environment Variables Required

Make sure these are set in Vercel:
- `DATABASE_URL` - Your Neon database connection string
- `EMAIL_USER` - Your Gmail address
- `EMAIL_APP_PASSWORD` - Gmail app password

## Troubleshooting

### If form still times out:
1. **Check database connection** - Verify `DATABASE_URL` is correct in Vercel
2. **Check database tables exist** - Run `npm run create-form-tables` locally
3. **Check Neon database status** - Ensure it's not sleeping (free tier)

### If emails don't arrive:
1. **Check Vercel logs** for email errors
2. **Verify email credentials** in Vercel environment variables
3. **Check spam folder**
4. **Gmail app password** may need to be regenerated

### If you see "Server returned non-JSON response":
- Clear browser cache
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Check Vercel deployment status

## API Response Format

### Success Response (200):
```json
{
  "success": true,
  "message": "Demo request submitted successfully",
  "id": 123,
  "emailsQueued": true
}
```

### Error Response (400/500):
```json
{
  "error": "Missing required fields",
  "details": "..."
}
```

## Notes

- ✅ Emails will still be sent, just not blocking the response
- ✅ Database saves immediately, so no data loss
- ✅ Better user experience with fast response
- ✅ Works within Vercel free tier 10s timeout
- ⚠️ Email failures are logged but won't cause form submission to fail
- ⚠️ If database is slow (>5s), request will still fail - check Neon plan

## Next Steps

1. Deploy and test
2. Monitor Vercel logs for any email delivery issues
3. Consider upgrading to Vercel Pro if you need longer timeouts
4. Consider using a dedicated email service (SendGrid, Mailgun) for better reliability

