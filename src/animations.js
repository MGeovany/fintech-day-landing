import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Hero intro (CSS-driven via keyframes; this is a safety net)       */
/* ------------------------------------------------------------------ */
export function playHeroIntro() {
  if (prefersReduce) {
    document.querySelectorAll('.hero-word').forEach((el) => {
      el.style.transform = 'none';
      el.style.animation = 'none';
    });
  }
}

/* ------------------------------------------------------------------ */
/* Reveal on scroll                                                   */
/* ------------------------------------------------------------------ */
export function setupReveals() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('is-in'),
    });
  });
}

/* ------------------------------------------------------------------ */
/* Split-text headings                                                */
/* ------------------------------------------------------------------ */
export function setupSplitHeadings() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = char === ' ' ? ' ' : char;
      el.appendChild(span);
    });

    if (prefersReduce) {
      el.querySelectorAll('.split-char').forEach((s) => {
        s.style.opacity = 1;
        s.style.transform = 'none';
      });
      return;
    }

    gsap.to(el.querySelectorAll('.split-char'), {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.018,
    });
  });
}

/* ------------------------------------------------------------------ */
/* Counters                                                           */
/* ------------------------------------------------------------------ */
export function setupCounters() {
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = Math.floor(obj.v).toLocaleString() + (obj.v >= target ? suffix : '');
          },
        });
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Card 3D tilt                                                       */
/* ------------------------------------------------------------------ */
export function setupTilt() {
  if (prefersReduce) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    let raf;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(0)`;
      });
    };
    const onLeave = () => {
      card.style.transform = '';
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
  });
}

/* ------------------------------------------------------------------ */
/* Horizontal scroll for activities                                   */
/* ------------------------------------------------------------------ */
export function setupActivitiesScroll() {
  const track = document.querySelector('#acts-track');
  if (!track) return;
  // Only horizontal-pin on wide screens to keep behavior predictable on mobile.
  ScrollTrigger.matchMedia({
    '(min-width: 920px)': () => {
      const total = track.scrollWidth - window.innerWidth + 64;
      gsap.to(track, {
        x: -total,
        ease: 'none',
        scrollTrigger: {
          trigger: track.parentElement,
          start: 'top 10%',
          end: () => `+=${total}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    '(max-width: 919px)': () => {
      // Native overflow scroll for small screens
      track.parentElement.style.overflowX = 'auto';
      track.parentElement.style.scrollSnapType = 'x mandatory';
      track.style.paddingInline = '20px';
      track.querySelectorAll('.act-card').forEach((c) => {
        c.style.scrollSnapAlign = 'start';
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Section parallax for hero canvas + sobre tags                      */
/* ------------------------------------------------------------------ */
export function setupParallax() {
  if (prefersReduce) return;

  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    gsap.to(heroCanvas, {
      yPercent: 30,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  document.querySelectorAll('.sobre-tag').forEach((tag, i) => {
    gsap.to(tag, {
      y: (i % 2 === 0 ? -24 : 24),
      ease: 'none',
      scrollTrigger: {
        trigger: '.sobre',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Nav auto-hide on scroll down                                       */
/* ------------------------------------------------------------------ */
export function setupNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 80 && y > last) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ------------------------------------------------------------------ */
/* Magnetic buttons                                                   */
/* ------------------------------------------------------------------ */
export function setupMagnetic() {
  if (prefersReduce) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------------ */
/* Custom cursor                                                      */
/* ------------------------------------------------------------------ */
export function setupCursor() {
  if (window.matchMedia('(hover: none)').matches || prefersReduce) {
    document.getElementById('cursor')?.remove();
    document.getElementById('cursor-dot')?.remove();
    return;
  }
  const cur = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  if (!cur || !dot) return;

  const c = { x: 0, y: 0 };
  const d = { x: 0, y: 0 };
  const t = { x: 0, y: 0 };

  window.addEventListener('pointermove', (e) => {
    t.x = e.clientX; t.y = e.clientY;
  });
  function loop() {
    c.x += (t.x - c.x) * 0.18;
    c.y += (t.y - c.y) * 0.18;
    d.x += (t.x - d.x) * 0.45;
    d.y += (t.y - d.y) * 0.45;
    cur.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, [data-tilt], [data-magnetic]').forEach((el) => {
    el.addEventListener('pointerenter', () => cur.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cur.classList.remove('is-hover'));
  });
}

/* ------------------------------------------------------------------ */
/* Smooth anchor scroll (Lenis-compatible)                            */
/* ------------------------------------------------------------------ */
export function setupAnchorScroll(lenis) {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -40, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
