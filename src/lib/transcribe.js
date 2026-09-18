import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';
import os from 'os';

function getFfmpegPath() {
  const knownPaths = [
    () => { try { return eval('require')('ffmpeg-static') } catch {} },
    () => path.join(process.cwd(), 'node_modules', 'ffmpeg-static',
      process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    () => path.join(require.resolve('ffmpeg-static/package.json').replace('package.json', ''),
      process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    () => 'ffmpeg',
  ];
  for (const p of knownPaths) {
    try { const v = p(); if (v) return v } catch {}
  }
  return 'ffmpeg';
}
const ffmpeg = getFfmpegPath();

let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
    const { pipeline } = await import('@xenova/transformers');
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
  }
  return transcriber;
}

function wavToFloat32(buffer) {
  const samples = new Float32Array((buffer.length - 44) / 2);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = buffer.readInt16LE(44 + i * 2) / 32768;
  }
  return samples;
}

export async function transcribeAudioLocally(audioBuffer) {
  const tmpDir = os.tmpdir();
  const id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const tmpInput = path.join(tmpDir, 'audio_' + id + '.m4a');
  const tmpWav = path.join(tmpDir, 'audio_' + id + '.wav');
  try {
    writeFileSync(tmpInput, audioBuffer);

    const ffmpegPath = ffmpeg;
    execSync('"' + ffmpegPath + '" -y -i "' + tmpInput + '" -ar 16000 -ac 1 -sample_fmt s16 "' + tmpWav + '"', { stdio: 'pipe', timeout: 30000 });

    const wav = readFileSync(tmpWav);
    if (wav.length <= 44) return null;

    const audio = wavToFloat32(wav);
    const tr = await getTranscriber();
    const result = await tr(audio, { return_timestamps: false });
    return (result && result.text) ? result.text.trim() : null;
  } catch (err) {
    console.error('🎙️ Transcription error:', err);
    // Rethrow so the caller (API) can return a helpful error message
    throw err;
  } finally {
    try { unlinkSync(tmpInput); } catch {}
    try { unlinkSync(tmpWav); } catch {}
  }
}

export async function transcribeWithOpenAI(audioBuffer) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_SECRET || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!OPENAI_KEY) throw new Error('OpenAI API key not configured on server');

  try {
    // Use global FormData / Blob available in modern Node runtimes (Next.js 13+)
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/m4a' });
    formData.append('file', blob, 'audio.m4a');
    formData.append('model', 'whisper-1');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `OpenAI transcription failed: ${res.status}`);
    }
    // OpenAI returns plain text in `text` when response_format is default
    return data.text || null;
  } catch (err) {
    console.error('OpenAI transcription error:', err);
    throw err;
  }
}
