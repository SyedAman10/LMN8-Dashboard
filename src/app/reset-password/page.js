'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams ? searchParams.get('token') : null;

  const [token, setToken] = useState(tokenFromUrl || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const validate = () => {
    const e = {};
    if (!token.trim()) e.token = 'Reset token is required';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: token, newPassword: password })
      });

      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrors({ general: data.error || 'Failed to reset password' });
      }
    } catch (err) {
      setErrors({ general: 'Unexpected error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-900">
        <div className="max-w-md w-full">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Password Reset Successful</h2>
            <p className="text-white/70 mb-6">Your password has been updated. You can now log in with your new password.</p>
            <Link href="/login" className="inline-block bg-cyan-500 text-white py-2 px-4 rounded-lg">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Reset Your Password</h1>
            <p className="text-white/70">Enter the reset token and choose a new password.</p>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">Reset Token</label>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Reset token"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40"
                />
                {errors.token && <p className="text-red-400 text-sm mt-1">{errors.token}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40"
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40"
                />
                {errors.confirm && <p className="text-red-400 text-sm mt-1">{errors.confirm}</p>}
              </div>

              {errors.general && <div className="text-red-400 text-sm">{errors.general}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Reset Password'}
              </button>

              <div className="text-center mt-2">
                <Link href="/login" className="text-cyan-400 text-sm">Back to Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
