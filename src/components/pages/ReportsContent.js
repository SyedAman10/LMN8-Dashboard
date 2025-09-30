'use client';

import { useState } from 'react';

export default function ReportsContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [showGenerateReport, setShowGenerateReport] = useState(false);

  const reports = [
    {
      id: 1,
      title: 'Monthly Clinical Summary',
      type: 'summary',
      category: 'clinical',
      description: 'Comprehensive overview of patient progress, session outcomes, and clinical metrics.',
      lastGenerated: '2024-01-15',
      frequency: 'Monthly',
      status: 'ready',
      data: {
        totalPatients: 24,
        activeSessions: 18,
        completedSessions: 156,
        successRate: 94.2,
        averageSessionDuration: 87,
        topDiagnoses: ['PTSD', 'Depression', 'Anxiety', 'Trauma'],
        patientSatisfaction: 4.8
      }
    },
    {
      id: 2,
      title: 'Patient Progress Report',
      type: 'progress',
      category: 'patient',
      description: 'Individual patient progress tracking and outcome measurements.',
      lastGenerated: '2024-01-14',
      frequency: 'Weekly',
      status: 'ready',
      data: {
        patientsTracked: 18,
        improvementRate: 89.3,
        averageProgressScore: 7.2,
        sessionsCompleted: 142,
        goalsAchieved: 67
      }
    },
    {
      id: 3,
      title: 'Safety & Compliance Report',
      type: 'safety',
      category: 'compliance',
      description: 'Safety incidents, compliance metrics, and protocol adherence tracking.',
      lastGenerated: '2024-01-13',
      frequency: 'Weekly',
      status: 'ready',
      data: {
        safetyIncidents: 0,
        complianceRate: 98.7,
        protocolViolations: 1,
        emergencyContacts: 0,
        safetyScore: 99.2
      }
    },
    {
      id: 4,
      title: 'Financial Performance',
      type: 'financial',
      category: 'business',
      description: 'Revenue, costs, and financial performance metrics for the practice.',
      lastGenerated: '2024-01-12',
      frequency: 'Monthly',
      status: 'ready',
      data: {
        monthlyRevenue: 45600,
        sessionRevenue: 38400,
        consultationRevenue: 7200,
        totalCosts: 28900,
        profitMargin: 36.6
      }
    },
    {
      id: 5,
      title: 'Therapeutic Outcomes Analysis',
      type: 'outcomes',
      category: 'clinical',
      description: 'Detailed analysis of therapeutic outcomes and treatment effectiveness.',
      lastGenerated: '2024-01-11',
      frequency: 'Monthly',
      status: 'generating',
      data: {
        totalOutcomes: 89,
        positiveOutcomes: 84,
        neutralOutcomes: 4,
        negativeOutcomes: 1,
        effectivenessRate: 94.4
      }
    },
    {
      id: 6,
      title: 'Integration Success Metrics',
      type: 'integration',
      category: 'clinical',
      description: 'Post-session integration success rates and patient follow-through.',
      lastGenerated: '2024-01-10',
      frequency: 'Weekly',
      status: 'ready',
      data: {
        integrationSessions: 45,
        successfulIntegrations: 42,
        followThroughRate: 93.3,
        averageIntegrationScore: 8.1,
        longTermRetention: 87.5
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'summary':
        return '📊';
      case 'progress':
        return '📈';
      case 'safety':
        return '🛡️';
      case 'financial':
        return '💰';
      case 'outcomes':
        return '🎯';
      case 'integration':
        return '🦋';
      default:
        return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'clinical':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'patient':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'compliance':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'business':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleGenerateReport = (report) => {
    alert(`Generating ${report.title}...`);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report) => {
    alert(`Downloading ${report.title}...`);
  };

  const handleScheduleReport = (report) => {
    alert(`Scheduling ${report.title}...`);
  };

  const handleNewReport = () => {
    setShowGenerateReport(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-white">Reports & Analytics</h2>
          <p className="text-slate-400">Clinical insights, performance metrics, and business analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button
            onClick={handleNewReport}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
          >
            + Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ready to View</p>
              <p className="text-2xl font-bold text-white">{reports.filter(r => r.status === 'ready').length}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Generating</p>
              <p className="text-2xl font-bold text-white">{reports.filter(r => r.status === 'generating').length}</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">98.5%</p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-slate-700/30 rounded-xl p-1 border border-slate-600/30">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', count: reports.length },
            { id: 'clinical', label: 'Clinical', count: reports.filter(r => r.category === 'clinical').length },
            { id: 'patient', label: 'Patient', count: reports.filter(r => r.category === 'patient').length },
            { id: 'compliance', label: 'Compliance', count: reports.filter(r => r.category === 'compliance').length },
            { id: 'business', label: 'Business', count: reports.filter(r => r.category === 'business').length }
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

      {/* Reports List */}
      <div className="space-y-4">
        {reports.filter(report => activeTab === 'overview' || report.category === activeTab).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No reports found</h3>
            <p className="text-slate-400">No reports match the current filter</p>
          </div>
        ) : (
          reports
            .filter(report => activeTab === 'overview' || report.category === activeTab)
            .map((report) => (
            <div
              key={report.id}
              className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl">{getTypeIcon(report.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(report.category)}`}>
                        {report.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{report.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <span>📅</span>
                        <span>Last: {report.lastGenerated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🔄</span>
                        <span>Freq: {report.frequency}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📊</span>
                        <span>Type: {report.type}</span>
                      </div>
                    </div>
                    
                    {/* Key Metrics Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {Object.entries(report.data).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="bg-slate-800/50 rounded-lg p-2">
                          <div className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div className="text-white font-semibold">
                            {typeof value === 'number' && value > 1000 
                              ? `${(value / 1000).toFixed(1)}k` 
                              : value
                            }
                            {key.includes('Rate') || key.includes('Score') ? '%' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {report.status === 'ready' && (
                    <button
                      onClick={() => handleViewReport(report)}
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      View Report
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleScheduleReport(report)}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    Schedule
                  </button>
                  {report.status === 'generating' && (
                    <button
                      onClick={() => handleGenerateReport(report)}
                      className="bg-yellow-600/50 hover:bg-yellow-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Generate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getTypeIcon(selectedReport.type)}</div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-white">{selectedReport.title}</h2>
                    <p className="text-slate-300">{selectedReport.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="space-y-6">
                {/* Report Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Report Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white">{selectedReport.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Category:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedReport.category)}`}>
                          {selectedReport.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Frequency:</span>
                        <span className="text-white">{selectedReport.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Generated:</span>
                        <span className="text-white">{selectedReport.lastGenerated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Key Metrics</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedReport.data).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-white font-semibold">
                            {typeof value === 'number' && value > 1000 
                              ? `${(value / 1000).toFixed(1)}k` 
                              : value
                            }
                            {key.includes('Rate') || key.includes('Score') ? '%' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleViewReport(selectedReport)}
                        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                      >
                        View Full Report
                      </button>
                      <button
                        onClick={() => handleDownloadReport(selectedReport)}
                        className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                      >
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleScheduleReport(selectedReport)}
                        className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                      >
                        Schedule Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Detailed Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(selectedReport.data).map(([key, value]) => (
                      <div key={key} className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-slate-400 text-sm capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-white font-bold text-lg">
                          {typeof value === 'number' && value > 1000 
                            ? `${(value / 1000).toFixed(1)}k` 
                            : value
                          }
                          {key.includes('Rate') || key.includes('Score') ? '%' : ''}
                        </div>
                      </div>
                    ))}
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
