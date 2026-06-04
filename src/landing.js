import Lenis from 'lenis';
import { toast } from './lib/toast.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountLayout } from './layout.js';
import { updateNavAuthCta } from './lib/nav-auth.js';
import { initEventCountdown } from './countdown.js';
import { initHeroScene } from './three/hero.js';
import { initEcosystemScene } from './three/ecosystem.js';
import {
  playHeroIntro,
  setupReveals,
  setupSplitHeadings,
  setupCounters,
  setupTilt,
  setupCardGlow,
  setupActivitiesScroll,
  setupParallax,
  setupNav,
  setupMagnetic,
  setupCursor,
  setupAnchorScroll,
} from './animations.js';

gsap.registerPlugin(ScrollTrigger);

const boot = () => {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  setupNav();
  updateNavAuthCta();
  initEventCountdown();
  setupCursor();
  setupReveals();
  setupSplitHeadings();
  setupCounters();
  setupTilt();
  setupCardGlow();
  setupMagnetic();
  setupParallax();
  setupActivitiesScroll();
  setupAnchorScroll(lenis);

  const heroGrid = document.getElementById('hero-grid');
  if (heroGrid) initHeroScene(heroGrid);

  const sobreCanvas = document.getElementById('sobre-canvas');
  if (sobreCanvas) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          initEcosystemScene(sobreCanvas);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(sobreCanvas);
  }

  playHeroIntro();

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('is-hidden');
    }, 350);
  });
};

function checkReferral() {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (!ref) return;
    const name = decodeURIComponent(escape(atob(ref)));
    if (!name) return;
    // Remove ref from URL without reload
    const clean = new URL(window.location.href);
    clean.searchParams.delete('ref');
    history.replaceState(null, '', clean.pathname + (clean.search !== '?' ? clean.search : ''));
    // Show invite banner after short delay so landing animations don't conflict
    setTimeout(() => {
      toast(`👋 ${name} te invitó al Honduras Fintech Day 2026`, {
        type: 'invite',
        duration: 12000,
        action: { label: 'Obtener entradas →', href: '/registro' },
      });
    }, 1200);
  } catch {
    // ignore malformed ref
  }
}

export function bootLanding() {
  mountLayout();
  checkReferral();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
