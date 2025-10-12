'use client';

import { useState } from 'react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import NotificationAlert from '@/components/ui/NotificationAlert';
import { useRouter } from 'next/navigation';

export default function FoundingPartnerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    clinicName: '',
    clinicWebsite: '',
    clinicLocation: '',
    phone: '',
    patientsPerMonth: '',
    currentSystems: '',
    challenges: '',
    vision: '',
    timeline: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/forms/partner-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setNotification({
          type: 'error',
          message: 'There was an error submitting your application. Please try again or email us directly at contact@lmn8.io'
        });
        console.error('Application error:', result);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setNotification({
        type: 'error',
        message: 'There was an error submitting your application. Please try again or email us directly at contact@lmn8.io'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen bg-bg-dark overflow-hidden">
        {/* Notification Alert */}
        {notification && (
          <NotificationAlert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        <AnimatedBackground />
        
        <div className="relative z-10 px-6 lg:px-12 py-16">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-12 lg:p-16 text-center">
              <div className="text-6xl mb-6">✓</div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 mb-6">
                Application Received
              </h1>
              <p className="text-xl text-text-85 mb-8 leading-relaxed">
                Thank you for your interest in becoming a Founding Partner. Your application demonstrates a commitment to therapeutic excellence that aligns with our mission.
              </p>
              <p className="text-lg text-text-85 mb-8">
                We review each application carefully and thoughtfully. A member of our team will reach out within 3-5 business days to discuss the next steps in this partnership journey.
              </p>
              <div className="border-t border-ui-secondary/30 pt-8 mt-8">
                <p className="text-text-60 text-sm mb-6">
                  In the meantime, you may close this window or return to our main site.
                </p>
                <button
                  onClick={() => window.close()}
                  className="btn-secondary px-8 py-3 mr-4"
                >
                  Close Window
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary px-8 py-3"
                >
                  Return to Home
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-dark overflow-hidden">
      {/* Notification Alert */}
      {notification && (
        <NotificationAlert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <AnimatedBackground />
      
      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12 border-b border-ui-secondary/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center">
            <span className="text-bg-dark font-bold text-lg">L8</span>
          </div>
          <div>
            <span className="text-text-100 font-serif text-2xl font-bold tracking-wider">LMN8</span>
            <span className="text-text-60 text-xs block -mt-1">ClinicOS</span>
          </div>
        </div>
        
        <button
          onClick={() => window.close()}
          className="text-text-60 hover:text-text-100 transition-colors"
        >
          Close
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-accent-primary text-sm uppercase tracking-widest mb-4 font-semibold">
              Exclusive Opportunity
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-text-100 mb-6">
              Founding Partnership Application
            </h1>
            <p className="text-xl text-text-85 leading-relaxed max-w-3xl mx-auto">
              Join a select group of exceptional clinics shaping the future of therapeutic presence technology
            </p>
          </div>

          {/* Context Section */}
          <GlassCard className="p-8 lg:p-12 mb-12 border border-accent-primary/20">
            <h2 className="text-2xl font-serif font-bold text-text-100 mb-6">
              What Founding Partnership Means
            </h2>
            
            <div className="space-y-4 text-text-85 mb-8">
              <p className="leading-relaxed">
                Founding Partners are not customers—they are co-creators. We're seeking clinics that understand the profound cost of patient abandonment and share our vision for therapeutic technology that witnesses rather than manages.
              </p>
              <p className="leading-relaxed">
                This partnership is intentionally limited. We're building with a small group of aligned clinics who will shape LMN8's evolution from inception.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-ui-secondary/30 rounded-lg p-6">
                <h3 className="text-lg font-serif font-semibold text-accent-primary mb-3">
                  Founding Partner Benefits
                </h3>
                <ul className="space-y-2 text-sm text-text-85">
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Lifetime preferential pricing and access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Direct influence on product development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Equity-aligned advantages as we grow</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Priority support and implementation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Recognition as founding member of the movement</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ui-secondary/30 rounded-lg p-6">
                <h3 className="text-lg font-serif font-semibold text-accent-primary mb-3">
                  What We're Looking For
                </h3>
                <ul className="space-y-2 text-sm text-text-85">
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Clinics committed to therapeutic excellence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Leadership that values presence over optimization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Willingness to collaborate on development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Alignment with our mission and values</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span>Active ketamine therapy practice</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Application Form */}
          <GlassCard className="p-8 lg:p-12">
            <h2 className="text-3xl font-serif font-bold text-text-100 mb-8">
              Your Application
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-6 pb-2 border-b border-ui-secondary/30">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange('name')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Role/Title *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="e.g., Founder, Medical Director"
                      value={formData.role}
                      onChange={handleChange('role')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="input-field"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                    />
                  </div>
                </div>
              </div>

              {/* Clinic Information */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-6 pb-2 border-b border-ui-secondary/30">
                  Clinic Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Clinic Name *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Your clinic's name"
                      value={formData.clinicName}
                      onChange={handleChange('clinicName')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-85 mb-2 font-semibold">Clinic Website</label>
                      <input
                        type="url"
                        className="input-field"
                        placeholder="https://yourclinic.com"
                        value={formData.clinicWebsite}
                        onChange={handleChange('clinicWebsite')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-text-85 mb-2 font-semibold">Clinic Location *</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="City, State"
                        value={formData.clinicLocation}
                        onChange={handleChange('clinicLocation')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Ketamine Therapy Patients per Month *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Approximate number"
                      value={formData.patientsPerMonth}
                      onChange={handleChange('patientsPerMonth')}
                    />
                    <p className="text-text-60 text-sm mt-2">This helps us understand your practice scale</p>
                  </div>

                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Current Systems & Tools *</label>
                    <textarea
                      required
                      rows="3"
                      className="input-field"
                      placeholder="What systems do you currently use for patient care, EMR, communication, etc.?"
                      value={formData.currentSystems}
                      onChange={handleChange('currentSystems')}
                    />
                  </div>
                </div>
              </div>

              {/* Vision & Alignment */}
              <div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-6 pb-2 border-b border-ui-secondary/30">
                  Vision & Alignment
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">
                      What are your clinic's biggest challenges in post-session integration? *
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="input-field"
                      placeholder="Share the specific challenges you face in supporting patients after ketamine therapy sessions..."
                      value={formData.challenges}
                      onChange={handleChange('challenges')}
                    />
                  </div>

                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">
                      Why does the LMN8 vision resonate with you? *
                    </label>
                    <textarea
                      required
                      rows="5"
                      className="input-field"
                      placeholder="What about our approach to therapeutic presence technology aligns with your values and vision for patient care?"
                      value={formData.vision}
                      onChange={handleChange('vision')}
                    />
                    <p className="text-text-60 text-sm mt-2">
                      This is the most important part of your application. Help us understand your perspective.
                    </p>
                  </div>

                  <div>
                    <label className="block text-text-85 mb-2 font-semibold">Implementation Timeline *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.timeline}
                      onChange={handleChange('timeline')}
                    >
                      <option value="">Select a timeframe...</option>
                      <option value="immediate">Immediate (Ready to start within 30 days)</option>
                      <option value="1-3months">1-3 months</option>
                      <option value="3-6months">3-6 months</option>
                      <option value="exploring">Exploring for future consideration</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Commitment Statement */}
              <div className="bg-ui-secondary/20 rounded-lg p-6 border border-accent-primary/20">
                <p className="text-text-85 text-sm leading-relaxed italic">
                  By submitting this application, I confirm that I am authorized to represent this clinic, that the information provided is accurate, and that we are genuinely interested in becoming a Founding Partner to help shape the future of therapeutic presence technology.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary text-lg px-12 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-text-60 text-sm">
              Questions about the Founding Partnership? Email us at{' '}
              <a href="mailto:founding@lmn8.io" className="text-accent-primary hover:text-accent-highlight transition-colors">
                founding@lmn8.io
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

