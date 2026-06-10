'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [staffName, setStaffName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const emailParam = searchParams.get('user');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
    const nameParam = searchParams.get('name');
    if (nameParam) {
      setStaffName(nameParam);
    }
  }, [searchParams]);

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/staff-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('staffToken', data.token);
        localStorage.setItem('staffPermissions', JSON.stringify(data.staff.permissions));
        localStorage.setItem('staffUser', JSON.stringify(data.staff));
        router.push('/staff-dashboard');
      } else {
        setErrors({ general: data.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
          style={{ background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(91, 192, 190, 0.2) 0%, transparent 50%)` }}
        />
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-600/15 to-teal-700/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-600/15 to-cyan-700/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16" style={{ perspective: '1000px' }}>
        <div className="relative max-w-6xl w-full">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-30"
            style={{ transform: `translateX(-50%) translateY(${mousePosition.y * 0.1 - 5}px) rotateX(${mousePosition.y * 0.1}deg)` }}
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
              <span className="text-3xl font-bold text-white">{staffName ? `Hi ${staffName}` : 'Staff User'}</span>
            </div>
          </div>

          <div className="relative transform-gpu transition-all duration-300 hover:scale-105"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mousePosition.y * 0.05 - 2.5}deg) rotateY(${mousePosition.x * 0.05 - 2.5}deg)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-3xl transform translate-z-[-20px] blur-xl"></div>

            <div className="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl animate-pulse"></div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 relative">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-white mb-1">Staff Login</h1>
                    <p className="text-white/70 text-lg mb-3">Sign in to your staff account</p>
                  </div>

                  <div className="space-y-3">
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all ${errors.email ? 'border-red-400/50' : ''}`}
                        placeholder="your@email.com" />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all ${errors.password ? 'border-red-400/50' : ''}`}
                        placeholder="Enter your password" />
                      {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {errors.general && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{errors.general}</div>
                    )}

                    <button onClick={handleSubmit} disabled={isLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 via-teal-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group">
                      <span className="relative z-10">{isLoading ? 'Signing In...' : 'Sign In'}</span>
                    </button>


                  </div>
                </div>

                <div className="p-6 relative flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl transform transition-all duration-500 hover:scale-105"
                      style={{ transform: `translateZ(20px) rotateY(${mousePosition.x * 0.02}deg)` }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-6">
                          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Staff Portal</h3>
                        <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4">Dashboard Access</h4>
                        <p className="text-white/70 text-base leading-relaxed">
                          Access your assigned dashboard modules based on your role and permissions.
                        </p>
                      </div>
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

export default function StaffLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"><p className="text-white/70">Loading...</p></div>}>
      <StaffLoginForm />
    </Suspense>
  );
}
