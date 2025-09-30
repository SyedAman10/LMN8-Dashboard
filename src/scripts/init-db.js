// Database initialization script
// Run this script to set up the database schema

import { initDatabase, testConnection } from '../lib/db.js';

async function main() {
  console.log('🚀 Initializing database...');
  
  try {
    // Test connection first
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed. Please check your DATABASE_URL environment variable.');
      process.exit(1);
    }
    
    // Initialize database schema
    console.log('🏗️  Creating database schema...');
    await initDatabase();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('📋 Created tables:');
    console.log('   - users (for authentication)');
    console.log('   - user_sessions (for session management)');
    console.log('   - patients (for patient data)');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
