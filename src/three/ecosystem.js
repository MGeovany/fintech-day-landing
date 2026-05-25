/**
 * "Sobre" section — 2D ecosystem hub.
 * Four stakeholder nodes linked to a central hub with animated data pulses.
 */
export function initEcosystemScene(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let dpr = 1;

  const ACCENT = '253, 83, 33';
  const MUTED = '255, 255, 255';

  const nodes = [
    { x: 0.2, y: 0.18 },
    { x: 0.82, y: 0.24 },
    { x: 0.16, y: 0.78 },
    { x: 0.84, y: 0.82 },
  ];
  const center = { x: 0.5, y: 0.5 };

  const links = [
    ...nodes.map((_, i) => ({ from: 'c', to: i })),
    { from: 0, to: 1 },
    { from: 1, to: 3 },
    { from: 3, to: 2 },
    { from: 2, to: 0 },
  ];

  const pulses = links.map((link, i) => ({
    link,
    t: i * 0.17,
    speed: 0.22 + (i % 3) * 0.04,
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw === 0 || ch === 0) return;
    w = cw;
    h = ch;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize);
  resize();

  function point(ref) {
    if (ref === 'c') return { x: center.x * w, y: center.y * h };
    return { x: nodes[ref].x * w, y: nodes[ref].y * h };
  }

  function drawGrid() {
    const step = 44;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = step; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function drawLink(from, to, alpha = 0.14) {
    const a = point(from);
    const b = point(to);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(${MUTED}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawPulse(from, to, t) {
    const a = point(from);
    const b = point(to);
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, 18);
    grad.addColorStop(0, `rgba(${ACCENT}, 0.95)`);
    grad.addColorStop(0.35, `rgba(${ACCENT}, 0.35)`);
    grad.addColorStop(1, `rgba(${ACCENT}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHub() {
    const cx = center.x * w;
    const cy = center.y * h;
    const r = Math.min(w, h) * 0.11;

    ctx.strokeStyle = `rgba(${ACCENT}, 0.35)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(${ACCENT}, 0.12)`;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.55, 0, Math.PI * 2);
    ctx.stroke();

    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
    glow.addColorStop(0, `rgba(${ACCENT}, 0.16)`);
    glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(${ACCENT}, 0.9)`;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNodes(time) {
    nodes.forEach((node, i) => {
      const x = node.x * w;
      const y = node.y * h;
      const pulse = 1 + Math.sin(time * 1.4 + i * 1.2) * 0.08;

      const glow = ctx.createRadialGradient(x, y, 0, x, y, 16 * pulse);
      glow.addColorStop(0, `rgba(${ACCENT}, 0.22)`);
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 16 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
      ctx.strokeStyle = `rgba(${ACCENT}, 0.55)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(${ACCENT}, 0.95)`;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  let rafId = 0;
  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const time = now * 0.001;

    if (w > 0 && h > 0) {
      ctx.clearRect(0, 0, w, h);
      drawGrid();

      links.forEach((link) => drawLink(link.from, link.to));
      drawHub();
      drawNodes(time);

      pulses.forEach((pulse) => {
        pulse.t = (pulse.t + pulse.speed * dt) % 1;
        drawPulse(pulse.link.from, pulse.link.to, pulse.t);
      });
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    window.removeEventListener('resize', resize);
  };
}
