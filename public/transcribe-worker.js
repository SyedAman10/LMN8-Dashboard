const { pipeline } = require('@xenova/transformers');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
    console.log('Loading Whisper model...');
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    console.log('Whisper model loaded');
  }
  return transcriber;
}

function wavToFloat32(buffer) {
  const bytesPerSample = 2;
  const dataOffset = 44;
  const numSamples = (buffer.length - dataOffset) / bytesPerSample;
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const sample = buffer.readInt16LE(dataOffset + i * 2);
    samples[i] = sample / 32768;
  }
  return samples;
}

process.on('message', async (msg) => {
  if (msg.type === 'transcribe') {
    const tmpInput = path.join(os.tmpdir(), `audio_${Date.now()}.m4a`);
    const tmpWav = path.join(os.tmpdir(), `audio_${Date.now()}.wav`);
    try {
      fs.writeFileSync(tmpInput, Buffer.from(msg.buffer.data));
      const ffmpegPath = require('ffmpeg-static');
      execSync(`"${ffmpegPath}" -y -i "${tmpInput}" -ar 16000 -ac 1 -sample_fmt s16 "${tmpWav}"`, { stdio: 'pipe' });
      const wavBuffer = fs.readFileSync(tmpWav);
      const audioData = wavToFloat32(wavBuffer);
      const tr = await getTranscriber();
      const result = await tr(audioData, { return_timestamps: false });
      process.send({ type: 'result', text: result?.text?.trim() || null });
    } catch (err) {
      process.send({ type: 'result', text: null, error: err.message });
    } finally {
      try { fs.unlinkSync(tmpInput); } catch {}
      try { fs.unlinkSync(tmpWav); } catch {}
    }
  }
});
