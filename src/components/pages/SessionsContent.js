'use client';

import { useState } from 'react';

export default function SessionsContent() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showNewSession, setShowNewSession] = useState(false);

  const sessions = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      type: 'Preparation',
      status: 'scheduled',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: 90,
      therapist: 'Dr. Jane Doe',
      notes: 'First preparation session - discussing expectations and safety protocols',
      location: 'Therapy Room A'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientId: 'P002',
      type: 'Therapeutic',
      status: 'in-progress',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: 180,
      therapist: 'Dr. Jane Doe',
      notes: 'Psychedelic-assisted therapy session - MDMA protocol',
      location: 'Therapy Room B'
    },
    {
      id: 3,
      patientName: 'Emily Rodriguez',
      patientId: 'P003',
      type: 'Integration',
      status: 'completed',
      date: '2024-01-14',
      time: '11:00 AM',
      duration: 60,
      therapist: 'Dr. Jane Doe',
      notes: 'Post-session integration - processing insights and setting intentions',
      location: 'Therapy Room A'
    },
    {
      id: 4,
      patientName: 'David Kim',
      patientId: 'P004',
      type: 'Preparation',
      status: 'cancelled',
      date: '2024-01-13',
      time: '3:00 PM',
      duration: 90,
      therapist: 'Dr. Jane Doe',
      notes: 'Patient cancelled due to illness - rescheduled for next week',
      location: 'Therapy Room B'
    },
    {
      id: 5,
      patientName: 'Lisa Thompson',
      patientId: 'P005',
      type: 'Therapeutic',
      status: 'scheduled',
      date: '2024-01-16',
      time: '9:00 AM',
      duration: 180,
      therapist: 'Dr. Jane Doe',
      notes: 'Second therapeutic session - ketamine-assisted therapy',
      location: 'Therapy Room A'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Preparation':
        return '🌱';
      case 'Therapeutic':
        return '🌊';
      case 'Integration':
        return '🦋';
      default:
        return '📋';
    }
  };

  const filteredSessions = sessions.filter(session => {
    switch (activeTab) {
      case 'upcoming':
        return session.status === 'scheduled';
      case 'in-progress':
        return session.status === 'in-progress';
      case 'completed':
        return session.status === 'completed';
      case 'cancelled':
        return session.status === 'cancelled';
      default:
        return true;
    }
  });

  const handleStartSession = (session) => {
    alert(`Starting session with ${session.patientName}`);
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
  };

  const handleEditSession = (session) => {
    alert(`Editing session with ${session.patientName}`);
  };

  const handleCancelSession = (session) => {
    alert(`Cancelling session with ${session.patientName}`);
  };

  const handleNewSession = () => {
    setShowNewSession(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-white">Therapeutic Sessions</h2>
          <p className="text-slate-400">Manage and track patient therapy sessions</p>
        </div>
        <button
          onClick={handleNewSession}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
        >
          + New Session
        </button>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Scheduled Today</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <div className="text-2xl">📅</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed This Week</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* Session Tabs */}
      <div className="bg-slate-700/30 rounded-xl p-1 border border-slate-600/30">
        <div className="flex space-x-1">
          {[
            { id: 'upcoming', label: 'Upcoming', count: sessions.filter(s => s.status === 'scheduled').length },
            { id: 'in-progress', label: 'In Progress', count: sessions.filter(s => s.status === 'in-progress').length },
            { id: 'completed', label: 'Completed', count: sessions.filter(s => s.status === 'completed').length },
            { id: 'cancelled', label: 'Cancelled', count: sessions.filter(s => s.status === 'cancelled').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No sessions found</h3>
            <p className="text-slate-400">No sessions match the current filter</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getTypeIcon(session.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{session.patientName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {session.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-slate-400">
                      <div className="flex items-center space-x-2">
                        <span>📅</span>
                        <span>{session.date} at {session.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>⏱️</span>
                        <span>{session.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>👩‍⚕️</span>
                        <span>{session.therapist}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📍</span>
                        <span>{session.location}</span>
                      </div>
                    </div>
                    {session.notes && (
                      <p className="text-slate-300 text-sm mt-2">{session.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {session.status === 'scheduled' && (
                    <button
                      onClick={() => handleStartSession(session)}
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Start Session
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(session)}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditSession(session)}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    Edit
                  </button>
                  {session.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancelSession(session)}
                      className="bg-red-600/50 hover:bg-red-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedSession(null)}
          />
          
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-white">Session Details</h2>
                  <p className="text-slate-300">{selectedSession.patientName} - {selectedSession.type} Session</p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-slate-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Session Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date & Time:</span>
                        <span className="text-white">{selectedSession.date} at {selectedSession.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-white">{selectedSession.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white">{selectedSession.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white">{selectedSession.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Patient Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name:</span>
                        <span className="text-white">{selectedSession.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Patient ID:</span>
                        <span className="text-white">{selectedSession.patientId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Therapist:</span>
                        <span className="text-white">{selectedSession.therapist}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSession.status)}`}>
                          {selectedSession.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Session Notes</h3>
                  <p className="text-slate-300">{selectedSession.notes}</p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Session Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedSession.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartSession(selectedSession)}
                        className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Start Session
                      </button>
                    )}
                    <button
                      onClick={() => handleEditSession(selectedSession)}
                      className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Edit Session
                    </button>
                    {selectedSession.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancelSession(selectedSession)}
                        className="bg-red-600/50 hover:bg-red-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Cancel Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
