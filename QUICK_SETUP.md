# Quick Setup Guide

## 🚨 Current Issue: Database Not Configured

The application is failing because the Neon database connection string is not set up. Here's how to fix it:

## Step 1: Create Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy your connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Set Environment Variables

Create a `.env.local` file in your project root with this content:

```env
# Replace with your actual Neon database connection string
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_change_this_in_production
```

## Step 3: Initialize Database

After setting up the environment variables, run:

```bash
node src/scripts/init-db.js
```

This will create the necessary database tables.

## Step 4: Restart the Application

```bash
npm run dev
```

## Alternative: Use Local PostgreSQL (if you prefer)

If you want to use a local PostgreSQL database instead of Neon:

1. Install PostgreSQL locally
2. Create a database named `luminate_clinician`
3. Set your `.env.local` to:
   ```env
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/luminate_clinician
   ```

## Verification

Once set up correctly, you should see:
- ✅ Database connected successfully
- ✅ Database schema initialized successfully
- No more connection errors in the console

## Need Help?

If you're still having issues:
1. Check that your `.env.local` file is in the project root
2. Verify your Neon connection string is correct
3. Make sure your Neon database is active
4. Check the console for any error messages
