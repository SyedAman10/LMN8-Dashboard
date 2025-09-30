#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Luminate Clinician - Environment Setup');
console.log('==========================================\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('Please edit it manually or delete it to run this setup again.\n');
  process.exit(0);
}

// Template for .env.local
const envTemplate = `# Neon Database Configuration
# Replace with your actual Neon database connection string
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Secret for authentication (generate a random string)
JWT_SECRET=${generateRandomString(32)}

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateRandomString(32)}

# Email Configuration (Gmail SMTP)
# For Gmail, you need to:
# 1. Enable 2-factor authentication on your Google account
# 2. Generate an App Password: https://myaccount.google.com/apppasswords
# 3. Use your Gmail address and the App Password below
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
`;

// Generate random string for secrets
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

try {
  // Write .env.local file
  fs.writeFileSync(envPath, envTemplate);
  
  console.log('✅ Created .env.local file successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Get your Neon database connection string from https://neon.tech');
  console.log('2. Replace the DATABASE_URL in .env.local with your actual connection string');
  console.log('3. Set up email configuration:');
  console.log('   - Enable 2FA on your Google account');
  console.log('   - Generate App Password: https://myaccount.google.com/apppasswords');
  console.log('   - Update EMAIL_USER and EMAIL_APP_PASSWORD in .env.local');
  console.log('4. Run: node src/scripts/init-db.js');
  console.log('5. Run: npm run dev');
  console.log('\n🔗 Get your Neon connection string at: https://console.neon.tech');
  console.log('📧 Email setup guide: https://myaccount.google.com/apppasswords');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
}
