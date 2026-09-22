import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
export async function POST(request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.HOMEWORK_REMINDER_CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await query(`CREATE TABLE IF NOT EXISTS app_notifications (id SERIAL PRIMARY KEY, homework_id INTEGER UNIQUE REFERENCES assigned_homework(id) ON DELETE CASCADE, patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE, student_id INTEGER REFERENCES students(id) ON DELETE CASCADE, message TEXT NOT NULL, is_read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    const result = await query(`INSERT INTO app_notifications (homework_id, patient_id, student_id, message) SELECT id, patient_id, student_id, 'Your homework is still pending. Go to the Homework screen to check it.' FROM assigned_homework WHERE status = 'assigned' AND created_at <= CURRENT_TIMESTAMP - INTERVAL '7 days' ON CONFLICT (homework_id) DO NOTHING RETURNING id`);
    return NextResponse.json({ created: result.rows.length });
  } catch (error) { console.error('Homework reminder error:', error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}
