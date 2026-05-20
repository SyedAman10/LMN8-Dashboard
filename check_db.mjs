import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

try {
  // List all tables
  const tables = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  console.log('=== ALL TABLES ===');
  tables.rows.forEach(r => console.log(`  ${r.table_name}`));

  // Check journal_entries
  const hasJournal = tables.rows.some(r => r.table_name === 'journal_entries');
  if (hasJournal) {
    const entries = await pool.query(`SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT 10`);
    console.log('\n=== JOURNAL ENTRIES (last 10) ===');
    entries.rows.forEach(e => {
      console.log(`ID: ${e.id}`);
      console.log(`  Title: ${e.title}`);
      console.log(`  Content: ${e.content?.substring(0, 100)}`);
      console.log(`  MediaType: ${e.media_type}`);
      console.log(`  Mood: ${e.mood}`);
      console.log(`  MediaURL: ${e.media_url?.substring(0, 80)}`);
      console.log(`  TranscribedText: ${e.transcribed_text?.substring(0, 80)}`);
      console.log(`  CreatedAt: ${e.created_at}`);
      console.log(`  UserID: ${e.user_id}`);
      console.log('---');
    });

    // Search specifically for "testing as dev"
    const search = await pool.query(`SELECT * FROM journal_entries WHERE title ILIKE '%testing%' OR title ILIKE '%dev%'`);
    console.log(`\n=== SEARCH "testing" OR "dev" ===`);
    console.log(`Found: ${search.rows.length}`);
    search.rows.forEach(e => {
      console.log(`ID: ${e.id}, Title: ${e.title}, MediaType: ${e.media_type}, Mood: ${e.mood}, Content: ${e.content?.substring(0, 80)}`);
    });
  } else {
    console.log('\nNo journal_entries table found');
  }

  // Check clinician_shared_summaries
  const hasSummaries = tables.rows.some(r => r.table_name === 'clinician_shared_summaries');
  if (hasSummaries) {
    const summaries = await pool.query(`SELECT * FROM clinician_shared_summaries ORDER BY created_at DESC LIMIT 10`);
    console.log('\n=== CLINICIAN SHARED SUMMARIES (last 10) ===');
    summaries.rows.forEach(s => {
      console.log(`ID: ${s.id}`);
      console.log(`  UserID: ${s.user_id}`);
      console.log(`  SummaryType: ${s.summary_type}`);
      console.log(`  SummaryText: ${s.summary_text?.substring(0, 150)}`);
      console.log(`  CreatedAt: ${s.created_at}`);
      console.log('---');
    });
  } else {
    console.log('\nNo clinician_shared_summaries table found');
  }

} catch (err) {
  console.error('Error:', err);
} finally {
  await pool.end();
}
