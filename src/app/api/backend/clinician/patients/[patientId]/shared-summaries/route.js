import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { patientId } = params;
    const url = new URL(request.url);
    const summaryType = url.searchParams.get('summaryType') || 'journal_entry';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Return ai_conversation rows for the given patient (user_id)
    const result = await query(
      `SELECT id, user_id, type AS summary_type, summary_text, created_at
       FROM ai_conversation
       WHERE user_id = $1 AND type = $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [String(patientId), summaryType, limit, offset]
    );

    return NextResponse.json(
      result.rows.map(r => ({
        id: String(r.id),
        summaryType: r.summary_type,
        summaryText: r.summary_text,
        createdAt: r.created_at
      }))
    );
  } catch (err) {
    console.error('GET shared-summaries (local) error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
