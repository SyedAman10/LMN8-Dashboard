'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Redirect if already authenticated
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Dynamic gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(91, 192, 190, 0.2) 0%, transparent 50%)`
          }}
        />
        
        {/* Floating 3D orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-600/15 to-teal-700/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-600/15 to-cyan-700/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-cyan-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 3D Perspective Container */}
      <div className="relative z-10 h-screen flex items-center justify-center px-4" style={{ perspective: '1000px' }}>
        {/* Main 3D Card Container */}
        <div className="relative max-w-6xl w-full">
          {/* Floating Header */}
          <div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-30"
            style={{
              transform: `translateX(-50%) translateY(${mousePosition.y * 0.1 - 5}px) rotateX(${mousePosition.y * 0.1}deg)`
            }}
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">LMN8</span>
                <div className="text-white/60 text-sm">|</div>
                <span className="text-white/80">Psychedelic Therapy Platform</span>
              </div>
            </div>
          </div>

          {/* 3D Form Card */}
          <div 
            className="relative transform-gpu transition-all duration-300 hover:scale-105"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mousePosition.y * 0.05 - 2.5}deg) rotateY(${mousePosition.x * 0.05 - 2.5}deg)`
            }}
          >
            {/* Card Shadow/Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-3xl transform translate-z-[-20px] blur-xl"></div>
            
            {/* Main Glass Card */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
               {/* Animated border glow */}
               <div className="absolute inset-0 rounded-3xl">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl animate-pulse"></div>
               </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
                {/* Form Side */}
                <div className="p-6 relative">
                  {/* Welcome Text */}
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-white mb-1">Welcome back,</h1>
                     <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-3">
                       let's continue your journey.
                     </h2>
                    <p className="text-white/70 text-lg">Sign in to your LMN8 account</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2 group-hover:text-white transition-colors">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 ${errors.email ? 'border-red-400/50' : ''}`}
                          placeholder="Enter your email address"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2 group-hover:text-white transition-colors">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 ${errors.password ? 'border-red-400/50' : ''}`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            )}
                          </svg>
                        </button>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* General Error Display */}
                    {errors.general && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                        {errors.general}
                      </div>
                    )}

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-cyan-400 bg-white/10 border-white/30 rounded focus:ring-cyan-400"
                        />
                        <label className="text-sm text-white/70">Remember me</label>
                      </div>
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">Forgot password?</a>
                    </div>

                     {/* Submit Button */}
                     <button
                       onClick={handleSubmit}
                       disabled={isLoading}
                       className="w-full bg-gradient-to-r from-cyan-500 via-teal-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </span>
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <p className="text-white/60 text-sm">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Sign up</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Side */}
                <div className="p-6 relative flex flex-col justify-center">
                  {/* 3D Feature Cards */}
                  <div className="space-y-4">
                    {/* Main Feature */}
                    <div 
                      className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-4 shadow-2xl transform transition-all duration-500 hover:scale-105"
                      style={{
                        transform: `translateZ(20px) rotateY(${mousePosition.x * 0.02}deg)`
                      }}
                    >
                      <div className="text-center">
                         <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-6">
                          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Welcome Back</h3>
                         <h4 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-3">to Your Journey</h4>
                        <p className="text-white/70 text-base leading-relaxed">
                          Continue your work in advancing psychedelic therapy with our community of professionals.
                        </p>
                      </div>
                    </div>
                    
                     {/* Feature List */}
                     <div className="space-y-2">
                      {[
                        'Access your personalized dashboard',
                        'Continue your research projects',
                        'Connect with your therapy network'
                      ].map((feature, index) => (
                        <div 
                          key={index}
                           className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-3 flex items-center space-x-3 hover:bg-white/10 transition-all duration-300 transform hover:translateZ-10"
                          style={{
                            transform: `translateZ(${10 + index * 5}px)`,
                            animationDelay: `${index * 0.2}s`
                          }}
                        >
                           <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <p className="text-white/80 font-medium">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
