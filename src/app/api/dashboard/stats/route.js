import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserBySession } from '@/lib/auth';

// GET - Fetch dashboard statistics for the authenticated user
export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getUserBySession(sessionToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get active patients count
    const activePatientsResult = await query(
      `SELECT COUNT(*) as count 
       FROM patients 
       WHERE user_id = $1 AND status = 'active'`,
      [user.id]
    );
    const activePatients = parseInt(activePatientsResult.rows[0].count);

    // Get total patients count
    const totalPatientsResult = await query(
      `SELECT COUNT(*) as count 
       FROM patients 
       WHERE user_id = $1`,
      [user.id]
    );
    const totalPatients = parseInt(totalPatientsResult.rows[0].count);

    // Get sessions completed today (mock data for now - you can implement real session tracking)
    const sessionsToday = 0; // This would be calculated from a sessions table

    // Get completion rate (patients who completed all their sessions)
    const completionRateResult = await query(
      `SELECT 
         COUNT(CASE WHEN sessions_completed >= total_sessions AND total_sessions > 0 THEN 1 END) as completed,
         COUNT(*) as total
       FROM patients 
       WHERE user_id = $1`,
      [user.id]
    );
    
    const completedPatients = parseInt(completionRateResult.rows[0].completed);
    const totalPatientsForRate = parseInt(completionRateResult.rows[0].total);
    const completionRate = totalPatientsForRate > 0 ? Math.round((completedPatients / totalPatientsForRate) * 100) : 0;

    // Get recent patients (last 5)
    const recentPatientsResult = await query(
      `SELECT id, name, diagnosis, sessions_completed, total_sessions, status, created_at
       FROM patients 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [user.id]
    );

    // Get patients by status
    const patientsByStatusResult = await query(
      `SELECT status, COUNT(*) as count
       FROM patients 
       WHERE user_id = $1 
       GROUP BY status`,
      [user.id]
    );

    const patientsByStatus = patientsByStatusResult.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});

    // Get average sessions per patient
    const avgSessionsResult = await query(
      `SELECT AVG(sessions_completed) as avg_completed, AVG(total_sessions) as avg_total
       FROM patients 
       WHERE user_id = $1`,
      [user.id]
    );

    const avgSessionsCompleted = Math.round(avgSessionsResult.rows[0].avg_completed || 0);
    const avgTotalSessions = Math.round(avgSessionsResult.rows[0].avg_total || 0);

    return NextResponse.json({
      success: true,
      stats: {
        activePatients,
        totalPatients,
        sessionsToday,
        completionRate,
        recentPatients: recentPatientsResult.rows.map(patient => ({
          id: patient.id,
          name: patient.name,
          diagnosis: patient.diagnosis,
          sessionsCompleted: patient.sessions_completed,
          totalSessions: patient.total_sessions,
          status: patient.status,
          createdAt: patient.created_at,
          progress: patient.total_sessions > 0 ? Math.round((patient.sessions_completed / patient.total_sessions) * 100) : 0
        })),
        patientsByStatus,
        avgSessionsCompleted,
        avgTotalSessions
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
