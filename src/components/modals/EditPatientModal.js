'use client';

import { useState, useEffect } from 'react';

export default function EditPatientModal({ patient, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    diagnosis: '',
    status: 'active',
    totalSessions: 12,
    therapist: 'Dr. Jane Doe',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      setFormData({
        name: patient.name || '',
        diagnosis: patient.diagnosis || '',
        status: patient.status || 'active',
        totalSessions: patient.totalSessions || 12,
        therapist: patient.therapist || 'Dr. Jane Doe',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen, patient]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }
    
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    }
    
    if (formData.totalSessions < 1) {
      newErrors.totalSessions = 'Total sessions must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSave({ ...patient, ...formData });
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      name: patient?.name || '',
      diagnosis: patient?.diagnosis || '',
      status: patient?.status || 'active',
      totalSessions: patient?.totalSessions || 12,
      therapist: patient?.therapist || 'Dr. Jane Doe',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-playfair font-bold text-white">Edit Patient</h2>
                <p className="text-slate-300">Update patient information</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.name ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter patient name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Diagnosis *
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.diagnosis ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter diagnosis"
                  />
                  {errors.diagnosis && (
                    <p className="text-red-400 text-xs mt-1">{errors.diagnosis}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Treatment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Total Sessions
                  </label>
                  <input
                    type="number"
                    name="totalSessions"
                    value={formData.totalSessions}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white ${
                      errors.totalSessions ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                  />
                  {errors.totalSessions && (
                    <p className="text-red-400 text-xs mt-1">{errors.totalSessions}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Assigned Therapist
                </label>
                <input
                  type="text"
                  name="therapist"
                  value={formData.therapist}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="Enter therapist name"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Clinical Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none"
                  placeholder="Enter any additional notes about the patient..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-600/30">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
