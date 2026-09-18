import path from 'path';
import { pathToFileURL } from 'url';

(async () => {
  try {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.js');
    const dbModule = await import(pathToFileURL(dbPath).href);
    if (!dbModule || typeof dbModule.initDatabase !== 'function') {
      console.error('initDatabase not found in src/lib/db.js');
      process.exit(1);
    }

    console.log('Running database initialization...');
    await dbModule.initDatabase();
    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
})();
