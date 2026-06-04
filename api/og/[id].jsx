import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const PASS_LABELS = { full: 'FULL PASS', expo: 'EXPO PASS', stand: 'EXPOSITOR' };

function decodeTicketId(id) {
  try {
    const padded = id.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(decodeURIComponent(escape(atob(padded))));
    if (!json?.n || !json?.p) return null;
    return { name: json.n, pass: json.p, role: json.r || '', company: json.c || '' };
  } catch {
    return null;
  }
}

async function fetchAttendee(origin, id) {
  try {
    const res = await fetch(`${origin}/api/attendee/${id}`, { next: { revalidate: 300 } });
    if (res.ok) return res.json();
  } catch {}
  return null;
}

async function loadFont(url) {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.pathname.replace(/^\/api\/og\//, '').split('?')[0];

  // Resolve attendee: try base64 decode first, then DB lookup
  let attendee = decodeTicketId(id);
  if (!attendee && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    attendee = await fetchAttendee(url.origin, id);
  }

  const name = attendee?.name || 'Honduras Fintech Day 2026';
  const passLabel = PASS_LABELS[attendee?.pass] || '';
  const subtitle = [attendee?.role, attendee?.company].filter(Boolean).join(' · ');

  let fontData;
  try {
    fontData = await loadFont(
      'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuEnF.woff2'
    );
  } catch {
    fontData = null;
  }

  const fonts = fontData
    ? [{ name: 'Space Grotesk', data: fontData, weight: 700, style: 'normal' }]
    : [];

  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #020c1b 0%, #030d1f 60%, #061428 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 80px',
        fontFamily: fontData ? 'Space Grotesk' : 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent dots */}
      <div style={{
        position: 'absolute', top: '-60px', right: '320px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,196,240,0.06) 0%, transparent 70%)',
        display: 'flex',
      }} />

      {/* Left: event branding */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', flex: 1 }}>
        <div style={{
          fontSize: '13px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(0,196,240,0.8)', marginBottom: '24px', display: 'flex',
        }}>
          hondurasfintechday.com
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '72px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex' }}>
            HONDURAS
          </span>
          <span style={{ fontSize: '72px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex' }}>
            FINTECH
          </span>
          <span style={{ fontSize: '72px', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex' }}>
            <span style={{ color: '#ffffff' }}>DAY </span>
            <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: '16px' }}>2026</span>
          </span>
        </div>

        <div style={{
          marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', display: 'flex' }}>
            20 · AGOSTO · 2026
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', display: 'flex' }}>
            San Pedro Sula, Honduras
          </div>
        </div>
      </div>

      {/* Right: badge card */}
      <div style={{
        width: '300px',
        background: '#0d1117',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        flexShrink: 0,
      }}>
        {/* Badge header */}
        <div style={{
          fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', marginBottom: '16px', display: 'flex',
        }}>
          hondurasfintechday.com
        </div>

        {/* Pass pill */}
        {passLabel ? (
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            background: '#f5f4f1', color: '#000', fontSize: '11px',
            fontWeight: 700, letterSpacing: '0.04em', padding: '4px 10px',
            borderRadius: '3px', marginBottom: '20px',
          }}>
            {passLabel}
          </div>
        ) : null}

        {/* Attendee info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)', display: 'flex',
          }}>
            Nombre
          </div>
          <div style={{
            fontSize: attendee ? '20px' : '14px',
            fontWeight: 700, color: '#ffffff',
            letterSpacing: '-0.01em', lineHeight: 1.2,
            display: 'flex',
          }}>
            {name}
          </div>
          {subtitle ? (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px', display: 'flex' }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <div style={{
          margin: '20px 0 16px',
          height: '1px', background: 'rgba(255,255,255,0.07)', display: 'flex',
        }} />

        {/* Meta row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '9px', letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.45)',
        }}>
          <span style={{ display: 'flex', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>20 · AGO · 2026</span>
          <span style={{ display: 'flex' }}>SAN PEDRO SULA</span>
        </div>

        {/* Accent line */}
        <div style={{
          marginTop: '16px', height: '2px', borderRadius: '1px',
          background: 'linear-gradient(90deg, #00c4f0, transparent)',
          display: 'flex',
        }} />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fonts.length ? fonts : undefined,
    }
  );
}
