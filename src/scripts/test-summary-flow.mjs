// Test the journal summary flow
import { query } from '../lib/db.js';

async function test() {
  // 1. Find testpatient
  const patient = await query("SELECT id FROM patient_users WHERE username = 'testpatient'");
  if (patient.rows.length === 0) {
    console.log('❌ Patient testpatient not found');
    process.exit(1);
  }
  const userId = String(patient.rows[0].id);
  console.log('✅ Patient ID:', userId);

  // 2. Check journal entries count
  const entries = await query('SELECT COUNT(*)::int AS count FROM journal_entries WHERE user_id = $1', [userId]);
  console.log(`✅ Journal entries: ${entries.rows[0].count}`);

  // 3. Check if summary exists
  const summary = await query(
    "SELECT * FROM ai_conversation WHERE user_id = $1 AND type = 'journal_summary'",
    [userId]
  );
  if (summary.rows.length > 0) {
    console.log('✅ Summary exists:', summary.rows[0].summary_text);
    console.log('✅ Metadata:', JSON.stringify(summary.rows[0].metadata));
    console.log('✅ Updated at:', summary.rows[0].updated_at);
  } else {
    console.log('⚠️ No summary yet - will be created when a new journal entry is posted');
  }

  process.exit(0);
}

test().catch(e => { console.error('❌', e.message); process.exit(1); });
