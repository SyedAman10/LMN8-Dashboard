'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '🏠',
    description: 'Overview & Progress'
  },
  {
    id: 'patients',
    title: 'Patients',
    icon: '👥',
    description: 'Patient Management'
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    icon: '🌱',
    description: 'New Patient Setup'
  },
  {
    id: 'sessions',
    title: 'Sessions',
    icon: '🌊',
    description: 'Therapeutic Sessions'
  },
  {
    id: 'integration',
    title: 'Integration',
    icon: '🦋',
    description: 'Post-Session Processing'
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: '📚',
    description: 'Tools & Materials'
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: '📊',
    description: 'Analytics & Insights'
  },
  {
    id: 'locations',
    title: 'Locations',
    icon: '🏢',
    description: 'Multi-Location Management'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
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
          <div className="w-12 h-12 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">LMN8</span>
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
        {sidebarItems.map((item) => (
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
            <span className={`${sidebarOpen ? 'text-2xl' : 'text-xl'}`}>{item.icon}</span>
            {sidebarOpen && (
              <div className="text-left">
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>
            )}
          </button>
        ))}
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
                <div className="text-slate-400 text-xs">
                  {user?.role === 'clinician' ? 'Licensed Therapist' : 
                   user?.role === 'researcher' ? 'Researcher' : 
                   user?.role === 'student' ? 'Student' : 'User'}
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
