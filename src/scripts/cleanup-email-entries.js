import path from 'path';
import { pathToFileURL } from 'url';

(async () => {
  try {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.js');
    const dbModule = await import(pathToFileURL(dbPath).href);
    const { query } = dbModule;

    const email = process.argv[2];
    const shouldDelete = process.argv.includes('--yes');

    if (!email) {
      console.error('Usage: node src/scripts/cleanup-email-entries.js <email> [--yes]');
      process.exit(1);
    }

    console.log('Searching for records with email:', email);

    const usersRes = await query(`SELECT id, email, role FROM users WHERE email = $1`, [email]);
    const clinicianStaffRes = await query(`SELECT id, clinician_id, email FROM clinician_staff WHERE email = $1`, [email]);
    const collegesRes = await query(`SELECT id, name, email FROM colleges WHERE email = $1`, [email]);
    const clinicsRes = await query(`SELECT id, name, email FROM clinics WHERE email = $1`, [email]);

    const found = {
      users: usersRes.rows,
      clinicianStaff: clinicianStaffRes.rows,
      colleges: collegesRes.rows,
      clinics: clinicsRes.rows,
    };

    console.log('Found summary:');
    console.log(' users:', found.users.length);
    console.log(' clinician_staff:', found.clinicianStaff.length);
    console.log(' colleges:', found.colleges.length);
    console.log(' clinics:', found.clinics.length);

    if (!shouldDelete) {
      console.log('\nNo changes made. To delete these records, re-run with --yes flag.');
      console.log('Example: node src/scripts/cleanup-email-entries.js', email, '--yes');
      process.exit(0);
    }

    console.log('\nDeleting matched records...');
    try {
      await query('BEGIN');

      if (found.clinicianStaff.length > 0) {
        await query('DELETE FROM clinician_staff WHERE email = $1', [email]);
        console.log(' Deleted clinician_staff rows');
      }

      if (found.colleges.length > 0) {
        await query('DELETE FROM colleges WHERE email = $1', [email]);
        console.log(' Deleted colleges rows');
      }

      if (found.clinics.length > 0) {
        await query('DELETE FROM clinics WHERE email = $1', [email]);
        console.log(' Deleted clinics rows');
      }

      if (found.users.length > 0) {
        // Deleting from users will cascade to many related tables if ON DELETE CASCADE is configured
        await query('DELETE FROM users WHERE email = $1', [email]);
        console.log(' Deleted users rows');
      }

      await query('COMMIT');
      console.log('Deletion completed successfully.');
      process.exit(0);
    } catch (delErr) {
      await query('ROLLBACK');
      console.error('Deletion failed, rolled back:', delErr);
      process.exit(1);
    }

  } catch (err) {
    console.error('Error running cleanup script:', err);
    process.exit(1);
  }
})();
