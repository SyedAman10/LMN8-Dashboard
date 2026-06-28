import { query } from './db';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-72B-Instruct';

async function getPatientGreetingName(patientId) {
  try {
    const result = await query(`
      SELECT c.patient_greeting_name
      FROM patients p
      JOIN users u ON p.user_id = u.id
      JOIN clinics c ON u.clinic_id = c.id
      WHERE p.id = $1
    `, [patientId]);
    return result.rows[0]?.patient_greeting_name || 'Patient';
  } catch {
    return 'Patient';
  }
}

async function generateClinicalSummary(entriesText, moodInfo, patientGreetingName = 'Patient') {
  const lower = patientGreetingName.toLowerCase();
  const greetingForPrompt = ['patient', 'client', 'individual'].includes(lower) ? `the ${lower}` : `the ${lower} (${patientGreetingName})`;
  const systemPrompt = `You are a clinical behavioral health analyst. Given ${greetingForPrompt}'s recent journal entries (including mood scores and transcribed voice notes), generate a concise 3rd-person clinical summary that captures:
- ${patientGreetingName}'s current emotional state and themes
- Notable behavioral patterns or shifts
- Any indicators of distress, anxiety, hopelessness, or suicidal ideation
- Progress, coping strategies, or positive developments

Write in professional clinical narrative style (e.g., "${greetingForPrompt} reports...", "${greetingForPrompt} exhibits..."). Keep it 3-5 sentences. Do NOT include statistics or data counts.`;

  const userMessage = `Recent journal entries and mood data:\n\n${entriesText}\n\n${moodInfo}\n\nGenerate a clinical behavioral summary:`;

  const payload = {
    model: HF_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 400,
    temperature: 0.4,
  };

  const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HF API error ${res.status}: ${errText}`);
  }

  const result = await res.json();
  const summary = result?.choices?.[0]?.message?.content?.trim();
  if (!summary) throw new Error('Empty LLM response');
  return summary;
}

export async function updateJournalSummary(userId) {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ HUGGINGFACE_API_KEY not set — skipping LLM summary');
      return;
    }

    const entriesResult = await query(
      `SELECT title, content, mood, transcribed_text, created_at
       FROM journal_entries
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [String(userId)]
    );

    if (entriesResult.rows.length === 0) {
      await query(
        `INSERT INTO ai_conversation (user_id, type, summary_text, metadata, updated_at)
         VALUES ($1, 'journal_entry', 'No journal entries yet.', '{}'::jsonb, NOW())`,
        [String(userId)]
      );
      return;
    }

    const moodValues = entriesResult.rows.map(r => r.mood).filter(m => m != null);
    const avgMood = moodValues.length > 0
      ? (moodValues.reduce((a, b) => a + b, 0) / moodValues.length).toFixed(1)
      : null;

    const entriesText = entriesResult.rows.map((e, i) => {
      const date = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const moodStr = e.mood != null ? ` [Mood: ${e.mood}/10]` : '';
      const transcribed = e.transcribed_text ? `\n   [Voice note]: ${e.transcribed_text}` : '';
      return `Entry ${i + 1} (${date}): "${e.title}"${moodStr}\n   ${e.content}${transcribed}`;
    }).join('\n\n');

    const moodInfo = avgMood
      ? `Average mood across entries: ${avgMood}/10. Recent mood scores: ${moodValues.join(', ')}.`
      : '';

    const patientGreetingName = await getPatientGreetingName(Number(userId));
    const summaryText = await generateClinicalSummary(entriesText, moodInfo, patientGreetingName);

    const metadata = {
      totalEntries: entriesResult.rows.length,
      entryDates: entriesResult.rows.map(e => e.created_at),
      moodScores: moodValues,
    };

    await query(`DELETE FROM ai_conversation WHERE user_id = $1 AND type = 'journal_entry'`, [String(userId)]);

    await query(
      `INSERT INTO ai_conversation (user_id, type, summary_text, metadata, updated_at)
       VALUES ($1, 'journal_entry', $2, $3::jsonb, NOW())`,
      [String(userId), summaryText, JSON.stringify(metadata)]
    );

    console.log(`📋 Journal clinical summary generated for user ${userId}`);
  } catch (err) {
    console.error('Failed to update journal summary:', err);
  }
}
