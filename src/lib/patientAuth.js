import bcrypt from 'bcryptjs';
import { query } from './db.js';

// Generate unique username for patient
export const generatePatientUsername = async (patientName, patientId) => {
  // Create base username from patient name
  const baseName = patientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 8);
  
  let username = baseName;
  let counter = 1;
  
  // Check if username exists and make it unique
  while (true) {
    const result = await query(
      'SELECT id FROM patient_users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      break; // Username is unique
    }
    
    username = `${baseName}${counter}`;
    counter++;
  }
  
  return username;
};

// Generate secure password
export const generatePatientPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Create patient user account
export const createPatientUser = async (patientId, patientName, additionalFields = {}) => {
  try {
    // Generate credentials
    const username = await generatePatientUsername(patientName, patientId);
    const password = generatePatientPassword();
    
    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert into patient_users table with additional fields
    const result = await query(
      `INSERT INTO patient_users (
        patient_id, username, password_hash, 
        idol, personality, goals, challenges, 
        communication_style, interests, values, support_needs
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, username, created_at`,
      [
        patientId, 
        username, 
        passwordHash,
        additionalFields.idol || null,
        additionalFields.personality || null,
        additionalFields.goals || null,
        additionalFields.challenges || null,
        additionalFields.communicationStyle || null,
        additionalFields.interests || null,
        additionalFields.values || null,
        additionalFields.supportNeeds || null
      ]
    );
    
    const patientUser = result.rows[0];
    
    return {
      success: true,
      patientUser: {
        id: patientUser.id,
        patientId: patientId,
        username: username,
        password: password, // Return plain password for email
        createdAt: patientUser.created_at,
        ...additionalFields
      }
    };
  } catch (error) {
    console.error('Error creating patient user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Authenticate patient user
export const authenticatePatient = async (username, password) => {
  try {
    // Get patient user with patient details and additional fields
    const result = await query(
      `SELECT 
        pu.id, pu.patient_id, pu.username, pu.password_hash, pu.is_active,
        pu.idol, pu.personality, pu.goals, pu.challenges, 
        pu.communication_style, pu.interests, pu.values, pu.support_needs,
        p.name, p.email, p.diagnosis, p.therapist, p.total_sessions, p.sessions_completed
       FROM patient_users pu
       JOIN patients p ON pu.patient_id = p.id
       WHERE pu.username = $1 AND pu.is_active = true`,
      [username]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const patientUser = result.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, patientUser.password_hash);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Update last login
    await query(
      'UPDATE patient_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [patientUser.id]
    );
    
    return {
      success: true,
      patient: {
        id: patientUser.patient_id,
        name: patientUser.name,
        email: patientUser.email,
        diagnosis: patientUser.diagnosis,
        therapist: patientUser.therapist,
        totalSessions: patientUser.total_sessions,
        sessionsCompleted: patientUser.sessions_completed
      },
      user: {
        id: patientUser.id,
        username: patientUser.username,
        idol: patientUser.idol,
        personality: patientUser.personality,
        goals: patientUser.goals,
        challenges: patientUser.challenges,
        communicationStyle: patientUser.communication_style,
        interests: patientUser.interests,
        values: patientUser.values,
        supportNeeds: patientUser.support_needs
      }
    };
  } catch (error) {
    console.error('Error authenticating patient:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
};

// Get patient user by patient ID
export const getPatientUserByPatientId = async (patientId) => {
  try {
    const result = await query(
      `SELECT pu.id, pu.username, pu.is_active, pu.last_login, pu.created_at
       FROM patient_users pu
       WHERE pu.patient_id = $1`,
      [patientId]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Patient user not found' };
    }
    
    return {
      success: true,
      patientUser: result.rows[0]
    };
  } catch (error) {
    console.error('Error getting patient user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update patient password
export const updatePatientPassword = async (patientUserId, newPassword) => {
  try {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    await query(
      'UPDATE patient_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, patientUserId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating patient password:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Deactivate patient user
export const deactivatePatientUser = async (patientUserId) => {
  try {
    await query(
      'UPDATE patient_users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [patientUserId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error deactivating patient user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
