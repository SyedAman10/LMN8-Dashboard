'use client';

import { useState, useEffect } from 'react';

export default function PatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !patient) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sessions', label: 'Sessions', icon: '🌊' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'documents', label: 'Documents', icon: '📄' }
  ];

  const sessionHistory = [
    { date: '2024-01-15', type: 'Preparation', duration: '45 min', status: 'completed', notes: 'Initial assessment completed' },
    { date: '2024-01-12', type: 'Therapeutic', duration: '2 hours', status: 'completed', notes: 'Breakthrough session' },
    { date: '2024-01-10', type: 'Integration', duration: '30 min', status: 'completed', notes: 'Processing insights' },
    { date: '2024-01-08', type: 'Preparation', duration: '60 min', status: 'completed', notes: 'Setting intentions' }
  ];

  const clinicalNotes = [
    { date: '2024-01-15', author: 'Dr. Jane Doe', note: 'Patient showed significant progress in managing anxiety symptoms. Recommended continued therapy.' },
    { date: '2024-01-12', author: 'Dr. Jane Doe', note: 'Breakthrough moment during session. Patient expressed deep insights about past trauma.' },
    { date: '2024-01-10', author: 'Dr. Jane Doe', note: 'Patient struggling with integration. Provided additional grounding techniques.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold text-white">{patient.name}</h2>
                <p className="text-slate-300">Patient ID: #{patient.id}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(patient.status)}`}>
                  {patient.status.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-700/30 border-b border-slate-600/30">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-600/30'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diagnosis:</span>
                      <span className="text-white">{patient.diagnosis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Therapist:</span>
                      <span className="text-white">{patient.therapist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Session:</span>
                      <span className="text-white">{patient.lastSession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Session:</span>
                      <span className="text-white">{patient.nextSession}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Treatment Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Sessions Completed</span>
                        <span className="text-white">{patient.sessionsCompleted}/{patient.totalSessions}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                          style={{ width: `${patient.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-cyan-400">{patient.progress}%</span>
                      <p className="text-slate-400 text-sm">Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 py-2 px-4 rounded-lg transition-colors">
                    Start Session
                  </button>
                  <button className="bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 px-4 rounded-lg transition-colors">
                    Add Note
                  </button>
                  <button className="bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 px-4 rounded-lg transition-colors">
                    Schedule
                  </button>
                  <button className="bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 px-4 rounded-lg transition-colors">
                    Edit Patient
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Session History</h3>
              {sessionHistory.map((session, index) => (
                <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌊</span>
                      <div>
                        <h4 className="text-white font-semibold">{session.type} Session</h4>
                        <p className="text-slate-400 text-sm">{session.date} • {session.duration}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{session.notes}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Clinical Notes</h3>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors">
                  Add Note
                </button>
              </div>
              {clinicalNotes.map((note, index) => (
                <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{note.date}</span>
                    <span className="text-slate-400 text-sm">{note.author}</span>
                  </div>
                  <p className="text-white">{note.note}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Documents</h3>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors">
                  Upload Document
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <h4 className="text-white font-semibold">Consent Form</h4>
                      <p className="text-slate-400 text-sm">Signed 2024-01-01</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <h4 className="text-white font-semibold">Medical History</h4>
                      <p className="text-slate-400 text-sm">Updated 2024-01-05</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
