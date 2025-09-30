'use client';

import { useState, useEffect } from 'react';

export default function AddPatientModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    diagnosis: '',
    medicalHistory: '',
    emergencyContact: '',
    emergencyPhone: '',
    therapist: 'Dr. Jane Doe',
    totalSessions: 12,
    notes: '',
    // New patient profile fields
    idol: '',
    personality: '',
    goals: '',
    challenges: '',
    communicationStyle: '',
    interests: '',
    values: '',
    supportNeeds: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Basic Information', icon: '👤' },
    { id: 2, title: 'Medical History', icon: '🏥' },
    { id: 3, title: 'Emergency Contact', icon: '📞' },
    { id: 4, title: 'Treatment Plan', icon: '📋' },
    { id: 5, title: 'Patient Profile', icon: '🎯' }
  ];

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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Patient name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (step === 2) {
      if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
      if (!formData.medicalHistory.trim()) newErrors.medicalHistory = 'Medical history is required';
    }
    
    if (step === 3) {
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
      if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
    }
    
    if (step === 4) {
      if (formData.totalSessions < 1) newErrors.totalSessions = 'Total sessions must be at least 1';
    }
    
    // Step 5 (Patient Profile) - all fields are optional, no validation needed
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < steps.length) {
      handleNext();
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the API to create the patient
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - call the onSave callback with the created patient and full response data
        onSave(data.patient, data);
        onClose();
        setCurrentStep(1);
        setFormData({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          diagnosis: '',
          medicalHistory: '',
          emergencyContact: '',
          emergencyPhone: '',
          therapist: 'Dr. Jane Doe',
          totalSessions: 12,
          notes: '',
          // Reset new patient profile fields
          idol: '',
          personality: '',
          goals: '',
          challenges: '',
          communicationStyle: '',
          interests: '',
          values: '',
          supportNeeds: ''
        });
      } else {
        // Show error message
        setErrors({ general: data.error || 'Failed to create patient' });
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      diagnosis: '',
      medicalHistory: '',
      emergencyContact: '',
      emergencyPhone: '',
      therapist: 'Dr. Jane Doe',
      totalSessions: 12,
      notes: '',
      // Reset new patient profile fields
      idol: '',
      personality: '',
      goals: '',
      challenges: '',
      communicationStyle: '',
      interests: '',
      values: '',
      supportNeeds: ''
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
              <h2 className="text-2xl font-playfair font-bold text-white">Add New Patient</h2>
              <p className="text-slate-300">Complete the patient onboarding process</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-slate-700/30 border-b border-slate-600/30 p-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-600 text-slate-400'
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-cyan-500' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.name ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.email ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.phone ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Medical History</h3>
              <div className="space-y-4">
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
                    placeholder="Enter primary diagnosis"
                  />
                  {errors.diagnosis && <p className="text-red-400 text-xs mt-1">{errors.diagnosis}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Medical History *
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none ${
                      errors.medicalHistory ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter detailed medical history, medications, allergies, etc."
                  />
                  {errors.medicalHistory && <p className="text-red-400 text-xs mt-1">{errors.medicalHistory}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.emergencyContact ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter emergency contact name"
                  />
                  {errors.emergencyContact && <p className="text-red-400 text-xs mt-1">{errors.emergencyContact}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${
                      errors.emergencyPhone ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'
                    }`}
                    placeholder="Enter emergency contact phone"
                  />
                  {errors.emergencyPhone && <p className="text-red-400 text-xs mt-1">{errors.emergencyPhone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Treatment Plan */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Treatment Plan</h3>
              <div className="space-y-4">
                <div>
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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Total Sessions Planned
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
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none"
                    placeholder="Enter any additional notes about the patient or treatment plan..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Patient Profile */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Patient Profile Questions</h3>
              <p className="text-slate-400 text-sm mb-6">
                These questions help create a personalized AI companion experience for the patient.
              </p>
              
              <div className="space-y-6">
                {/* Idol Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Who is your idol?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">Tell us about someone you admire and look up to</p>
                  <input
                    type="text"
                    name="idol"
                    value={formData.idol}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="e.g., Oprah Winfrey, Elon Musk, your grandmother..."
                  />
                </div>

                {/* Personality Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    How would you describe yourself?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">What are your key personality traits?</p>
                  <input
                    type="text"
                    name="personality"
                    value={formData.personality}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="e.g., creative, analytical, empathetic, determined..."
                  />
                </div>

                {/* Goals Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What are your main goals?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">What do you want to achieve in life?</p>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none"
                    placeholder="e.g., career success, better relationships, personal growth..."
                  />
                </div>

                {/* Challenges Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What challenges do you face?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">What obstacles are you currently dealing with?</p>
                  <textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none"
                    placeholder="e.g., anxiety, time management, self-doubt..."
                  />
                </div>

                {/* Communication Style Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    How do you prefer to communicate?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">What communication style works best for you?</p>
                  <input
                    type="text"
                    name="communicationStyle"
                    value={formData.communicationStyle}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="e.g., direct and honest, gentle and supportive, motivational..."
                  />
                </div>

                {/* Interests Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What are your interests?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">What topics and activities excite you?</p>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="e.g., art, technology, nature, music, sports..."
                  />
                </div>

                {/* Values Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What values are important to you?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">What principles guide your decisions?</p>
                  <input
                    type="text"
                    name="values"
                    value={formData.values}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="e.g., honesty, creativity, family, justice, growth..."
                  />
                </div>

                {/* Support Needs Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What kind of support do you need?
                  </label>
                  <p className="text-slate-400 text-xs mb-2">How can your AI companion best help you?</p>
                  <textarea
                    name="supportNeeds"
                    value={formData.supportNeeds}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none"
                    placeholder="e.g., motivation, accountability, emotional support, guidance..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* General Error Display */}
          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-4">
              {errors.general}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-600/30">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
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
                {isLoading ? 'Saving...' : currentStep === steps.length ? 'Complete Registration' : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
