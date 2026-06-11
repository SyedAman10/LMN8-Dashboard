'use client';

import { useState, useEffect } from 'react';

export default function ClinicDetailsModal({ isOpen, clinic, onClose, onDeactivate, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && clinic) {
      document.body.style.overflow = 'hidden';
      setFormData({
        name: clinic.name || '',
        address: clinic.address || '',
        city: clinic.city || '',
        state: clinic.state || '',
        zipCode: clinic.zipCode || '',
        phone: clinic.phone || '',
        email: clinic.email || '',
        website: clinic.website || ''
      });
      setEditing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, clinic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/clinics/${clinic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setEditing(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !clinic) return null;

  const staffCount = clinic.staff?.length || 0;
  const patientCount = clinic.patients?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{clinic.name}</h2>
              <p className="text-slate-300">{clinic.city}{clinic.state ? `, ${clinic.state}` : ''}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${clinic.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {clinic.status}
              </span>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl transition-colors">×</button>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 min-h-0 overflow-y-auto scrollbar-thin space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{staffCount}</div>
              <div className="text-slate-400 text-sm">Staff Members</div>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{patientCount}</div>
              <div className="text-slate-400 text-sm">Recent Patients</div>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{clinic.clinicianName || '—'}</div>
              <div className="text-slate-400 text-sm">Clinician</div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Clinic Details</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
              )}
            </div>
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Zip Code</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button onClick={handleSave} disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all disabled:opacity-50">
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white text-sm py-2 px-4">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400">Phone:</span> <span className="text-white">{clinic.phone || '—'}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-white">{clinic.email || '—'}</span></div>
                <div><span className="text-slate-400">Address:</span> <span className="text-white">{clinic.address || '—'}</span></div>
                <div><span className="text-slate-400">Website:</span> <span className="text-white">{clinic.website || '—'}</span></div>
                <div><span className="text-slate-400">Clinician Email:</span> <span className="text-white">{clinic.clinicianEmail || '—'}</span></div>
              </div>
            )}
          </div>

          {clinic.staff && clinic.staff.length > 0 && (
            <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Staff Members ({staffCount})</h3>
              <div className="space-y-2">
                {clinic.staff.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3">
                    <div>
                      <p className="text-white font-medium text-sm">{s.firstName} {s.lastName}</p>
                      <p className="text-slate-400 text-xs">{s.email} — {s.role}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {s.lastLogin ? `Last login: ${new Date(s.lastLogin).toLocaleDateString()}` : 'Never logged in'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {clinic.patients && clinic.patients.length > 0 && (
            <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Patients ({patientCount})</h3>
              <div className="space-y-2">
                {clinic.patients.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3">
                    <div>
                      <p className="text-white font-medium text-sm">{p.name}</p>
                      <p className="text-slate-400 text-xs">{p.diagnosis || '—'} — {p.therapist || 'No therapist'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {clinic.status === 'active' && (
            <div className="flex justify-end pt-2">
              <button onClick={() => onDeactivate(clinic.id)}
                className="text-red-400 hover:text-red-300 text-sm border border-red-400/30 hover:border-red-400/50 px-4 py-2 rounded-lg transition-all">
                Deactivate Clinic
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
