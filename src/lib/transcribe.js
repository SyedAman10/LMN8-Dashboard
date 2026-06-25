import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import os from 'os';

const CACHE_DIR = path.join(os.tmpdir(), 'lmn8-whisper-cache');

const WORKER_CODE = `
const { pipeline } = require('@xenova/transformers');
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
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

process.on('message', async (msg) => {
  if (msg.type === 'transcribe') {
    const tmpDir = os.tmpdir();
    const id = Date.now();
    const tmpInput = path.join(tmpDir, 'audio_' + id + '.m4a');
    const tmpWav = path.join(tmpDir, 'audio_' + id + '.wav');
    try {
      fs.writeFileSync(tmpInput, Buffer.from(msg.buffer.data));
      const ffmpeg = require('ffmpeg-static');
      execSync('"' + ffmpeg + '" -y -i "' + tmpInput + '" -ar 16000 -ac 1 -sample_fmt s16 "' + tmpWav + '"', { stdio: 'pipe' });
      const wav = fs.readFileSync(tmpWav);
      const audio = wavToFloat32(wav);
      const tr = await getTranscriber();
      const result = await tr(audio, { return_timestamps: false });
      process.send({ type: 'result', text: (result && result.text) ? result.text.trim() : null });
    } catch (err) {
      process.send({ type: 'result', text: null, error: err.message });
    } finally {
      try { fs.unlinkSync(tmpInput); } catch {}
      try { fs.unlinkSync(tmpWav); } catch {}
    }
  }
});
`;

let worker = null;
let workerPath = null;

function getWorkerPath() {
  if (!workerPath) {
    mkdirSync(CACHE_DIR, { recursive: true });
    workerPath = path.join(CACHE_DIR, 'whisper-worker.js');
    writeFileSync(workerPath, WORKER_CODE);
  }
  return workerPath;
}

function getWorker() {
  if (!worker) {
    worker = spawn(process.execPath, [getWorkerPath()], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      env: {
        ...process.env,
        TRANSFORMERS_CACHE: CACHE_DIR,
        HF_HOME: CACHE_DIR,
      },
    });
    worker.on('exit', () => { worker = null; });
  }
  return worker;
}

export function transcribeAudioLocally(audioBuffer) {
  return new Promise((resolve) => {
    const w = getWorker();
    const timeout = setTimeout(() => {
      worker = null;
      w.kill();
      resolve(null);
    }, 120000);

    w.on('message', (msg) => {
      clearTimeout(timeout);
      if (msg.type === 'result') {
        resolve(msg.text);
      }
    });

    w.on('error', () => {
      clearTimeout(timeout);
      worker = null;
      resolve(null);
    });

    w.send({ type: 'transcribe', buffer: audioBuffer });
  });
}
