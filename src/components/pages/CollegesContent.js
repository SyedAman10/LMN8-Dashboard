'use client';

import { useState, useEffect } from 'react';
import AddCollegeModal from '@/components/modals/AddCollegeModal';
import CollegeDetailsModal from '@/components/modals/CollegeDetailsModal';
import SuccessAlert from '@/components/ui/SuccessAlert';

export default function CollegesContent() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/colleges', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setColleges(data.colleges);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.collegeUserName && c.collegeUserName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCollege = (newCollege, responseData) => {
    let message = `${newCollege.name} has been created successfully.`;
    if (responseData?.emailSent) {
      message += ' Login credentials sent to college email.';
    } else if (responseData?.emailError) {
      message += ` College created but email failed: ${responseData.emailError}`;
    }
    setShowSuccessAlert({ isOpen: true, title: 'College Created!', message });
    fetchColleges();
  };

  const handleViewDetails = async (college) => {
    try {
      const response = await fetch(`/api/admin/colleges/${college.id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSelectedCollege({ ...data.college, students: data.students });
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching college details:', error);
    }
  };

  const handleRefresh = async () => {
    await fetchColleges();
    if (selectedCollege?.id) {
      try {
        const response = await fetch(`/api/admin/colleges/${selectedCollege.id}`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSelectedCollege({ ...data.college, students: data.students });
        }
      } catch (error) {
        console.error('Error refreshing college details:', error);
      }
    }
  };

  const handleDeactivate = async (collegeId) => {
    if (!confirm('Are you sure you want to deactivate this college? This will also deactivate the college account.')) return;
    try {
      const response = await fetch(`/api/admin/colleges/${collegeId}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        setShowSuccessAlert({ isOpen: true, title: 'College Deactivated', message: 'College has been deactivated successfully.' });
        fetchColleges();
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error deactivating college:', error);
    }
  };

  const activeColleges = filteredColleges.filter(c => c.status === 'active');
  const inactiveColleges = filteredColleges.filter(c => c.status !== 'active');

  const renderCollegeCard = (college) => (
    <div key={college.id} className="bg-slate-700/30 rounded-2xl p-5 border border-slate-600/30 hover:border-cyan-500/40 transition-all cursor-pointer" onClick={() => handleViewDetails(college)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold text-white">{college.name}</h4>
          {college.collegeUserName && (
            <p className="text-slate-400 text-sm mt-1">
              <span className="text-cyan-400">Contact:</span> {college.collegeUserName}
            </p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${college.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {college.status}
        </span>
      </div>
      {college.city && <p className="text-slate-400 text-sm">{college.city}{college.state ? `, ${college.state}` : ''}</p>}
      {college.collegeUserEmail && <p className="text-slate-500 text-xs mt-1">{college.collegeUserEmail}</p>}
      <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-600/20">
        <span className="text-slate-400 text-xs"><span className="text-white font-medium">{college.studentCount}</span> Students</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-screen">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input type="text" placeholder="Search colleges by name, contact, or city..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50" />
        </div>
        <button onClick={() => setShowAddCollege(true)}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105">
          + Add College
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-400 mt-3">Loading colleges...</p>
        </div>
      ) : filteredColleges.length === 0 ? (
        <div className="text-center py-12 bg-slate-700/20 rounded-2xl">
          <p className="text-slate-400 text-lg">No colleges found</p>
          <p className="text-slate-500 text-sm mt-1">Create your first college to get started</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeColleges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Active Colleges ({activeColleges.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeColleges.map(renderCollegeCard)}
              </div>
            </div>
          )}
          {inactiveColleges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-400 mb-4">Inactive Colleges ({inactiveColleges.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {inactiveColleges.map(renderCollegeCard)}
              </div>
            </div>
          )}
        </div>
      )}

      <AddCollegeModal isOpen={showAddCollege} onClose={() => setShowAddCollege(false)} onSave={handleAddCollege} />
      <CollegeDetailsModal isOpen={showDetails} college={selectedCollege} onClose={() => { setShowDetails(false); setSelectedCollege(null); }}
        onDeactivate={handleDeactivate} onRefresh={handleRefresh} />
      <SuccessAlert isOpen={showSuccessAlert.isOpen}
        onClose={() => setShowSuccessAlert({ isOpen: false, title: '', message: '' })}
        title={showSuccessAlert.title} message={showSuccessAlert.message} duration={4000} />
    </div>
  );
}
