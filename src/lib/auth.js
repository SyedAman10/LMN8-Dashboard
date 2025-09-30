import bcrypt from 'bcryptjs';
import { query } from './db.js';

// Hash password
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate a simple session token (in production, use a proper JWT library)
export function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Create user session
export async function createUserSession(userId) {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await query(
    'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
    [userId, sessionToken, expiresAt]
  );

  return sessionToken;
}

// Get user by session token
export async function getUserBySession(sessionToken) {
  const result = await query(
    `SELECT u.*, s.expires_at 
     FROM users u 
     JOIN user_sessions s ON u.id = s.user_id 
     WHERE s.session_token = $1 AND s.expires_at > NOW() AND u.is_active = true`,
    [sessionToken]
  );

  return result.rows[0] || null;
}

// Clean up expired sessions
export async function cleanupExpiredSessions() {
  await query('DELETE FROM user_sessions WHERE expires_at < NOW()');
}

// Get user by email
export async function getUserByEmail(email) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );
  return result.rows[0] || null;
}

// Create new user
export async function createUser(userData) {
  const { firstName, lastName, email, password, role, licenseNumber } = userData;
  
  const passwordHash = await hashPassword(password);
  
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, license_number) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, first_name, last_name, email, role, created_at`,
    [firstName, lastName, email, passwordHash, role, licenseNumber || null]
  );

  return result.rows[0];
}

// Validate user credentials
export async function validateUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return null;
  }

  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
