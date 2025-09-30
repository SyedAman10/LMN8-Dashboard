'use client';

import { useState, useEffect } from 'react';
import PatientDetailsModal from '@/components/modals/PatientDetailsModal';
import EditPatientModal from '@/components/modals/EditPatientModal';
import AddPatientModal from '@/components/modals/AddPatientModal';
import SuccessAlert from '@/components/ui/SuccessAlert';

export default function PatientsContent() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState({ isOpen: false, title: '', message: '' });

  // Fetch patients from database
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleStartSession = (patient) => {
    // In a real app, this would start a new session
    alert(`Starting new session with ${patient.name}`);
  };

  const handleAddPatient = () => {
    setShowAddPatient(true);
  };

  const handlePatientAdded = (newPatient, responseData) => {
    // Add the new patient to the list
    setPatients(prev => [newPatient, ...prev]);
    setShowAddPatient(false);
    
    // Show success message with response data
    let message = `${newPatient.name} has been successfully added to your patient database.`;
    
    if (responseData?.hasEmail) {
      const details = [];
      if (responseData.patientUserCreated) details.push('User account created');
      if (responseData.credentialsEmailSent) details.push('Login credentials sent');
      if (responseData.welcomeEmailSent) details.push('Welcome email sent');
      
      if (details.length > 0) {
        message += ` ${details.join(', ')}.`;
      }
    } else {
      message += " Note: No email provided - no user account or emails sent.";
    }
    
    setShowSuccessAlert({
      isOpen: true,
      title: "Patient Added Successfully!",
      message: message
    });
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
  };

  const handleSavePatient = (updatedPatient) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    setEditingPatient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 mx-auto mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-white/70">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold text-white">Patient Management</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Add Patient Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleAddPatient}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
        >
          + Add New Patient
        </button>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{patient.name}</div>
                  <div className="text-slate-400 text-sm">ID: #{patient.id}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400">Diagnosis:</span> {patient.diagnosis}
              </div>
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400">Therapist:</span> {patient.therapist}
              </div>
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400">Email:</span> {patient.email || 'N/A'}
              </div>
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400">Progress:</span> {patient.sessionsCompleted}/{patient.totalSessions} sessions
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                style={{ width: `${(patient.sessionsCompleted / patient.totalSessions) * 100}%` }}
              ></div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleViewPatient(patient)}
                className="bg-slate-600/50 hover:bg-slate-600/70 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => handleStartSession(patient)}
                className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-sm py-2 px-3 rounded transition-colors"
              >
                Start Session
              </button>
            </div>

            {/* Additional Actions */}
            <div className="mt-3 flex justify-center">
              <button 
                onClick={() => handleEditPatient(patient)}
                className="text-slate-400 hover:text-white text-xs transition-colors"
              >
                Edit Patient
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-white mb-2">No patients found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
          </p>
          <button 
            onClick={handleAddPatient}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Add New Patient
          </button>
        </div>
      )}

      {/* Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* Edit Patient Modal */}
      <EditPatientModal
        patient={editingPatient}
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        onSave={handleSavePatient}
      />

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        onSave={handlePatientAdded}
      />

      {/* Success Alert */}
      <SuccessAlert
        isOpen={showSuccessAlert.isOpen}
        onClose={() => setShowSuccessAlert({ isOpen: false, title: '', message: '' })}
        title={showSuccessAlert.title}
        message={showSuccessAlert.message}
        duration={4000}
      />
    </div>
  );
}
