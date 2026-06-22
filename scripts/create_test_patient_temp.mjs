import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', expand: true });
dotenv.config({ path: '.env', expand: true });

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_cyTfzMd1J8bE@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function main() {
  try {
    const c = await pool.connect();
    
    // Check if testpatient already exists
    const existing = await c.query("SELECT id, username FROM patient_users WHERE username = 'testpatient'");
    if (existing.rows.length > 0) {
      // Reset password
      const pw = 'Test@123456';
      const hash = await bcrypt.hash(pw, 12);
      await c.query('UPDATE patient_users SET password_hash = $1 WHERE id = $2', [hash, existing.rows[0].id]);
      console.log('Password UPDATED for existing user: testpatient');
    } else {
      // Create new patient + user
      const p = await c.query(
        `INSERT INTO patients (user_id, name, email, therapist, total_sessions, sessions_completed, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['0420cc96-7b0c-4fb9-8692-7fb31c545540', 'Test Patient', 'test@lmn8.ai', 'LMN8 Admin', 12, 0, 'active']
      );
      const pw = 'Test@123456';
      const hash = await bcrypt.hash(pw, 12);
      await c.query(
        'INSERT INTO patient_users (patient_id, username, password_hash, is_active) VALUES ($1, $2, $3, true)',
        [p.rows[0].id, 'testpatient', hash]
      );
      console.log('Patient CREATED with ID:', p.rows[0].id);
    }

    console.log('\nLogin credentials:');
    console.log('  Username: testpatient');
    console.log('  Password: Test@123456');
    console.log('\nApp login URL: http://192.168.18.9:3000 (local Dashboard)');
    console.log('Or if using production: https://lumen8health.com');
    
    c.release();
    await pool.end();
  } catch (e) {
    console.error('Error:', e.message);
    console.error(e.stack);
  }
}

main();
