'use client';

import { useState, useEffect } from 'react';
import AnimatedBackground from './AnimatedBackground';

export default function ScreenLoader({ message = "Preparing your dashboard..." }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-bg-dark flex items-center justify-center">
      <AnimatedBackground />
      
      {/* Main loader content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-accent-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-bg-dark font-bold text-3xl">L</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-text-100 mb-2">Luminate</h1>
          <p className="text-text-60 text-sm">Illuminating your path</p>
        </div>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          {/* Loading message */}
          <p className="text-text-85 text-lg">
            {message}{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-ui-secondary rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent-primary to-accent-highlight rounded-full animate-pulse"></div>
        </div>

        {/* Loading steps */}
        <div className="mt-8 space-y-2 text-sm text-text-60">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse"></div>
            <span>Authenticating your session</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <span>Loading your personalized data</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
            <span>Preparing your dashboard</span>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-accent-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent-highlight/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-accent-primary/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
