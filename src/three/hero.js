/**
 * Hero alive-grid renderer (2D canvas).
 *
 * Draws a faint grid of vertical/horizontal lines and, on top, periodic
 * "pulses" that travel along random grid segments leaving a glowing trail.
 * The corner light cones are CSS - this canvas only handles the grid.
 */
export function initHeroScene(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;

  const CELL = 88;
  const BASE_LINE = 'rgba(255, 255, 255, 0.045)';
  const PULSE_COLOR = '0, 196, 240';
  const HEAD_COLOR  = '160, 230, 255';
  const HOVER_RADIUS = 140;
  const HOVER_SEGMENT = 100;
  const HOVER_LERP = 8;

  const hero = canvas.closest('.hero');
  let pointerX = -9999;
  let pointerY = -9999;
  let hoverTarget = 0;
  let hoverStrength = 0;

  function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointerX = clientX - rect.left;
    pointerY = clientY - rect.top;
    hoverTarget = 1;
  }

  function onPointerMove(e) {
    updatePointer(e.clientX, e.clientY);
  }

  function onPointerLeave() {
    hoverTarget = 0;
  }

  if (hero) {
    hero.addEventListener('pointermove', onPointerMove);
    hero.addEventListener('pointerleave', onPointerLeave);
  }

  /** Smooth falloff from cursor to a grid line (0–1). */
  function lineGlow(dist) {
    const t = 1 - Math.min(1, dist / HOVER_RADIUS);
    return t * t * (3 - 2 * t);
  }

  function drawHoverGrid(strength) {
    if (strength < 0.008 || w === 0) return;

    const seg = HOVER_SEGMENT;
    const y0 = Math.max(0, pointerY - seg);
    const y1 = Math.min(h, pointerY + seg);
    const x0 = Math.max(0, pointerX - seg);
    const x1 = Math.min(w, pointerX + seg);

    ctx.lineWidth = 1;

    for (let x = CELL; x < w; x += CELL) {
      const g = lineGlow(Math.abs(pointerX - x)) * strength;
      if (g < 0.04) continue;
      const xx = Math.round(x) + 0.5;
      ctx.strokeStyle = `rgba(${PULSE_COLOR}, ${0.03 + g * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(xx, y0);
      ctx.lineTo(xx, y1);
      ctx.stroke();
    }

    for (let y = CELL; y < h; y += CELL) {
      const g = lineGlow(Math.abs(pointerY - y)) * strength;
      if (g < 0.04) continue;
      const yy = Math.round(y) + 0.5;
      ctx.strokeStyle = `rgba(${PULSE_COLOR}, ${0.03 + g * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(x0, yy);
      ctx.lineTo(x1, yy);
      ctx.stroke();
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw === 0 || ch === 0) return;
    w = cw; h = ch;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize);
  resize();

  /** active pulses */
  const pulses = [];

  function spawnPulse(opts = {}) {
    if (w === 0) return;
    const horizontal = Math.random() > 0.5;
    const cols = Math.max(1, Math.floor(w / CELL));
    const rows = Math.max(1, Math.floor(h / CELL));

    if (horizontal) {
      const row = Math.floor(Math.random() * rows) + 1;
      const startCol = Math.floor(Math.random() * cols);
      const dir = Math.random() > 0.5 ? 1 : -1;
      pulses.push({
        x: startCol * CELL,
        y: row * CELL,
        vx: dir * (60 + Math.random() * 40),
        vy: 0,
        t: 0,
        max: 2.4 + Math.random() * 2.4,
        trail: [],
        ...opts,
      });
    } else {
      const col = Math.floor(Math.random() * cols) + 1;
      const startRow = Math.floor(Math.random() * rows);
      const dir = Math.random() > 0.5 ? 1 : -1;
      pulses.push({
        x: col * CELL,
        y: startRow * CELL,
        vx: 0,
        vy: dir * (60 + Math.random() * 40),
        t: 0,
        max: 2.4 + Math.random() * 2.4,
        trail: [],
        ...opts,
      });
    }
  }

  // initial burst so the grid feels alive from the first frame
  for (let i = 0; i < 4; i++) spawnPulse({ t: Math.random() * 1.5 });

  let spawnTimer = 0;
  const SPAWN_INTERVAL = 0.65; // seconds

  let last = performance.now();
  let rafId = 0;
  let running = true;

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    spawnTimer += dt;
    while (spawnTimer >= SPAWN_INTERVAL) {
      spawnTimer -= SPAWN_INTERVAL;
      spawnPulse();
    }

    hoverStrength += (hoverTarget - hoverStrength) * Math.min(1, dt * HOVER_LERP);

    ctx.clearRect(0, 0, w, h);

    // ─── base grid ─────────────────────────────────────────────────────
    ctx.strokeStyle = BASE_LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = CELL; x < w; x += CELL) {
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, h);
    }
    for (let y = CELL; y < h; y += CELL) {
      ctx.moveTo(0, Math.round(y) + 0.5);
      ctx.lineTo(w, Math.round(y) + 0.5);
    }
    ctx.stroke();

    drawHoverGrid(hoverStrength);

    // ─── pulses ────────────────────────────────────────────────────────
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += dt;
      if (p.t >= p.max) {
        pulses.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // off-screen? drop
      if (p.x < -CELL || p.x > w + CELL || p.y < -CELL || p.y > h + CELL) {
        pulses.splice(i, 1);
        continue;
      }

      const life = 1 - (p.t / p.max);
      const eased = Math.sin(life * Math.PI); // fade in & out

      // glow along the segment behind the pulse
      const horizontal = p.vx !== 0;
      const trailLen = 220;
      const gx0 = horizontal ? p.x - Math.sign(p.vx) * trailLen : p.x;
      const gy0 = horizontal ? p.y : p.y - Math.sign(p.vy) * trailLen;

      const grad = ctx.createLinearGradient(gx0, gy0, p.x, p.y);
      grad.addColorStop(0,   `rgba(${PULSE_COLOR}, 0)`);
      grad.addColorStop(0.6, `rgba(${PULSE_COLOR}, ${0.18 * eased})`);
      grad.addColorStop(1,   `rgba(${PULSE_COLOR}, ${0.85 * eased})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      if (horizontal) {
        const yy = Math.round(p.y) + 0.5;
        ctx.moveTo(gx0, yy);
        ctx.lineTo(p.x, yy);
      } else {
        const xx = Math.round(p.x) + 0.5;
        ctx.moveTo(xx, gy0);
        ctx.lineTo(xx, p.y);
      }
      ctx.stroke();

      // outer halo around the head
      const haloR = 22;
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
      halo.addColorStop(0,   `rgba(${PULSE_COLOR}, ${0.55 * eased})`);
      halo.addColorStop(0.4, `rgba(${PULSE_COLOR}, ${0.18 * eased})`);
      halo.addColorStop(1,   `rgba(${PULSE_COLOR}, 0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(p.x - haloR, p.y - haloR, haloR * 2, haloR * 2);

      // bright head dot
      ctx.fillStyle = `rgba(${HEAD_COLOR}, ${eased})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (running) rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // pause when offscreen (saves cycles on long scrolls)
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!running) {
        running = true;
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    } else if (running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0 });
  io.observe(canvas);

  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    ro.disconnect();
    io.disconnect();
    if (hero) {
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
    }
  };
}
