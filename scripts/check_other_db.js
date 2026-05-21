const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-misty-lab-ad2lnqxa-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log('Other DB tables:', tables.rows.map(x => x.table_name).join(', '));
    const users = await pool.query('SELECT id, username FROM patient_users');
    console.log('patient_users:', users.rows.length);
    users.rows.forEach(u => console.log('  -', u.username));
  } catch (e) {
    console.error('Error:', e.message);
  }
  pool.end();
}
main();
