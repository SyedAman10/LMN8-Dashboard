'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import OceanStarryBackground from '@/components/ui/OceanStarryBackground';
import MountainBackground from '@/components/ui/MountainBackground';
import GlassCard from '@/components/ui/GlassCard';
import NotificationAlert from '@/components/ui/NotificationAlert';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [notification, setNotification] = useState(null);
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    email: '',
    clinicName: '',
    phone: ''
  });
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setSubmittingDemo(true);
    
    try {
      const response = await fetch('/api/forms/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoFormData),
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Thank you for your interest! We\'ll be in touch within 24 hours to schedule your demo.'
        });
        setShowDemoForm(false);
        setDemoFormData({ name: '', email: '', clinicName: '', phone: '' });
      } else {
        setNotification({
          type: 'error',
          message: 'There was an error submitting your request. Please try again or email us directly.'
        });
        console.error('Demo request error:', result);
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setNotification({
        type: 'error',
        message: 'There was an error submitting your request. Please try again or email us directly.'
      });
    } finally {
      setSubmittingDemo(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    
    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Thank you for reaching out! We\'ll respond to your message within 24-48 hours.'
        });
        setShowContactForm(false);
        setContactFormData({ name: '', email: '', subject: '', message: '' });
    } else {
        setNotification({
          type: 'error',
          message: 'There was an error submitting your message. Please try again or email us directly.'
        });
        console.error('Contact form error:', result);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setNotification({
        type: 'error',
        message: 'There was an error submitting your message. Please try again or email us directly.'
      });
    } finally {
      setSubmittingContact(false);
    }
  };

  const solutions = [
    {
      icon: "🛡️",
      title: "Zero-Failure Commitment",
      description: "Reliable support during every vulnerable moment. When internet fails, when servers crash, when patients need support at 3am—LMN8 remains present."
    },
    {
      icon: "🔗",
      title: "Integration Excellence",
      description: "Address the critical post-session phase that 73% of clinics miss entirely. Transform your biggest weakness into your strongest competitive advantage. Completion rates rise from 73% to 96%."
    },
    {
      icon: "💝",
      title: "Therapeutic Relationship Enhancement",
      description: "Your patients' healing journey is preserved and honored across time. Metaphors evolve, breakthroughs build on each other, and no patient ever has to start over or feel forgotten."
    }
  ];

  const businessOutcomes = [
    {
      icon: "🤝",
      title: "Deeper Patient Engagement",
      description: "When patients feel genuinely witnessed and never abandoned, they engage more fully in treatment. Trust deepens. Vulnerability increases. Healing accelerates."
    },
    {
      icon: "⭐",
      title: "Enhanced Reputation",
      description: "Word spreads when patients experience truly transformative care. Your clinic becomes known for the depth and quality of therapeutic relationships, not operational efficiency."
    },
    {
      icon: "📈",
      title: "Sustainable Growth",
      description: "Better therapeutic relationships create more referrals, higher patient satisfaction, and stronger insurance relationships. Growth emerges from excellence, not marketing."
    },
    {
      icon: "✨",
      title: "Clinical Staff Fulfillment",
      description: "When technology enhances rather than replaces therapeutic work, clinicians rediscover why they entered this field. Burnout decreases. Meaning increases."
    }
  ];

  const faqs = [
    {
      question: "How does this integrate with our existing systems?",
      answer: "LMN8 enhances your current workflows without disrupting established processes. It works behind the scenes to strengthen therapeutic relationships, not complicate them."
    },
    {
      question: "What's the learning curve for our staff?",
      answer: "Minimal. LMN8 is designed to feel natural and intuitive. Your clinical team focuses on what they do best—providing therapeutic care—while LMN8 handles presence and continuity."
    },
    {
      question: "How do we measure the impact?",
      answer: "Beyond traditional metrics, LMN8 tracks therapeutic relationship quality, integration success, and patient-reported sense of being witnessed. These deeper measures correlate with better clinical outcomes and stronger business performance."
    },
    {
      question: "What makes this different from other clinic software?",
      answer: "LMN8 isn't clinic management software. It's therapeutic presence technology. While others focus on operational efficiency, we focus on ensuring patients never feel abandoned during their healing journey."
    }
  ];

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

      {/* Use OceanStarryBackground only for hero section */}
      <div className="absolute inset-0 w-full h-screen overflow-hidden">
        <OceanStarryBackground />
      </div>
      
      {/* AnimatedBackground for sections after mountains */}
      <div className="absolute w-full h-full" style={{ top: '100vh', left: 0, right: 0, bottom: 0 }}>
      <AnimatedBackground />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12 backdrop-blur-sm bg-bg-dark/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center">
            <span className="text-bg-dark font-bold text-lg">L8</span>
          </div>
          <div>
            <span className="text-text-100 font-serif text-2xl font-bold tracking-wider">LMN8</span>
            <span className="text-text-60 text-xs block -mt-1">ClinicOS</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {isAuthenticated ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-primary px-6 py-2"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="btn-secondary px-6 py-2"
                  >
                    Staff Login
                  </button>
                  <button
                    onClick={() => setShowDemoForm(true)}
                    className="btn-primary px-6 py-2"
                  >
                    Schedule Demo
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-12 mb-0">
        <div className="max-w-6xl mx-auto w-full">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-text-100 mb-8 leading-tight drop-shadow-lg">
              Technology Built to Heal,
              <span className="block text-accent-primary mt-2">Not Replace</span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-text-100 mb-6 max-w-4xl mx-auto leading-relaxed font-serif drop-shadow-md">
              LMN8 ensures no ketamine therapy patient ever experiences abandonment during their most vulnerable moments.
            </p>

            <p className="text-lg lg:text-xl text-text-85 mb-8 max-w-4xl mx-auto italic drop-shadow-md">
              Built by a veteran who's been in that chair.
            </p>

            <p className="text-base lg:text-lg text-text-85 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
              When therapeutic technology fails during crisis moments, patients lose trust. When systems forget their breakthroughs, healing stalls. When post-session support disappears, transformation becomes trauma. LMN8 was built to solve the problem every ketamine clinic faces: ensuring unwavering presence when patients need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowDemoForm(true)}
                className="btn-primary text-lg px-10 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-xl"
              >
                Schedule Your Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Challenges Section with Mountain Background - No Gap */}
      <section className="relative px-6 lg:px-12 py-20 lg:py-32 overflow-hidden -mt-20">
        {/* Mountain Background */}
        <div className="absolute inset-0">
          <MountainBackground />
            </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <GlassCard className="p-12 lg:p-16 bg-container/60 backdrop-blur-md border-2 border-accent-primary/20">
                <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 mb-8">
                  The Crisis Every Clinic Faces
                </h2>
                <h3 className="text-2xl lg:text-3xl font-serif text-accent-primary mb-8">
                  The Hidden Cost of Patient Abandonment
                </h3>
                
                <div className="text-5xl lg:text-6xl font-bold text-accent-primary mb-6">
                  27%
              </div>

                <p className="text-xl lg:text-2xl text-text-100 mb-6 leading-relaxed">
                  27% of ketamine therapy patients fail to complete integration. The reason isn't the medicine. It's abandonment.
                </p>
                
                <p className="text-lg text-text-85 mb-4 leading-relaxed">
                  Patients left alone in their most vulnerable states. Current "mental health tech" only makes it worse—apps that replace the therapeutic relationship, dashboards that optimize metrics but not lives.
                </p>
                
                <p className="text-lg text-text-85 leading-relaxed">
                  The result: broken trust, failed outcomes, lost referrals, and burned-out clinicians who entered this work to heal, not manage data.
                </p>
              </div>
            </GlassCard>
              </div>
            </div>
      </section>

      {/* Solution & Outcomes Section - Unified */}
      <section className="relative z-10 px-6 lg:px-12 py-16 lg:py-24 bg-gradient-to-b from-bg-dark via-container/10 to-bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 mb-6">
                The LMN8 Solution
              </h2>
              <p className="text-2xl text-accent-primary font-serif mb-6">
                Therapeutic Presence Technology
              </p>
              <p className="text-lg text-text-85 max-w-3xl mx-auto leading-relaxed">
                LMN8 is built to strengthen, not replace. It doesn't optimize—it preserves presence. It ensures your patients never walk the healing path alone.
              </p>
          </div>

            {/* Core Solutions - Prominent Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {solutions.map((solution, index) => (
                <GlassCard key={index} className="p-8 hover:scale-105 transition-transform duration-300 border border-accent-primary/20 flex flex-col h-full">
                  <div className="text-5xl mb-6 h-16 flex items-center justify-start">{solution.icon}</div>
                  <h3 className="text-2xl font-serif font-semibold text-text-100 mb-4 h-16 flex items-start">
                    {solution.title}
                </h3>
                  <p className="text-text-85 leading-relaxed flex-1 text-base">
                    {solution.description}
                </p>
              </GlassCard>
            ))}
          </div>

            {/* Transition Element */}
            <div className="flex items-center justify-center mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"></div>
              <div className="px-8">
                <button
                  onClick={() => {
                    const outcomesSection = document.getElementById('outcomes-section');
                    if (outcomesSection) {
                      const yOffset = -150; // Offset to keep some content visible above
                      const y = outcomesSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="text-accent-primary text-4xl hover:text-accent-highlight transition-all duration-300 hover:scale-125 animate-bounce cursor-pointer focus:outline-none group"
                  aria-label="Scroll to outcomes"
                >
              <div className="relative">
                    ↓
                    <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
                </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"></div>
                </div>
              
            {/* Outcomes Header */}
            <div id="outcomes-section" className="text-center mb-12 scroll-mt-24">
              <h3 className="text-3xl lg:text-4xl font-serif font-bold text-text-100 mb-4">
                What This Means for Your Clinic
                </h3>
              <p className="text-xl text-accent-primary font-serif">
                The Natural Outcomes of Therapeutic Excellence
                </p>
              </div>
              
            {/* Business Outcomes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessOutcomes.map((outcome, index) => (
                <div key={index} className="group h-full">
                  <div className="bg-ui-secondary/30 backdrop-blur-sm rounded-xl p-6 h-full border border-ui-secondary/50 hover:border-accent-primary/50 transition-all duration-300 hover:transform hover:scale-105 flex flex-col">
                    <div className="text-4xl mb-4 h-12 flex items-center justify-start group-hover:scale-110 transition-transform duration-300">{outcome.icon}</div>
                    <h4 className="text-xl font-serif font-semibold text-text-100 mb-3 h-14 flex items-start">
                      {outcome.title}
                    </h4>
                    <p className="text-text-85 text-sm leading-relaxed flex-1">
                      {outcome.description}
                </p>
              </div>
                </div>
              ))}
            </div>
          </div>
                </div>
      </section>

      {/* Founding Partner Section - Premium */}
      <section className="relative z-10 px-6 lg:px-12 py-20 lg:py-32 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-highlight/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Premium Card */}
            <div className="relative group">
              {/* Luxurious outer glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-primary via-accent-highlight to-accent-primary rounded-2xl opacity-20 blur-2xl group-hover:opacity-40 transition-all duration-1000 animate-pulse" style={{ animationDuration: '6s' }}></div>
              
              {/* Premium border animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary via-accent-highlight to-accent-primary rounded-2xl opacity-50 blur-sm"></div>
              
              <GlassCard className="relative p-12 lg:p-16 bg-gradient-to-br from-container via-ui-secondary/40 to-container border-2 border-accent-primary/50">
                
                {/* Decorative corner flourishes */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-accent-primary/40 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-accent-primary/40 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-accent-primary/40 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-accent-primary/40 rounded-br-2xl"></div>

                <div className="text-center max-w-4xl mx-auto relative z-10">
                  
                  {/* Premium Badge */}
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/30 mb-8">
                    <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
                    <span className="text-accent-primary text-xs uppercase tracking-[0.3em] font-bold">
                      Exclusive Opportunity
                    </span>
                    <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
                  </div>
                  
                  {/* Main Heading */}
                  <h2 className="text-5xl lg:text-6xl font-serif font-bold text-text-100 mb-6 leading-tight">
                    A Rare Invitation
                  </h2>
                  
                  {/* Divider with center ornament */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent-primary"></div>
              <div className="relative">
                      <div className="w-3 h-3 bg-accent-primary rounded-full"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-accent-primary rounded-full animate-ping"></div>
                    </div>
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent-primary"></div>
                </div>
                  
                  <p className="text-2xl lg:text-3xl text-accent-primary font-serif mb-12 italic">
                    Founding Partnership Opportunity
                  </p>
                  
                  {/* Content with enhanced spacing */}
                  <div className="space-y-6 mb-12">
                    <p className="text-xl text-text-85 leading-relaxed">
                      We are inviting a <span className="text-accent-primary font-semibold">select few exceptional clinics</span> to shape LMN8 from inception. This isn't an offer—it's an alignment.
                    </p>
                    
                    <p className="text-lg text-text-85 leading-relaxed">
                      Founding Partners understand the cost of abandonment and the inevitability of this solution. They see beyond operational efficiency to the profound transformation possible when technology serves therapeutic relationship.
                    </p>
                    
                    <p className="text-lg text-text-85 leading-relaxed italic">
                      If you've read this far, if this vision resonates deeply, if you recognize the sacred work of witnessing human transformation—you may be ready for this partnership.
                </p>
              </div>
              
                  {/* Premium Benefits Box */}
                  <div className="relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-accent-highlight/20 rounded-xl blur-xl"></div>
                    <div className="relative bg-ui-secondary/60 backdrop-blur-sm rounded-xl p-8 border border-accent-primary/30">
                      <div className="text-accent-primary text-xs uppercase tracking-widest font-bold mb-4">
                        Partnership Benefits
                </div>
                      <p className="text-text-100 text-lg leading-relaxed">
                        Founding Partners receive <span className="text-accent-primary font-semibold">lifetime preferential access</span>, <span className="text-accent-primary font-semibold">equity-aligned advantages</span>, and a <span className="text-accent-primary font-semibold">permanent place</span> in the origin of a movement that will transform therapeutic technology worldwide.
                </p>
              </div>
            </div>

                  {/* Premium CTA */}
                  <div className="relative inline-block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-highlight rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                    <a
                      href="/founding-partner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative btn-primary text-lg px-12 py-5 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-accent-primary inline-flex items-center gap-3 font-semibold"
                    >
                      <span>Apply for Founding Partnership</span>
                      <span className="text-xl">→</span>
                    </a>
                  </div>

                  {/* Limited availability notice */}
                  <p className="text-text-60 text-sm mt-8 italic">
                    Limited to a small cohort of visionary partners
                  </p>

                </div>

                {/* Subtle animated particles */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent-primary rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent-highlight rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-accent-primary rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
                
              </GlassCard>
          </div>

          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="relative z-10 px-6 lg:px-12 py-16 lg:py-24 bg-gradient-to-b from-bg-dark to-container/20">
        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Elegant Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 mb-4">
                Built by Someone Who's Been There
            </h2>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent-primary"></div>
                <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent-primary"></div>
            </div>
          </div>

            {/* Quote Card with Animations */}
            <div className="relative group">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-highlight/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
              
              <GlassCard className="relative p-8 lg:p-12 border border-accent-primary/30">
                {/* Opening Quote Mark */}
                <div className="text-accent-primary/40 text-6xl font-serif leading-none mb-4">"</div>
                
                {/* Quote Content */}
                <div className="space-y-6 mb-6">
                  <p className="text-lg lg:text-xl text-text-85 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    I know what it's like to be <span className="text-accent-primary font-semibold">abandoned in treatment</span>. As a combat veteran with PTSD, I went through ketamine therapy myself. The medicine opened me—but the system left me alone when I needed support the most.
                  </p>
                  
                  <p className="text-lg lg:text-xl text-text-85 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    LMN8 was born to end that failure. To build therapeutic technology that <span className="text-accent-primary font-semibold">deepens trust</span> instead of replacing it. Anti-fragile, radically ethical, designed for healing above all else.
                  </p>
                  
                  <p className="text-xl lg:text-2xl text-accent-primary font-serif italic animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    This isn't just business. It's mission.
                  </p>
                </div>

                {/* Closing Quote Mark */}
                <div className="text-accent-primary/40 text-6xl font-serif leading-none text-right">"</div>

                {/* Connection Line */}
                <div className="my-8 flex items-center justify-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"></div>
                </div>

                {/* Attribution */}
                <div className="text-center">
                  <p className="text-text-100 font-semibold mb-1">Founder</p>
                  <p className="text-accent-primary text-sm uppercase tracking-widest">LMN8</p>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent-primary/30 rounded-tl-lg animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent-primary/30 rounded-br-lg animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
              </GlassCard>
            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Integration Advantage Section - Data-Focused */}
      <section className="relative z-10 px-6 lg:px-12 py-16 lg:py-24 bg-gradient-to-b from-bg-dark to-container/20">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 mb-6">
                The Integration Advantage
              </h2>
              <p className="text-2xl text-accent-primary font-serif mb-6">
                The Critical Phase Most Clinics Miss
              </p>
              <p className="text-lg text-text-85 max-w-4xl mx-auto leading-relaxed">
                Post-session integration is where transformation either solidifies or dissolves. It's the most vulnerable phase of healing—and the most neglected by current systems.
              </p>
            </div>

            {/* Stats Comparison Card */}
            <GlassCard className="p-8 lg:p-12 mb-12 border-2 border-accent-primary/20">
              <div className="text-center mb-8">
                <div className="inline-block px-6 py-2 bg-accent-primary/10 rounded-full border border-accent-primary/30 mb-4">
                  <span className="text-accent-primary text-xs uppercase tracking-wider font-bold">Performance Data</span>
                </div>
              </div>

              {/* Main Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                
                {/* Industry Standard */}
                <div className="bg-error/5 border-2 border-error/30 rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="text-error text-xs uppercase tracking-wider font-bold mb-4">Industry Standard</div>
                    <div className="text-6xl lg:text-7xl font-bold text-error mb-2">73%</div>
                    <div className="text-text-85 text-sm mb-4">Integration Completion Rate</div>
                    <div className="h-px bg-error/30 mb-4"></div>
                    <div className="text-text-60 text-xs">
                      Based on industry-wide clinical data
                    </div>
                  </div>
                </div>

                {/* Arrow/Transformation */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl lg:text-6xl mb-4">→</div>
                    <div className="text-accent-primary font-semibold text-lg mb-2">+23%</div>
                    <div className="text-text-60 text-sm">Improvement</div>
                  </div>
                </div>

                {/* LMN8 Performance */}
                <div className="bg-accent-primary/5 border-2 border-accent-primary/50 rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="text-accent-primary text-xs uppercase tracking-wider font-bold mb-4">With LMN8</div>
                    <div className="text-6xl lg:text-7xl font-bold text-accent-primary mb-2">96%</div>
                    <div className="text-text-85 text-sm mb-4">Integration Completion Rate</div>
                    <div className="h-px bg-accent-primary/30 mb-4"></div>
                    <div className="text-text-60 text-xs">
                      Validated through consistent presence
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="bg-ui-secondary/30 rounded-xl overflow-hidden border border-ui-secondary/50">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-ui-secondary/50 border-b border-ui-secondary">
                  <div className="p-4 font-semibold text-text-100 text-sm uppercase tracking-wider">
                    Metric
                  </div>
                  <div className="p-4 font-semibold text-error text-sm uppercase tracking-wider border-l border-ui-secondary text-center">
                    Industry Gap
                  </div>
                  <div className="p-4 font-semibold text-accent-primary text-sm uppercase tracking-wider border-l border-ui-secondary text-center">
                    LMN8 Solution
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-ui-secondary/30">
                  <div className="grid grid-cols-3 hover:bg-ui-secondary/20 transition-colors">
                    <div className="p-4 text-text-85 text-sm">
                      Completion Rate
                    </div>
                    <div className="p-4 text-error text-center border-l border-ui-secondary/30">
                      <div className="font-bold text-2xl">73%</div>
                      <div className="text-xs text-text-60 mt-1">Standard</div>
                    </div>
                    <div className="p-4 text-accent-primary text-center border-l border-ui-secondary/30">
                      <div className="font-bold text-2xl">96%</div>
                      <div className="text-xs text-text-60 mt-1">Consistent</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 hover:bg-ui-secondary/20 transition-colors">
                    <div className="p-4 text-text-85 text-sm">
                      Post-Session Support
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <span className="text-error text-xl">×</span>
                      <div className="text-xs text-text-60 mt-1">Abandoned</div>
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <span className="text-accent-primary text-xl">✓</span>
                      <div className="text-xs text-text-60 mt-1">Continuous</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 hover:bg-ui-secondary/20 transition-colors">
                    <div className="p-4 text-text-85 text-sm">
                      Integration Tracking
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <span className="text-error text-xl">×</span>
                      <div className="text-xs text-text-60 mt-1">No System</div>
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <span className="text-accent-primary text-xl">✓</span>
                      <div className="text-xs text-text-60 mt-1">Personalized</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 hover:bg-ui-secondary/20 transition-colors">
                    <div className="p-4 text-text-85 text-sm">
                      Therapeutic Continuity
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <span className="text-error text-xl">×</span>
                      <div className="text-xs text-text-60 mt-1">Fragmented</div>
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <span className="text-accent-primary text-xl">✓</span>
                      <div className="text-xs text-text-60 mt-1">Preserved</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 hover:bg-ui-secondary/20 transition-colors">
                    <div className="p-4 text-text-85 text-sm">
                      Technology Approach
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <div className="text-error text-xs font-semibold">Manages</div>
                      <div className="text-xs text-text-60 mt-1">Metrics Focus</div>
                    </div>
                    <div className="p-4 text-center border-l border-ui-secondary/30">
                      <div className="text-accent-primary text-xs font-semibold">Witnesses</div>
                      <div className="text-xs text-text-60 mt-1">Healing Focus</div>
                    </div>
                  </div>
                </div>
              </div>
              </GlassCard>
              
            {/* Closing Statement */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xl text-text-85 italic leading-relaxed">
                This isn't just a feature—it's a <span className="text-accent-primary font-semibold">fundamental reimagining</span> of what therapeutic technology can be.
              </p>
            </div>

            </div>
          </div>
      </section>

      {/* Vision Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 lg:py-32 bg-gradient-to-b from-bg-dark via-container/10 to-bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-serif font-bold text-text-100 mb-12">
                The Future of Therapeutic Technology
            </h2>
            
              <p className="text-xl lg:text-2xl text-text-85 mb-8 leading-relaxed">
                In five years, LMN8 will be the foundation for therapeutic presence technology worldwide. Not a product. Not a protocol. A new standard of care: reliable presence in every healing journey.
              </p>
              
              <p className="text-2xl lg:text-3xl text-accent-primary font-serif italic">
                We're not building software. We're building a movement toward technology that serves healing rather than extracting from it.
              </p>
            </div>
            </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 text-center mb-16">
              Frequently Asked Questions
              </h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <GlassCard 
                  key={index} 
                  className="p-6 cursor-pointer hover:border-accent-primary transition-all duration-300"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-serif font-semibold text-text-100 pr-4">
                      {faq.question}
                    </h3>
                    <span className="text-2xl text-accent-primary flex-shrink-0">
                      {expandedFaq === index ? '−' : '+'}
                    </span>
                  </div>
                  {expandedFaq === index && (
                    <p className="text-text-85 mt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
            </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ui-secondary/50 bg-gradient-to-b from-bg-dark to-container/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            
            {/* Brand Column - Larger */}
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
                  <span className="text-bg-dark font-bold text-xl">L8</span>
                </div>
                <div>
                  <span className="text-text-100 font-serif text-2xl font-bold tracking-wider">LMN8</span>
                  <span className="text-text-60 text-xs block -mt-1 uppercase tracking-widest">ClinicOS</span>
                </div>
              </div>
              <p className="text-text-85 leading-relaxed mb-6">
                Therapeutic presence technology ensuring no ketamine therapy patient ever experiences abandonment during their most vulnerable moments.
              </p>
              <p className="text-text-60 text-sm italic">
                Technology built to heal, not replace.
              </p>
            </div>
            
            {/* Company Info */}
            <div className="md:col-span-4">
              <h3 className="text-text-100 font-semibold text-lg mb-4 uppercase tracking-wider text-sm">Company</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDemoForm(true)}
                  className="block text-text-85 hover:text-accent-primary transition-colors text-left"
                >
                  Schedule Demo
                </button>
                <a
                  href="/founding-partner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-text-85 hover:text-accent-primary transition-colors"
                >
                  Founding Partnership
                </a>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="block text-text-85 hover:text-accent-primary transition-colors text-left"
                >
                  Contact Us
                </button>
              </div>
            </div>
            
            {/* Get in Touch */}
            <div className="md:col-span-3">
              <h3 className="text-text-100 font-semibold text-lg mb-4 uppercase tracking-wider text-sm">Get in Touch</h3>
              <div className="space-y-3">
                <p className="text-text-85 text-sm leading-relaxed">
                  Have questions? We're here to help.
                </p>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="btn-primary text-sm px-6 py-2"
                >
                  Send Message
                </button>
                <p className="text-text-60 text-xs pt-2">
                  or email us at{' '}
                  <a href="mailto:contact@lmn8.io" className="text-accent-primary hover:text-accent-highlight transition-colors">
                    contact@lmn8.io
                  </a>
                </p>
            </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-ui-secondary/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="text-text-60 text-center md:text-left">
                <p>&copy; 2024 LMN8. All rights reserved.</p>
              </div>
              <div className="text-text-60 text-center md:text-right">
                <p className="text-xs">
                  LMN8 is therapeutic presence technology, not a replacement for professional clinical care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Form Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowDemoForm(false)}
              className="absolute top-4 right-4 text-text-60 hover:text-text-100 text-2xl"
            >
              ×
            </button>
            
            <h2 className="text-3xl font-serif font-bold text-text-100 mb-6">Schedule Your Demo</h2>
            
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-text-85 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={demoFormData.name}
                  onChange={(e) => setDemoFormData({...demoFormData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-text-85 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={demoFormData.email}
                  onChange={(e) => setDemoFormData({...demoFormData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-text-85 mb-2">Clinic Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={demoFormData.clinicName}
                  onChange={(e) => setDemoFormData({...demoFormData, clinicName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-text-85 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={demoFormData.phone}
                  onChange={(e) => setDemoFormData({...demoFormData, phone: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submittingDemo}
                className="btn-primary w-full py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submittingDemo ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-text-60 hover:text-text-100 text-2xl"
            >
              ×
            </button>
            
            <h2 className="text-3xl font-serif font-bold text-text-100 mb-6">Contact Us</h2>
            <p className="text-text-85 mb-6">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-text-85 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Your name"
                  value={contactFormData.name}
                  onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-text-85 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="your@email.com"
                  value={contactFormData.email}
                  onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-text-85 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="How can we help?"
                  value={contactFormData.subject}
                  onChange={(e) => setContactFormData({...contactFormData, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-text-85 mb-2">Message *</label>
                <textarea
                  required
                  rows="5"
                  className="input-field"
                  placeholder="Tell us more about your inquiry..."
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData({...contactFormData, message: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submittingContact}
                className="btn-primary w-full py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submittingContact ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
}
