module.exports = [
"[project]/.next-internal/server/app/api/patient-auth/login/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[project]/src/app/api/patient-auth/login/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$patientAuth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/patientAuth.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'jsonwebtoken'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;
        // Validate input
        if (!username || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Username and password are required'
            }, {
                status: 400
            });
        }
        // Authenticate patient
        const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$patientAuth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticatePatient"])(username, password);
        if (!authResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: authResult.error
            }, {
                status: 401
            });
        }
        // Create JWT token for patient
        const token = jwt.sign({
            patientId: authResult.patient.id,
            userId: authResult.user.id,
            username: authResult.user.username,
            type: 'patient'
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        // Set secure HTTP-only cookie
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Login successful',
            patient: authResult.patient,
            user: authResult.user
        });
        response.cookies.set('patient_token', token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return response;
    } catch (error) {
        console.error('Patient login error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__78582da1._.js.map