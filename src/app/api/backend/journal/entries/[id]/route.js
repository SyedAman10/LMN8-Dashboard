import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

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

// GET /api/backend/journal/entries/[id]
export async function GET(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id } = await params;
    const result = await query('SELECT * FROM journal_entries WHERE id = $1', [parseInt(id, 10)]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/backend/journal/entries/[id]
export async function PUT(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const result = await query(
      `UPDATE journal_entries
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           mood = COALESCE($3, mood),
           transcribed_text = COALESCE($4, transcribed_text),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [body.title, body.content, body.mood ?? null, body.transcribed_text, parseInt(id, 10)]
    );

    if (result.rows.length === 0) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/backend/journal/entries/[id]
export async function DELETE(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id } = await params;

    // Get the entry to find audio/image files to delete
    const existing = await query('SELECT * FROM journal_entries WHERE id = $1', [parseInt(id, 10)]);
    if (existing.rows.length === 0) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

    // Delete associated files
    const entry = existing.rows[0];
    if (entry.audio_file_path) {
      const filePath = path.join(process.cwd(), 'public', entry.audio_file_path);
      try { await unlink(filePath); } catch {}
    }
    if (entry.media_url && entry.media_url.startsWith('/uploads/') && entry.media_url !== entry.audio_file_path) {
      const filePath = path.join(process.cwd(), 'public', entry.media_url);
      try { await unlink(filePath); } catch {}
    }

    await query('DELETE FROM journal_entries WHERE id = $1', [parseInt(id, 10)]);
    return NextResponse.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
