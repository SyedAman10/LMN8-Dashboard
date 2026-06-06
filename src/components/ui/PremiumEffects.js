'use client';

import { useEffect, useRef } from 'react';

export default function PremiumEffects() {
  const cursorMain = useRef(null);
  const cursorRing = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const ringX = useRef(0);
  const ringY = useRef(0);
  const rafId = useRef(null);

  // Custom cursor
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const main = cursorMain.current;
    const ring = cursorRing.current;
    if (!main || !ring) return;

    const onMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      main.style.left = `${e.clientX}px`;
      main.style.top = `${e.clientY}px`;

      // Cursor spotlight on hero
      const hero = document.querySelector('[data-hero-spotlight]');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const spotlight = hero.querySelector('.cursor-spotlight');
        if (spotlight && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          spotlight.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(91, 192, 190, 0.055), transparent 65%)`;
        }
      }
    };

    // Ring lerps behind main cursor
    const animateRing = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.1;
      ringY.current += (mouseY.current - ringY.current) * 0.1;
      ring.style.left = `${ringX.current}px`;
      ring.style.top = `${ringY.current}px`;
      rafId.current = requestAnimationFrame(animateRing);
    };

    // Expand cursor on interactive elements
    const addHover = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');

    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, [tabindex]').forEach(el => {
        el.addEventListener('mouseenter', addHover, { passive: true });
        el.addEventListener('mouseleave', removeHover, { passive: true });
      });
    };

    attachHoverListeners();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, [tabindex]').forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  // Scroll: nav class, hero-passed class, scroll-progress CSS var
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (y / maxScroll) * 100 : 0;

      document.documentElement.style.setProperty('--scroll-progress', `${pct}%`);
      document.body.classList.toggle('nav-scrolled', y > 80);
      document.body.classList.toggle('hero-passed', y > window.innerHeight * 0.65);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver — scroll reveal
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll('.reveal-section, .reveal-left, .reveal-scale');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Hero 3D parallax — mouse drives per-layer depth offsets + container tilt
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = document.querySelector('[data-hero-3d]');
    if (!hero) return;

    const container = hero.querySelector('[data-hero-container]');
    const layers = hero.querySelectorAll('[data-depth]');

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf = null;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
      targetY = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      // Perspective tilt on the whole content block
      if (container) {
        container.style.transform =
          `perspective(1200px) rotateX(${-currentY * 4}deg) rotateY(${currentX * 5}deg)`;
        container.style.transformStyle = 'preserve-3d';
      }

      // Each [data-depth] element drifts at its own rate
      layers.forEach(layer => {
        const d = parseFloat(layer.dataset.depth) || 0.5;
        const x = currentX * d * 22;
        const y = currentY * d * 14;
        layer.style.transform = `translate(${x}px, ${y}px)`;
        layer.style.willChange = 'transform';
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      if (container) container.style.transform = '';
      layers.forEach(l => { l.style.transform = ''; });
    };
  }, []);

  // Card tilt on hover
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll('.card-tilt');
    const listeners = [];

    cards.forEach(card => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -5;
        const rotY = ((x - cx) / cx) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      };

      const onLeave = () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      };

      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave, { passive: true });
      listeners.push({ card, onMove, onLeave });
    });

    return () => {
      listeners.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorMain} className="cursor-main" aria-hidden="true" />
      <div ref={cursorRing} className="cursor-ring" aria-hidden="true" />
      <div className="scroll-progress-track" aria-hidden="true" />
    </>
  );
}
