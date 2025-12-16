'use client';

import { useState, useEffect } from 'react';

export default function DashboardContent({ onAddPatient, refreshTrigger }) {
  const [currentPhase, setCurrentPhase] = useState('preparation');
  const [dashboardStats, setDashboardStats] = useState({
    activePatients: 0,
    totalPatients: 0,
    sessionsToday: 0,
    completionRate: 0,
    recentPatients: [],
    patientsByStatus: {},
    avgSessionsCompleted: 0,
    avgTotalSessions: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardStats(data.stats);
        } else {
          console.error('Failed to fetch dashboard stats');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const clinicalMetrics = [
    {
      id: 'active-patients',
      title: 'Active Patients',
      description: 'Currently in treatment',
      status: 'active',
      progress: dashboardStats.totalPatients > 0 ? Math.round((dashboardStats.activePatients / dashboardStats.totalPatients) * 100) : 0,
      color: 'from-cyan-600 to-teal-600',
      icon: '👥',
      count: loading ? '...' : dashboardStats.activePatients.toString()
    },
    {
      id: 'sessions-today',
      title: 'Sessions Today',
      description: 'Scheduled appointments',
      status: 'upcoming',
      progress: 60,
      color: 'from-teal-600 to-cyan-700',
      icon: '🌊',
      count: loading ? '...' : dashboardStats.sessionsToday.toString()
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      description: 'Successful treatment outcomes',
      status: 'locked',
      progress: dashboardStats.completionRate,
      color: 'from-cyan-700 to-teal-800',
      icon: '📊',
      count: loading ? '...' : `${dashboardStats.completionRate}%`
    }
  ];

  const clinicalTools = [
    {
      title: 'Session Notes',
      description: 'Document patient sessions',
      icon: '📝',
      status: 'available'
    },
    {
      title: 'Treatment Plans',
      description: 'Create and manage protocols',
      icon: '📋',
      status: 'available'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor patient outcomes',
      icon: '📈',
      status: 'available'
    },
    {
      title: 'Assessment Tools',
      description: 'Clinical evaluation forms',
      icon: '🔍',
      status: 'available'
    }
  ];

  // Use recent patients data for recent sessions (mock session data for now)
  const recentSessions = dashboardStats.recentPatients.slice(0, 3).map(patient => ({
    date: new Date(patient.createdAt).toLocaleDateString(),
    patient: patient.name,
    duration: '45 min', // Mock duration
    status: 'completed',
    type: 'Therapeutic Session',
    progress: patient.progress
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-600/20 via-teal-600/20 to-cyan-600/20 rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back! 👋</h2>
            <p className="text-slate-300">Here's your clinical overview for today</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Today</p>
            <p className="text-2xl font-bold text-cyan-400">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Clinical Metrics Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Clinical Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {clinicalMetrics.map((metric, index) => (
            <div
              key={metric.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                metric.status === 'active'
                  ? 'bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : metric.status === 'upcoming'
                  ? 'bg-slate-700/40 border-slate-600/50 hover:border-cyan-500/30'
                  : 'bg-slate-800/40 border-slate-700/50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{metric.title}</h4>
                <p className="text-slate-300 text-sm mb-2">{metric.description}</p>
                <div className="text-2xl font-bold text-cyan-400 mb-3">{metric.count}</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                    style={{ width: `${metric.progress}%` }}
                  ></div>
                </div>
                <span className="text-cyan-400 text-sm font-medium">{metric.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Tools Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Clinical Tools</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {clinicalTools.map((tool, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                tool.status === 'available'
                  ? 'bg-slate-700/40 border-cyan-500/30 hover:border-cyan-400/50 cursor-pointer'
                  : 'bg-slate-800/40 border-slate-700/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h4 className="text-sm font-semibold text-white mb-1">{tool.title}</h4>
                <p className="text-slate-400 text-xs">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Sessions */}
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Recent Patients</h4>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="text-slate-400 mt-2">Loading patients...</p>
              </div>
            ) : recentSessions.length > 0 ? (
              recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{session.patient}</p>
                    <p className="text-slate-400 text-sm">{session.type} • {session.duration}</p>
                    <p className="text-slate-500 text-xs">{session.date}</p>
                    {session.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{session.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-teal-500 h-1 rounded-full transition-all duration-500"
                            style={{ width: `${session.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No patients yet</p>
                <p className="text-slate-500 text-sm">Add your first patient to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Quick Actions</h4>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="space-y-3">
            <button 
              onClick={onAddPatient}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              + Add New Patient
            </button>
            <button className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
              New Patient Session
            </button>
            <button className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
              View Patient Records
            </button>
            <button className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
              Clinical Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
