'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportsContent() {
  const [savedReports, setSavedReports] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Report configuration state
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    reportType: 'summary', // summary, detailed, trend, custom
    dataSource: 'patients', // patients, sessions, demographics, outcomes
    metrics: [], // Selected metrics to display
    filters: {
      dateRange: 'last_30_days', // last_7_days, last_30_days, last_90_days, custom, all_time
      startDate: '',
      endDate: '',
      status: 'all', // all, active, completed, inactive
      therapist: 'all',
      diagnosis: 'all'
    },
    groupBy: 'none', // none, therapist, status, diagnosis, month, week
    chartType: 'bar', // bar, line, pie, table, mixed
    columns: [], // For table reports
    sortBy: 'date',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchSavedReports();
  }, []);

  // Fetch all saved reports
  const fetchSavedReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSavedReports(data.reports);
      } else {
        showNotification('error', 'Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      showNotification('error', 'Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  // Create new report
  const handleCreateReport = async () => {
    if (!reportConfig.name) {
      showNotification('error', 'Please enter a report name');
      return;
    }

    if (reportConfig.metrics.length === 0) {
      showNotification('error', 'Please select at least one metric');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reportConfig)
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('success', 'Report created successfully');
        setShowCreateModal(false);
        fetchSavedReports();
        resetReportConfig();
      } else {
        const error = await response.json();
        showNotification('error', error.message || 'Failed to create report');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      showNotification('error', 'Error creating report');
    } finally {
      setLoading(false);
    }
  };

  // Generate report data
  const handleGenerateReport = async (reportId) => {
    try {
      setLoading(true);
      setReportData(null);
      
      const response = await fetch(`/api/reports/${reportId}/generate`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        setSelectedReport(savedReports.find(r => r.id === reportId));
      } else {
        showNotification('error', 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showNotification('error', 'Error generating report');
    } finally {
      setLoading(false);
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('success', 'Report deleted successfully');
        fetchSavedReports();
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
          setReportData(null);
        }
      } else {
        showNotification('error', 'Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      showNotification('error', 'Error deleting report');
    }
  };

  // Export report
  const handleExportReport = async (format = 'csv') => {
    if (!reportData) return;

    try {
      const response = await fetch(`/api/reports/${selectedReport.id}/export?format=${format}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport.name}_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('success', 'Report exported successfully');
      } else {
        showNotification('error', 'Failed to export report');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      showNotification('error', 'Error exporting report');
    }
  };

  const resetReportConfig = () => {
    setReportConfig({
      name: '',
      description: '',
      reportType: 'summary',
      dataSource: 'patients',
      metrics: [],
      filters: {
        dateRange: 'last_30_days',
        startDate: '',
        endDate: '',
        status: 'all',
        therapist: 'all',
        diagnosis: 'all'
      },
      groupBy: 'none',
      chartType: 'bar',
      columns: [],
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleMetric = (metric) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const availableMetrics = {
    patients: [
      { id: 'total_patients', label: 'Total Patients', description: 'Count of all patients' },
      { id: 'active_patients', label: 'Active Patients', description: 'Currently active patients' },
      { id: 'new_patients', label: 'New Patients', description: 'Patients added in date range' },
      { id: 'completed_patients', label: 'Completed Treatment', description: 'Patients who completed treatment' },
      { id: 'inactive_patients', label: 'Inactive Patients', description: 'Patients marked as inactive' },
      { id: 'average_age', label: 'Average Age', description: 'Mean age of patients' },
      { id: 'gender_distribution', label: 'Gender Distribution', description: 'Breakdown by gender' }
    ],
    sessions: [
      { id: 'total_sessions', label: 'Total Sessions', description: 'Count of all sessions' },
      { id: 'completed_sessions', label: 'Completed Sessions', description: 'Successfully completed sessions' },
      { id: 'average_sessions_per_patient', label: 'Avg Sessions/Patient', description: 'Mean sessions per patient' },
      { id: 'session_completion_rate', label: 'Completion Rate', description: 'Percentage of completed sessions' },
      { id: 'sessions_by_therapist', label: 'Sessions by Therapist', description: 'Breakdown by therapist' }
    ],
    demographics: [
      { id: 'diagnosis_distribution', label: 'Diagnosis Distribution', description: 'Breakdown by diagnosis' },
      { id: 'age_groups', label: 'Age Groups', description: 'Patients grouped by age ranges' },
      { id: 'geographic_distribution', label: 'Geographic Distribution', description: 'Patients by location' }
    ],
    outcomes: [
      { id: 'treatment_outcomes', label: 'Treatment Outcomes', description: 'Success rates and outcomes' },
      { id: 'progress_trends', label: 'Progress Trends', description: 'Patient progress over time' },
      { id: 'retention_rate', label: 'Retention Rate', description: 'Patient retention percentage' }
    ]
  };

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Custom Reports</h1>
          <p className="text-slate-600 mt-1">Create and manage custom reports for your data</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Create Report
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Reports List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Saved Reports</h2>
            
            {loading && savedReports.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Loading reports...</div>
            ) : savedReports.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No reports yet</p>
                <p className="text-sm mt-2">Create your first report to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedReports.map(report => (
                  <div
                    key={report.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedReport?.id === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{report.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{report.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {report.reportType}
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {report.dataSource}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Report Display Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {!selectedReport ? (
              <div className="text-center py-20 text-slate-500">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Select a Report</h3>
                <p>Choose a report from the left or create a new one</p>
              </div>
            ) : loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-slate-600 mt-4">Generating report...</p>
              </div>
            ) : reportData ? (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedReport.name}</h2>
                    <p className="text-slate-600 mt-1">{selectedReport.description}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportReport('csv')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => handleExportReport('pdf')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleGenerateReport(selectedReport.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                {/* Report Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reportData.summary?.map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg">
                      <p className="text-sm text-slate-600">{item.label}</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">{item.value}</p>
                      {item.change && (
                        <p className={`text-xs mt-1 ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chart/Visualization Area */}
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    {selectedReport.chartType === 'table' ? 'Data Table' : 'Visualization'}
                  </h3>
                  {selectedReport.chartType === 'table' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-200">
                          <tr>
                            {reportData.tableData?.headers?.map((header, index) => (
                              <th key={index} className="px-4 py-2 text-left font-semibold text-slate-700">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.tableData?.rows?.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-slate-200 hover:bg-slate-100">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 text-slate-700">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      <div>
                        <p>Chart Type: {selectedReport.chartType}</p>
                        <p className="text-sm mt-2">Chart visualization placeholder</p>
                        <p className="text-xs mt-1">(Integrate with Chart.js or similar library)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Data */}
                {reportData.additionalData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Additional Insights</h3>
                    {reportData.additionalData.map((insight, index) => (
                      <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="font-semibold text-slate-800">{insight.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-800">Create Custom Report</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Report Name *
                  </label>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter report name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe what this report shows"
                  />
                </div>

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportConfig.reportType}
                    onChange={(e) => setReportConfig({ ...reportConfig, reportType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="trend">Trend Analysis</option>
                    <option value="custom">Custom Report</option>
                  </select>
                </div>

                {/* Data Source */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Data Source
                  </label>
                  <select
                    value={reportConfig.dataSource}
                    onChange={(e) => setReportConfig({ ...reportConfig, dataSource: e.target.value, metrics: [] })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="patients">Patients</option>
                    <option value="sessions">Sessions</option>
                    <option value="demographics">Demographics</option>
                    <option value="outcomes">Outcomes</option>
                  </select>
                </div>

                {/* Metrics Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Metrics * (Choose at least one)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                    {availableMetrics[reportConfig.dataSource]?.map(metric => (
                      <label
                        key={metric.id}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          reportConfig.metrics.includes(metric.id)
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-slate-50 border-2 border-transparent hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={reportConfig.metrics.includes(metric.id)}
                          onChange={() => toggleMetric(metric.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{metric.label}</p>
                          <p className="text-xs text-slate-500">{metric.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Filters
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Date Range</label>
                      <select
                        value={reportConfig.filters.dateRange}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          filters: { ...reportConfig.filters, dateRange: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="last_90_days">Last 90 Days</option>
                        <option value="custom">Custom Range</option>
                        <option value="all_time">All Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Status</label>
                      <select
                        value={reportConfig.filters.status}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          filters: { ...reportConfig.filters, status: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="completed">Completed Only</option>
                        <option value="inactive">Inactive Only</option>
                      </select>
                    </div>

                    {reportConfig.filters.dateRange === 'custom' && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={reportConfig.filters.startDate}
                            onChange={(e) => setReportConfig({
                              ...reportConfig,
                              filters: { ...reportConfig.filters, startDate: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={reportConfig.filters.endDate}
                            onChange={(e) => setReportConfig({
                              ...reportConfig,
                              filters: { ...reportConfig.filters, endDate: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Visualization Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Group By
                    </label>
                    <select
                      value={reportConfig.groupBy}
                      onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="none">No Grouping</option>
                      <option value="therapist">Therapist</option>
                      <option value="status">Status</option>
                      <option value="diagnosis">Diagnosis</option>
                      <option value="month">Month</option>
                      <option value="week">Week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Chart Type
                    </label>
                    <select
                      value={reportConfig.chartType}
                      onChange={(e) => setReportConfig({ ...reportConfig, chartType: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="table">Table</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetReportConfig();
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={loading || !reportConfig.name || reportConfig.metrics.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Report'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
