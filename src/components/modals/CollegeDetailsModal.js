'use client';

import { useState, useEffect } from 'react';

export default function CollegeDetailsModal({ isOpen, college, onClose, onDeactivate, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && college) {
      document.body.style.overflow = 'hidden';
      setFormData({
        name: college.name || '',
        address: college.address || '',
        city: college.city || '',
        state: college.state || '',
        zipCode: college.zipCode || '',
        phone: college.phone || '',
        email: college.email || '',
        website: college.website || '',
        studentGreetingName: college.studentGreetingName || ''
      });
      setEditing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, college]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/colleges/${college.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, ...data.college }));
        setEditing(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating college:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !college) return null;

  const studentCount = college.students?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{college.name}</h2>
              <p className="text-slate-300">{college.city}{college.state ? `, ${college.state}` : ''}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${college.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {college.status}
              </span>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl transition-colors">×</button>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 min-h-0 overflow-y-auto scrollbar-thin space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{studentCount}</div>
              <div className="text-slate-400 text-sm">Students</div>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{college.collegeUserName || '—'}</div>
              <div className="text-slate-400 text-sm">Contact</div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">College Details</h3>
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
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Student Greeting Name</label>
                    <input type="text" name="studentGreetingName" value={formData.studentGreetingName} onChange={handleInputChange}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="e.g., Scholars, Learners, Members" />
                    <p className="text-slate-300 text-xs mt-1">How will this college refer to its students?</p>
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
                <div><span className="text-slate-400">Phone:</span> <span className="text-white">{college.phone || '—'}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-white">{college.email || '—'}</span></div>
                <div><span className="text-slate-400">Address:</span> <span className="text-white">{college.address || '—'}</span></div>
                <div><span className="text-slate-400">Website:</span> <span className="text-white">{college.website || '—'}</span></div>
                <div><span className="text-slate-400">Contact Email:</span> <span className="text-white">{college.collegeUserEmail || '—'}</span></div>
                <div><span className="text-slate-400">Student Greeting:</span> <span className="text-white">{formData.studentGreetingName ? `Dear ${formData.studentGreetingName}` : '—'}</span></div>
              </div>
            )}
          </div>

          {college.students && college.students.length > 0 && (
            <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Students ({studentCount})</h3>
              <div className="space-y-2">
                {college.students.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3">
                    <div>
                      <p className="text-white font-medium text-sm">{s.name}</p>
                      <p className="text-slate-400 text-xs">{s.program || '—'} — {s.email || 'No email'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {college.status === 'active' && (
            <div className="flex justify-end pt-2">
              <button onClick={() => onDeactivate(college.id)}
                className="text-red-400 hover:text-red-300 text-sm border border-red-400/30 hover:border-red-400/50 px-4 py-2 rounded-lg transition-all">
                Deactivate College
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
