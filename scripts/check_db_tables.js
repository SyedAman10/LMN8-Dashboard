const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const users = await pool.query('SELECT id, username FROM patient_users');
    console.log('patient_users rows:', users.rows.length);
    users.rows.forEach(u => console.log('  -', u.username));

    const patients = await pool.query('SELECT id, name, email FROM patients');
    console.log('patients rows:', patients.rows.length);
    patients.rows.forEach(p => console.log('  -', p.name, p.email));

    const adminUsers = await pool.query('SELECT id, username, email FROM users');
    console.log('admin users rows:', adminUsers.rows.length);
    adminUsers.rows.forEach(u => console.log('  -', u.username, u.email));
  } catch (e) {
    console.error('Error:', e.message);
  }
  pool.end();
}
main();
