require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL });

async function run() {
  try {
    const del = await pool.query("DELETE FROM ai_conversation WHERE type = 'ai_conversation' AND user_id = '16'");
    console.log('Deleted ' + del.rowCount + ' old summaries');
    const cnt = await pool.query("SELECT COUNT(*) FROM ai_conversation");
    console.log('Total remaining in ai_conversation: ' + cnt.rows[0].count);
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error(e);
    await pool.end();
    process.exit(1);
  }
}
run();
