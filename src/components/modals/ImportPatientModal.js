'use client';

import { useState, useEffect } from 'react';

export default function ImportPatientModal({ isOpen, onClose, onImport }) {
  const [importMethod, setImportMethod] = useState('csv');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [importStatus, setImportStatus] = useState('');

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile && importMethod === 'csv') {
      // Simulate CSV parsing
      const mockData = [
        { name: 'John Doe', email: 'john@example.com', diagnosis: 'PTSD', status: 'active' },
        { name: 'Jane Smith', email: 'jane@example.com', diagnosis: 'Depression', status: 'active' },
        { name: 'Bob Johnson', email: 'bob@example.com', diagnosis: 'Anxiety', status: 'paused' }
      ];
      setPreviewData(mockData);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    setImportStatus('Importing patients...');
    
    // Simulate import process
    setTimeout(() => {
      setIsLoading(false);
      setImportStatus('Successfully imported 3 patients');
      
      // Simulate adding imported patients
      const importedPatients = previewData.map((patient, index) => ({
        id: Date.now() + index,
        name: patient.name,
        email: patient.email,
        diagnosis: patient.diagnosis,
        status: patient.status,
        lastSession: 'N/A',
        nextSession: 'TBD',
        progress: 0,
        sessionsCompleted: 0,
        totalSessions: 12,
        therapist: 'Dr. Jane Doe'
      }));
      
      onImport(importedPatients);
      
      setTimeout(() => {
        onClose();
        setFile(null);
        setPreviewData([]);
        setImportStatus('');
      }, 2000);
    }, 2000);
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewData([]);
    setImportStatus('');
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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-white">Import Patient Data</h2>
              <p className="text-slate-300">Import patient records from external sources</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="space-y-6">
            {/* Import Method Selection */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Select Import Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setImportMethod('csv')}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    importMethod === 'csv'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">CSV File</div>
                  <div className="text-sm opacity-75">Upload CSV file</div>
                </button>

                <button
                  onClick={() => setImportMethod('api')}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    importMethod === 'api'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-semibold">API Import</div>
                  <div className="text-sm opacity-75">Connect to system</div>
                </button>

                <button
                  onClick={() => setImportMethod('manual')}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    importMethod === 'manual'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">✏️</div>
                  <div className="font-semibold">Manual Entry</div>
                  <div className="text-sm opacity-75">Bulk data entry</div>
                </button>
              </div>
            </div>

            {/* File Upload */}
            {importMethod === 'csv' && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Upload CSV File</h3>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-4xl mb-4">📁</div>
                    <div className="text-white font-semibold mb-2">
                      {file ? file.name : 'Click to upload CSV file'}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Supported format: CSV files only
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* API Import */}
            {importMethod === 'api' && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      API Endpoint
                    </label>
                    <input
                      type="url"
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                      placeholder="https://api.example.com/patients"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                      placeholder="Enter your API key"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Manual Entry */}
            {importMethod === 'manual' && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Manual Data Entry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Patient Data (JSON Format)
                    </label>
                    <textarea
                      rows={6}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 font-mono text-sm"
                      placeholder='[{"name": "John Doe", "email": "john@example.com", "diagnosis": "PTSD"}]'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preview Data */}
            {previewData.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Preview Data</h3>
                <div className="space-y-2">
                  {previewData.map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">{patient.name}</div>
                        <div className="text-slate-400 text-sm">{patient.email} • {patient.diagnosis}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Import Status */}
            {importStatus && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  {isLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <div className="text-green-400 text-xl">✓</div>
                  )}
                  <span className="text-white">{importStatus}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-600/30">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file && importMethod === 'csv' || isLoading}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Importing...' : 'Import Patients'}
          </button>
        </div>
      </div>
    </div>
  );
}
