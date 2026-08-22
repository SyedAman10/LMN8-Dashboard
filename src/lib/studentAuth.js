import bcrypt from 'bcryptjs';
import { query } from './db.js';

// Generate unique username for student
export const generateStudentUsername = async (studentName, studentId) => {
  const baseName = studentName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 8);

  let username = baseName;
  let counter = 1;

  while (true) {
    const result = await query(
      'SELECT id FROM student_users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      break;
    }

    username = `${baseName}${counter}`;
    counter++;
  }

  return username;
};

// Generate secure password
export const generateStudentPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';

  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Create student user account
export const createStudentUser = async (studentId, studentName) => {
  try {
    const username = await generateStudentUsername(studentName, studentId);
    const password = generateStudentPassword();

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      `INSERT INTO student_users (student_id, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, created_at`,
      [studentId, username, passwordHash]
    );

    const studentUser = result.rows[0];

    return {
      success: true,
      studentUser: {
        id: studentUser.id,
        studentId: studentId,
        username: username,
        password: password,
        createdAt: studentUser.created_at
      }
    };
  } catch (error) {
    console.error('Error creating student user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Authenticate student user
export const authenticateStudent = async (username, password) => {
  try {
    const result = await query(
      `SELECT
        su.id, su.student_id, su.username, su.password_hash, su.is_active,
        s.name, s.email, s.program, s.enrollment_year,
        c.student_greeting_name, c.show_community, c.country_type
       FROM student_users su
       JOIN students s ON su.student_id = s.id
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN colleges c ON u.college_id = c.id
       WHERE su.username = $1 AND su.is_active = true`,
      [username]
    );

    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }

    const studentUser = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, studentUser.password_hash);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    await query(
      'UPDATE student_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [studentUser.id]
    );

    return {
      success: true,
      student: {
        id: studentUser.student_id,
        name: studentUser.name,
        email: studentUser.email,
        program: studentUser.program,
        enrollmentYear: studentUser.enrollment_year,
        studentGreetingName: studentUser.student_greeting_name || 'Student',
        showCommunity: studentUser.show_community !== false,
        countryType: studentUser.country_type || 'US'
      },
      user: {
        id: studentUser.id,
        username: studentUser.username
      }
    };
  } catch (error) {
    console.error('Error authenticating student:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
};

// Get student user by student ID
export const getStudentUserByStudentId = async (studentId) => {
  try {
    const result = await query(
      `SELECT su.id, su.username, su.is_active, su.last_login, su.created_at
       FROM student_users su
       WHERE su.student_id = $1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return { success: false, error: 'Student user not found' };
    }

    return {
      success: true,
      studentUser: result.rows[0]
    };
  } catch (error) {
    console.error('Error getting student user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Deactivate student user
export const deactivateStudentUser = async (studentUserId) => {
  try {
    await query(
      'UPDATE student_users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [studentUserId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error deactivating student user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
