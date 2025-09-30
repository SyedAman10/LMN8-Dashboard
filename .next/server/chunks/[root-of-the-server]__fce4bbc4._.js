module.exports = [
"[project]/.next-internal/server/app/api/patients/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "initDatabase",
    ()=>initDatabase,
    "query",
    ()=>query,
    "testConnection",
    ()=>testConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
;
;
// Load environment variables
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].config({
    path: '.env.local'
});
// Get database connection string
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('Please set DATABASE_URL in your .env.local file with your Neon database connection string.');
    console.error('Example: DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require');
}
// Create a connection pool
const pool = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Pool"]({
    connectionString: connectionString
});
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connected successfully:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}
async function query(text, params) {
    if (!connectionString) {
        throw new Error('Database connection string not configured. Please set DATABASE_URL environment variable.');
    }
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        console.error('Query:', text);
        console.error('Params:', params);
        throw error;
    } finally{
        client.release();
    }
}
async function initDatabase() {
    try {
        // Check if database is configured
        if (!connectionString) {
            throw new Error('Database connection string not configured. Please set DATABASE_URL environment variable.');
        }
        console.log('🔍 Checking database connection...');
        const connected = await testConnection();
        if (!connected) {
            throw new Error('Database connection failed');
        }
        console.log('📋 Initializing database schema...');
        // Create users table first
        console.log('   Creating users table...');
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        license_number VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('   ✅ Users table created');
        // Create sessions table for JWT session management
        console.log('   Creating user_sessions table...');
        await query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('   ✅ User sessions table created');
        // Create patients table
        console.log('   Creating patients table...');
        await query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        diagnosis TEXT,
        medical_history TEXT,
        emergency_contact VARCHAR(255),
        emergency_phone VARCHAR(20),
        therapist VARCHAR(255),
        total_sessions INTEGER DEFAULT 12,
        sessions_completed INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('   ✅ Patients table created');
        // Create patient_users table for patient authentication
        console.log('   Creating patient_users table...');
        await query(`
      CREATE TABLE IF NOT EXISTS patient_users (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('   ✅ Patient users table created');
        // Create indexes for better performance
        console.log('   Creating indexes...');
        try {
            await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
            await query(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`);
            await query(`CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id)`);
            await query(`CREATE INDEX IF NOT EXISTS idx_patient_users_username ON patient_users(username)`);
            await query(`CREATE INDEX IF NOT EXISTS idx_patient_users_patient_id ON patient_users(patient_id)`);
            console.log('   ✅ Indexes created');
        } catch (indexError) {
            console.log('   ⚠️  Some indexes may already exist:', indexError.message);
        }
        console.log('✅ Database schema initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            detail: error.detail
        });
        throw error;
    }
}
const __TURBOPACK__default__export__ = pool;
}),
"[project]/src/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cleanupExpiredSessions",
    ()=>cleanupExpiredSessions,
    "createUser",
    ()=>createUser,
    "createUserSession",
    ()=>createUserSession,
    "generateSessionToken",
    ()=>generateSessionToken,
    "getUserByEmail",
    ()=>getUserByEmail,
    "getUserBySession",
    ()=>getUserBySession,
    "hashPassword",
    ()=>hashPassword,
    "validateUser",
    ()=>validateUser,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-route] (ecmascript)");
