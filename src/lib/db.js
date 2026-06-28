import { Pool, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// In Node.js environments (scripts), provide a WebSocket implementation
if (typeof WebSocket === 'undefined') {
  const { default: ws } = await import('ws');
  neonConfig.webSocketConstructor = ws;
}
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local', expand: true });
dotenv.config({ path: '.env', expand: true });

// Get database connection string
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your .env.local file with your Neon database connection string.');
  console.error('Example: DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require');
}

// Create a connection pool
const pool = new Pool({
  connectionString: connectionString,
});

// Test the database connection
export async function testConnection() {
  try {
    // Enable UUID generation for primary keys
    await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
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

// Execute a query with error handling
export async function query(text, params) {
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
  } finally {
    client.release();
  }
}

// Initialize database schema
export async function initDatabase() {
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
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP
      )
    `);
    console.log('   ✅ Users table created');

    // Create sessions table for JWT session management
    console.log('   Creating user_sessions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        idol TEXT,
        personality TEXT,
        goals TEXT,
        challenges TEXT,
        communication_style TEXT,
        interests TEXT,
        values TEXT,
        support_needs TEXT
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

    // Create clinician_staff table for staff user management
    console.log('   Creating clinician_staff table...');
    await query(`
      CREATE TABLE IF NOT EXISTS clinician_staff (
        id SERIAL PRIMARY KEY,
        clinician_id UUID REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) NOT NULL DEFAULT 'staff',
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        can_view_dashboard BOOLEAN DEFAULT true,
        can_view_patients BOOLEAN DEFAULT false,
        can_edit_patients BOOLEAN DEFAULT false,
        can_delete_patients BOOLEAN DEFAULT false,
        can_view_sessions BOOLEAN DEFAULT false,
        can_view_integration BOOLEAN DEFAULT false,
        can_view_resources BOOLEAN DEFAULT false,
        can_view_reports BOOLEAN DEFAULT false,
        can_create_reports BOOLEAN DEFAULT false,
        can_edit_reports BOOLEAN DEFAULT false,
        can_delete_reports BOOLEAN DEFAULT false,
        can_view_locations BOOLEAN DEFAULT false,
        can_view_settings BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        UNIQUE(clinician_id, email)
      )
    `);
    console.log('   ✅ clinician_staff table created');

    // Create locations table for clinician-specific locations
    console.log('   Creating locations table...');
    await query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        clinician_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50),
        zip_code VARCHAR(20),
        phone VARCHAR(20),
        email VARCHAR(255),
        manager_name VARCHAR(255),
        established_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        staff_count INTEGER DEFAULT 0,
        patient_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ locations table created');

    // Add index for locations
    try {
      await query(`CREATE INDEX IF NOT EXISTS idx_locations_clinician_id ON locations(clinician_id)`);
      console.log('   ✅ locations index created');
    } catch (idxError) {
      console.log('   ⚠️  Locations index error:', idxError.message);
    }

    // Create clinics table for LMN8 admin to manage clinics
    console.log('   Creating clinics table...');
    await query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ clinics table created');

    // Create patient_chat_sessions table for linking chat sessions to patients
    console.log('   Creating patient_chat_sessions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS patient_chat_sessions (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patient_users(id) ON DELETE CASCADE,
        session_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_patient_chat_sessions_patient ON patient_chat_sessions(patient_id)`);
    await query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_patient_chat_sessions_session ON patient_chat_sessions(session_id)`);
    console.log('   ✅ patient_chat_sessions table created');

    // Add clinic_id and phone to users table (if not exist)
    console.log('   Adding clinic_id and phone columns to users...');
    try {
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id)`);
      console.log('   ✅ users columns added');
    } catch (colError) {
      console.log('   ⚠️  Users alter error:', colError.message);
    }

    // Add patient_greeting_name to clinics table (if not exist)
    console.log('   Adding patient_greeting_name column to clinics...');
    try {
      await query(`ALTER TABLE clinics ADD COLUMN IF NOT EXISTS patient_greeting_name VARCHAR(100) DEFAULT 'Patient'`);
      console.log('   ✅ patient_greeting_name column added to clinics');
    } catch (colError) {
      console.log('   ⚠️  clinics alter error:', colError.message);
    }

    // Add clinic_id to clinician_staff (if not exist)
    console.log('   Adding clinic_id column to clinician_staff...');
    try {
      await query(`ALTER TABLE clinician_staff ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id)`);
      console.log('   ✅ clinician_staff column added');
    } catch (colError) {
      console.log('   ⚠️  clinician_staff alter error:', colError.message);
    }

    // Ensure lmn8_admin and clinician are valid enum values
    try {
      await query(`ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'lmn8_admin'`);
      await query(`ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'clinician'`);
      console.log('   ✅ lmn8_admin and clinician roles added to userrole enum');
    } catch (enumError) {
      console.log('   ⚠️  Enum alter error (may not apply if role is VARCHAR):', enumError.message);
    }

    // Create audit_logs table for patient data access tracking
    console.log('   Creating audit_logs table...');
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS clinician_access_log (
          id SERIAL PRIMARY KEY,
          clinician_id UUID NOT NULL,
          clinician_email VARCHAR(255) NOT NULL,
          clinician_name VARCHAR(255) NOT NULL,
          patient_id INTEGER NOT NULL,
          patient_name VARCHAR(255) NOT NULL,
          patient_email VARCHAR(255) DEFAULT '',
          action VARCHAR(50) NOT NULL,
          violation_type VARCHAR(50),
          details TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ Clinician access log table created');
    } catch (err) {
      console.log('   ⚠️  Clinician access log table error:', err.message);
    }

    // Create community tables for patient community feature
    console.log('   Creating community_posts table...');
    await query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id SERIAL PRIMARY KEY,
        patient_user_id INTEGER REFERENCES patient_users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_community_posts_patient ON community_posts(patient_user_id)`);
    console.log('   ✅ community_posts table created');

    console.log('   Creating community_likes table...');
    await query(`
      CREATE TABLE IF NOT EXISTS community_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
        patient_user_id INTEGER REFERENCES patient_users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(post_id, patient_user_id)
      )
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_community_likes_post ON community_likes(post_id)`);
    console.log('   ✅ community_likes table created');

    console.log('   Creating community_comments table...');
    await query(`
      CREATE TABLE IF NOT EXISTS community_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
        patient_user_id INTEGER REFERENCES patient_users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id)`);
    console.log('   ✅ community_comments table created');

    // Migrate existing TIMESTAMP columns to TIMESTAMPTZ for consistent timezone handling
    try { await query(`ALTER TABLE community_posts ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`); } catch {}
    try { await query(`ALTER TABLE community_posts ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'`); } catch {}
    try { await query(`ALTER TABLE community_likes ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`); } catch {}
    try { await query(`ALTER TABLE community_comments ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`); } catch {}

    // Seed LMN8 admin user if not exists
    console.log('   Checking LMN8 admin account...');
    try {
      const adminResult = await query(`SELECT id, role FROM users WHERE email = 'amanullahnaqvi@gmail.com'`);
      if (adminResult.rows.length === 0) {
        const adminPassword = 'Admin@123456';
        const adminHash = await bcrypt.hash(adminPassword, 12);
        await query(
          `INSERT INTO users (email, username, full_name, hashed_password, role, is_active)
           VALUES ($1, $2, $3, $4, $5, true)`,
          ['amanullahnaqvi@gmail.com', 'lmn8admin', 'LMN8 Admin', adminHash, 'lmn8_admin']
        );
        console.log('   ✅ LMN8 admin account created (email: amanullahnaqvi@gmail.com, password: Admin@123456)');
        console.log('   ⚠️  PLEASE CHANGE THE DEFAULT ADMIN PASSWORD AFTER FIRST LOGIN');
      } else if (adminResult.rows[0].role !== 'lmn8_admin') {
        await query(`UPDATE users SET role = 'lmn8_admin' WHERE email = 'amanullahnaqvi@gmail.com'`);
        console.log('   ✅ LMN8 admin role updated for existing user (email: amanullahnaqvi@gmail.com)');
      } else {
        console.log('   ✅ LMN8 admin account already exists with correct role');
      }
    } catch (seedError) {
      console.log('   ⚠️  Admin seed error:', seedError.message);
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

export default pool;
