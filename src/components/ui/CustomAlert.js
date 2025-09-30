'use client';

import { useState, useEffect } from 'react';

export default function CustomAlert({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = false
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgGradient: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/50',
          iconBg: 'from-green-500 to-emerald-500',
          buttonBg: 'from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgGradient: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/50',
          iconBg: 'from-yellow-500 to-orange-500',
          buttonBg: 'from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
        };
      case 'error':
        return {
          icon: '❌',
          bgGradient: 'from-red-500/20 to-pink-500/20',
          borderColor: 'border-red-500/50',
          iconBg: 'from-red-500 to-pink-500',
          buttonBg: 'from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400'
        };
      default:
        return {
          icon: 'ℹ️',
          bgGradient: 'from-cyan-500/20 to-blue-500/20',
          borderColor: 'border-cyan-500/50',
          iconBg: 'from-cyan-500 to-blue-500',
          buttonBg: 'from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
        };
    }
  };

  if (!isVisible) return null;

  const styles = getTypeStyles();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />
      
      {/* Alert Modal */}
      <div 
        className={`relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl border ${styles.borderColor} rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl">
          <div className={`absolute inset-0 bg-gradient-to-r ${styles.bgGradient} rounded-2xl animate-pulse`}></div>
        </div>

        <div className="relative z-10 p-6">
          {/* Icon and Title */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${styles.iconBg} rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-6`}>
              <span className="text-2xl">{styles.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 bg-gradient-to-r ${styles.buttonBg} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
