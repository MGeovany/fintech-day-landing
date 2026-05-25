import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountLayout } from './layout.js';
import { initHeroScene } from './three/hero.js';
import { initOrbScene } from './three/orb.js';
import {
  playHeroIntro,
  setupReveals,
  setupSplitHeadings,
  setupCounters,
  setupTilt,
  setupActivitiesScroll,
  setupParallax,
  setupNav,
  setupMagnetic,
  setupCursor,
  setupAnchorScroll,
} from './animations.js';

gsap.registerPlugin(ScrollTrigger);

const boot = () => {
  // Smooth scroll
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Animations
  setupNav();
  setupCursor();
  setupReveals();
  setupSplitHeadings();
  setupCounters();
  setupTilt();
  setupMagnetic();
  setupParallax();
  setupActivitiesScroll();
  setupAnchorScroll(lenis);

  // Hero alive grid
  const heroGrid = document.getElementById('hero-grid');
  if (heroGrid) initHeroScene(heroGrid);

  const sobreCanvas = document.getElementById('sobre-canvas');
  if (sobreCanvas) {
    // Lazy-init when in view to keep hero perf clean
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          initOrbScene(sobreCanvas);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(sobreCanvas);
  }

  // Play hero intro
  playHeroIntro();

  // Hide loader
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('is-hidden');
    }, 350);
  });
};

mountLayout();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
