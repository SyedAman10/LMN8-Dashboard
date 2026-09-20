import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const role = auth.user?.role;
    if (role === 'lmn8_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const studentId = url.searchParams.get('studentId');
    const status = url.searchParams.get('status');
    const allowedStatuses = new Set(['completed', 'not_understood']);

    if (status && !allowedStatuses.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (role === 'college' && patientId) {
      return NextResponse.json({ error: 'College users can only view student homework summaries' }, { status: 403 });
    }

    if (role !== 'college' && studentId) {
      return NextResponse.json({ error: 'Clinic users can only view patient homework summaries' }, { status: 403 });
    }

    let sql = `SELECT * FROM homework_summaries`;
    const clauses = [];
    const params = [];
    let idx = 1;

    clauses.push(`assigner_id = $${idx++}`);
    params.push(auth.clinicianId);
    if (patientId) { clauses.push(`patient_id = $${idx++}`); params.push(patientId); }
    if (studentId) { clauses.push(`student_id = $${idx++}`); params.push(studentId); }
    if (status) { clauses.push(`status = $${idx++}`); params.push(status); }

    sql += ' WHERE ' + clauses.join(' AND ');
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
