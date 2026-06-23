import { query } from '../lib/db.js';

async function run() {
  // Check clinician_shared_summaries table structure
  const cols = await query(
    `SELECT column_name, data_type, is_nullable
     FROM information_schema.columns
     WHERE table_name = 'clinician_shared_summaries'
     ORDER BY ordinal_position`
  );
  console.log('=== clinician_shared_summaries COLUMNS ===');
  cols.rows.forEach(c => console.log(`  ${c.column_name} (${c.data_type}, nullable: ${c.is_nullable})`));

  // Check data
  const data = await query('SELECT * FROM clinician_shared_summaries ORDER BY created_at DESC LIMIT 10');
  console.log(`\n=== ROWS (${data.rows.length}) ===`);
  data.rows.forEach(r => {
    console.log(`ID: ${r.id}, UserID: ${r.user_id}, Type: ${r.summary_type}`);
    console.log(`  Summary: ${r.summary_text?.substring(0, 200)}`);
    console.log(`  Created: ${r.created_at}`);
    console.log('---');
  });

  // Check ai_conversation table
  const aiCols = await query(
    `SELECT column_name, data_type, is_nullable
     FROM information_schema.columns
     WHERE table_name = 'ai_conversation'
     ORDER BY ordinal_position`
  );
  console.log('\n=== ai_conversation COLUMNS ===');
  aiCols.rows.forEach(c => console.log(`  ${c.column_name} (${c.data_type}, nullable: ${c.is_nullable})`));

  const aiData = await query("SELECT * FROM ai_conversation ORDER BY updated_at DESC LIMIT 5");
  console.log(`\n=== ai_conversation ROWS (${aiData.rows.length}) ===`);
  aiData.rows.forEach(r => {
    console.log(`ID: ${r.id}, UserID: ${r.user_id}, Type: ${r.type}`);
    console.log(`  Summary: ${r.summary_text?.substring(0, 200)}`);
    console.log(`  Meta: ${JSON.stringify(r.metadata)}`);
    console.log(`  Updated: ${r.updated_at}`);
    console.log('---');
  });

  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
