import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { generateAIConversationSummaries } from '@/lib/conversationSummary';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';

function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.substring(7);
  return request.cookies.get('patient_token')?.value || request.cookies.get('token')?.value;
}

function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

function getUserId(decoded) {
  return decoded?.patientId || decoded?.id || decoded?.user_id || decoded?.sub || null;
}

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = String(getUserId(decoded));
    if (!userId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const summaryType = searchParams.get('summaryType') || 'journal_entry';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (summaryType === 'ai_conversation') {
      generateAIConversationSummaries(userId).catch(err =>
        console.error('Background AI conversation summary generation failed:', err)
      );
    }

    const countResult = await query(
      `SELECT COUNT(*) FROM ai_conversation WHERE user_id = $1 AND type = $2`,
      [userId, summaryType]
    );
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    const result = await query(
      `SELECT id, user_id, type AS summary_type, summary_text, created_at
       FROM ai_conversation
       WHERE user_id = $1 AND type = $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId, summaryType, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: result.rows.map(r => ({
        id: String(r.id),
        userId: String(r.user_id),
        summaryType: r.summary_type,
        summaryText: r.summary_text,
        createdAt: r.created_at,
      })),
      pagination: { limit, offset, count: total },
    });
  } catch (err) {
    console.error('GET clinician-sharing summaries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
