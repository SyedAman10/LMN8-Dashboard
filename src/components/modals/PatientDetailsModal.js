'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [notification, setNotification] = useState(null);

  // Note form state
  const [noteForm, setNoteForm] = useState({
    note: '',
    noteType: 'general',
    isPrivate: false,
    tags: []
  });

  // Document upload state
  const [uploadForm, setUploadForm] = useState({
    file: null,
    category: 'other',
    description: '',
    tags: ''
  });

  useEffect(() => {
    if (isOpen && patient) {
      fetchNotes();
      fetchDocuments();
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

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/backend/patients/${patient.id}/notes`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/backend/patients/${patient.id}/documents`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleAddNote = async () => {
    if (!noteForm.note.trim()) {
      showNotification('error', 'Please enter a note');
      return;
    }

    try {
      setLoading(true);
      const url = editingNote 
        ? `/api/backend/patients/${patient.id}/notes/${editingNote.id}`
        : `/api/backend/patients/${patient.id}/notes`;
      
      const method = editingNote ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...noteForm,
          tags: noteForm.tags.length > 0 ? noteForm.tags : []
        })
      });

      if (response.ok) {
        showNotification('success', editingNote ? 'Note updated successfully' : 'Note added successfully');
        setShowAddNoteModal(false);
        setEditingNote(null);
        setNoteForm({ note: '', noteType: 'general', isPrivate: false, tags: [] });
        fetchNotes();
      } else {
        const error = await response.json();
        showNotification('error', error.message || (editingNote ? 'Failed to update note' : 'Failed to add note'));
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showNotification('error', 'Error saving note');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({
      note: note.note,
      noteType: note.noteType || 'general',
      isPrivate: note.isPrivate || false,
      tags: note.tags || []
    });
    setShowAddNoteModal(true);
  };

  const handleUploadDocument = async () => {
    if (!uploadForm.file) {
      showNotification('error', 'Please select a file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('category', uploadForm.category);
      formData.append('description', uploadForm.description);
      formData.append('tags', uploadForm.tags);

      const response = await fetch(`/api/backend/patients/${patient.id}/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        showNotification('success', 'Document uploaded successfully');
        setShowUploadModal(false);
        setUploadForm({ file: null, category: 'other', description: '', tags: '' });
        fetchDocuments();
      } else {
        const error = await response.json();
        showNotification('error', error.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      showNotification('error', 'Error uploading document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/backend/patients/${patient.id}/documents/${documentId}/download`, {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'document';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showNotification('error', 'Failed to download document');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      showNotification('error', 'Error downloading document');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/backend/patients/${patient.id}/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('success', 'Note deleted successfully');
        fetchNotes();
      } else {
        showNotification('error', 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      showNotification('error', 'Error deleting note');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/backend/patients/${patient.id}/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('success', 'Document deleted successfully');
        fetchDocuments();
      } else {
        showNotification('error', 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      showNotification('error', 'Error deleting document');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('image')) return '🖼️';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    return '📎';
  };

  if (!isOpen || !patient) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sessions', label: 'Sessions', icon: '🌊' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'documents', label: 'Documents', icon: '📄' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500/90 backdrop-blur-sm' 
                : 'bg-red-500/90 backdrop-blur-sm'
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
                <p className="text-slate-300">Patient ID: #{patient.id}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(patient.status)}`}>
                  {patient.status?.toUpperCase() || 'ACTIVE'}
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

        {/* Tabs */}
        <div className="bg-slate-700/30 border-b border-slate-600/30">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-600/30'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diagnosis:</span>
                      <span className="text-white">{patient.diagnosis || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Therapist:</span>
                      <span className="text-white">{patient.therapist || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white">{patient.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-white">{patient.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Treatment Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Sessions Completed</span>
                        <span className="text-white">{patient.sessionsCompleted || 0}/{patient.totalSessions || 12}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                          style={{ width: `${((patient.sessionsCompleted || 0) / (patient.totalSessions || 12)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-cyan-400">
                        {Math.round(((patient.sessionsCompleted || 0) / (patient.totalSessions || 12)) * 100)}%
                      </span>
                      <p className="text-slate-400 text-sm">Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 py-2 px-4 rounded-lg transition-colors">
                    Start Session
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('notes');
                      setShowAddNoteModal(true);
                    }}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Note
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('documents');
                      setShowUploadModal(true);
                    }}
                    className="bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload Doc
                  </button>
                  <button className="bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 px-4 rounded-lg transition-colors">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Clinical Notes</h3>
                <button 
                  onClick={() => setShowAddNoteModal(true)}
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white py-2 px-4 rounded-lg transition-all"
                >
                  + Add Note
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="text-slate-400 mt-2">Loading notes...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-4xl mb-4">📝</p>
                  <p>No notes yet</p>
                  <p className="text-sm mt-2">Add your first note for this patient</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-sm">{new Date(note.createdAt).toLocaleDateString()}</span>
                          <span className="text-slate-400 text-sm">by {note.authorName}</span>
                          {note.noteType && (
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                              {note.noteType}
                            </span>
                          )}
                          {note.isPrivate && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                              Private
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-white">{note.note}</p>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {note.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Documents</h3>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white py-2 px-4 rounded-lg transition-all"
                >
                  + Upload Document
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="text-slate-400 mt-2">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-4xl mb-4">📄</p>
                  <p>No documents yet</p>
                  <p className="text-sm mt-2">Upload your first document for this patient</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-3xl">{getFileIcon(doc.mimeType)}</span>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{doc.originalFileName}</h4>
                            <p className="text-slate-400 text-sm">{formatFileSize(doc.fileSize)}</p>
                            <p className="text-slate-500 text-xs mt-1">
                              {new Date(doc.createdAt).toLocaleDateString()} • {doc.category}
                            </p>
                            {doc.description && (
                              <p className="text-slate-300 text-sm mt-2">{doc.description}</p>
                            )}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {doc.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDownloadDocument(doc.id)}
                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNoteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddNoteModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{editingNote ? 'Edit Note' : 'Add Note'}</h2>
                  <button
                    onClick={() => {
                      setShowAddNoteModal(false);
                      setEditingNote(null);
                      setNoteForm({ note: '', noteType: 'general', isPrivate: false, tags: [] });
                    }}
                    className="text-slate-400 hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Note *</label>
                  <textarea
                    value={noteForm.note}
                    onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 min-h-[150px]"
                    placeholder="Enter your note here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Note Type</label>
                    <select
                      value={noteForm.noteType}
                      onChange={(e) => setNoteForm({ ...noteForm, noteType: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="general">General</option>
                      <option value="clinical">Clinical</option>
                      <option value="session">Session</option>
                      <option value="followup">Follow-up</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noteForm.isPrivate}
                        onChange={(e) => setNoteForm({ ...noteForm, isPrivate: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Private note (only visible to me)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={noteForm.tags.join(', ')}
                    onChange={(e) => setNoteForm({ 
                      ...noteForm, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                    })}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                    placeholder="anxiety, progress, therapy"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-700/30 border-t border-slate-600/30 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-6 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? (editingNote ? 'Updating...' : 'Adding...') : (editingNote ? 'Update Note' : 'Add Note')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-slate-400 hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">File *</label>
                  <input
                    type="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <p className="text-slate-400 text-xs mt-1">Max file size: 10MB. Allowed: PDF, DOC, DOCX, JPG, PNG, TXT</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="lab-results">Lab Results</option>
                    <option value="medical-records">Medical Records</option>
                    <option value="consent-forms">Consent Forms</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 min-h-[100px]"
                    placeholder="Optional description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                    placeholder="lab, blood-test, annual"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-700/30 border-t border-slate-600/30 flex justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  disabled={loading || !uploadForm.file}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
