import path from 'path';
import { pathToFileURL } from 'url';

(async () => {
  try {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.js');
    const dbModule = await import(pathToFileURL(dbPath).href);
    const { query } = dbModule;
    const bcrypt = (await import('bcryptjs')).default;

    console.log('Creating test clinician user...');
    const password = 'Test@1234';
    const hash = await bcrypt.hash(password, 10);
    const userRes = await query(
      `INSERT INTO users (email, username, full_name, hashed_password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      ['test.clinician@example.com', 'testclinician', 'Test Clinician', hash, 'clinician']
    );
    const user = userRes.rows[0];
    console.log('Clinician created with id:', user.id);

    console.log('Creating test patient...');
    const patientRes = await query(
      `INSERT INTO patients (user_id, name, diagnosis, medical_history) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user.id, 'Test Patient', 'Test diagnosis', 'No history']
    );
    const patient = patientRes.rows[0];
    console.log('Patient created with id:', patient.id);

    console.log('Inserting voice homework with transcript...');
    const hwRes = await query(
      `INSERT INTO assigned_homework (assigned_by, patient_id, title, type, transcript) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.id, patient.id, 'Voice: Test Homework', 'voice', 'This is a test transcript created by automated script.']
    );
    const hw = hwRes.rows[0];
    console.log('Inserted homework id:', hw.id);

    console.log('Test homework created successfully.');
    console.log({ clinicianId: user.id, patientId: patient.id, homeworkId: hw.id });
    process.exit(0);
  } catch (err) {
    console.error('Failed to create test homework:', err);
    process.exit(1);
  }
})();
