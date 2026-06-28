import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { transcribeAudioLocally } from '@/lib/transcribe';
import { sendCrisisAlert } from '@/lib/crisisEmail';
import { updateJournalSummary } from '@/lib/journalSummary';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';

const HARM_KEYWORDS = [
  // Self-harm
  "suicide", "kill myself", "harm myself", "end my life",
  "want to die", "i want to die", "commit suicide", "self-harm",
  "better off dead", "end it all", "no reason to live",
  "cut myself", "hurt myself", "take my own life",
  // Harm to others
  "kill you", "kill him", "kill her", "kill them",
  "i want to kill", "going to kill", "wanna kill",
  "want kill", "kill a", "kill someone", "want to kill",
  "hurt you", "hurt him", "hurt her",
  "want to hurt", "going to hurt",
  // Indirect crisis (careful — only clear suicide/self-harm intent)
  "never wake up", "don't want to be here anymore",
  "better off without me", "nobody would miss", "want to end it",
  "end the pain", "no way out", "end my life",
];

function containsHarmfulContent(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return HARM_KEYWORDS.some(kw => lower.includes(kw));
}



function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return request.cookies.get('patient_token')?.value || request.cookies.get('token')?.value;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function getUserId(decoded) {
  return decoded?.patientId || decoded?.id || decoded?.user_id || decoded?.sub || null;
}

