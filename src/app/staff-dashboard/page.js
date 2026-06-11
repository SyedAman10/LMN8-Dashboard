'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, UserPlus, Calendar, HeartHandshake, BookOpen, BarChart3, Building2, Settings, LogOut } from 'lucide-react';
import DashboardContent from '@/components/pages/DashboardContent';
import PatientsContent from '@/components/pages/PatientsContent';
import OnboardingContent from '@/components/pages/OnboardingContent';
import SessionsContent from '@/components/pages/SessionsContent';
import IntegrationContent from '@/components/pages/IntegrationContent';
import ResourcesContent from '@/components/pages/ResourcesContent';
import ReportsContent from '@/components/pages/ReportsContent';
import LocationsContent from '@/components/pages/LocationsContent';
import SettingsContent from '@/components/pages/SettingsContent';

const iconMap = {
  dashboard: LayoutDashboard,
  patients: Users,
  onboarding: UserPlus,
  sessions: Calendar,
  integration: HeartHandshake,
  resources: BookOpen,
  reports: BarChart3,
  locations: Building2,
  settings: Settings
};

const allTabs = [
  { id: 'dashboard', title: 'Dashboard', permKey: 'can_view_dashboard' },
  { id: 'patients', title: 'Patients', permKey: 'can_view_patients' },
  { id: 'onboarding', title: 'Onboarding', permKey: 'can_view_patients' },
  { id: 'sessions', title: 'Sessions', permKey: 'can_view_sessions' },
  { id: 'integration', title: 'Integration', permKey: 'can_view_integration' },
  { id: 'resources', title: 'Resources', permKey: 'can_view_resources' },
  { id: 'reports', title: 'Reports', permKey: 'can_view_reports' },
  { id: 'locations', title: 'Locations', permKey: 'can_view_locations' },
  { id: 'settings', title: 'Settings', permKey: 'can_view_settings' },
];

const contentComponents = {
  dashboard: DashboardContent,
  patients: PatientsContent,
  onboarding: OnboardingContent,
  sessions: SessionsContent,
  integration: IntegrationContent,
  resources: ResourcesContent,
  reports: ReportsContent,
  locations: LocationsContent,
  settings: SettingsContent,
};

export default function StaffDashboard() {
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('staffToken');
    const perms = localStorage.getItem('staffPermissions');
    const user = localStorage.getItem('staffUser');

    if (!token || !user) {
      router.push('/staff-login');
      return;
    }

    setPermissions(JSON.parse(perms || '{}'));
    setStaff(JSON.parse(user));
    setLoading(false);
  }, [router]);

  const availableTabs = allTabs.filter(tab => permissions[tab.permKey]);

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffPermissions');
    localStorage.removeItem('staffUser');
    router.push('/staff-login');
  };

  const renderContent = () => {
    const Component = contentComponents[activePage];
    if (Component) {
      const commonProps = {
        onAddPatient: () => {},
        onImportPatient: () => {},
        onCreatePlan: () => {},
        userName: staff?.firstName || 'User',
      };
      return <Component {...commonProps} />;
    }
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-white mb-2">
          {allTabs.find(t => t.id === activePage)?.title || 'Dashboard'}
        </h3>
        <p className="text-slate-400">This section is accessible based on your permissions.</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top bar */}
      <div className="bg-slate-800/60 border-b border-cyan-500/30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          
          <span className="text-white font-bold text-lg">{staff?.clinicName || staff?.firstName || 'Staff Dashboard'}</span>
          {staff?.firstName && <span className="text-slate-400 text-sm ml-2">{staff.firstName} {staff.lastName || ''}</span>}
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/30 min-h-[calc(100vh-60px)] p-3 border-r border-cyan-500/20">
          <div className="space-y-1">
            {availableTabs.map(tab => {
              const Icon = iconMap[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePage(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    activePage === tab.id
                      ? 'bg-gradient-to-r from-cyan-600/30 to-teal-600/30 border border-cyan-500/50 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="font-semibold">{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
