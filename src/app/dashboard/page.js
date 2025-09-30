'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/layout/PageHeader';
import DashboardContent from '@/components/pages/DashboardContent';
import OnboardingContent from '@/components/pages/OnboardingContent';
import SettingsContent from '@/components/pages/SettingsContent';
import PatientsContent from '@/components/pages/PatientsContent';
import SessionsContent from '@/components/pages/SessionsContent';
import IntegrationContent from '@/components/pages/IntegrationContent';
import ResourcesContent from '@/components/pages/ResourcesContent';
import ReportsContent from '@/components/pages/ReportsContent';
import AddPatientModal from '@/components/modals/AddPatientModal';
import ImportPatientModal from '@/components/modals/ImportPatientModal';
import CreateTreatmentPlanModal from '@/components/modals/CreateTreatmentPlanModal';
import SignoutModal from '@/components/modals/SignoutModal';
import SuccessAlert from '@/components/ui/SuccessAlert';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Modal states for onboarding
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showImportPatient, setShowImportPatient] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState({ isOpen: false, title: '', message: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      description: 'Account & Preferences'
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: '📊',
      description: 'Analytics & Insights'
    }
  ];

  // Modal handlers
  const handleAddPatient = (newPatient, responseData) => {
    console.log('New patient added:', newPatient);
    console.log('Response data:', responseData);
    
    // Trigger dashboard refresh
    setRefreshTrigger(prev => prev + 1);
    
    // Show success message with custom alert
    let message = `${newPatient.name} has been successfully added to your patient database.`;
    
    if (responseData?.hasEmail) {
      const details = [];
      if (responseData.patientUserCreated) details.push('User account created');
      if (responseData.credentialsEmailSent) details.push('Login credentials sent');
      if (responseData.welcomeEmailSent) details.push('Welcome email sent');
      
      if (details.length > 0) {
        message += ` ${details.join(', ')}.`;
      }
    } else {
      message += " Note: No email provided - no user account or emails sent.";
    }
    
    setShowSuccessAlert({
      isOpen: true,
      title: "Patient Added Successfully!",
      message: message
    });
  };

  const handleImportPatients = (importedPatients) => {
    console.log('Patients imported:', importedPatients);
    alert(`${importedPatients.length} patients have been successfully imported!`);
  };

  const handleCreatePlan = (treatmentPlan) => {
    console.log('Treatment plan created:', treatmentPlan);
    alert(`Treatment plan for ${treatmentPlan.patientName} has been created!`);
  };

  const handleSignoutClick = () => {
    setShowSignoutModal(true);
  };

  const handleSignoutConfirm = async () => {
    await logout();
    setShowSignoutModal(false);
  };

  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardContent onAddPatient={() => setShowAddPatient(true)} refreshTrigger={refreshTrigger} />;
      case 'onboarding':
        return (
          <OnboardingContent 
            onAddPatient={() => setShowAddPatient(true)}
            onImportPatient={() => setShowImportPatient(true)}
            onCreatePlan={() => setShowCreatePlan(true)}
          />
        );
      case 'sessions':
        return <SessionsContent />;
      case 'integration':
        return <IntegrationContent />;
      case 'resources':
        return <ResourcesContent />;
      case 'reports':
        return <ReportsContent />;
      case 'settings':
        return <SettingsContent />;
      case 'patients':
        return <PatientsContent />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{sidebarItems.find(item => item.id === activePage)?.icon}</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {sidebarItems.find(item => item.id === activePage)?.title}
            </h3>
            <p className="text-slate-400">This page is coming soon...</p>
          </div>
        );
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 mx-auto mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AnimatedBackground />

      {/* 3D Perspective Container */}
      <div className="relative z-10 h-screen flex" style={{ perspective: '1000px' }}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          onSignoutClick={handleSignoutClick}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col px-4 py-4 overflow-hidden">
          <div 
            className="w-full max-w-6xl mx-auto transform-gpu transition-all duration-300 ease-out"
            style={{
              transform: `rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg) translateZ(0)`
            }}
          >
            <GlassCard>
              <div className="p-6 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-slate-800/30">
                <PageHeader 
                  title={sidebarItems.find(item => item.id === activePage)?.title || 'Dashboard'}
                  description={sidebarItems.find(item => item.id === activePage)?.description || 'Clinical management and patient care'}
                />
                {renderPageContent()}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Modals - Render at root level to avoid overflow clipping */}
      <AddPatientModal
        isOpen={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        onSave={handleAddPatient}
      />

      <ImportPatientModal
        isOpen={showImportPatient}
        onClose={() => setShowImportPatient(false)}
        onImport={handleImportPatients}
      />

      <CreateTreatmentPlanModal
        isOpen={showCreatePlan}
        onClose={() => setShowCreatePlan(false)}
        onSave={handleCreatePlan}
      />

      <SignoutModal
        isOpen={showSignoutModal}
        onClose={() => setShowSignoutModal(false)}
        onConfirm={handleSignoutConfirm}
      />

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