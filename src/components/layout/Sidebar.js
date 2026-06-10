'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, UserPlus, Calendar, HeartHandshake, BookOpen, BarChart3, Building2, Settings } from 'lucide-react';

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

const sidebarItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview & Progress'
  },
  {
    id: 'patients',
    title: 'Patients',
    description: 'Patient Management'
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'New Patient Setup'
  },
  {
    id: 'sessions',
    title: 'Sessions',
    description: 'Therapeutic Sessions'
  },
  {
    id: 'integration',
    title: 'Integration',
    description: 'Post-Session Processing'
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Tools & Materials'
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Analytics & Insights'
  },
  {
    id: 'locations',
    title: 'Locations',
    description: 'Multi-Location Management'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Account & Preferences'
  }
];

export default function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen, onSignoutClick }) {
  const { user } = useAuth();
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-slate-800/40 backdrop-blur-xl border-r border-cyan-500/30 flex-shrink-0`}>
      {/* Sidebar Header */}
      <div className={`${sidebarOpen ? 'p-4' : 'p-2'} border-b border-slate-700/50`}>
        <div className={`flex items-center ${sidebarOpen ? 'justify-center' : 'flex-col space-y-2'}`}>
          <div className="flex flex-col items-center mx-auto">
            <span className="text-white font-bold text-sm">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-cyan-400 hover:text-cyan-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg px-2 py-1 transition-all duration-200 text-lg font-semibold ${sidebarOpen ? 'absolute right-4' : ''}`}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="p-3 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.id];
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-2'} rounded-xl transition-all duration-200 ${
                activePage === item.id
                  ? 'bg-gradient-to-r from-cyan-600/30 to-teal-600/30 border border-cyan-500/50 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title={!sidebarOpen ? item.title : ''}
            >
              {Icon && <Icon className={`${sidebarOpen ? 'w-5 h-5' : 'w-5 h-5'}`} />}
              {sidebarOpen && (
                <div className="text-left">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-3 left-3 right-3">
        {sidebarOpen ? (
          <div className="bg-slate-700/50 rounded-xl p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </div>
              </div>
            </div>
             <button 
               onClick={onSignoutClick}
               className="text-slate-400 hover:text-white text-sm transition-colors hover:scale-105"
             >
               Sign Out
             </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div 
              className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" 
              title={user ? `${user.firstName} ${user.lastName}` : 'User'}
            >
              <span className="text-white text-sm font-bold">
                {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'}
              </span>
            </div>
          </div>
        )}
      </div>

     </div>
   );
 }