'use client';

import { useEffect, useMemo, useState } from 'react';

const CLINICIAN_BASE_URL = 'https://lumenatehealth.com';
const SUMMARY_LIMIT = 100;

export default function SessionsContent() {
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [summariesLoading, setSummariesLoading] = useState(false);
  const [summariesError, setSummariesError] = useState('');
  const [summaryTypeFilter, setSummaryTypeFilter] = useState('all');
  const [isLegacyUnlinked, setIsLegacyUnlinked] = useState(false);
  const [linkingLegacyPatient, setLinkingLegacyPatient] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient?.id) {
      fetchPatientSummaries(selectedPatient.id);
    }
  }, [selectedPatient?.id]);

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      const response = await fetch('/api/patients', {
        credentials: 'include'
      });

      if (!response.ok) {
        setPatients([]);
        return;
      }

      const data = await response.json();
      const list = Array.isArray(data?.patients) ? data.patients : [];
      setPatients(list);
      if (list.length > 0) {
        setSelectedPatient((prev) => prev || list[0]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const normalizeSummary = (entry, fallbackType, index) => {
    const rawType = String(entry?.summaryType || entry?.tag || fallbackType || '').toLowerCase();
    const summaryType =
      rawType === 'journal' || rawType === 'journal_entry'
        ? 'journal_entry'
        : 'ai_conversation';

    return {
      id: String(entry?.id || entry?._id || `${summaryType}-${index}`),
      summaryType,
      summaryText: entry?.summaryText || entry?.summary || entry?.content || '',
      createdAt: entry?.createdAt || entry?.submittedAt || new Date().toISOString()
    };
  };

  const fetchByType = async (patientId, token, summaryType) => {
    const query = new URLSearchParams({
      summaryType,
      limit: String(SUMMARY_LIMIT),
      offset: '0'
    });

    const response = await fetch(
      `${CLINICIAN_BASE_URL}/api/backend/clinician/patients/${encodeURIComponent(patientId)}/shared-summaries?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  };

  const fetchPatientSummaries = async (patientId) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        setSummariesError('Missing auth token. Please sign in again.');
        setSummaries([]);
        return;
      }

      setSummariesLoading(true);
      setSummariesError('');
      setIsLegacyUnlinked(false);

      const [aiResponse, journalResponse] = await Promise.all([
        fetchByType(patientId, token, 'ai_conversation'),
        fetchByType(patientId, token, 'journal_entry')
      ]);

      if (aiResponse.status === 403 || journalResponse.status === 403) {
        setSummaries([]);
        setSummariesError('Patient is not linked to this clinician yet. Link the patient first.');
        await checkIfLegacyPatientUnlinked(patientId, token);
        return;
      }

      if (!aiResponse.ok || !journalResponse.ok) {
        setSummaries([]);
        setSummariesError('Failed to load patient summaries.');
        return;
      }

      const aiData = await aiResponse.json();
      const journalData = await journalResponse.json();

      const aiList = Array.isArray(aiData)
        ? aiData
        : Array.isArray(aiData?.summaries)
          ? aiData.summaries
          : Array.isArray(aiData?.data)
            ? aiData.data
            : [];
      const journalList = Array.isArray(journalData)
        ? journalData
        : Array.isArray(journalData?.summaries)
          ? journalData.summaries
          : Array.isArray(journalData?.data)
            ? journalData.data
            : [];

      const merged = [
        ...aiList.map((entry, index) => normalizeSummary(entry, 'ai_conversation', index)),
        ...journalList.map((entry, index) => normalizeSummary(entry, 'journal_entry', index))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setSummaries(merged);
    } catch (error) {
      console.error('Error fetching patient summaries:', error);
      setSummaries([]);
      setSummariesError('Error loading patient summaries.');
    } finally {
      setSummariesLoading(false);
    }
  };

  const checkIfLegacyPatientUnlinked = async (patientId, token) => {
    try {
      const query = new URLSearchParams({
        search: String(patientId),
        limit: '50',
        offset: '0'
      });

      const response = await fetch(
        `${CLINICIAN_BASE_URL}/api/backend/clinician/patients/unlinked?${query.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) return;
      const data = await response.json();
      const candidates = Array.isArray(data)
        ? data
        : Array.isArray(data?.patients)
          ? data.patients
          : Array.isArray(data?.data)
            ? data.data
            : [];

      const currentPatientId = String(patientId);
      const foundUnlinked = candidates.some((entry) => String(entry?.patientId || entry?.id) === currentPatientId);
      setIsLegacyUnlinked(foundUnlinked);
    } catch (error) {
      console.error('Error checking unlinked legacy patients:', error);
    }
  };

  const handleLinkLegacyPatient = async () => {
    try {
      if (!selectedPatient?.id) return;

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        setSummariesError('Missing auth token. Please sign in again.');
        return;
      }

      setLinkingLegacyPatient(true);
      const response = await fetch(
        `${CLINICIAN_BASE_URL}/api/backend/clinician/patients/${encodeURIComponent(selectedPatient.id)}/link`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const errorMessage =
          payload?.error?.message ||
          payload?.message ||
          `Failed to link patient (${response.status}).`;
        setSummariesError(errorMessage);
        return;
      }

      setIsLegacyUnlinked(false);
      setSummariesError('');
      await fetchPatientSummaries(selectedPatient.id);
    } catch (error) {
      console.error('Error linking legacy patient:', error);
      setSummariesError('Error linking patient.');
    } finally {
      setLinkingLegacyPatient(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const value = patientSearch.trim().toLowerCase();
    if (!value) return patients;
    return patients.filter((patient) => {
      return (
        String(patient?.name || '').toLowerCase().includes(value) ||
        String(patient?.id || '').toLowerCase().includes(value)
      );
    });
  }, [patients, patientSearch]);

  const visibleSummaries = useMemo(() => {
    if (summaryTypeFilter === 'all') {
      return summaries;
    }
    return summaries.filter((entry) => entry.summaryType === summaryTypeFilter);
  }, [summaries, summaryTypeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-white">Patient Summaries</h2>
        <p className="text-slate-400">Click a patient to view AI and Journal summaries by date.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-slate-700/30 rounded-xl border border-slate-600/30 p-4">
          <div className="mb-3">
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search patient..."
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
            />
          </div>

          <div className="max-h-[62vh] overflow-auto space-y-2">
            {patientsLoading ? (
              <p className="text-slate-400 text-sm">Loading patients...</p>
            ) : filteredPatients.length === 0 ? (
              <p className="text-slate-400 text-sm">No patients found.</p>
            ) : (
              filteredPatients.map((patient) => (
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
            <div className="text-slate-400 text-sm">Select a patient to view summaries.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedPatient.name}</h3>
                  <p className="text-xs text-slate-400">Patient ID: #{selectedPatient.id}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={summaryTypeFilter}
                    onChange={(e) => setSummaryTypeFilter(e.target.value)}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="ai_conversation">AI Conversation</option>
                    <option value="journal_entry">Journal Entry</option>
                  </select>
                  <button
                    onClick={() => fetchPatientSummaries(selectedPatient.id)}
                    disabled={summariesLoading}
                    className="bg-slate-700/60 hover:bg-slate-700/80 text-white text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {summariesError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span>{summariesError}</span>
                    {isLegacyUnlinked && (
                      <button
                        onClick={handleLinkLegacyPatient}
                        disabled={linkingLegacyPatient}
                        className="bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-100 border border-cyan-500/40 text-sm py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {linkingLegacyPatient ? 'Linking...' : 'Link Legacy Patient'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {summariesLoading ? (
                <p className="text-slate-400 text-sm">Loading summaries...</p>
              ) : visibleSummaries.length === 0 ? (
                <p className="text-slate-400 text-sm">No summaries found for this patient.</p>
              ) : (
                <div className="rounded-xl border border-slate-600/30 bg-slate-800/30 overflow-hidden">
                  <div className="max-h-[62vh] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-sm z-10">
                        <tr className="border-b border-slate-600/40">
                          <th className="text-left px-4 py-3 text-slate-300 font-semibold">Date</th>
                          <th className="text-left px-4 py-3 text-slate-300 font-semibold">Type</th>
                          <th className="text-left px-4 py-3 text-slate-300 font-semibold">Summary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleSummaries.map((entry) => (
                          <tr key={entry.id} className="border-b border-slate-700/50 align-top">
                            <td className="px-4 py-3 text-slate-200 whitespace-nowrap">
                              {new Date(entry.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  entry.summaryType === 'ai_conversation'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                }`}
                              >
                                {entry.summaryType === 'ai_conversation' ? 'AI Conversation Summary' : 'Journal Entry'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-100 max-w-[520px]">
                              <div
                                className="truncate whitespace-nowrap overflow-hidden"
                                title={entry.summaryText || 'No summary text available.'}
                              >
                                {entry.summaryText || 'No summary text available.'}
                              </div>
                            </td>
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
