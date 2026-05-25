import './ticket.css';
import {
  decodeTicketId,
  loadTicket,
  getPassInfo,
  formatDisplayTicketId,
} from './lib/ticket-store.js';
import {
  setPageShareMeta,
  shareLinks,
  downloadShareImage,
  nativeShare,
} from './lib/ticket-share.js';
import { shareIcon } from './lib/share-icons.js';

const POINTS = 14;
const GRAVITY = 0.95;
const DAMPING = 0.985;
const ITERATIONS = 20;
const RIBBON_TEXT = 'HONDURAS FINTECH DAY 2026 · ';

export function mountTicket(ticketId) {
  const attendee =
    decodeTicketId(ticketId) || loadTicket(ticketId);

  if (!attendee) {
    window.location.replace('/registro');
    return;
  }

  const pageUrl = `${window.location.origin}/ticket/${ticketId}`;
  setPageShareMeta(attendee, pageUrl);

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = renderTicket(ticketId, attendee);
  document.body.classList.add('on-ticket-page');

  initPhysics();
  initShare(attendee, pageUrl);
}

function renderTicket(ticketId, attendee) {
  const pass = getPassInfo(attendee.pass);
  const repeats = 8;
  const ribbonText = RIBBON_TEXT.repeat(repeats);
  const subtitle = [attendee.role, attendee.company].filter(Boolean).join(' · ');
  const displayRole = subtitle || pass.label;
  const links = shareLinks(`${window.location.origin}/ticket/${ticketId}`);
  const displayId = formatDisplayTicketId(ticketId);

  return `
    <div class="ticket-page">
      <a href="/" class="ticket-back" aria-label="Volver al inicio">
        <span aria-hidden="true">←</span>
        <span>Volver</span>
      </a>

      <div class="ticket-meta">
        <div>HONDURAS FINTECH DAY</div>
        <div><strong>20 · AGOSTO · 2026</strong></div>
      </div>

      <div class="lanyard-stage" id="lanyard-stage">
        <svg class="rope-svg" id="rope-svg" aria-hidden="true">
          <defs>
            <path id="rope-path-def"/>
          </defs>
          <path id="rope-shadow" stroke="rgba(0,0,0,0.55)" stroke-width="26" fill="none" stroke-linecap="butt" stroke-linejoin="round" transform="translate(3,4)"/>
          <path id="rope-path" stroke="#0a0a0a" stroke-width="22" fill="none" stroke-linecap="butt" stroke-linejoin="round"/>
          <path id="rope-edge" stroke="rgba(255,255,255,0.06)" stroke-width="22" fill="none" stroke-linecap="butt" stroke-linejoin="round"/>
          <text id="rope-text" font-family="Space Grotesk, system-ui, sans-serif" font-size="8.5" font-weight="600" letter-spacing="2" fill="rgba(245,244,241,0.78)">
            <textPath id="rope-textpath" href="#rope-path-def" startOffset="14">${ribbonText}</textPath>
          </text>
        </svg>

        <div class="badge-anchor" id="badge-anchor">
          <div class="lanyard-buckle" aria-hidden="true"></div>
          <div class="lanyard-tab" aria-hidden="true">
            <span class="lanyard-tab-dot"></span>
          </div>

          <div class="badge-card" id="badge-card">
            <div class="badge-holes" aria-hidden="true">
              <span class="badge-hole"></span>
              <span class="badge-hole"></span>
            </div>

            <div class="badge-inner">
              <div class="badge-header">
                <div class="badge-url">afinh2026.hn</div>
              </div>

              <h1 class="badge-title">
                <span>HONDURAS</span>
                <span>FINTECH</span>
                <span>DAY <span class="badge-title-year">2026</span></span>
              </h1>

              <div class="badge-role-pill">${escapeHtml(pass.pill)}</div>

              <div class="badge-attendee">
                <div class="badge-label">Nombre</div>
                <div class="badge-name">${escapeHtml(attendee.name)}</div>
                <div class="badge-role">${escapeHtml(displayRole)}</div>
              </div>

              <div class="badge-spacer"></div>

              <div class="badge-meta-row">
                <div><strong>20 · AGO · 2026</strong></div>
                <div>SAN PEDRO SULA</div>
              </div>

              <div class="badge-barcode">
                <svg class="badge-barcode-bars" viewBox="0 0 200 26" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  ${barcodeBars(ticketId)}
                </svg>
                <div class="badge-barcode-id">
                  <span class="badge-barcode-label">No. de entrada</span>
                  <code class="badge-barcode-code" title="${escapeHtml(ticketId)}">#${escapeHtml(displayId)}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ticket-hint" id="ticket-hint">
        <span>Arrastra el gafete</span>
      </div>

      <aside class="ticket-share" id="ticket-share" aria-label="Compartir badge">
        <div class="ticket-share-actions">
          <a class="ticket-share-btn" href="${links.x}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en X">${shareIcon('x')}</a>
          <a class="ticket-share-btn" href="${links.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en LinkedIn">${shareIcon('linkedin')}</a>
          <a class="ticket-share-btn" href="${links.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook">${shareIcon('facebook')}</a>
          <a class="ticket-share-btn" href="${links.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en WhatsApp">${shareIcon('whatsapp')}</a>
          <button type="button" class="ticket-share-btn" id="share-instagram" aria-label="Descargar imagen para Instagram">${shareIcon('instagram')}</button>
        </div>
        <div class="ticket-share-divider" aria-hidden="true"></div>
        <div class="ticket-share-tools">
          <button type="button" class="ticket-share-btn ticket-share-btn--tool" id="share-native" aria-label="Compartir imagen">${shareIcon('share')}</button>
          <button type="button" class="ticket-share-btn ticket-share-btn--tool" id="share-download" aria-label="Descargar PNG">${shareIcon('download')}</button>
          <button type="button" class="ticket-share-btn ticket-share-btn--tool" id="share-copy" aria-label="Copiar enlace">${shareIcon('link')}</button>
        </div>
      </aside>
    </div>
  `;
}

