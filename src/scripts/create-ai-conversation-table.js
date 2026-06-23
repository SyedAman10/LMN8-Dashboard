// Migration: Create ai_conversation table
// Stores journal summaries & AI chat summaries per user
import { query, testConnection } from '../lib/db.js';

async function run() {
  console.log('🚀 Creating ai_conversation table...');
  const connected = await testConnection();
  if (!connected) { console.error('❌ DB connection failed'); process.exit(1); }

  await query(`
    CREATE TABLE IF NOT EXISTS ai_conversation (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR NOT NULL,
      type VARCHAR(50) NOT NULL,
      summary_text TEXT,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, type)
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_ai_conversation_user_type ON ai_conversation(user_id, type)
  `);

  console.log('✅ ai_conversation table created');
  process.exit(0);
}

run().catch(err => { console.error('❌', err); process.exit(1); });