;
;
async function hashPassword(password) {
    const saltRounds = 12;
    return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, saltRounds);
}
async function verifyPassword(password, hashedPassword) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hashedPassword);
}
function generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
async function createUserSession(userId) {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)', [
        userId,
        sessionToken,
        expiresAt
    ]);
    return sessionToken;
}
async function getUserBySession(sessionToken) {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT u.*, s.expires_at 
     FROM users u 
     JOIN user_sessions s ON u.id = s.user_id 
     WHERE s.session_token = $1 AND s.expires_at > NOW() AND u.is_active = true`, [
        sessionToken
    ]);
    return result.rows[0] || null;
}
async function cleanupExpiredSessions() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('DELETE FROM user_sessions WHERE expires_at < NOW()');
}
async function getUserByEmail(email) {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM users WHERE email = $1 AND is_active = true', [
        email
    ]);
    return result.rows[0] || null;
}
async function createUser(userData) {
    const { firstName, lastName, email, password, role, licenseNumber } = userData;
    const passwordHash = await hashPassword(password);
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO users (first_name, last_name, email, password_hash, role, license_number) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, first_name, last_name, email, role, created_at`, [
        firstName,
        lastName,
        email,
        passwordHash,
        role,
        licenseNumber || null
    ]);
    return result.rows[0];
}
async function validateUser(email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
        return null;
    }
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
        return null;
    }
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/src/lib/email.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPatientCredentialsEmailTemplate",
    ()=>createPatientCredentialsEmailTemplate,
    "createWelcomeEmailTemplate",
    ()=>createWelcomeEmailTemplate,
    "sendPatientCredentialsEmail",
    ()=>sendPatientCredentialsEmail,
    "sendWelcomeEmail",
    ()=>sendWelcomeEmail,
    "testEmailConfiguration",
    ()=>testEmailConfiguration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].config({
    path: '.env.local'
});
// Email configuration
const createTransporter = ()=>{
    // For development, we'll use Gmail SMTP
    // In production, you might want to use SendGrid, AWS SES, or other services
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
};
const createWelcomeEmailTemplate = (patient)=>{
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
const sendWelcomeEmail = async (patient)=>{
    try {
        // Check if email configuration is available
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.warn('Email configuration missing. Skipping email send.');
            console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
            console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Missing');
            return {
                success: false,
                error: 'Email configuration missing'
            };
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
const createPatientCredentialsEmailTemplate = (patient, credentials)=>{
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
const sendPatientCredentialsEmail = async (patient, credentials)=>{
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.warn('Email configuration missing. Skipping credentials email send.');
            return {
                success: false,
                error: 'Email configuration missing'
            };
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
const testEmailConfiguration = async ()=>{
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            return {
                success: false,
                error: 'Email configuration missing'
            };
        }
        const transporter = createTransporter();
        await transporter.verify();
        return {
            success: true,
            message: 'Email configuration is valid'
        };
    } catch (error) {
        console.error('Email configuration test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
}),
"[project]/src/lib/patientAuth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticatePatient",
    ()=>authenticatePatient,
    "createPatientUser",
    ()=>createPatientUser,
    "deactivatePatientUser",
    ()=>deactivatePatientUser,
    "generatePatientPassword",
    ()=>generatePatientPassword,
    "generatePatientUsername",
    ()=>generatePatientUsername,
    "getPatientUserByPatientId",
    ()=>getPatientUserByPatientId,
    "updatePatientPassword",
    ()=>updatePatientPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-route] (ecmascript)");
;
;
const generatePatientUsername = async (patientName, patientId)=>{
    // Create base username from patient name
    const baseName = patientName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    let username = baseName;
    let counter = 1;
    // Check if username exists and make it unique
    while(true){
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT id FROM patient_users WHERE username = $1', [
            username
        ]);
        if (result.rows.length === 0) {
            break; // Username is unique
        }
        username = `${baseName}${counter}`;
        counter++;
    }
    return username;
};
const generatePatientPassword = ()=>{
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    // Ensure at least one character from each category
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    // Fill the rest randomly
    for(let i = 4; i < length; i++){
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    // Shuffle the password
    return password.split('').sort(()=>Math.random() - 0.5).join('');
};
const createPatientUser = async (patientId, patientName)=>{
    try {
        // Generate credentials
        const username = await generatePatientUsername(patientName, patientId);
        const password = generatePatientPassword();
        // Hash the password
        const saltRounds = 12;
        const passwordHash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, saltRounds);
        // Insert into patient_users table
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO patient_users (patient_id, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, created_at`, [
            patientId,
            username,
            passwordHash
        ]);
        const patientUser = result.rows[0];
        return {
            success: true,
            patientUser: {
                id: patientUser.id,
                patientId: patientId,
                username: username,
                password: password,
                createdAt: patientUser.created_at
            }
        };
    } catch (error) {
        console.error('Error creating patient user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
const authenticatePatient = async (username, password)=>{
    try {
        // Get patient user with patient details
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT 
        pu.id, pu.patient_id, pu.username, pu.password_hash, pu.is_active,
        p.name, p.email, p.diagnosis, p.therapist, p.total_sessions, p.sessions_completed
       FROM patient_users pu
       JOIN patients p ON pu.patient_id = p.id
       WHERE pu.username = $1 AND pu.is_active = true`, [
            username
        ]);
        if (result.rows.length === 0) {
            return {
                success: false,
                error: 'Invalid credentials'
            };
        }
        const patientUser = result.rows[0];
        // Verify password
        const isValidPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, patientUser.password_hash);
        if (!isValidPassword) {
            return {
                success: false,
                error: 'Invalid credentials'
            };
        }
        // Update last login
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('UPDATE patient_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
            patientUser.id
        ]);
        return {
            success: true,
            patient: {
                id: patientUser.patient_id,
                name: patientUser.name,
                email: patientUser.email,
                diagnosis: patientUser.diagnosis,
                therapist: patientUser.therapist,
                totalSessions: patientUser.total_sessions,
                sessionsCompleted: patientUser.sessions_completed
            },
            user: {
                id: patientUser.id,
                username: patientUser.username
            }
        };
    } catch (error) {
        console.error('Error authenticating patient:', error);
        return {
            success: false,
            error: 'Authentication failed'
        };
    }
};
const getPatientUserByPatientId = async (patientId)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT pu.id, pu.username, pu.is_active, pu.last_login, pu.created_at
       FROM patient_users pu
       WHERE pu.patient_id = $1`, [
            patientId
        ]);
        if (result.rows.length === 0) {
            return {
                success: false,
                error: 'Patient user not found'
            };
        }
        return {
            success: true,
            patientUser: result.rows[0]
        };
    } catch (error) {
        console.error('Error getting patient user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
const updatePatientPassword = async (patientUserId, newPassword)=>{
    try {
        const saltRounds = 12;
        const passwordHash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(newPassword, saltRounds);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('UPDATE patient_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
            passwordHash,
            patientUserId
        ]);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error updating patient password:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
const deactivatePatientUser = async (patientUserId)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('UPDATE patient_users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [
            patientUserId
        ]);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error deactivating patient user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
}),
"[project]/src/app/api/patients/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$patientAuth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/patientAuth.js [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request) {
    try {
        const sessionToken = request.cookies.get('session_token')?.value;
        if (!sessionToken) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Not authenticated'
            }, {
                status: 401
            });
        }
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserBySession"])(sessionToken);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid or expired session'
            }, {
                status: 401
            });
        }
        // Get all patients for this user
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT * FROM patients 
       WHERE user_id = $1 
       ORDER BY created_at DESC`, [
            user.id
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            patients: result.rows.map((patient)=>({
                    id: patient.id,
                    name: patient.name,
                    email: patient.email,
                    phone: patient.phone,
                    dateOfBirth: patient.date_of_birth,
                    diagnosis: patient.diagnosis,
                    medicalHistory: patient.medical_history,
                    emergencyContact: patient.emergency_contact,
                    emergencyPhone: patient.emergency_phone,
                    therapist: patient.therapist,
                    totalSessions: patient.total_sessions,
                    sessionsCompleted: patient.sessions_completed,
                    status: patient.status,
                    notes: patient.notes,
                    createdAt: patient.created_at,
                    updatedAt: patient.updated_at
                }))
        });
    } catch (error) {
        console.error('Get patients error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const sessionToken = request.cookies.get('session_token')?.value;
        if (!sessionToken) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Not authenticated'
            }, {
                status: 401
            });
        }
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserBySession"])(sessionToken);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid or expired session'
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes } = body;
        // Validate required fields
        if (!name || !diagnosis || !medicalHistory) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Name, diagnosis, and medical history are required'
            }, {
                status: 400
            });
        }
        // Create new patient
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO patients (
        user_id, name, email, phone, date_of_birth, diagnosis, 
        medical_history, emergency_contact, emergency_phone, 
        therapist, total_sessions, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`, [
            user.id,
            name,
            email || null,
            phone || null,
            dateOfBirth || null,
            diagnosis,
            medicalHistory,
            emergencyContact || null,
            emergencyPhone || null,
            therapist || user.first_name + ' ' + user.last_name,
            totalSessions || 12,
            notes || null
        ]);
        const newPatient = result.rows[0];
        // Prepare patient data for email
        const patientForEmail = {
            id: newPatient.id,
            name: newPatient.name,
            email: newPatient.email,
            phone: newPatient.phone,
            dateOfBirth: newPatient.date_of_birth,
            diagnosis: newPatient.diagnosis,
            medicalHistory: newPatient.medical_history,
            emergencyContact: newPatient.emergency_contact,
            emergencyPhone: newPatient.emergency_phone,
            therapist: newPatient.therapist,
            totalSessions: newPatient.total_sessions,
            sessionsCompleted: newPatient.sessions_completed,
            status: newPatient.status,
            notes: newPatient.notes,
            createdAt: newPatient.created_at,
            updatedAt: newPatient.updated_at
        };
        // Create patient user account and send credentials
        let patientUserResult = null;
        let credentialsEmailResult = null;
        let welcomeEmailResult = null;
        if (newPatient.email) {
            try {
                // Create patient user account
                console.log('Creating patient user account...');
                patientUserResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$patientAuth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPatientUser"])(newPatient.id, newPatient.name);
                if (patientUserResult.success) {
                    console.log('Patient user created:', patientUserResult.patientUser.username);
                    // Send credentials email
                    console.log('Sending patient credentials email...');
                    credentialsEmailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendPatientCredentialsEmail"])(patientForEmail, {
                        username: patientUserResult.patientUser.username,
                        password: patientUserResult.patientUser.password
                    });
                    console.log('Credentials email result:', credentialsEmailResult);
                } else {
                    console.error('Failed to create patient user:', patientUserResult.error);
                }
            } catch (error) {
                console.error('Patient user creation failed (non-blocking):', error);
                patientUserResult = {
                    success: false,
                    error: error.message
                };
            }
            // Also send welcome email
            try {
                console.log('Sending welcome email...');
                welcomeEmailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendWelcomeEmail"])(patientForEmail);
                console.log('Welcome email result:', welcomeEmailResult);
            } catch (emailError) {
                console.error('Welcome email sending failed (non-blocking):', emailError);
                welcomeEmailResult = {
                    success: false,
                    error: emailError.message
                };
            }
        }
        // Prepare response messages
        const messages = [];
        if (patientUserResult?.success) {
            messages.push('Patient user account created');
        } else if (patientUserResult?.error) {
            messages.push(`User account creation failed: ${patientUserResult.error}`);
        }
        if (credentialsEmailResult?.success) {
            messages.push('Login credentials sent via email');
        } else if (credentialsEmailResult?.error) {
            messages.push(`Credentials email failed: ${credentialsEmailResult.error}`);
        }
        if (welcomeEmailResult?.success) {
            messages.push('Welcome email sent');
        } else if (welcomeEmailResult?.error) {
            messages.push(`Welcome email failed: ${welcomeEmailResult.error}`);
        }
        if (!newPatient.email) {
            messages.push('No email provided - no user account or emails sent');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Patient created successfully',
            patient: patientForEmail,
            patientUserCreated: patientUserResult?.success || false,
            credentialsEmailSent: credentialsEmailResult?.success || false,
            welcomeEmailSent: welcomeEmailResult?.success || false,
            details: messages.join('; '),
            hasEmail: !!newPatient.email
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Create patient error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fce4bbc4._.js.map