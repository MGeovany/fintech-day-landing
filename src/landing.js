import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountLayout } from './layout.js';
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

export function bootLanding() {
  mountLayout();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
