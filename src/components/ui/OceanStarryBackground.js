'use client';

import { useEffect, useRef } from 'react';

export default function OceanStarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let ripples = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize stars
    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.6), // Stars in upper 60% only
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    // Initialize ripples
    const createRipple = () => {
      if (ripples.length < 8) {
        ripples.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.65 + Math.random() * canvas.height * 0.15,
          radius: 0,
          maxRadius: Math.random() * 100 + 50,
          speed: Math.random() * 0.5 + 0.3,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    };

    // Animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
      skyGradient.addColorStop(0, '#0a0e1a');
      skyGradient.addColorStop(0.5, '#0f1829');
      skyGradient.addColorStop(1, '#0b132b');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

      // Draw nebulae (subtle)
      ctx.save();
      const nebula1 = ctx.createRadialGradient(
        canvas.width * 0.3, 
        canvas.height * 0.2, 
        0, 
        canvas.width * 0.3, 
        canvas.height * 0.2, 
        canvas.width * 0.3
      );
      nebula1.addColorStop(0, 'rgba(91, 192, 190, 0.03)');
      nebula1.addColorStop(1, 'rgba(91, 192, 190, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

      const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.7, 
        canvas.height * 0.3, 
        0, 
        canvas.width * 0.7, 
        canvas.height * 0.3, 
        canvas.width * 0.25
      );
      nebula2.addColorStop(0, 'rgba(111, 255, 233, 0.02)');
      nebula2.addColorStop(1, 'rgba(111, 255, 233, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
      ctx.restore();

      // Draw and animate stars
      stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.phase) + 1) / 2;
        const opacity = star.opacity * twinkle * 0.8 + 0.2;

        // Star glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.3, `rgba(91, 192, 190, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(91, 192, 190, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ocean surface
      const oceanGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      oceanGradient.addColorStop(0, 'rgba(11, 19, 43, 0.7)');
      oceanGradient.addColorStop(0.3, 'rgba(15, 24, 41, 0.85)');
      oceanGradient.addColorStop(1, 'rgba(10, 14, 26, 0.95)');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // Draw water waves (using sine waves)
      ctx.save();
      const waveOffset = (time / 1000) * 20;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(91, 192, 190, ${0.1 - i * 0.02})`;
        ctx.lineWidth = 2;
        
        const yBase = canvas.height * (0.62 + i * 0.08);
        const amplitude = 15 + i * 5;
        const frequency = 0.003 - i * 0.0005;
        const phase = waveOffset + i * 100;
        
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = yBase + Math.sin(x * frequency + phase * 0.01) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Draw star reflections on water
      stars.forEach(star => {
        if (star.y < canvas.height * 0.5) {
          const reflectionY = canvas.height * 0.6 + (canvas.height * 0.6 - star.y) * 0.3;
          const distortion = Math.sin(time / 1000 + star.x * 0.01) * 5;
          const opacity = star.opacity * 0.3 * ((Math.sin(star.phase) + 1) / 2);
          
          // Reflection shimmer
          const shimmer = ctx.createRadialGradient(
            star.x + distortion, 
            reflectionY, 
            0, 
            star.x + distortion, 
            reflectionY, 
            star.radius * 8
          );
          shimmer.addColorStop(0, `rgba(91, 192, 190, ${opacity * 0.6})`);
          shimmer.addColorStop(0.5, `rgba(111, 255, 233, ${opacity * 0.3})`);
          shimmer.addColorStop(1, 'rgba(91, 192, 190, 0)');
          
          ctx.fillStyle = shimmer;
          ctx.beginPath();
          ctx.ellipse(star.x + distortion, reflectionY, star.radius * 8, star.radius * 15, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw and animate ripples
      ripples = ripples.filter(ripple => {
        ripple.radius += ripple.speed;
        const progress = ripple.radius / ripple.maxRadius;
        const opacity = ripple.opacity * (1 - progress);

        if (progress < 1) {
          ctx.strokeStyle = `rgba(91, 192, 190, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner ripple
          ctx.strokeStyle = `rgba(111, 255, 233, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
          ctx.stroke();

          return true;
        }
        return false;
      });

      // Randomly create new ripples
      if (Math.random() < 0.01) {
        createRipple();
      }

      // Draw light shimmer on water surface
      const shimmerCount = 30;
      for (let i = 0; i < shimmerCount; i++) {
        const x = (i / shimmerCount) * canvas.width;
        const baseY = canvas.height * 0.65;
        const shimmerPhase = time / 1000 + i * 0.5;
        const shimmerY = baseY + Math.sin(shimmerPhase) * 3;
        const shimmerOpacity = (Math.sin(shimmerPhase * 2) + 1) / 2 * 0.2;

        ctx.fillStyle = `rgba(91, 192, 190, ${shimmerOpacity})`;
        ctx.fillRect(x, shimmerY, canvas.width / shimmerCount + 1, 2);
      }

      // Draw horizon glow
      const horizonGlow = ctx.createLinearGradient(0, canvas.height * 0.58, 0, canvas.height * 0.68);
      horizonGlow.addColorStop(0, 'rgba(91, 192, 190, 0)');
      horizonGlow.addColorStop(0.5, 'rgba(91, 192, 190, 0.08)');
      horizonGlow.addColorStop(1, 'rgba(91, 192, 190, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, canvas.height * 0.58, canvas.width, canvas.height * 0.1);

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
        style={{ opacity: 0.85 }}
      />
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 via-transparent to-bg-dark/60 pointer-events-none" />
    </>
  );
}

