import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const assignerId = url.searchParams.get('assignerId');
    const patientId = url.searchParams.get('patientId');
    const studentId = url.searchParams.get('studentId');

    let sql = `SELECT * FROM homework_summaries`;
    const clauses = [];
    const params = [];
    let idx = 1;

    if (assignerId) { clauses.push(`assigner_id = $${idx++}`); params.push(assignerId); }
    if (patientId) { clauses.push(`patient_id = $${idx++}`); params.push(patientId); }
    if (studentId) { clauses.push(`student_id = $${idx++}`); params.push(studentId); }

    if (clauses.length > 0) {
      sql += ' WHERE ' + clauses.join(' AND ');
    }
    sql += ' ORDER BY created_at DESC';

    try {
      const result = await query(sql, params);
      return NextResponse.json({ summaries: result.rows });
    } catch (dbErr) {
      console.error('Homework summaries query failed');
      console.error('SQL:', sql);
      console.error('Params:', params);
      console.error(dbErr && dbErr.stack ? dbErr.stack : dbErr.message || dbErr);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Get homework summaries error:', error && error.stack ? error.stack : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
