'use client';

import { useEffect } from 'react';

export default function NotificationAlert({ type = 'success', message, onClose }) {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  const colors = {
    success: {
      bg: 'bg-accent-primary/10',
      border: 'border-accent-primary',
      text: 'text-accent-primary',
      icon: 'bg-accent-primary'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500',
      text: 'text-red-400',
      icon: 'bg-red-500'
    },
    info: {
      bg: 'bg-accent-highlight/10',
      border: 'border-accent-highlight',
      text: 'text-accent-highlight',
      icon: 'bg-accent-highlight'
    }
  };

  const colorScheme = colors[type] || colors.success;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in-right">
      <div className={`${colorScheme.bg} backdrop-blur-xl ${colorScheme.border} border-2 rounded-xl shadow-2xl overflow-hidden max-w-md`}>
        <div className="flex items-start p-5 gap-4">
          {/* Icon */}
          <div className={`${colorScheme.icon} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl`}>
            {icons[type]}
          </div>
          
          {/* Message */}
          <div className="flex-1 pt-1">
            <p className={`${colorScheme.text} font-medium leading-relaxed`}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`${colorScheme.text} hover:opacity-70 transition-opacity flex-shrink-0 w-6 h-6 flex items-center justify-center`}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-ui-secondary/20 overflow-hidden">
          <div 
            className={`h-full ${colorScheme.icon} animate-progress-bar`}
            style={{ animationDuration: '5s' }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-progress-bar {
          animation: progress-bar 5s linear;
        }
      `}</style>
    </div>
  );
}

