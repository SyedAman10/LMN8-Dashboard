import { Pool, neonConfig } from '@neondatabase/serverless';

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
