import { query } from '../lib/db.js';

async function createFormTables() {
  try {
    console.log('📋 Creating form submission tables...');

    // Create demo_requests table
    console.log('   Creating demo_requests table...');
    await query(`
      CREATE TABLE IF NOT EXISTS demo_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        clinic_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ demo_requests table created');

    // Create contact_submissions table
    console.log('   Creating contact_submissions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ contact_submissions table created');

    // Create partner_applications table
    console.log('   Creating partner_applications table...');
    await query(`
      CREATE TABLE IF NOT EXISTS partner_applications (
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
      )
    `);
    console.log('   ✅ partner_applications table created');

    // Create indexes
    console.log('   Creating indexes...');
    await query(`CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_partner_applications_email ON partner_applications(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_partner_applications_status ON partner_applications(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_partner_applications_created_at ON partner_applications(created_at DESC)`);
    console.log('   ✅ Indexes created');

    console.log('✅ Form submission tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating form tables:', error);
    process.exit(1);
  }
}

createFormTables();

