import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

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

// GET /api/backend/clinician-sharing/preferences
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = String(getUserId(decoded));
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const result = await query(
      'SELECT * FROM clinician_sharing_preferences WHERE user_id = $1',
      [userId]
    );

    const row = result.rows[0] || {};
    return NextResponse.json({
      success: true,
      data: {
        share_ai_conversation_summary: row.share_ai_conversation_summary ?? true,
        share_journal_entry_summary: row.share_journal_entry_summary ?? true,
        shareAIConversationSummary: row.share_ai_conversation_summary ?? true,
        shareJournalEntrySummary: row.share_journal_entry_summary ?? true,
      },
    });
  } catch (err) {
    console.error('GET clinician-sharing preferences error:', err);
    return NextResponse.json({
      success: true,
      data: {
        share_ai_conversation_summary: true,
        share_journal_entry_summary: true,
        shareAIConversationSummary: true,
        shareJournalEntrySummary: true,
      },
    });
  }
}

// PUT /api/backend/clinician-sharing/preferences
export async function PUT(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = String(getUserId(decoded));
    const body = await request.json();

    const result = await query(
      `INSERT INTO clinician_sharing_preferences (user_id, share_ai_conversation_summary, share_journal_entry_summary)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE
       SET share_ai_conversation_summary = COALESCE($2, clinician_sharing_preferences.share_ai_conversation_summary),
           share_journal_entry_summary = COALESCE($3, clinician_sharing_preferences.share_journal_entry_summary)
       RETURNING *`,
      [
        userId,
        body.shareAIConversationSummary ?? body.share_ai_conversation_summary ?? true,
        body.shareJournalEntrySummary ?? body.share_journal_entry_summary ?? true,
      ]
    );

    const updated = result.rows[0] || {};
    return NextResponse.json({
      success: true,
      data: {
        share_ai_conversation_summary: updated.share_ai_conversation_summary,
        share_journal_entry_summary: updated.share_journal_entry_summary,
        shareAIConversationSummary: updated.share_ai_conversation_summary,
        shareJournalEntrySummary: updated.share_journal_entry_summary,
      },
    });
  } catch (err) {
    console.error('PUT clinician-sharing preferences error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
