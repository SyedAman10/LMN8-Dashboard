import { Pool } from '@neondatabase/serverless';
import { query } from './db';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-72B-Instruct';

let backendPool = null;

function getBackendPool() {
  if (!backendPool) {
    const url = process.env.BACKEND_DATABASE_URL;
    if (!url) throw new Error('BACKEND_DATABASE_URL not set');
    backendPool = new Pool({ connectionString: url });
  }
  return backendPool;
}

async function closeBackendPool() {
  try { if (backendPool) { await backendPool.end(); backendPool = null; } } catch {}
}

async function generateSessionSummary(sessionTitle, messages) {
  const systemPrompt = `You are a clinical behavioral health analyst. Given a patient's conversation with an AI therapy assistant, generate a concise 3rd-person clinical summary that captures:
- The patient's emotional state and concerns
- Topics discussed and themes explored
- Any indicators of distress, anxiety, hopelessness, or progress
- The overall therapeutic trajectory

Write in professional clinical narrative style (e.g., "The patient discussed...", "The individual expressed..."). Keep it 2-4 sentences. Focus on the PATIENT's content, not the AI assistant's responses.`;

  const transcript = messages.map(m =>
    `${m.role === 'user' ? 'Patient' : 'AI Assistant'}: ${m.content}`
  ).join('\n\n');

  const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: HF_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Session title: ${sessionTitle || 'Untitled'}\n\nConversation transcript:\n${transcript}\n\nGenerate a clinical summary:` },
      ],
      max_tokens: 400,
      temperature: 0.4,
    }),
  });

  if (!res.ok) throw new Error(`HF API error ${res.status}: ${await res.text()}`);

  const result = await res.json();
  return result?.choices?.[0]?.message?.content?.trim() || '';
}

export async function generateAIConversationSummaries(userId) {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ HUGGINGFACE_API_KEY not set — skipping AI conversation summary');
      return;
    }

    const linkedResult = await query(
      `SELECT session_id FROM patient_chat_sessions WHERE patient_id = $1`,
      [userId]
    );

    if (linkedResult.rows.length === 0) {
      console.log(`No linked chat sessions found for user ${userId}`);
      return;
    }

    const sessionIds = linkedResult.rows.map(r => r.session_id);
    const pool = getBackendPool();

    const sessionsResult = await pool.query(
      `SELECT s.id, s.created_at
       FROM sessions s
       WHERE s.id = ANY($1::uuid[])
         AND EXISTS (SELECT 1 FROM messages m WHERE m.session_id = s.id)
       ORDER BY s.created_at DESC`,
      [sessionIds]
    );

    if (sessionsResult.rows.length === 0) return;

    for (const session of sessionsResult.rows) {
      const existing = await query(
        `SELECT 1 FROM ai_conversation WHERE user_id = $1 AND type = 'ai_conversation' AND metadata->>'sessionId' = $2 LIMIT 1`,
        [String(userId), session.id]
      );
      if (existing.rows.length > 0) continue;

      const messagesResult = await pool.query(
        `SELECT role, content FROM messages WHERE session_id = $1 ORDER BY created_at ASC`,
        [session.id]
      );

      if (messagesResult.rows.length < 2) continue;

      const summaryText = await generateSessionSummary('Chat Session', messagesResult.rows);

      await query(
        `INSERT INTO ai_conversation (user_id, type, summary_text, metadata, updated_at)
         VALUES ($1, 'ai_conversation', $2, $3::jsonb, NOW())`,
        [
          String(userId),
          summaryText,
          JSON.stringify({ sessionId: session.id, messageCount: messagesResult.rows.length }),
        ]
      );

      console.log(`📋 AI conversation summary generated for session ${session.id}`);
    }
  } catch (err) {
    console.error('Failed to generate AI conversation summaries:', err);
  } finally {
    await closeBackendPool();
  }
}
