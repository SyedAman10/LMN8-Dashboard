'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function PageHeader({ title, description }) {
  const { user } = useAuth();

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-playfair font-bold text-white mb-2">
        {title}
      </h2>
      <p className="text-slate-300 text-lg">
        {description}
      </p>
      {user && (
        <p className="text-slate-400 text-sm mt-2">
          Welcome back, {user.firstName} {user.lastName}
        </p>
      )}
    </div>
  );
}
