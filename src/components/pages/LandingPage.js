'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const features = [
    {
      icon: "🧘",
      title: "Personalized Journey",
      description: "Discover your unique path with our Full-Track or Fast-Track onboarding experience tailored to your needs."
    },
    {
      icon: "💭",
      title: "Mindful Reflection",
      description: "Explore your inner landscape through guided questions that help you understand your values and aspirations."
    },
    {
      icon: "🌱",
      title: "Growth Support",
      description: "Get personalized guidance and reminders to help you stay grounded and focused on your personal development."
    },
    {
      icon: "🔗",
      title: "Safe Connection",
      description: "Connect with your support system and access resources designed to nurture your mental wellness journey."
    }
  ];

  return (
    <div className="relative min-h-screen bg-bg-dark overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
            <span className="text-bg-dark font-bold text-lg">L</span>
          </div>
          <span className="text-text-100 font-serif text-xl font-semibold">Luminate</span>
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
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="btn-primary px-6 py-2"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-text-100 mb-6 leading-tight">
              Illuminate Your
              <span className="block text-accent-primary">Inner Journey</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-text-85 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover your unique path to mental wellness through personalized guidance, 
              mindful reflection, and compassionate support designed just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                {isAuthenticated ? 'Continue Your Journey' : 'Start Your Journey'}
              </button>
              
              {!isAuthenticated && (
                <button
                  onClick={() => router.push('/login')}
                  className="btn-secondary text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <div className="text-text-100 font-semibold mb-2">Secure & Private</div>
                <div className="text-text-60">Your personal journey is protected with enterprise-grade security</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <div className="text-text-100 font-semibold mb-2">Personalized</div>
                <div className="text-text-60">Tailored guidance based on your unique needs and goals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💝</div>
                <div className="text-text-100 font-semibold mb-2">Compassionate</div>
                <div className="text-text-60">Gentle, supportive approach to your mental wellness journey</div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {features.map((feature, index) => (
              <GlassCard key={index} className="p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-85 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* How It Works Section */}
          <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 mb-16">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="relative">
                <div className="w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center text-bg-dark font-bold text-xl mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-4">
                  Choose Your Path
                </h3>
                <p className="text-text-85">
                  Select between our comprehensive Full-Track or streamlined Fast-Track onboarding experience.
                </p>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center text-bg-dark font-bold text-xl mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-4">
                  Share Your Story
                </h3>
                <p className="text-text-85">
                  Answer thoughtful questions about your values, aspirations, and personal journey.
                </p>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center text-bg-dark font-bold text-xl mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-4">
                  Begin Your Journey
                </h3>
                <p className="text-text-85">
                  Receive personalized guidance and support tailored to your unique needs and goals.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={`mt-20 mb-20 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 text-center mb-16">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-3">
                  What's the difference between Full-Track and Fast-Track?
                </h3>
                <p className="text-text-85">
                  Full-Track includes 13 comprehensive questions for deep personalization, while Fast-Track offers 8 essential questions for quick setup. Both paths lead to personalized guidance tailored to your needs.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-3">
                  Is my personal information secure?
                </h3>
                <p className="text-text-85">
                  Absolutely. We use enterprise-grade security to protect your data. Your personal journey and reflections are encrypted and stored securely, and we never share your information without your explicit consent.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-3">
                  How often should I use Luminate?
                </h3>
                <p className="text-text-85">
                  You can use Luminate as often as you'd like. Many people find daily reflection helpful, while others prefer weekly check-ins. The platform adapts to your pace and provides gentle reminders when you need them.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h3 className="text-xl font-serif font-semibold text-text-100 mb-3">
                  Can I change my answers later?
                </h3>
                <p className="text-text-85">
                  Yes! Your journey is dynamic, and you can update your profile anytime. As you grow and change, your guidance will evolve with you to reflect your current needs and aspirations.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Contact Support Section */}
          <div className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-text-100 text-center mb-16">
              We're Here to Help
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <GlassCard className="p-8 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-serif font-semibold text-text-100 mb-4">
                  Get Support
                </h3>
                <p className="text-text-85 mb-6">
                  Have questions or need help getting started? Our support team is here to assist you on your journey.
                </p>
                <button className="btn-secondary px-6 py-3">
                  Contact Support
                </button>
              </GlassCard>
              
              <GlassCard className="p-8 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-serif font-semibold text-text-100 mb-4">
                  Learn More
                </h3>
                <p className="text-text-85 mb-6">
                  Explore our resources and guides to make the most of your mental wellness journey with Luminate.
                </p>
                <button className="btn-secondary px-6 py-3">
                  View Resources
                </button>
              </GlassCard>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center mt-20 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <GlassCard className="p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-text-100 mb-6">
                Ready to Illuminate Your Path?
              </h2>
              <p className="text-lg text-text-85 mb-8 max-w-2xl mx-auto">
                Begin your personalized journey to mental wellness today. Discover your inner strength and find clarity in your path forward.
              </p>
              <button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                {isAuthenticated ? 'Continue Your Journey' : 'Start Your Journey Today'}
              </button>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ui-secondary/30 mt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
                  <span className="text-bg-dark font-bold text-lg">L</span>
                </div>
                <span className="text-text-100 font-serif text-xl font-semibold">Luminate</span>
              </div>
              <p className="text-text-85 mb-4 max-w-md">
                Illuminating paths to mental wellness through personalized guidance, mindful reflection, and compassionate support.
              </p>
              <div className="flex space-x-4">
                <button className="text-text-60 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Email</span>
                  📧
                </button>
                <button className="text-text-60 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </button>
                <button className="text-text-60 hover:text-accent-primary transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-text-100 font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">About Us</button></li>
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">How It Works</button></li>
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">Privacy Policy</button></li>
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">Terms of Service</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-text-100 font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">Help Center</button></li>
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">Contact Us</button></li>
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">FAQ</button></li>
                <li><button className="text-text-60 hover:text-accent-primary transition-colors text-left">Resources</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-ui-secondary/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-text-60 text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2024 Luminate. All rights reserved.</p>
                <p className="text-sm mt-1">Illuminating paths to mental wellness.</p>
              </div>
              
              <div className="text-text-60 text-sm text-center md:text-right">
                <p>Made with 💚 for your mental wellness journey</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
