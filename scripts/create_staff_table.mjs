import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_cyTfzMd1J8bE@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

const sql = `
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
);

CREATE INDEX IF NOT EXISTS idx_clinician_staff_clinician ON clinician_staff(clinician_id);
`;

try {
  await pool.query(sql);
  console.log('✅ clinician_staff table created successfully');
  console.log('   Columns: id, clinician_id, first_name, last_name, email, phone, role, password_hash, is_active');
  console.log('   Permissions: can_view_dashboard, can_view_patients, can_edit_patients, can_delete_patients');
  console.log('   can_view_sessions, can_view_integration, can_view_resources');
  console.log('   can_view_reports, can_create_reports, can_edit_reports, can_delete_reports');
  console.log('   can_view_locations, can_view_settings');
  await pool.end();
} catch (err) {
  console.error('❌ Failed:', err.message);
  process.exit(1);
}
