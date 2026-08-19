'use client';

import { useState, useEffect } from 'react';
import StudentDetailsModal from '@/components/modals/StudentDetailsModal';
import AddStudentModal from '@/components/modals/AddStudentModal';
import SuccessAlert from '@/components/ui/SuccessAlert';

export default function StudentsContent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.program && student.program.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'graduated': return 'bg-blue-500/20 text-blue-400';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleAddStudent = () => {
    setShowAddStudent(true);
  };

  const handleStudentAdded = (newStudent, responseData) => {
    setStudents(prev => [newStudent, ...prev]);
    setShowAddStudent(false);

    let message = `${newStudent.name} has been successfully added.`;

    if (responseData?.hasEmail) {
      const details = [];
      if (responseData.studentUserCreated) details.push('User account created');
      if (responseData.credentialsEmailSent) details.push('Login credentials sent');

      if (details.length > 0) {
        message += ` ${details.join(', ')}.`;
      }
    } else {
      message += " Note: No email provided - no user account or emails sent.";
    }

    setShowSuccessAlert({
      isOpen: true,
      title: "Student Added Successfully!",
      message: message
    });
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
          <p className="text-white/70">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-screen">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold text-white">Student Management</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search students..."
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
            <option value="graduated">Graduated</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Add Student Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddStudent}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
        >
          + Add New Student
        </button>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{student.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{student.name}</div>
                  <div className="text-slate-400 text-sm">ID: #{student.id}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400">Program:</span> {student.program || 'N/A'}
              </div>
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400">Email:</span> {student.email || 'N/A'}
              </div>
              {student.enrollmentYear && (
                <div className="text-slate-300 text-sm">
                  <span className="text-slate-400">Enrollment:</span> {student.enrollmentYear}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <button
                onClick={() => handleViewStudent(student)}
                className="bg-slate-600/50 hover:bg-slate-600/70 text-white text-sm py-2 px-4 rounded transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first student'}
          </p>
          <button
            onClick={handleAddStudent}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Add New Student
          </button>
        </div>
      )}

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSave={handleStudentAdded}
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
