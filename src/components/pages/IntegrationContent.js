'use client';

import { useState } from 'react';

export default function IntegrationContent() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showNewIntegration, setShowNewIntegration] = useState(false);

  const integrations = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      sessionId: 'S001',
      sessionDate: '2024-01-14',
      sessionType: 'Therapeutic',
      status: 'pending',
      priority: 'high',
      insights: 'Patient reported breakthrough in understanding childhood trauma patterns. Expressed deep gratitude and renewed sense of purpose.',
      nextSteps: 'Schedule follow-up integration session. Provide journaling prompts for continued reflection.',
      assignedTo: 'Dr. Jane Doe',
      dueDate: '2024-01-16',
      createdAt: '2024-01-14',
      notes: 'Patient showed significant emotional release during session. Recommended gentle integration approach.'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientId: 'P002',
      sessionId: 'S002',
      sessionDate: '2024-01-13',
      sessionType: 'Therapeutic',
      status: 'in-progress',
      priority: 'medium',
      insights: 'Patient experienced profound connection with nature and reported feeling "one with everything". Discussed ecological consciousness and environmental responsibility.',
      nextSteps: 'Continue nature-based integration activities. Explore environmental volunteer opportunities.',
      assignedTo: 'Dr. Jane Doe',
      dueDate: '2024-01-15',
      createdAt: '2024-01-13',
      notes: 'Patient requested additional resources on environmental activism and sustainable living.'
    },
    {
      id: 3,
      patientName: 'Emily Rodriguez',
      patientId: 'P003',
      sessionId: 'S003',
      sessionDate: '2024-01-12',
      sessionType: 'Integration',
      status: 'completed',
      priority: 'low',
      insights: 'Patient successfully integrated previous session insights into daily life. Reported improved relationships and better emotional regulation.',
      nextSteps: 'Continue current integration practices. Schedule next therapeutic session in 2 weeks.',
      assignedTo: 'Dr. Jane Doe',
      dueDate: '2024-01-14',
      createdAt: '2024-01-12',
      notes: 'Patient demonstrated excellent integration skills. Ready for next phase of treatment.'
    },
    {
      id: 4,
      patientName: 'David Kim',
      patientId: 'P004',
      sessionId: 'S004',
      sessionDate: '2024-01-11',
      sessionType: 'Therapeutic',
      status: 'pending',
      priority: 'high',
      insights: 'Patient confronted deep-seated fear of abandonment. Experienced intense emotional release and reported feeling "lighter" afterward.',
      nextSteps: 'Provide additional support resources. Schedule weekly check-ins for next month.',
      assignedTo: 'Dr. Jane Doe',
      dueDate: '2024-01-13',
      createdAt: '2024-01-11',
      notes: 'Patient may need extra support during integration phase. Monitor closely for any distress.'
    },
    {
      id: 5,
      patientName: 'Lisa Thompson',
      patientId: 'P005',
      sessionId: 'S005',
      sessionDate: '2024-01-10',
      sessionType: 'Therapeutic',
      status: 'in-progress',
      priority: 'medium',
      insights: 'Patient discovered new perspective on work-life balance. Realized need to prioritize personal relationships over career advancement.',
      nextSteps: 'Support patient in implementing work-life balance changes. Provide resources on boundary setting.',
      assignedTo: 'Dr. Jane Doe',
      dueDate: '2024-01-12',
      createdAt: '2024-01-10',
      notes: 'Patient is motivated to make changes but may need practical guidance on implementation.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'Therapeutic':
        return '🌊';
      case 'Integration':
        return '🦋';
      case 'Preparation':
        return '🌱';
      default:
        return '📋';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    switch (activeTab) {
      case 'pending':
        return integration.status === 'pending';
      case 'in-progress':
        return integration.status === 'in-progress';
      case 'completed':
        return integration.status === 'completed';
      case 'overdue':
        return integration.status === 'overdue';
      default:
        return true;
    }
  });

  const handleStartIntegration = (integration) => {
    alert(`Starting integration work for ${integration.patientName}`);
  };

  const handleViewDetails = (integration) => {
    setSelectedIntegration(integration);
  };

  const handleEditIntegration = (integration) => {
    alert(`Editing integration for ${integration.patientName}`);
  };

  const handleCompleteIntegration = (integration) => {
    alert(`Marking integration as completed for ${integration.patientName}`);
  };

  const handleNewIntegration = () => {
    setShowNewIntegration(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-white">Post-Session Integration</h2>
          <p className="text-slate-400">Process and integrate therapeutic session insights</p>
        </div>
        <button
          onClick={handleNewIntegration}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
        >
          + New Integration
        </button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <div className="text-2xl">🔄</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">96%</p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* Integration Tabs */}
      <div className="bg-slate-700/30 rounded-xl p-1 border border-slate-600/30">
        <div className="flex space-x-1">
          {[
            { id: 'pending', label: 'Pending', count: integrations.filter(i => i.status === 'pending').length },
            { id: 'in-progress', label: 'In Progress', count: integrations.filter(i => i.status === 'in-progress').length },
            { id: 'completed', label: 'Completed', count: integrations.filter(i => i.status === 'completed').length },
            { id: 'overdue', label: 'Overdue', count: integrations.filter(i => i.status === 'overdue').length }
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

      {/* Integrations List */}
      <div className="space-y-4">
        {filteredIntegrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No integrations found</h3>
            <p className="text-slate-400">No integrations match the current filter</p>
          </div>
        ) : (
          filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl">{getSessionTypeIcon(integration.sessionType)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{integration.patientName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                        {integration.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(integration.priority)}`}>
                        {integration.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-slate-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <span>📅</span>
                        <span>Session: {integration.sessionDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>⏰</span>
                        <span>Due: {integration.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>👩‍⚕️</span>
                        <span>{integration.assignedTo}</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Key Insights:</h4>
                      <p className="text-slate-300 text-sm">{integration.insights}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Next Steps:</h4>
                      <p className="text-slate-300 text-sm">{integration.nextSteps}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {integration.status === 'pending' && (
                    <button
                      onClick={() => handleStartIntegration(integration)}
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Start Integration
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(integration)}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditIntegration(integration)}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    Edit
                  </button>
                  {integration.status === 'in-progress' && (
                    <button
                      onClick={() => handleCompleteIntegration(integration)}
                      className="bg-green-600/50 hover:bg-green-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Integration Details Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedIntegration(null)}
          />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-white">Integration Details</h2>
                  <p className="text-slate-300">{selectedIntegration.patientName} - {selectedIntegration.sessionType} Session</p>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="text-slate-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="space-y-6">
                {/* Session Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Session Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Session Date:</span>
                        <span className="text-white">{selectedIntegration.sessionDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Session Type:</span>
                        <span className="text-white">{selectedIntegration.sessionType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Session ID:</span>
                        <span className="text-white">{selectedIntegration.sessionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedIntegration.status)}`}>
                          {selectedIntegration.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Integration Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Patient:</span>
                        <span className="text-white">{selectedIntegration.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Patient ID:</span>
                        <span className="text-white">{selectedIntegration.patientId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assigned To:</span>
                        <span className="text-white">{selectedIntegration.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Due Date:</span>
                        <span className="text-white">{selectedIntegration.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Key Insights</h3>
                  <p className="text-slate-300">{selectedIntegration.insights}</p>
                </div>

                {/* Next Steps */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
                  <p className="text-slate-300">{selectedIntegration.nextSteps}</p>
                </div>

                {/* Additional Notes */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Additional Notes</h3>
                  <p className="text-slate-300">{selectedIntegration.notes}</p>
                </div>

                {/* Integration Actions */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Integration Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedIntegration.status === 'pending' && (
                      <button
                        onClick={() => handleStartIntegration(selectedIntegration)}
                        className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Start Integration
                      </button>
                    )}
                    <button
                      onClick={() => handleEditIntegration(selectedIntegration)}
                      className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Edit Integration
                    </button>
                    {selectedIntegration.status === 'in-progress' && (
                      <button
                        onClick={() => handleCompleteIntegration(selectedIntegration)}
                        className="bg-green-600/50 hover:bg-green-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Mark Complete
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
