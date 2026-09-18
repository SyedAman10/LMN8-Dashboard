import { NextResponse } from 'next/server';
import { transcribeAudioLocally, transcribeWithOpenAI } from '@/lib/transcribe';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const homeworkId = form.get('homeworkId');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let transcript = null;

    // Prefer OpenAI Whisper if server key is configured (mirrors mobile app flow)
    try {
      transcript = await transcribeWithOpenAI(buffer);
    } catch (openAiErr) {
      console.warn('OpenAI transcription failed or not configured, falling back to local model:', openAiErr?.message || openAiErr);
      transcript = await transcribeAudioLocally(buffer);
    }

    if (!transcript) {
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
    }

    // If homeworkId provided, update the record
    if (homeworkId) {
      const result = await query(
        `UPDATE assigned_homework SET transcript = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [transcript, homeworkId]
      );
      return NextResponse.json({ transcript, homework: result.rows[0] });
    }

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error('Transcribe route error:', err);
    const message = (err && err.message) ? err.message : String(err);
    return NextResponse.json({ error: message || 'Internal server error' }, { status: 500 });
  }
}