function initShare(attendee, pageUrl) {
  const shareBusyIds = ['share-download', 'share-instagram', 'share-native'];

  const setShareBusy = (busy) => {
    shareBusyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.disabled = busy;
      el.setAttribute('aria-busy', busy ? 'true' : 'false');
    });
  };

  const downloadBadgeImage = async () => {
    setShareBusy(true);
    try {
      const slug = attendee.name.replace(/\s+/g, '-').toLowerCase().slice(0, 24);
      await downloadShareImage(attendee, `fintech-day-${slug}.png`);
    } finally {
      setShareBusy(false);
    }
  };

  document.getElementById('share-download')?.addEventListener('click', downloadBadgeImage);
  document.getElementById('share-instagram')?.addEventListener('click', downloadBadgeImage);

  document.getElementById('share-native')?.addEventListener('click', async () => {
    setShareBusy(true);
    try {
      const ok = await nativeShare(attendee, pageUrl);
      if (!ok) await downloadShareImage(attendee);
    } finally {
      setShareBusy(false);
    }
  });

  document.getElementById('share-copy')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      const btn = document.getElementById('share-copy');
      if (btn) {
        const prev = btn.getAttribute('aria-label');
        btn.setAttribute('aria-label', 'Enlace copiado');
        setTimeout(() => btn.setAttribute('aria-label', prev || 'Copiar enlace'), 2000);
      }
    } catch {
      /* ignore */
    }
  });
}

