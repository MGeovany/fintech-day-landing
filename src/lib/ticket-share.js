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

export function setPageShareMeta(attendee, pageUrl) {
  const pass = getPassInfo(attendee.pass);
  const title = `${attendee.name} — ${SITE_NAME}`;
  const description = `${pass.label} · 20 ago 2026 · San Pedro Sula, Honduras`;
  const canonicalUrl = pageUrl || absoluteUrl('/');
  const ogImage = absoluteUrl('/og-share.svg');

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
  setMeta('og:image:alt', `Badge ${SITE_NAME} — ${attendee.name}`, true);

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:url', canonicalUrl);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);
  setMeta('twitter:image:alt', `Badge ${SITE_NAME} — ${attendee.name}`);
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

/** Captura badge-anchor (buckle + tab + card) con fondo transparente. */
export async function captureBadgeWithLanyard() {
  const anchor = document.getElementById('badge-anchor');
  if (!anchor) return null;

  if (document.fonts?.ready) await document.fonts.ready;

  const stage = document.createElement('div');
  stage.setAttribute('aria-hidden', 'true');
  Object.assign(stage.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${EXPORT_W}px`,
    height: `${EXPORT_H}px`,
    pointerEvents: 'none',
    zIndex: '-1',
    overflow: 'hidden',
  });

  const clone = anchor.cloneNode(true);
  clone.removeAttribute('id');
  Object.assign(clone.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    transform: `translate3d(${EXPORT_W / 2}px, ${ANCHOR_Y}px, 0) rotate(0deg)`,
    transformOrigin: '0 0',
    willChange: 'auto',
  });

  const cloneCard = clone.querySelector('.badge-card');
  if (cloneCard) {
    cloneCard.removeAttribute('id');
    cloneCard.classList.remove('is-dragging');
    cloneCard.style.cursor = 'default';
  }

  stage.appendChild(clone);
  document.body.appendChild(stage);

  try {
    return await toPng(stage, {
      pixelRatio: EXPORT_PIXEL_RATIO,
      width: EXPORT_W,
      height: EXPORT_H,
      // no backgroundColor → transparent
      cacheBust: true,
      skipFonts: false,
    });
  } catch {
    return null;
  } finally {
    stage.remove();
  }
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

/** Comparte en la plataforma dada: intenta Web Share API con imagen; fallback a URL + descarga. */
export async function shareToSocial(platform, attendee, pageUrl) {
  const links = shareLinks(pageUrl);
  const text = buildShareText(attendee, pageUrl);
  const slug = attendee.name.replace(/\s+/g, '-').toLowerCase().slice(0, 24);
  const filename = `fintech-day-${slug}.png`;

  const dataUrl = await captureBadgeWithLanyard();

  // Mobile / desktop con Web Share API + soporte de archivos
  if (dataUrl && navigator.share) {
    try {
      const file = await dataUrlToFile(dataUrl, filename);
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Honduras Fintech Day 2026',
          text,
          files: [file],
        });
        return true;
      }
    } catch (err) {
      if (err?.name === 'AbortError') return true;
      // fall through
    }
  }

  // Fallback desktop: abrir URL de la plataforma + descargar imagen
  const url = links[platform];
  if (url) window.open(url, '_blank', 'noopener,noreferrer');

  if (dataUrl) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  return true;
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
