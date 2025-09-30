'use client';

export default function GlassCard({ children, className = "", ...props }) {
  return (
    <div 
      className={`bg-slate-800/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
