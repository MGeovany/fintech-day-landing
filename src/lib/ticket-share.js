import { toPng } from 'html-to-image';
import { getPassInfo } from './ticket-store.js';
import { SITE_NAME, HASHTAG, absoluteUrl } from './site.js';

const EVENT_HASHTAG = HASHTAG;

const BADGE_W = 260;
const BADGE_H = 380;
const EXPORT_PIXEL_RATIO = 3;

// Export container: badge (260) + 24px padding each side
const EXPORT_W = 308;
// Anchor origin y-offset inside container (room for buckle above)
const ANCHOR_Y = 52;
// Approx total height: ANCHOR_Y + buckle(58) + tab(32) + card(380) + bottom pad
const EXPORT_H = 540;

export function setPageShareMeta(attendee, pageUrl, ticketId) {
  const pass = getPassInfo(attendee.pass);
  const title = `${attendee.name} - ${SITE_NAME}`;
  const description = `${pass.label} · 20 ago 2026 · San Pedro Sula, Honduras`;
  const canonicalUrl = pageUrl || absoluteUrl('/');
  const ogImage = ticketId
    ? absoluteUrl(`/api/og/${encodeURIComponent(ticketId)}`)
    : absoluteUrl('/og-share.svg');

  document.title = title;
  setMeta('description', description);
  setMeta('robots', 'noindex, follow');
  setCanonical(canonicalUrl);

  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:type', 'profile', true);
  setMeta('og:url', canonicalUrl, true);
  setMeta('og:site_name', SITE_NAME, true);
  setMeta('og:image', ogImage, true);
  setMeta('og:image:alt', `Badge ${SITE_NAME} - ${attendee.name}`, true);

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:url', canonicalUrl);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);
  setMeta('twitter:image:alt', `Badge ${SITE_NAME} - ${attendee.name}`);
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setMeta(key, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function buildShareText(attendee, pageUrl) {
  const pass = getPassInfo(attendee.pass);
  return `¡Voy al Honduras Fintech Day 2026! ${pass.label} · 20 ago · San Pedro Sula\n${pageUrl}\n${EVENT_HASHTAG}`;
}

export function buildReferralUrl(attendee) {
  const encoded = btoa(unescape(encodeURIComponent(attendee.name)));
  return `${window.location.origin}/?ref=${encoded}`;
}

export function shareLinks(pageUrl) {
  const text = `¡Me registré para Honduras Fintech Day 2026! 20 ago · San Pedro Sula\n${pageUrl}\n${EVENT_HASHTAG}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(pageUrl);
  return {
    x: `https://twitter.com/intent/tweet?text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
  };
}

/**
 * Captura el badge card (que funciona de forma confiable) y luego dibuja
 * el cordón y el buckle encima usando canvas 2D - evita los problemas de
 * html-to-image con el DOM de width:0 y márgenes negativos del anchor.
 */
export async function captureBadgeWithLanyard() {
  const cardDataUrl = await captureBadgeFromDom();
  if (!cardDataUrl) return null;

  const PR = EXPORT_PIXEL_RATIO;

  // Dimensiones en px CSS → escalar por pixelRatio para canvas
  const CORD_W   = 8;   // ancho del cordón
  const CORD_H   = 64;  // altura visible del cordón encima del buckle
  const BKL_W    = 26;  // buckle
  const BKL_H    = 50;
  const TAB_W    = 22;  // tab negro
  const TAB_H    = 30;
  const PAD_X    = 24;  // padding lateral
  const CTR_W    = BADGE_W + PAD_X * 2;            // 308
  const CTR_H    = CORD_H + BKL_H + 8 + TAB_H + 4 + BADGE_H + 16; // ~562

  const canvas = document.createElement('canvas');
  canvas.width  = CTR_W * PR;
  canvas.height = CTR_H * PR;
  const ctx = canvas.getContext('2d');
  ctx.scale(PR, PR);

  const cx = CTR_W / 2; // centro horizontal

  // ── Cordón (lanyard strap) ──────────────────────────────────────
  const cordX = cx - CORD_W / 2;
  ctx.fillStyle = '#111111';
  ctx.fillRect(cordX, 0, CORD_W, CORD_H + BKL_H / 2); // llega hasta mitad del buckle

  // ── Buckle (naranja) ────────────────────────────────────────────
  const bklX = cx - BKL_W / 2;
  const bklY = CORD_H;

  const bklGrad = ctx.createLinearGradient(bklX, bklY, bklX, bklY + BKL_H);
  bklGrad.addColorStop(0,    '#ff5e2b');
  bklGrad.addColorStop(0.38, '#ff5e2b');
  bklGrad.addColorStop(0.49, 'rgba(0,0,0,0.55)');
  bklGrad.addColorStop(0.51, 'rgba(0,0,0,0.55)');
  bklGrad.addColorStop(0.62, '#ff5e2b');
  bklGrad.addColorStop(1,    '#c5421a');
  ctx.fillStyle = bklGrad;
  roundRect(ctx, bklX, bklY, BKL_W, BKL_H, [4, 4, 5, 5]);
  ctx.fill();

  // Línea central del buckle
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(cx - 0.75, bklY + 6, 1.5, BKL_H - 12);

  // Conector inferior del buckle
  const conW = 14, conH = 8;
  const conGrad = ctx.createLinearGradient(0, bklY + BKL_H, 0, bklY + BKL_H + conH);
  conGrad.addColorStop(0, '#c5421a');
  conGrad.addColorStop(1, '#9a3414');
  ctx.fillStyle = conGrad;
  roundRect(ctx, cx - conW / 2, bklY + BKL_H, conW, conH, [0, 0, 3, 3]);
  ctx.fill();

  // ── Tab negro ───────────────────────────────────────────────────
  const tabX = cx - TAB_W / 2;
  const tabY = bklY + BKL_H + conH + 2;
  const tabGrad = ctx.createLinearGradient(tabX, tabY, tabX, tabY + TAB_H);
  tabGrad.addColorStop(0, '#1a1a1a');
  tabGrad.addColorStop(1, '#050505');
  ctx.fillStyle = tabGrad;
  ctx.fillRect(tabX, tabY, TAB_W, TAB_H);

  // Punto cyan del tab
  ctx.beginPath();
  ctx.arc(cx, tabY + TAB_H / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#00c4f0';
  ctx.shadowColor = 'rgba(0,196,240,0.7)';
  ctx.shadowBlur = 8 / PR;
  ctx.fill();
  ctx.shadowBlur = 0;

  // ── Badge card ──────────────────────────────────────────────────
  const cardY = tabY + TAB_H - 4; // -4 = margin-top original del card
  const img = new Image();
  img.src = cardDataUrl;
  await new Promise((res) => { img.onload = res; });
  ctx.drawImage(img, PAD_X, cardY, BADGE_W, BADGE_H);

  return canvas.toDataURL('image/png');
}

function roundRect(ctx, x, y, w, h, radii) {
  const [tl = 0, tr = 0, br = 0, bl = 0] = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

/** Captura solo el badge-card (para compatibilidad). */
export async function captureBadgeFromDom() {
  const source = document.getElementById('badge-card');
  if (!source) return null;

  if (document.fonts?.ready) await document.fonts.ready;

  const stage = document.createElement('div');
  stage.setAttribute('aria-hidden', 'true');
  Object.assign(stage.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${BADGE_W}px`,
    height: `${BADGE_H}px`,
    pointerEvents: 'none',
    zIndex: '-1',
    overflow: 'hidden',
  });

  const clone = source.cloneNode(true);
  clone.removeAttribute('id');
  clone.classList.remove('is-dragging');
  Object.assign(clone.style, {
    margin: '0',
    transform: 'none',
    position: 'relative',
    width: `${BADGE_W}px`,
    height: `${BADGE_H}px`,
    cursor: 'default',
  });

  stage.appendChild(clone);
  document.body.appendChild(stage);

  try {
    return await toPng(clone, {
      pixelRatio: EXPORT_PIXEL_RATIO,
      width: BADGE_W,
      height: BADGE_H,
      cacheBust: true,
      skipFonts: false,
    });
  } catch {
    return null;
  } finally {
    stage.remove();
  }
}

async function dataUrlToFile(dataUrl, filename) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: 'image/png' });
}

/**
 * Abre la red social en nueva pestaña y descarga la imagen del badge.
 * LinkedIn no acepta texto pre-llenado vía URL - copia el texto al clipboard
 * antes de abrir para que el usuario solo tenga que pegar.
 * Devuelve { copied: boolean } para que el llamador muestre feedback.
 */
export async function shareToSocial(platform, attendee, pageUrl) {
  const links = shareLinks(pageUrl);
  const text = buildShareText(attendee, pageUrl);
  const slug = attendee.name.replace(/\s+/g, '-').toLowerCase().slice(0, 24);
  const filename = `fintech-day-${slug}.png`;

  // LinkedIn no soporta texto pre-llenado - copiar al portapapeles primero
  if (platform === 'linkedin') {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
  }

  const url = links[platform];
  if (url) window.open(url, '_blank', 'noopener,noreferrer');

  const dataUrl = await captureBadgeWithLanyard();
  if (dataUrl) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  return { copied: platform === 'linkedin' };
}

export async function downloadShareImage(attendee, filename) {
  const name = filename || `fintech-day-${(attendee?.name || 'badge').replace(/\s+/g, '-').toLowerCase().slice(0, 24)}.png`;
  const dataUrl = await captureBadgeWithLanyard();
  if (!dataUrl) return false;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name;
  a.click();
  return true;
}

export async function nativeShare(attendee, pageUrl) {
  const dataUrl = await captureBadgeWithLanyard();
  if (!dataUrl || !navigator.share) return false;

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], 'fintech-day-2026.png', { type: 'image/png' });
  const pass = getPassInfo(attendee.pass);

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: 'Honduras Fintech Day 2026',
        text: `¡Voy al Fintech Day 2026! ${pass.label}`,
        files: [file],
      });
      return true;
    }
    await navigator.share({
      title: 'Honduras Fintech Day 2026',
      text: `¡Voy al Fintech Day 2026! ${pass.label} · ${pageUrl}`,
      url: pageUrl,
    });
    return true;
  } catch (err) {
    if (err?.name === 'AbortError') return true;
    return false;
  }
}
