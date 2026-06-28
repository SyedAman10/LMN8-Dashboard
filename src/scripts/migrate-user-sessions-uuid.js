import { query, testConnection } from '../lib/db.js';

async function migrateUserSessionsToUuid() {
  try {
    console.log('🔍 Checking database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }


    

    console.log('🔍 Inspecting current schema...');
    const usersIdTypeResult = await query(
      "SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id'"
    );
    const usersIdType = usersIdTypeResult.rows[0]?.data_type;

    if (usersIdType !== 'uuid') {
      throw new Error(
        `Expected users.id to be UUID but found: ${usersIdType || 'unknown'}. Aborting migration.`
      );
    }

    const sessionsUserIdTypeResult = await query(
      "SELECT data_type FROM information_schema.columns WHERE table_name = 'user_sessions' AND column_name = 'user_id'"
    );
    const sessionsUserIdType = sessionsUserIdTypeResult.rows[0]?.data_type;

    if (sessionsUserIdType === 'uuid') {
      console.log('✅ user_sessions.user_id is already UUID. Nothing to do.');
      return;
    }

    console.log('⚠️  user_sessions.user_id is not UUID. Rebuilding user_sessions table...');

    // Sessions are ephemeral; safest fix is to rebuild the table.
    await query('DROP TABLE IF EXISTS user_sessions');

    await query(`
      CREATE TABLE user_sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query('CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)');

    console.log('✅ Migration completed: user_sessions now uses UUID user_id.');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateUserSessionsToUuid();
