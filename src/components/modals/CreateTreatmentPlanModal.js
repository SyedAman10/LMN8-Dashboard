'use client';

import { useState, useEffect } from 'react';

export default function CreateTreatmentPlanModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    patientName: '',
    diagnosis: '',
    treatmentGoals: '',
    sessionFrequency: 'weekly',
    totalSessions: 12,
    sessionDuration: 60,
    therapeuticApproach: 'psychedelic-assisted',
    preparationSessions: 2,
    therapeuticSessions: 6,
    integrationSessions: 4,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    }
    
    if (!formData.treatmentGoals.trim()) {
      newErrors.treatmentGoals = 'Treatment goals are required';
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
      onSave(formData);
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      patientName: '',
      diagnosis: '',
      treatmentGoals: '',
      sessionFrequency: 'weekly',
      totalSessions: 12,
      sessionDuration: 60,
      therapeuticApproach: 'psychedelic-assisted',
      preparationSessions: 2,
      therapeuticSessions: 6,
      integrationSessions: 4,
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-white">Create Treatment Plan</h2>
              <p className="text-slate-300">Design a comprehensive treatment protocol</p>
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
            {/* Patient Information */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.patientName ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter patient name"
                  />
                  {errors.patientName && <p className="text-red-400 text-xs mt-1">{errors.patientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Primary Diagnosis *
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
                  {errors.diagnosis && <p className="text-red-400 text-xs mt-1">{errors.diagnosis}</p>}
                </div>
              </div>
            </div>

            {/* Treatment Goals */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Treatment Goals</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Treatment Goals *
                </label>
                <textarea
                  name="treatmentGoals"
                  value={formData.treatmentGoals}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none ${
                    errors.treatmentGoals ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                  }`}
                  placeholder="Describe the specific treatment goals and expected outcomes..."
                />
                {errors.treatmentGoals && <p className="text-red-400 text-xs mt-1">{errors.treatmentGoals}</p>}
              </div>
            </div>

            {/* Session Configuration */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Session Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Session Frequency
                  </label>
                  <select
                    name="sessionFrequency"
                    value={formData.sessionFrequency}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="as-needed">As Needed</option>
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
                  {errors.totalSessions && <p className="text-red-400 text-xs mt-1">{errors.totalSessions}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Session Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionDuration"
                    value={formData.sessionDuration}
                    onChange={handleInputChange}
                    min="30"
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Therapeutic Approach */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Therapeutic Approach</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Primary Approach
                  </label>
                  <select
                    name="therapeuticApproach"
                    value={formData.therapeuticApproach}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="psychedelic-assisted">Psychedelic-Assisted Therapy</option>
                    <option value="integration-focused">Integration-Focused Therapy</option>
                    <option value="trauma-informed">Trauma-Informed Therapy</option>
                    <option value="mindfulness-based">Mindfulness-Based Therapy</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Preparation Sessions
                    </label>
                    <input
                      type="number"
                      name="preparationSessions"
                      value={formData.preparationSessions}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Therapeutic Sessions
                    </label>
                    <input
                      type="number"
                      name="therapeuticSessions"
                      value={formData.therapeuticSessions}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Integration Sessions
                    </label>
                    <input
                      type="number"
                      name="integrationSessions"
                      value={formData.integrationSessions}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Treatment Plan Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none"
                  placeholder="Enter any additional notes about the treatment plan, special considerations, or protocols..."
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
              {isLoading ? 'Creating...' : 'Create Treatment Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
