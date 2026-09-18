'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeworkSummariesContent() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [homeworks, setHomeworks] = useState([]);
  const [loadingHomeworks, setLoadingHomeworks] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchPatients(); }, []);
  useEffect(() => { if (selectedPatient?.id) fetchSummaries(selectedPatient.id); }, [selectedPatient?.id]);

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      const resp = await fetch('/api/patients', { credentials: 'include' });
      if (!resp.ok) { setPatients([]); return; }
      const data = await resp.json();
      const list = Array.isArray(data?.patients) ? data.patients : [];
      setPatients(list);
      if (list.length > 0) setSelectedPatient(prev => prev || list[0]);
    } catch (err) {
      console.error('Fetch patients error', err);
      setPatients([]);
    } finally { setPatientsLoading(false); }
  };

  const fetchSummaries = async (patientId) => {
    try {
      setLoadingSummaries(true);
      setError('');
      const assignerId = user?.id;
      const q = new URLSearchParams();
      if (assignerId) q.set('assignerId', assignerId);
      if (patientId) q.set('patientId', String(patientId));
      const resp = await fetch(`/api/homework/summaries?${q.toString()}`, { credentials: 'include' });
      if (!resp.ok) {
        const text = await resp.text();
        console.error('Summaries API error', resp.status, text);
        setSummaries([]);
        setError(`Failed to load summaries: ${resp.status} ${text}`);
        return;
      }
      const data = await resp.json();
      const rows = Array.isArray(data?.summaries) ? data.summaries : [];
      setSummaries(rows);
      // If no summaries exist, fetch assigned homework as a fallback
      if (rows.length === 0 && patientId) {
        fetchHomeworks(patientId);
      }
    } catch (err) {
      console.error('Fetch summaries error', err);
      setSummaries([]);
      setError(err?.message || 'Error loading summaries');
    } finally { setLoadingSummaries(false); }
  };

  const fetchHomeworks = async (patientId) => {
    try {
      setLoadingHomeworks(true);
      const resp = await fetch(`/api/homework?patientId=${patientId}`, { credentials: 'include' });
      if (!resp.ok) {
        const text = await resp.text();
        console.error('Homeworks API error', resp.status, text);
        setHomeworks([]);
        return;
      }
      const data = await resp.json();
      setHomeworks(Array.isArray(data?.homeworks) ? data.homeworks : []);
    } catch (err) {
      console.error('Fetch homeworks error', err);
      setHomeworks([]);
    } finally {
      setLoadingHomeworks(false);
    }
  };

  const visibleSummaries = useMemo(() => summaries, [summaries]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-white">Homework Summaries</h2>
        <p className="text-slate-400">Completed and updated homework summaries for your patients.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-slate-700/30 rounded-xl border border-slate-600/30 p-4">
          <div className="mb-3">
            <input
              type="text"
              onChange={() => {}}
              placeholder="Search patient..."
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
              disabled
            />
          </div>

          <div className="max-h-[62vh] overflow-auto space-y-2">
            {patientsLoading ? (
              <p className="text-slate-400 text-sm">Loading patients...</p>
            ) : patients.length === 0 ? (
              <p className="text-slate-400 text-sm">No patients found.</p>
            ) : (
              patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'bg-cyan-600/20 border-cyan-500/40 text-white'
                      : 'bg-slate-800/40 border-slate-600/40 text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Patient ID: #{patient.id}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="xl:col-span-2 bg-slate-700/30 rounded-xl border border-slate-600/30 p-4">
          {!selectedPatient ? (
            <div className="text-slate-400 text-sm">Select a patient to view homework summaries.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedPatient.name}</h3>
                  <p className="text-xs text-slate-400">Patient ID: #{selectedPatient.id}</p>
                </div>
                <div>
                  <button
                    onClick={() => fetchSummaries(selectedPatient.id)}
                    disabled={loadingSummaries}
                    className="bg-slate-700/60 hover:bg-slate-700/80 text-white text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {error && <div className="text-red-300">{error}</div>}

              {loadingSummaries ? (
                <p className="text-slate-400 text-sm">Loading summaries...</p>
              ) : visibleSummaries.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm">No homework summaries found for this patient.</p>
                  <p className="text-slate-400 text-sm">Showing assigned homework for this patient instead (if any):</p>

                  {loadingHomeworks ? (
                    <p className="text-slate-400 text-sm">Loading assigned homework...</p>
                  ) : homeworks.length === 0 ? (
                    <p className="text-slate-400 text-sm">No assigned homework found for this patient.</p>
                  ) : (
                    <div className="space-y-2">
                      {homeworks.map(h => (
                        <div key={h.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{h.title || 'Untitled'}</div>
                              <div className="text-xs text-slate-400">Status: {h.status} • Created: {new Date(h.created_at || h.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          {h.transcript && <div className="text-slate-200 mt-2 text-sm">{h.transcript.slice(0, 300)}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-600/30 bg-slate-800/30 overflow-hidden">
                  <div className="max-h-[62vh] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-sm z-10">
                        <tr className="border-b border-slate-600/40">
                          <th className="text-left px-4 py-3 text-slate-300 font-semibold">Date</th>
                          <th className="text-left px-4 py-3 text-slate-300 font-semibold">Status</th>
                          <th className="text-left px-4 py-3 text-slate-300 font-semibold">Summary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleSummaries.map((s) => (
                          <tr key={s.id} className="border-b border-slate-700/50 align-top">
                            <td className="px-4 py-3 text-slate-200 whitespace-nowrap">{new Date(s.created_at || s.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-200 whitespace-nowrap">{s.status}</td>
                            <td className="px-4 py-3 text-slate-100 max-w-[520px]"><div className="whitespace-pre-wrap break-words">{s.summary}</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
