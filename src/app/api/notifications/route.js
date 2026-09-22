import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

async function ensureTable() {
  await query(`CREATE TABLE IF NOT EXISTS app_notifications (id SERIAL PRIMARY KEY, homework_id INTEGER UNIQUE REFERENCES assigned_homework(id) ON DELETE CASCADE, patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE, student_id INTEGER REFERENCES students(id) ON DELETE CASCADE, message TEXT NOT NULL, is_read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
}
function appUser(request) {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : request.cookies.get('app_token')?.value;
  if (!token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production'); } catch { return null; }
}
export async function GET(request) {
  try {
    const user = appUser(request); if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    await ensureTable();
    const result = await query(user.type === 'student' ? 'SELECT id, message, is_read, created_at FROM app_notifications WHERE student_id = $1 ORDER BY created_at DESC' : 'SELECT id, message, is_read, created_at FROM app_notifications WHERE patient_id = $1 ORDER BY created_at DESC', [user.type === 'student' ? user.studentId : user.patientId]);
    return NextResponse.json({ notifications: result.rows });
  } catch (error) { console.error('Notifications GET error:', error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}
export async function PATCH(request) {
  try {
    const user = appUser(request); if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    await ensureTable(); const { id } = await request.json();
    const result = await query(user.type === 'student' ? 'UPDATE app_notifications SET is_read = true WHERE id = $1 AND student_id = $2 RETURNING id' : 'UPDATE app_notifications SET is_read = true WHERE id = $1 AND patient_id = $2 RETURNING id', [id, user.type === 'student' ? user.studentId : user.patientId]);
    return NextResponse.json({ updated: result.rows.length > 0 });
  } catch (error) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}
