'use client';

import { useEffect, useRef } from 'react';

export default function MountainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let mistParticles = [];
    let auroraPhase = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initMist();
    };

    // Initialize stars
    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 12000);
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.5), // Stars in upper half only
          radius: Math.random() * 1.2 + 0.3,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    // Initialize mist particles
    const initMist = () => {
      mistParticles = [];
      const mistCount = 30;
      
      for (let i = 0; i < mistCount; i++) {
        mistParticles.push({
          x: Math.random() * canvas.width,
          y: canvas.height * (0.5 + Math.random() * 0.3),
          radius: Math.random() * 150 + 100,
          opacity: Math.random() * 0.15 + 0.05,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.1
        });
      }
    };

    // Draw mountain layer
    const drawMountain = (peaks, baseY, color, variation = 0.3) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      let x = 0;
      peaks.forEach((peak, index) => {
        const peakX = (canvas.width / peaks.length) * (index + 0.5);
        const peakY = baseY - peak.height + Math.sin(Date.now() / 5000 + index) * variation;
        
        if (index === 0) {
          ctx.lineTo(0, baseY);
        }
        
        // Create smooth peaks using quadratic curves
        const prevPeakX = index > 0 ? (canvas.width / peaks.length) * (index - 0.5) : 0;
        const valleyX = (prevPeakX + peakX) / 2;
        const valleyY = baseY - peak.height * 0.3;
        
        ctx.quadraticCurveTo(valleyX, valleyY, peakX, peakY);
        x = peakX;
      });
      
      ctx.lineTo(canvas.width, baseY);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient with atmospheric colors - blending with site background
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#0b132b');
      skyGradient.addColorStop(0.3, '#0f1829');
      skyGradient.addColorStop(0.6, '#1a1f3a');
      skyGradient.addColorStop(1, '#0b132b');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora borealis effect (subtle)
      auroraPhase += 0.001;
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const auroraGradient = ctx.createRadialGradient(
          canvas.width * (0.3 + i * 0.2),
          canvas.height * 0.3,
          0,
          canvas.width * (0.3 + i * 0.2),
          canvas.height * 0.3,
          canvas.width * 0.4
        );
        const opacity = (Math.sin(auroraPhase + i) + 1) / 2 * 0.03;
        auroraGradient.addColorStop(0, `rgba(91, 192, 190, ${opacity})`);
        auroraGradient.addColorStop(0.5, `rgba(111, 255, 233, ${opacity * 0.5})`);
        auroraGradient.addColorStop(1, 'rgba(91, 192, 190, 0)');
        ctx.fillStyle = auroraGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
      }
      ctx.restore();

      // Light rays from behind mountains (subtle)
      ctx.save();
      const rayGradient = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.5,
        0,
        canvas.width * 0.7,
        canvas.height * 0.5,
        canvas.width * 0.5
      );
      rayGradient.addColorStop(0, 'rgba(91, 192, 190, 0.04)');
      rayGradient.addColorStop(0.5, 'rgba(91, 192, 190, 0.02)');
      rayGradient.addColorStop(1, 'rgba(91, 192, 190, 0)');
      ctx.fillStyle = rayGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw stars
      stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.phase) + 1) / 2;
        const opacity = star.opacity * twinkle * 0.6 + 0.4;

        // Star glow
        const starGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 2);
        starGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        starGradient.addColorStop(0.5, `rgba(91, 192, 190, ${opacity * 0.3})`);
        starGradient.addColorStop(1, 'rgba(91, 192, 190, 0)');
        
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Background mountains (distant, haziest)
      const distantPeaks = [
        { height: canvas.height * 0.15 },
        { height: canvas.height * 0.2 },
        { height: canvas.height * 0.18 },
        { height: canvas.height * 0.22 },
        { height: canvas.height * 0.16 }
      ];
      drawMountain(distantPeaks, canvas.height * 0.55, 'rgba(28, 37, 65, 0.4)', 0.5);

      // Mid-ground mountains
      const midPeaks = [
        { height: canvas.height * 0.25 },
        { height: canvas.height * 0.35 },
        { height: canvas.height * 0.28 },
        { height: canvas.height * 0.38 },
        { height: canvas.height * 0.3 }
      ];
      drawMountain(midPeaks, canvas.height * 0.6, 'rgba(28, 37, 65, 0.6)', 0.3);

      // Animate and draw mist
      mistParticles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.y > canvas.height) particle.y = canvas.height * 0.5;
        if (particle.y < canvas.height * 0.5) particle.y = canvas.height;

        // Draw mist particle
        const mistGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );
        mistGradient.addColorStop(0, `rgba(91, 192, 190, ${particle.opacity})`);
        mistGradient.addColorStop(0.5, `rgba(91, 192, 190, ${particle.opacity * 0.5})`);
        mistGradient.addColorStop(1, 'rgba(91, 192, 190, 0)');
        
        ctx.fillStyle = mistGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Foreground mountains (darkest, most defined)
      const foregroundPeaks = [
        { height: canvas.height * 0.35 },
        { height: canvas.height * 0.45 },
        { height: canvas.height * 0.38 },
        { height: canvas.height * 0.48 },
        { height: canvas.height * 0.4 }
      ];
      drawMountain(foregroundPeaks, canvas.height * 0.65, 'rgba(28, 37, 65, 0.85)', 0.2);

      // Subtle horizon glow
      const horizonGlow = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height * 0.7);
      horizonGlow.addColorStop(0, 'rgba(91, 192, 190, 0)');
      horizonGlow.addColorStop(0.5, 'rgba(91, 192, 190, 0.05)');
      horizonGlow.addColorStop(1, 'rgba(91, 192, 190, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.2);

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
      />
      {/* Vignette and gradient overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/60 via-transparent to-bg-dark/80 pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(11, 19, 43, 0.4) 100%)'
        }}
      />
    </>
  );
}

