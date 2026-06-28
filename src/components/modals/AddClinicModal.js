'use client';

import { useState, useEffect } from 'react';

export default function AddClinicModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    patientGreetingName: '',
    showCommunity: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData({
        name: '', address: '', city: '', state: '', zipCode: '',
        phone: '', email: '', website: '', patientGreetingName: '',
        showCommunity: true
      });
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Clinic name is required';
    if (!formData.email.trim()) newErrors.email = 'Clinic email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        onSave(data.clinic, data);
        onClose();
      } else {
        setErrors({ general: data.error || 'Failed to create clinic' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Clinic</h2>
              <p className="text-slate-300">Create a clinic with a clinician account</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl transition-colors">×</button>
          </div>
        </div>

        <div className="p-6 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Clinic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Clinic Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${errors.name ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'}`}
                  placeholder="Enter clinic name" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Patient Greeting Name</label>
                <input type="text" name="patientGreetingName" value={formData.patientGreetingName} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="e.g., Seekers, Warriors, Healers" />
                <p className="text-slate-400 text-xs mt-1">How will this clinic refer to its patients?</p>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="showCommunity" checked={formData.showCommunity} onChange={(e) => setFormData(prev => ({ ...prev, showCommunity: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500" />
                  <span className="text-sm font-medium text-slate-300">Show Community</span>
                </label>
                <p className="text-slate-400 text-xs mt-1 ml-8">Patients under this clinic will see the community feature in the app.</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="Enter street address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Zip Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="Zip code" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="Phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Clinic Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white placeholder-slate-400 ${errors.email ? 'border-red-500' : 'border-slate-600/50 focus:border-cyan-500'}`}
                  placeholder="clinic@example.com" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                <input type="text" name="website" value={formData.website} onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  placeholder="Website URL" />
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mt-4">{errors.general}</div>
          )}
        </div>

        <div className="flex justify-between p-6 pt-4 border-t border-slate-600/30 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-6 py-2 text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={isLoading}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed">
            {isLoading ? 'Creating...' : 'Create Clinic'}
          </button>
        </div>
      </div>
    </div>
  );
}
