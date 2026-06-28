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

async function generateSessionSummary(sessionTitle, messages, patientGreetingName = 'Patient') {
  const greetingForPrompt = patientGreetingName.toLowerCase() === 'patient'
    ? 'the patient'
    : `the ${patientGreetingName.toLowerCase()}`;

  const systemPrompt = `You are a clinical behavioral health analyst. Given a ${patientGreetingName.toLowerCase()}'s conversation with an AI therapy assistant, generate a concise 3rd-person clinical summary that captures:
- The ${patientGreetingName.toLowerCase()}'s emotional state and concerns
- Topics discussed and themes explored
- Any indicators of distress, anxiety, hopelessness, or progress
- The overall therapeutic trajectory

Write in professional clinical narrative style (e.g., "${greetingForPrompt} discussed...", "${greetingForPrompt} expressed..."). Keep it 2-4 sentences. Focus on the ${patientGreetingName.toLowerCase()}'s content, not the AI assistant's responses.`;

  const transcript = messages.map(m =>
    `${m.role === 'user' ? patientGreetingName : 'AI Assistant'}: ${m.content}`
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

async function getPatientGreetingName(userId) {
  try {
    const result = await query(
      `SELECT c.patient_greeting_name
       FROM patient_users pu
       JOIN patients p ON pu.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       JOIN clinics c ON u.clinic_id = c.id
       WHERE pu.id = $1`,
      [userId]
    );
    return result.rows[0]?.patient_greeting_name || 'Patient';
  } catch {
    return 'Patient';
  }
}

export async function generateAIConversationSummaries(userId) {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ HUGGINGFACE_API_KEY not set — skipping AI conversation summary');
      return;
    }

    const patientGreetingName = await getPatientGreetingName(userId);

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

      const summaryText = await generateSessionSummary('Chat Session', messagesResult.rows, patientGreetingName);

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

export async function generateLatestAIConversationSummary(userId) {
  try {
    if (!HF_API_KEY) return null;

    const patientGreetingName = await getPatientGreetingName(userId);

    const linkedResult = await query(
      `SELECT session_id FROM patient_chat_sessions WHERE patient_id = $1`,
      [userId]
    );
    if (linkedResult.rows.length === 0) return null;

    const sessionIds = linkedResult.rows.map(r => r.session_id);
    const pool = getBackendPool();

    const sessionsResult = await pool.query(
      `SELECT s.id, s.created_at
       FROM sessions s
       WHERE s.id = ANY($1::uuid[])
         AND EXISTS (SELECT 1 FROM messages m WHERE m.session_id = s.id)
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [sessionIds]
    );
    if (sessionsResult.rows.length === 0) return null;

    const session = sessionsResult.rows[0];

    // Delete old summary for this session (if any) so it regenerates fresh
    await query(
      `DELETE FROM ai_conversation WHERE user_id = $1 AND type = 'ai_conversation' AND metadata->>'sessionId' = $2`,
      [String(userId), session.id]
    );

    const messagesResult = await pool.query(
      `SELECT role, content FROM messages WHERE session_id = $1 ORDER BY created_at ASC`,
      [session.id]
    );
    if (messagesResult.rows.length < 2) return null;

    const summaryText = await generateSessionSummary('Chat Session', messagesResult.rows, patientGreetingName);

    const insertResult = await query(
      `INSERT INTO ai_conversation (user_id, type, summary_text, metadata, updated_at)
       VALUES ($1, 'ai_conversation', $2, $3::jsonb, NOW())
       RETURNING id, summary_text, created_at`,
      [
        String(userId),
        summaryText,
        JSON.stringify({ sessionId: session.id, messageCount: messagesResult.rows.length }),
      ]
    );

    console.log(`📋 AI conversation summary generated synchronously for latest session ${session.id}`);
    return insertResult.rows[0];
  } catch (err) {
    console.error('Failed to generate latest AI conversation summary:', err);
    return null;
  } finally {
    await closeBackendPool();
  }
}
