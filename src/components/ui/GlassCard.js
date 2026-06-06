'use client';

export default function GlassCard({ children, className = "", tilt = false, ...props }) {
  return (
    <div
      className={[
        'relative',
        'bg-slate-800/40',
        'backdrop-blur-2xl',
        'border border-cyan-500/20',
        'rounded-3xl',
        'shadow-2xl',
        'overflow-hidden',
        'transition-all duration-400',
        'hover:border-cyan-500/35',
        'hover:shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(91,192,190,0.07),inset_0_1px_0_rgba(255,255,255,0.06)]',
        tilt ? 'card-tilt' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {/* Inner top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
