'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeworkSummariesContent() {
  const { user } = useAuth();
  const isCollege = user?.role === 'college';
  const personLabel = isCollege ? 'student' : 'patient';
  const personLabelTitle = isCollege ? 'Student' : 'Patient';
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('assigned');
  const [summaries, setSummaries] = useState([]);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [homeworks, setHomeworks] = useState([]);
  const [loadingHomeworks, setLoadingHomeworks] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchPeople(); }, [isCollege]);
  useEffect(() => { if (selectedPerson?.id) fetchData(selectedPerson.id); }, [selectedPerson?.id, statusFilter, isCollege]);

  const fetchPeople = async () => {
    try {
      setPeopleLoading(true);
      setError('');
      setSummaries([]);
      setHomeworks([]);
      const resp = await fetch(isCollege ? '/api/students' : '/api/patients', { credentials: 'include' });
      if (!resp.ok) {
        setPeople([]);
        setSelectedPerson(null);
        return;
      }
      const data = await resp.json();
      const list = Array.isArray(data?.students) ? data.students : Array.isArray(data?.patients) ? data.patients : [];
      setPeople(list);
      setSelectedPerson(prev => {
        if (prev && list.some(person => person.id === prev.id)) return prev;
        return list[0] || null;
      });
    } catch (err) {
      console.error(`Fetch ${personLabel}s error`, err);
      setPeople([]);
      setSelectedPerson(null);
    } finally {
      setPeopleLoading(false);
    }
  };

  const fetchData = async (personId) => {
    if (statusFilter === 'assigned') {
      setSummaries([]);
      await fetchHomeworks(personId);
      return;
    }
    await fetchSummaries(personId);
  };

  const fetchSummaries = async (personId) => {
    try {
      setLoadingSummaries(true);
      setError('');
      setHomeworks([]);
      const q = new URLSearchParams();
      q.set('status', statusFilter);
      if (isCollege) {
        q.set('studentId', String(personId));
      } else {
        q.set('patientId', String(personId));
      }
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
    } catch (err) {
      console.error('Fetch summaries error', err);
      setSummaries([]);
      setError(err?.message || 'Error loading summaries');
    } finally {
      setLoadingSummaries(false);
    }
  };

  const fetchHomeworks = async (personId) => {
    try {
      setLoadingHomeworks(true);
      setError('');
      const idParam = isCollege ? 'studentId' : 'patientId';
      const resp = await fetch(`/api/homework?${idParam}=${personId}`, { credentials: 'include' });
      if (!resp.ok) {
        const text = await resp.text();
        console.error('Homeworks API error', resp.status, text);
        setHomeworks([]);
        return;
      }
      const data = await resp.json();
      const rows = Array.isArray(data?.homeworks) ? data.homeworks : [];
      setHomeworks(rows.filter(h => !h.status || h.status === 'assigned'));
    } catch (err) {
      console.error('Fetch homeworks error', err);
      setHomeworks([]);
    } finally {
      setLoadingHomeworks(false);
    }
  };

  const filteredPeople = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return people;

    return people.filter((person) => {
      const searchableText = [person.name, person.email, person.id]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [people, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    if (selectedPerson && filteredPeople.some((person) => person.id === selectedPerson.id)) return;
    setSelectedPerson(filteredPeople[0] || null);
  }, [filteredPeople, searchTerm, selectedPerson]);

  const visibleSummaries = useMemo(() => summaries, [summaries]);
  const isLoading = loadingSummaries || loadingHomeworks;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-white">Homework Summaries</h2>
        <p className="text-slate-400">Pending, completed, and not understood homework for your {personLabel}s.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-slate-700/30 rounded-xl border border-slate-600/30 p-4">
          <div className="mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${personLabel}...`}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"

            />
          </div>

          <div className="max-h-[62vh] overflow-auto space-y-2">
            {peopleLoading ? (
              <p className="text-slate-400 text-sm">Loading {personLabel}s...</p>
            ) : filteredPeople.length === 0 ? (
              <p className="text-slate-400 text-sm">No {personLabel}s found.</p>
            ) : (
              filteredPeople.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPerson?.id === person.id
                      ? 'bg-cyan-600/20 border-cyan-500/40 text-white'
                      : 'bg-slate-800/40 border-slate-600/40 text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{personLabelTitle} ID: #{person.id}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="xl:col-span-2 bg-slate-700/30 rounded-xl border border-slate-600/30 p-4">
          {!selectedPerson ? (
            <div className="text-slate-400 text-sm">Select a {personLabel} to view homework summaries.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedPerson.name}</h3>
                  <p className="text-xs text-slate-400">{personLabelTitle} ID: #{selectedPerson.id}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex rounded-lg overflow-hidden border border-slate-600/50">
                    <button
                      onClick={() => setStatusFilter('assigned')}
                      className={`text-sm py-2 px-3 transition-colors ${statusFilter === 'assigned' ? 'bg-cyan-600/30 text-white' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setStatusFilter('completed')}
                      className={`text-sm py-2 px-3 transition-colors ${statusFilter === 'completed' ? 'bg-cyan-600/30 text-white' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'}`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setStatusFilter('not_understood')}
                      className={`text-sm py-2 px-3 transition-colors ${statusFilter === 'not_understood' ? 'bg-cyan-600/30 text-white' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'}`}
                    >
                      Not Understood
                    </button>
                  </div>
                  <button
                    onClick={() => fetchData(selectedPerson.id)}
                    disabled={isLoading}
                    className="bg-slate-700/60 hover:bg-slate-700/80 text-white text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {error && <div className="text-red-300">{error}</div>}

              {isLoading ? (
                <p className="text-slate-400 text-sm">Loading homework...</p>
              ) : statusFilter === 'assigned' ? (
                homeworks.length === 0 ? (
                  <p className="text-slate-400 text-sm">No pending homework found for this {personLabel}.</p>
                ) : (
                  <div className="space-y-2">
                    {homeworks.map(h => (
                      <div key={h.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="font-semibold text-white">{h.title || 'Untitled'}</div>
                        <div className="text-xs text-slate-400">Status: pending - Created: {new Date(h.created_at || h.createdAt).toLocaleString()}</div>
                        <div className="text-slate-200 mt-2 text-sm whitespace-pre-wrap">{h.type === 'text' ? h.content : (h.transcript || 'Voice homework')}</div>
                      </div>
                    ))}
                  </div>
                )
              ) : visibleSummaries.length === 0 ? (
                <p className="text-slate-400 text-sm">No {statusFilter === 'completed' ? 'completed' : 'not understood'} homework summaries found for this {personLabel}.</p>
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
