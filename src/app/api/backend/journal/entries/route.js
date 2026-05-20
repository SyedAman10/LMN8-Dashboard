import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { transcribeAudioLocally } from '@/lib/transcribe';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

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

    return NextResponse.json({
      success: true,
      data: result.rows,
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

    const contentType = request.headers.get('content-type') || '';
    let isVoiceWithoutText = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title') || '';
      content = formData.get('content') || '';
      mediaType = formData.get('media_type') || 'text';
      mood = formData.get('mood') ? parseInt(formData.get('mood'), 10) : null;
      transcribedText = formData.get('transcribed_text') || null;

      const audioFile = formData.get('audio');
      const imageFile = formData.get('image');

      if (audioFile && audioFile instanceof File && audioFile.size > 0) {
        const buffer = Buffer.from(await audioFile.arrayBuffer());
        const ext = path.extname(audioFile.name) || '.m4a';
        const filename = `audio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
        if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        audioFilePath = `/uploads/audio/${filename}`;
        mediaUrl = audioFilePath;

        isVoiceWithoutText = mediaType === 'voice' && (!content || content === 'Voice memo entry');

        if (!transcribedText) {
          console.log('🎙️ Starting local transcription, audio size:', buffer.length);
          const transcription = await transcribeAudioLocally(buffer);
          console.log('🎙️ Transcription result:', transcription ? `"${transcription.slice(0, 100)}"` : '(empty)');
          if (transcription) transcribedText = transcription;
        }

        if (mediaType === 'voice' && !content) {
          content = transcribedText || 'Voice memo entry';
        }
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

    return NextResponse.json({
      success: true,
      data: entry,
      message: 'Journal entry created successfully',
    }, { status: 201 });
  } catch (err) {
    console.error('POST journal entry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
