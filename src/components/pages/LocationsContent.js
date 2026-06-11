'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationsContent() {
  const [locations, setLocations] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);

  const [staff, setStaff] = useState([]);

  const [activeTab, setActiveTab] = useState('locations');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Location form state
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    managerName: '',
    establishedDate: '',
    status: 'active'
  });

  // User form state
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff'
  });

  const [userPermissions, setUserPermissions] = useState({
    can_view_dashboard: true,
    can_view_patients: false,
    can_edit_patients: false,
    can_delete_patients: false,
    can_view_sessions: false,
    can_view_integration: false,
    can_view_resources: false,
    can_view_reports: false,
    can_create_reports: false,
    can_edit_reports: false,
    can_delete_reports: false,
    can_view_locations: false,
    can_view_settings: false
  });

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchStaff();
  }, []);

  const handleSaveLocation = async () => {
    if (!locationForm.name || !locationForm.address || !locationForm.city) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const isEditing = !!editingLocation;
      const url = isEditing ? `/api/locations/${editingLocation.id}` : '/api/locations';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(locationForm)
      });

      if (response.ok) {
        showNotification('success', isEditing ? 'Location updated successfully' : 'Location created successfully');
        setShowLocationModal(false);
        fetchLocations();
        resetLocationForm();
      } else {
        const error = await response.json();
        showNotification('error', error.message || `Failed to ${isEditing ? 'update' : 'create'} location`);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      showNotification('error', 'Error saving location');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.role) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...userForm,
          permissions: userPermissions
        })
      });

      if (response.ok) {
        const data = await response.json();
        const msg = data.emailSent
          ? `Staff created. Credentials sent to ${userForm.email}.`
          : `Staff created. Email failed. Login: ${userForm.email} / Password: ${data.password}`;
        showNotification('success', msg);
        setShowUserModal(false);
        fetchStaff();
        resetUserForm();
      } else {
        const error = await response.json();
        showNotification('error', error.message || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      showNotification('error', 'Error creating staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (!confirm('Are you sure you want to delete this location? All associated data will be archived.')) return;

    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('success', 'Location deleted successfully');
        fetchLocations();
      } else {
        showNotification('error', 'Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      showNotification('error', 'Error deleting location');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;

    try {
      const response = await fetch(`/api/staff/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('success', 'Staff member deactivated successfully');
        fetchStaff();
      } else {
        showNotification('error', 'Failed to deactivate staff member');
      }
    } catch (error) {
      console.error('Error deactivating staff:', error);
      showNotification('error', 'Error deactivating staff member');
    }
  };

  const resetLocationForm = () => {
    setLocationForm({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      managerName: '',
      establishedDate: '',
      status: 'active'
    });
    setEditingLocation(null);
  };

  const resetUserForm = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'staff'
    });
    setUserPermissions({
      can_view_dashboard: true,
      can_view_patients: false,
      can_edit_patients: false,
      can_delete_patients: false,
      can_view_sessions: false,
      can_view_integration: false,
      can_view_resources: false,
      can_view_reports: false,
      can_create_reports: false,
      can_edit_reports: false,
      can_delete_reports: false,
      can_view_locations: false,
      can_view_settings: false
    });
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const roleConfig = {
    admin: { color: 'bg-purple-500', label: 'Admin', permissions: 'Full system access' },
    clinician: { color: 'bg-blue-500', label: 'Clinician', permissions: 'Patient care, treatment plans' },
    nurse: { color: 'bg-green-500', label: 'Nurse', permissions: 'Patient monitoring, documentation' },
    frontDesk: { color: 'bg-yellow-500', label: 'Front Desk', permissions: 'Scheduling, patient intake' },
    finance: { color: 'bg-indigo-500', label: 'Finance', permissions: 'Billing, payments, reports' },
    staff: { color: 'bg-gray-500', label: 'Staff', permissions: 'General access' }
  };

  return (
    <div className="space-y-6 h-screen">
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
          <h1 className="text-3xl font-bold text-white">Multi-Location Management</h1>
          <p className="text-slate-300 mt-1">Manage branches, users, and role-based access</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('locations');
              resetLocationForm();
              setShowLocationModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Location
          </button>
          <button
            onClick={() => {
              setActiveTab('users');
              setShowUserModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'locations'
              ? 'border-b-2 border-cyan-500 text-cyan-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          📍 Locations ({locations.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-teal-500 text-teal-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          👥 Users ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'roles'
              ? 'border-b-2 border-cyan-600 text-cyan-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          🔐 Roles & Permissions
        </button>
      </div>

      {/* Tabs Content */}
      <div className="bg-slate-700/30 rounded-xl shadow-sm p-6 border border-slate-600/30">
        {activeTab === 'locations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Locations</h2>
              <input
                type="text"
                placeholder="Search locations..."
                className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm"
              />
            </div>

            {loading && locations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Loading locations...</div>
            ) : locations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">🏢</p>
                <p>No locations yet</p>
                <p className="text-sm mt-2">Create your first location to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map(location => (
                  <div
                    key={location.id}
                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-slate-800/30 ${
                      selectedLocation?.id === location.id
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-slate-600/30 hover:border-cyan-500/30'
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">{location.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{location.city}, {location.state}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        location.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {location.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-300">
                      <p>📧 {location.email}</p>
                      <p>📞 {location.phone}</p>
                      <p>👤 Manager: {location.managerName}</p>
                      <p>👥 Staff: {location.staffCount || 0} users</p>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-600/30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLocation(location);
                          setLocationForm({
                            name: location.name,
                            address: location.address,
                            city: location.city,
                            state: location.state || '',
                            zipCode: location.zipCode || '',
                            phone: location.phone || '',
                            email: location.email || '',
                            managerName: location.managerName || '',
                            establishedDate: location.establishedDate || '',
                            status: location.status || 'active'
                          });
                          setShowLocationModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg text-sm transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLocation(location.id);
                        }}
                        className="flex-1 px-3 py-2 bg-red-500/70 text-white rounded-lg hover:bg-red-600/70 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Users & Staff</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm"
                />
              </div>
            </div>

            {loading && staff.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Loading staff...</div>
            ) : staff.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">👥</p>
                <p>No staff yet</p>
                <p className="text-sm mt-2">Add your first team member</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(member => {
                      const role = roleConfig[member.role] || roleConfig.staff;
                      const isActive = member.is_active;
                      return (
                        <tr key={member.id} className="border-b border-slate-600/30 hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                {member.first_name?.[0]}{member.last_name?.[0]}
                              </div>
                              <span className="font-medium text-white">{member.first_name} {member.last_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                              {role.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300">{member.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isActive
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {isActive ? 'active' : 'inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleDeleteUser(member.id)}
                              className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                            >
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Role-Based Access Control (RBAC)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(roleConfig).filter(([key]) => key !== 'staff').map(([key, config]) => (
                <div
                  key={key}
                  className="p-6 rounded-lg border-2 border-cyan-500/30 bg-cyan-500/10 bg-slate-800/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                      {config.label[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{config.label}</h3>
                      <p className="text-sm text-slate-400">{config.permissions}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-cyan-400">Access Level:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {key === 'admin' && (
                        <>
                          <li>Full system access</li>
                          <li>User management</li>
                          <li>Location management</li>
                          <li>Financial reports</li>
                        </>
                      )}
                      {key === 'clinician' && (
                        <>
                          <li>Patient records</li>
                          <li>Treatment plans</li>
                          <li>Session notes</li>
                          <li>Progress tracking</li>
                        </>
                      )}
                      {key === 'nurse' && (
                        <>
                          <li>Patient monitoring</li>
                          <li>Documentation</li>
                          <li>Vital signs</li>
                        </>
                      )}
                      {key === 'frontDesk' && (
                        <>
                          <li>Scheduling</li>
                          <li>Patient intake</li>
                          <li>Appointment management</li>
                        </>
                      )}
                      {key === 'finance' && (
                        <>
                          <li>Billing & invoicing</li>
                          <li>Payments</li>
                          <li>Financial reports</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLocationModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{editingLocation ? 'Edit Location' : 'Add New Location'}</h2>
                    <p className="text-slate-300">{editingLocation ? 'Update clinic branch information' : 'Create a new clinic branch'}</p>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="text-slate-400 hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Location Name *</label>
                      <input
                        type="text"
                        value={locationForm.name}
                        onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={locationForm.status}
                      onChange={(e) => setLocationForm({ ...locationForm, status: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="active" className="bg-slate-800">Active</option>
                      <option value="inactive" className="bg-slate-800">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-white mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={locationForm.address}
                    onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">City *</label>
                    <input
                      type="text"
                      value={locationForm.city}
                      onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      value={locationForm.state}
                      onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={locationForm.zipCode}
                      onChange={(e) => setLocationForm({ ...locationForm, zipCode: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={locationForm.phone}
                      onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={locationForm.email}
                      onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Manager Name</label>
                    <input
                      type="text"
                      value={locationForm.managerName}
                      onChange={(e) => setLocationForm({ ...locationForm, managerName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Established Date</label>
                    <input
                      type="date"
                      value={locationForm.establishedDate}
                      onChange={(e) => setLocationForm({ ...locationForm, establishedDate: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                </div>
              </div>

              <div className="p-6 bg-slate-700/30 border-t border-slate-600/30 flex justify-end gap-3">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="px-6 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLocation}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Saving...' : editingLocation ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowUserModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add New Staff Member</h2>
                    <p className="text-slate-300">Create a new staff member account</p>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-slate-400 hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">First Name *</label>
                      <input
                        type="text"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Email *</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                      <input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Role *</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => {
                        setUserForm({ ...userForm, role: e.target.value });
                        if (e.target.value === 'admin') {
                          setUserPermissions({
                            can_view_dashboard: true,
                            can_view_patients: true,
                            can_edit_patients: true,
                            can_delete_patients: true,
                            can_view_sessions: true,
                            can_view_integration: true,
                            can_view_resources: true,
                            can_view_reports: true,
                            can_create_reports: true,
                            can_edit_reports: true,
                            can_delete_reports: true,
                            can_view_locations: true,
                            can_view_settings: true
                          });
                        } else {
                          setUserPermissions({
                            can_view_dashboard: true,
                            can_view_patients: false,
                            can_edit_patients: false,
                            can_delete_patients: false,
                            can_view_sessions: false,
                            can_view_integration: false,
                            can_view_resources: false,
                            can_view_reports: false,
                            can_create_reports: false,
                            can_edit_reports: false,
                            can_delete_reports: false,
                            can_view_locations: false,
                            can_view_settings: false
                          });
                        }
                      }}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                    >
                      <option value="staff" className="bg-slate-800">Staff</option>
                      <option value="clinician" className="bg-slate-800">Clinician</option>
                      <option value="nurse" className="bg-slate-800">Nurse</option>
                      <option value="frontDesk" className="bg-slate-800">Front Desk</option>
                      <option value="finance" className="bg-slate-800">Finance</option>
                    </select>
                  </div>

                  {/* Permissions Section */}
                  {userForm.role === 'admin' ? (
                    <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
                      <p className="text-sm text-cyan-300 font-semibold">
                        ✓ Admin role — all permissions are auto-granted.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">Permissions</label>
                      <div className="space-y-4">
                        {/* Dashboard */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Dashboard</h4>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userPermissions.can_view_dashboard}
                              onChange={(e) => setUserPermissions({ ...userPermissions, can_view_dashboard: e.target.checked })}
                              className="accent-cyan-500"
                            />
                            <span className="text-sm text-white">View Dashboard</span>
                          </label>
                        </div>

                        {/* Patients */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Patients</h4>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_view_patients}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_view_patients: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">View Patients</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_edit_patients}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_edit_patients: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">Edit Patients</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_delete_patients}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_delete_patients: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">Delete Patients</span>
                            </label>
                          </div>
                        </div>

                        {/* Sessions */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Sessions</h4>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userPermissions.can_view_sessions}
                              onChange={(e) => setUserPermissions({ ...userPermissions, can_view_sessions: e.target.checked })}
                              className="accent-cyan-500"
                            />
                            <span className="text-sm text-white">View Sessions</span>
                          </label>
                        </div>

                        {/* Integration */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Integration</h4>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userPermissions.can_view_integration}
                              onChange={(e) => setUserPermissions({ ...userPermissions, can_view_integration: e.target.checked })}
                              className="accent-cyan-500"
                            />
                            <span className="text-sm text-white">View Integration</span>
                          </label>
                        </div>

                        {/* Resources */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Resources</h4>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userPermissions.can_view_resources}
                              onChange={(e) => setUserPermissions({ ...userPermissions, can_view_resources: e.target.checked })}
                              className="accent-cyan-500"
                            />
                            <span className="text-sm text-white">View Resources</span>
                          </label>
                        </div>

                        {/* Reports */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Reports</h4>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_view_reports}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_view_reports: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">View Reports</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_create_reports}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_create_reports: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">Create Reports</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_edit_reports}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_edit_reports: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">Edit Reports</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userPermissions.can_delete_reports}
                                onChange={(e) => setUserPermissions({ ...userPermissions, can_delete_reports: e.target.checked })}
                                className="accent-cyan-500"
                              />
                              <span className="text-sm text-white">Delete Reports</span>
                            </label>
                          </div>
                        </div>

                        {/* Locations */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Locations</h4>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userPermissions.can_view_locations}
                              onChange={(e) => setUserPermissions({ ...userPermissions, can_view_locations: e.target.checked })}
                              className="accent-cyan-500"
                            />
                            <span className="text-sm text-white">View Locations</span>
                          </label>
                        </div>

                        {/* Settings */}
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Settings</h4>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userPermissions.can_view_settings}
                              onChange={(e) => setUserPermissions({ ...userPermissions, can_view_settings: e.target.checked })}
                              className="accent-cyan-500"
                            />
                            <span className="text-sm text-white">View Settings</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-cyan-500/10 p-4 rounded-lg border-l-4 border-cyan-500">
                    <p className="text-sm text-cyan-300">
                      <strong>Note:</strong> Staff member will receive login credentials via email after creation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-700/30 border-t border-slate-600/30 flex justify-end gap-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Creating...' : 'Create Staff Member'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

