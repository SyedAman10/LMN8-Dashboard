'use client';

import { useState, useEffect } from 'react';

export default function StudentDetailsModal({ student, isOpen, onClose }) {
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

  if (!isOpen || !student) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'graduated': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                <p className="text-slate-300">Student ID: #{student.id}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(student.status)}`}>
                  {student.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
          <div className="space-y-6">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Student Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{student.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-white">{student.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date of Birth:</span>
                    <span className="text-white">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Academic Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Program:</span>
                    <span className="text-white">{student.program || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enrollment Year:</span>
                    <span className="text-white">{student.enrollmentYear || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-white">{student.status || 'Active'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {(student.emergencyContact || student.emergencyPhone) && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Name:</span>
                    <span className="text-white">{student.emergencyContact || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Phone:</span>
                    <span className="text-white">{student.emergencyPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {student.notes && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{student.notes}</p>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Created:</span>{' '}
                  <span className="text-white">
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Updated:</span>{' '}
                  <span className="text-white">
                    {student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
