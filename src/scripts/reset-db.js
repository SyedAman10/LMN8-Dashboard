// Database reset script
// This will drop and recreate all tables in the correct order

import { query, testConnection } from '../lib/db.js';

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  try {
    // Test connection first
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed. Please check your DATABASE_URL environment variable.');
      process.exit(1);
    }
    
    console.log('🗑️  Dropping existing tables...');
    
    // Drop tables in reverse order (to handle foreign key constraints)
    try {
      await query('DROP TABLE IF EXISTS patients CASCADE');
      console.log('   - Dropped patients table');
    } catch (error) {
      console.log('   - patients table not found or already dropped');
    }
    
    try {
      await query('DROP TABLE IF EXISTS user_sessions CASCADE');
      console.log('   - Dropped user_sessions table');
    } catch (error) {
      console.log('   - user_sessions table not found or already dropped');
    }
    
    try {
      await query('DROP TABLE IF EXISTS users CASCADE');
      console.log('   - Dropped users table');
    } catch (error) {
      console.log('   - users table not found or already dropped');
    }
    
    console.log('🏗️  Creating tables in correct order...');
    
    // Create users table first
    await query(`
      CREATE TABLE users (
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
    console.log('   ✅ Created users table');
    
    // Create user_sessions table
    await query(`
      CREATE TABLE user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ Created user_sessions table');
    
    // Create patients table
    await query(`
      CREATE TABLE patients (
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
    console.log('   ✅ Created patients table');
    
    console.log('📊 Creating indexes...');
    
    // Create indexes
    await query('CREATE INDEX idx_users_email ON users(email)');
    await query('CREATE INDEX idx_sessions_token ON user_sessions(session_token)');
    await query('CREATE INDEX idx_patients_user_id ON patients(user_id)');
    
    console.log('   ✅ Created all indexes');
    
    console.log('✅ Database reset completed successfully!');
    console.log('📋 Tables created:');
    console.log('   - users (for authentication)');
    console.log('   - user_sessions (for session management)');
    console.log('   - patients (for patient data)');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();