function initPhysics() {
  const stage = document.getElementById('lanyard-stage');
  const ropePath = document.getElementById('rope-path');
  const ropeEdge = document.getElementById('rope-edge');
  const ropeShadow = document.getElementById('rope-shadow');
  const ropePathDef = document.getElementById('rope-path-def');
  const anchor = document.getElementById('badge-anchor');
  const card = document.getElementById('badge-card');
  const hint = document.getElementById('ticket-hint');

  let stageRect = stage.getBoundingClientRect();
  let pinX = stageRect.width / 2;
  let pinY = 0;
  let segmentLen = computeSegmentLen(stageRect.height);

  const points = [];
  for (let i = 0; i < POINTS; i++) {
    const x = pinX;
    const y = pinY + i * segmentLen;
    points.push({ x, y, px: x, py: y, pinned: i === 0 });
  }

  let isDragging = false;
  let mouseX = points[points.length - 1].x;
  let mouseY = points[points.length - 1].y;
  let hasInteracted = false;

  const onResize = () => {
    stageRect = stage.getBoundingClientRect();
    pinX = stageRect.width / 2;
    segmentLen = computeSegmentLen(stageRect.height);
    points[0].x = pinX;
    points[0].y = pinY;
    points[0].px = pinX;
    points[0].py = pinY;
  };
  window.addEventListener('resize', onResize);
  onResize();

  const getPos = (e) => {
    const r = stage.getBoundingClientRect();
    const t = e.touches?.[0] || e.changedTouches?.[0] || e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };

  const onStart = (e) => {
    if (e.cancelable) e.preventDefault();
    isDragging = true;
    const p = getPos(e);
    mouseX = p.x;
    mouseY = p.y;
    card.classList.add('is-dragging');
    if (!hasInteracted) {
      hasInteracted = true;
      hint?.classList.add('is-hidden');
    }
  };
  const onMove = (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const p = getPos(e);
    mouseX = p.x;
    mouseY = p.y;
  };
  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('is-dragging');
  };

  card.addEventListener('mousedown', onStart);
  card.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
  window.addEventListener('touchcancel', onEnd);

  setTimeout(() => {
    if (!hasInteracted) hint?.classList.add('is-hidden');
  }, 6000);

  const tick = () => {
    // Verlet integration
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.pinned) continue;
      const vx = (p.x - p.px) * DAMPING;
      const vy = (p.y - p.py) * DAMPING;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + GRAVITY;
    }

    if (isDragging) {
      const last = points[points.length - 1];
      const lerp = 0.6;
      last.x += (mouseX - last.x) * lerp;
      last.y += (mouseY - last.y) * lerp;
    }

    // Constraint passes
    for (let k = 0; k < ITERATIONS; k++) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const diff = (segmentLen - dist) / dist;
        const ox = dx * 0.5 * diff;
        const oy = dy * 0.5 * diff;

        if (a.pinned) {
          b.x += ox * 2;
          b.y += oy * 2;
        } else if (b.pinned) {
          a.x -= ox * 2;
          a.y -= oy * 2;
        } else {
          a.x -= ox;
          a.y -= oy;
          b.x += ox;
          b.y += oy;
        }
      }
      points[0].x = pinX;
      points[0].y = pinY;
      if (isDragging) {
        const last = points[points.length - 1];
        last.x = mouseX;
        last.y = mouseY;
      }
    }

    // Build smooth path through points (quadratic Bezier via midpoints)
    const d = buildSmoothPath(points);
    ropePath.setAttribute('d', d);
    ropeEdge.setAttribute('d', d);
    ropeShadow.setAttribute('d', d);
    ropePathDef.setAttribute('d', d);

    // Anchor at last point, rotated to rope tangent
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const dx = last.x - prev.x;
    const dy = last.y - prev.y;
    const angle = Math.atan2(dx, dy) * (180 / Math.PI);

    anchor.style.transform = `translate3d(${last.x.toFixed(2)}px, ${last.y.toFixed(2)}px, 0) rotate(${(-angle).toFixed(2)}deg)`;

    requestAnimationFrame(tick);
  };

  tick();
}

function computeSegmentLen(viewportH) {
  // Reserve space for card (~380 + buckle/tab ~80 = ~460) plus margins.
  const badgeReserve = viewportH < 700 ? 400 : 460;
  const ropeSpace = Math.max(180, viewportH - badgeReserve - 80);
  return clamp(ropeSpace / (POINTS - 1), 16, 30);
}

function buildSmoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    d += ` Q ${a.x.toFixed(2)} ${a.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const lastA = points[points.length - 2];
  const lastB = points[points.length - 1];
  d += ` Q ${lastA.x.toFixed(2)} ${lastA.y.toFixed(2)} ${lastB.x.toFixed(2)} ${lastB.y.toFixed(2)}`;
  return d;
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Deterministic barcode bars derived from ticket id.
function barcodeBars(id) {
  let seed = 1779033703 ^ id.length;
  for (let i = 0; i < id.length; i++) {
    seed = Math.imul(seed ^ id.charCodeAt(i), 3432918353);
    seed = (seed << 13) | (seed >>> 19);
  }
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let x = 0;
  let bars = '';
  while (x < 200) {
    const w = 1 + Math.floor(rand() * 3); // 1..3
    const isBar = rand() < 0.55;
    if (isBar) {
      bars += `<rect x="${x}" y="0" width="${w}" height="26" fill="#f5f4f1"/>`;
    }
    x += w + (rand() < 0.4 ? 1 : 0);
  }
  return bars;
}
