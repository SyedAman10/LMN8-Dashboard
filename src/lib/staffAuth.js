import bcrypt from 'bcryptjs';
import { query } from './db.js';

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const generatePassword = () => {
  const length = 12;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const all = lowercase + uppercase + numbers + symbols;
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const getAllPermissions = () => ({
  can_view_dashboard: true,
  can_view_patients: true,
  can_edit_patients: true,
  can_delete_patients: true,
  can_view_sessions: true,
  can_view_integration: true,
  can_view_resources: true,
  can_view_reports: true,
  can_create_reports: true,
  can_edit_reports: true,
  can_delete_reports: true,
  can_view_locations: true,
  can_view_settings: true
});

export const getDefaultPermissions = (role) => {
  if (role === 'admin') return getAllPermissions();

  return {
    can_view_dashboard: true,
    can_view_patients: false,
    can_edit_patients: false,
    can_delete_patients: false,
    can_view_sessions: false,
    can_view_integration: false,
    can_view_resources: false,
    can_view_reports: false,
    can_create_reports: false,
    can_edit_reports: false,
    can_delete_reports: false,
    can_view_locations: false,
    can_view_settings: false
  };
};

export const createStaff = async ({ clinicianId, firstName, lastName, email, phone, role, permissions, clinicId }) => {
  const password = generatePassword();
  const passwordHash = await hashPassword(password);

  const perms = role === 'admin' ? getAllPermissions() : {
    can_view_dashboard: true,
    can_view_patients: permissions?.can_view_patients || false,
    can_edit_patients: permissions?.can_edit_patients || false,
    can_delete_patients: permissions?.can_delete_patients || false,
    can_view_sessions: permissions?.can_view_sessions || false,
    can_view_integration: permissions?.can_view_integration || false,
    can_view_resources: permissions?.can_view_resources || false,
    can_view_reports: permissions?.can_view_reports || false,
    can_create_reports: permissions?.can_create_reports || false,
    can_edit_reports: permissions?.can_edit_reports || false,
    can_delete_reports: permissions?.can_delete_reports || false,
    can_view_locations: permissions?.can_view_locations || false,
    can_view_settings: permissions?.can_view_settings || false
  };

  const result = await query(
    `INSERT INTO clinician_staff (
      clinician_id, first_name, last_name, email, phone, role, password_hash, clinic_id,
      can_view_dashboard, can_view_patients, can_edit_patients, can_delete_patients,
      can_view_sessions, can_view_integration, can_view_resources,
      can_view_reports, can_create_reports, can_edit_reports, can_delete_reports,
      can_view_locations, can_view_settings
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
    RETURNING id, first_name, last_name, email, role, created_at`,
    [
      clinicianId, firstName, lastName, email, phone || null, role, passwordHash, clinicId || null,
      perms.can_view_dashboard, perms.can_view_patients, perms.can_edit_patients, perms.can_delete_patients,
      perms.can_view_sessions, perms.can_view_integration, perms.can_view_resources,
      perms.can_view_reports, perms.can_create_reports, perms.can_edit_reports, perms.can_delete_reports,
      perms.can_view_locations, perms.can_view_settings
    ]
  );

  return {
    staff: result.rows[0],
    plainPassword: password,
    permissions: perms
  };
};

export const authenticateStaff = async (email, password) => {
  const result = await query(
    `SELECT * FROM clinician_staff WHERE email = $1 AND is_active = true`,
    [email]
  );

  if (result.rows.length === 0) return null;

  const staff = result.rows[0];
  const valid = await bcrypt.compare(password, staff.password_hash);
  if (!valid) return null;

  await query(
    `UPDATE clinician_staff SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
    [staff.id]
  );

  const { password_hash, ...safe } = staff;
  return safe;
};

export const getStaffById = async (id) => {
  const result = await query(
    `SELECT * FROM clinician_staff WHERE id = $1`,
    [id]
  );
  if (result.rows.length === 0) return null;
  const { password_hash, ...safe } = result.rows[0];
  return safe;
};

export const getStaffByClinician = async (clinicianId) => {
  const result = await query(
    `SELECT cs.id, cs.first_name, cs.last_name, cs.email, cs.phone, cs.role, cs.is_active, cs.clinic_id,
            cs.can_view_dashboard, cs.can_view_patients, cs.can_edit_patients, cs.can_delete_patients,
            cs.can_view_sessions, cs.can_view_integration, cs.can_view_resources,
            cs.can_view_reports, cs.can_create_reports, cs.can_edit_reports, cs.can_delete_reports,
            cs.can_view_locations, cs.can_view_settings,
            cs.created_at, cs.last_login,
            u.full_name AS clinician_name
     FROM clinician_staff cs
     JOIN users u ON u.id = cs.clinician_id
     WHERE cs.clinician_id = $1 AND cs.is_active = true
     ORDER BY cs.created_at DESC`,
    [clinicianId]
  );
  return result.rows;
};

export const deactivateStaff = async (id, clinicianId) => {
  await query(
    `UPDATE clinician_staff SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND clinician_id = $2`,
    [id, clinicianId]
  );
  return { success: true };
};
