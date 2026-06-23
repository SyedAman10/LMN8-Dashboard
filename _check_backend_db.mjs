import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-misty-lab-ad2lnqxa-pooler.c-2.us-east-1.aws.neon.tech/neondb' });

const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
console.log('=== BACKEND DB TABLES ===');
tables.rows.forEach(r => console.log(' ', r.table_name));

const sessions = await pool.query('SELECT id, user_id, created_at FROM sessions ORDER BY created_at DESC LIMIT 5');
console.log('\n=== RECENT SESSIONS ===');
sessions.rows.forEach(r => console.log(`  id=${r.id} user_id=${r.user_id} created=${r.created_at}`));

const msgs = await pool.query('SELECT m.id, m.session_id, m.role, LEFT(m.content::text, 100) AS content, m.created_at FROM messages m ORDER BY m.created_at DESC LIMIT 10');
console.log('\n=== RECENT MESSAGES ===');
msgs.rows.forEach(r => console.log(`  id=${r.id} session=${r.session_id} role=${r.role} content="${r.content}" created=${r.created_at}`));

const userSessions = await pool.query("SELECT s.id, s.user_id, s.created_at FROM sessions s WHERE s.user_id IS NOT NULL ORDER BY s.created_at DESC LIMIT 10");
console.log('\n=== SESSIONS WITH USER_ID ===');
userSessions.rows.forEach(r => console.log(`  id=${r.id} user_id=${r.user_id}`));

const noUserSessions = await pool.query("SELECT s.id, s.created_at FROM sessions s WHERE s.user_id IS NULL ORDER BY s.created_at DESC LIMIT 10");
console.log('\n=== SESSIONS WITHOUT USER_ID ===');
noUserSessions.rows.forEach(r => console.log(`  id=${r.id} created=${r.created_at}`));

await pool.end();
process.exit(0);
