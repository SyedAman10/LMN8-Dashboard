'use client';

import { useState, useEffect, useRef } from 'react';

export default function AssignHomeworkModal({ isOpen, onClose, patient, onAssigned }) {
  const [mode, setMode] = useState('text'); // text | voice
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [recordError, setRecordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setMode('text');
      setTitle('');
      setText('');
      setTranscript('');
      setRecordingUrl('');
      setRecordError('');
      setSuccessMessage('');
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body = {
        patientId: patient?.id || null,
        title,
        type: mode,
        content: mode === 'text' ? text : null,
        transcript: mode === 'voice' ? transcript : null
      };

      const resp = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const data = await resp.json();
      if (resp.ok) {
        setSuccessMessage('Homework assigned successfully');
        onAssigned && onAssigned(data.homework);
        // close after brief delay so user sees success inside modal
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 900);
      } else {
        setRecordError(data.error || 'Failed to assign homework');
      }
    } catch (err) {
      console.error('Assign homework failed', err);
      setRecordError('Network error while assigning homework');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const startRecording = async () => {
    setRecordError('');
    setSuccessMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        try {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordingUrl(url);

          // Auto-transcribe the recorded audio
          const fd = new FormData();
          fd.append('file', blob, 'recording.webm');
          // include homeworkId null for now
          const resp = await fetch('/api/homework/transcribe', { method: 'POST', body: fd, credentials: 'include' });
          const data = await resp.json();
          if (resp.ok && data.transcript) {
            setTranscript(data.transcript);
          } else {
            setRecordError(data.error || 'Transcription failed');
          }
        } catch (err) {
          console.error('Transcribe failed', err);
          setRecordError('Transcription failed');
        }
      };
      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording start failed', err);
      setRecordError('Could not start recording — check microphone permissions');
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error('Stop recording failed', err);
      setRecordError('Failed to stop recording');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel} />
      <div className="relative w-full max-w-2xl bg-slate-800/95 border border-cyan-500/30 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Assign Homework</h2>
            <p className="text-slate-400 text-sm">Assign to: <span className="text-white">{patient?.name || 'Unknown'}</span></p>
          </div>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {recordError && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded p-2 text-sm">{recordError}</div>}
          {successMessage && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded p-2 text-sm">{successMessage}</div>}
          <div>
            <label className="text-sm text-slate-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white" placeholder="Short title (optional)" />
          </div>

          <div>
            <label className="text-sm text-slate-300">Mode</label>
            <div className="mt-2 flex space-x-2">
              <button type="button" onClick={() => setMode('text')} className={`px-3 py-1 rounded ${mode==='text' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Text</button>
              <button type="button" onClick={() => setMode('voice')} className={`px-3 py-1 rounded ${mode==='voice' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Voice</button>
            </div>
          </div>

          {mode === 'text' && (
            <div>
              <label className="text-sm text-slate-300">Homework (text)</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full mt-1 bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white resize-none" placeholder="Enter homework instructions for the patient" />
            </div>
          )}

          {mode === 'voice' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button type="button" onClick={startRecording} className="px-4 py-2 bg-red-600 text-white rounded">Start Recording</button>
                ) : (
                  <button type="button" onClick={stopRecording} className="px-4 py-2 bg-yellow-600 text-black rounded">Stop</button>
                )}
                <div className={`text-sm ${isRecording ? 'text-red-400' : 'text-slate-400'}`}>
                  {isRecording ? 'Recording…' : (recordingUrl ? 'Recording ready' : 'Not recording')}
                </div>
              </div>

              {recordingUrl && (
                <div>
                  <label className="text-sm text-slate-300">Playback</label>
                  <audio src={recordingUrl} controls className="w-full mt-2" />
                </div>
              )}

              <div>
                <label className="text-sm text-slate-300">Transcript (editable)</label>
                <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={4} className="w-full mt-1 bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white resize-none" placeholder="Transcript will appear here after recording" />
              </div>

              <div className="text-sm text-slate-400">Note: Recorded audio is transcribed server-side; audio storage isn't persisted yet.</div>

              {recordError && <div className="text-sm text-red-400">{recordError}</div>}
              {successMessage && <div className="text-sm text-green-400">{successMessage}</div>}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/30">
            <button type="button" onClick={handleCancel} className="px-4 py-2 text-slate-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded">
              {isLoading ? 'Assigning...' : 'Assign Homework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
