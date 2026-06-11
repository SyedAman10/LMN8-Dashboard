'use client';

import { useState, useEffect } from 'react';
import AddClinicModal from '@/components/modals/AddClinicModal';
import ClinicDetailsModal from '@/components/modals/ClinicDetailsModal';
import SuccessAlert from '@/components/ui/SuccessAlert';

export default function ClinicsContent() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClinic, setShowAddClinic] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/clinics', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setClinics(data.clinics);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClinics = clinics.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.clinicianName && c.clinicianName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClinic = (newClinic, responseData) => {
    let message = `${newClinic.name} has been created successfully.`;
    if (responseData?.emailSent) {
      message += ' Login credentials sent to clinician email.';
    } else if (responseData?.emailError) {
      message += ` Clinician created but email failed: ${responseData.emailError}`;
    }
    setShowSuccessAlert({ isOpen: true, title: 'Clinic Created!', message });
    fetchClinics();
  };

  const handleViewDetails = async (clinic) => {
    try {
      const response = await fetch(`/api/admin/clinics/${clinic.id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSelectedClinic({ ...data.clinic, staff: data.staff, patients: data.patients });
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching clinic details:', error);
    }
  };

  const handleDeactivate = async (clinicId) => {
    if (!confirm('Are you sure you want to deactivate this clinic? This will also deactivate the clinician account.')) return;
    try {
      const response = await fetch(`/api/admin/clinics/${clinicId}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        setShowSuccessAlert({ isOpen: true, title: 'Clinic Deactivated', message: 'Clinic has been deactivated successfully.' });
        fetchClinics();
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error deactivating clinic:', error);
    }
  };

  const activeClinics = filteredClinics.filter(c => c.status === 'active');
  const inactiveClinics = filteredClinics.filter(c => c.status !== 'active');

  const renderClinicCard = (clinic) => (
    <div key={clinic.id} className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30 hover:border-cyan-500/40 transition-all cursor-pointer" onClick={() => handleViewDetails(clinic)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold text-white">{clinic.name}</h4>
          {clinic.clinicianName && (
            <p className="text-slate-400 text-sm mt-1">
              <span className="text-cyan-400">Clinician:</span> {clinic.clinicianName}
            </p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${clinic.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {clinic.status}
        </span>
      </div>
      {clinic.city && <p className="text-slate-400 text-sm">{clinic.city}{clinic.state ? `, ${clinic.state}` : ''}</p>}
      {clinic.clinicianEmail && <p className="text-slate-500 text-xs mt-1">{clinic.clinicianEmail}</p>}
      <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-600/20">
        <span className="text-slate-400 text-xs"><span className="text-white font-medium">{clinic.staffCount}</span> Staff</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-screen">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input type="text" placeholder="Search clinics by name, clinician, or city..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50" />
        </div>
        <button onClick={() => setShowAddClinic(true)}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105">
          + Add Clinic
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-400 mt-3">Loading clinics...</p>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="text-center py-12 bg-slate-700/20 rounded-2xl">
          <p className="text-slate-400 text-lg">No clinics found</p>
          <p className="text-slate-500 text-sm mt-1">Create your first clinic to get started</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeClinics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Active Clinics ({activeClinics.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeClinics.map(renderClinicCard)}
              </div>
            </div>
          )}
          {inactiveClinics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-400 mb-4">Inactive Clinics ({inactiveClinics.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {inactiveClinics.map(renderClinicCard)}
              </div>
            </div>
          )}
        </div>
      )}

      <AddClinicModal isOpen={showAddClinic} onClose={() => setShowAddClinic(false)} onSave={handleAddClinic} />
      <ClinicDetailsModal isOpen={showDetails} clinic={selectedClinic} onClose={() => { setShowDetails(false); setSelectedClinic(null); }}
        onDeactivate={handleDeactivate} onRefresh={fetchClinics} />
      <SuccessAlert isOpen={showSuccessAlert.isOpen}
        onClose={() => setShowSuccessAlert({ isOpen: false, title: '', message: '' })}
        title={showSuccessAlert.title} message={showSuccessAlert.message} duration={4000} />
    </div>
  );
}
