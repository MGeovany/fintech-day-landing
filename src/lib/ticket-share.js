import { toPng } from 'html-to-image';
import { getPassInfo } from './ticket-store.js';
import { SITE_NAME, OG_IMAGE_URL, HASHTAG, absoluteUrl } from './site.js';

const EVENT_HASHTAG = HASHTAG;

/** Mismas dimensiones que `.badge-card` en ticket.css */
const BADGE_W = 260;
const BADGE_H = 380;
const EXPORT_PIXEL_RATIO = 3;

export function setPageShareMeta(attendee, pageUrl) {
  const pass = getPassInfo(attendee.pass);
  const title = `${attendee.name} — ${SITE_NAME}`;
  const description = `${pass.label} · 20 ago 2026 · San Pedro Sula, Honduras`;
  const canonicalUrl = pageUrl || absoluteUrl('/');
  const ogImage = OG_IMAGE_URL;

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

export function shareLinks(pageUrl) {
  const text = `¡Me registré para Honduras Fintech Day 2026! 20 ago · San Pedro Sula\n${pageUrl}\n${EVENT_HASHTAG}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(pageUrl);
  return {
    x: `https://twitter.com/intent/tweet?text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
  };
}

/** Captura el `#badge-card` visible en la página (mismo HTML/CSS que en pantalla). */
export async function captureBadgeFromDom() {
  const source = document.getElementById('badge-card');
  if (!source) return null;

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

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
    marginLeft: '0',
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
      backgroundColor: '#0d0d0f',
      cacheBust: true,
      skipFonts: false,
    });
  } catch {
    return null;
  } finally {
    stage.remove();
  }
}

export async function renderShareImage() {
  return captureBadgeFromDom();
}

export async function downloadShareImage(_attendee, filename = 'fintech-day-badge.png') {
  const dataUrl = await captureBadgeFromDom();
  if (!dataUrl) return false;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
  return true;
}

export async function nativeShare(attendee, pageUrl) {
  const dataUrl = await captureBadgeFromDom();
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