// GET /api/backend/journal/entries — list journal entries for the authenticated user
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const userId = getUserId(decoded);
    if (!userId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const countResult = await query(
      'SELECT COUNT(*) FROM journal_entries WHERE user_id = $1',
      [String(userId)]
    );
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    const result = await query(
      'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [String(userId), limit, offset]
    );

    const mapped = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      mediaType: r.media_type,
      mood: r.mood,
      mediaUrl: r.media_url,
      audioFilePath: r.audio_file_path,
      transcribedText: r.transcribed_text,
      userId: r.user_id,
      timestamp: r.timestamp,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    return NextResponse.json({
      success: true,
      data: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('GET journal entries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/backend/journal/entries — create a journal entry (supports file upload)
export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const userId = getUserId(decoded);
    if (!userId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    let title = '';
    let content = '';
    let mediaType = 'text';
    let mood = null;
    let mediaUrl = null;
    let audioFilePath = null;
    let transcribedText = null;
    let audioBufferForBg = null;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title') || '';
      content = formData.get('content') || '';
      mediaType = formData.get('media_type') || 'text';
      mood = formData.get('mood') ? parseInt(formData.get('mood'), 10) : null;
      transcribedText = formData.get('transcribed_text') || null;

      const audioFile = formData.get('audio');
      const imageFile = formData.get('image');

      // Store audio buffer for transcription
      if (audioFile && audioFile instanceof File && audioFile.size > 0) {
        audioBufferForBg = Buffer.from(await audioFile.arrayBuffer());
        if (mediaType === 'voice' && !content) content = 'Voice memo entry';
      }

      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const ext = path.extname(imageFile.name) || '.jpg';
        const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
        if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
        mediaUrl = `/uploads/images/${filename}`;
      }
    } else {
      const body = await request.json();
      title = body.title || '';
      content = body.content || '';
      mediaType = body.media_type || body.mediaType || 'text';
      mood = body.mood ?? null;
      mediaUrl = body.media_url || body.mediaUrl || null;
      transcribedText = body.transcribed_text || body.transcribedText || null;
    }

    if (!title) return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });

    console.log('📦 Inserting entry with transcribed_text:', transcribedText ? `"${transcribedText.slice(0, 100)}"` : 'null');

    const result = await query(
      `INSERT INTO journal_entries (title, content, media_type, mood, media_url, audio_file_path, transcribed_text, user_id, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [title, content, mediaType, mood, mediaUrl, audioFilePath, transcribedText, String(userId)]
    );

    const entry = result.rows[0];
    console.log(`Journal entry created: ID=${entry.id}, type=${mediaType}, transcribed=${!!transcribedText}`);

    // Synchronous transcription for voice entries (blocking - keeps app showing "Saving...")
    let transcriptionError = null;
    if (audioBufferForBg && !transcribedText) {
      const eid = entry.id;
      console.log(`🎙️ Starting transcription for entry ${eid}, buffer size: ${audioBufferForBg.length}`);
      try {
        const transcription = await transcribeAudioLocally(audioBufferForBg);
        if (transcription) {
          console.log(`🎙️ Transcription complete for entry ${eid}:`, transcription.slice(0, 100));
          await query(
            `UPDATE journal_entries SET transcribed_text = $1, content = CASE WHEN content = 'Voice memo entry' OR content = $1 THEN $1 ELSE content || E'\\n\\n[Voice transcription]: ' || $1 END WHERE id = $2`,
            [transcription, eid]
          );
          entry.transcribed_text = transcription;
          if (entry.content === 'Voice memo entry' || entry.content === transcription) {
            entry.content = transcription;
          } else {
            entry.content = entry.content + '\n\n[Voice transcription]: ' + transcription;
          }
        } else {
          transcriptionError = 'transcription_empty';
        }
      } catch (transErr) {
        transcriptionError = transErr.message || 'transcription_failed';
      }
    }

    // Update journal summary in real-time (non-blocking)
    updateJournalSummary(String(userId)).catch(err =>
      console.error('Background journal summary update failed:', err)
    );

    // Crisis check: scan journal content + transcribed text for harmful keywords
    const combinedContent = [entry.title, entry.content, entry.transcribed_text].filter(Boolean).join(' ');
    let crisisResult = 'not_checked';
    if (containsHarmfulContent(combinedContent)) {
      crisisResult = 'detected';
      console.log('[CRISIS] Harmful content detected in journal entry, sending alert to clinician');
      try {
        // Look up the clinician who created this patient, plus patient info
        const clinicianResult = await query(
          `SELECT u.email, u.full_name, p.name AS patient_name, p.email AS patient_email FROM users u
           JOIN patients p ON p.user_id = u.id
           WHERE p.id = $1
           LIMIT 1`,
          [decoded?.patientId]
        );
        if (clinicianResult.rows.length > 0) {
          const row = clinicianResult.rows[0];
          crisisResult = 'sending';
          await sendCrisisAlert(row.email, row.full_name || 'Clinician', combinedContent, 'journal', row.patient_name, row.patient_email);
          crisisResult = 'sent_to_' + row.email;
        } else {
          crisisResult = 'no_clinician_primary';
          // Fallback: look up by patient_users relation
          const fallbackResult = await query(
            `SELECT u.email, u.full_name, p.name AS patient_name, p.email AS patient_email FROM users u
             JOIN patients p ON p.user_id = u.id
             JOIN patient_users pu ON pu.patient_id = p.id
             WHERE pu.id = $1
             LIMIT 1`,
            [String(userId)]
          );
          if (fallbackResult.rows.length > 0) {
            const row = fallbackResult.rows[0];
            crisisResult = 'sending_fallback';
            await sendCrisisAlert(row.email, row.full_name || 'Clinician', combinedContent, 'journal', row.patient_name, row.patient_email);
            crisisResult = 'sent_fallback_to_' + row.email;
          } else {
            crisisResult = 'no_clinician_any';
            console.warn('[CRISIS] No clinician found for patient, cannot send alert');
          }
        }
      } catch (crisisErr) {
        crisisResult = 'error_' + crisisErr.message;
        console.error('[CRISIS] Error sending journal alert email:', crisisErr.message);
      }
    }

    const mappedEntry = {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      mediaType: entry.media_type,
      mood: entry.mood,
      mediaUrl: entry.media_url,
      audioFilePath: entry.audio_file_path,
      transcribedText: entry.transcribed_text,
      userId: entry.user_id,
      timestamp: entry.timestamp,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    };
    return NextResponse.json({
      success: true,
      data: mappedEntry,
      message: 'Journal entry created successfully',
      crisis: crisisResult,
      transcriptionError,
    }, { status: 201 });
  } catch (err) {
    console.error('POST journal entry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
