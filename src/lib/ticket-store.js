/** Tipos de entrada — Nota Conceptual Fintech Day 2026 */

export const PASS_TYPES = {
  full: {
    id: 'full',
    label: 'Full Pass',
    price: '$65',
    pill: 'FULL PASS',
    hint: 'Feria, charlas, workshop (registro previo) y almuerzo.',
  },
  expo: {
    id: 'expo',
    label: 'Expo Pass',
    price: 'Gratis',
    pill: 'EXPO PASS',
    hint: 'Acceso solo a la feria tecnológica (Napoleón VI).',
  },
  stand: {
    id: 'stand',
    label: 'Stand / Expositor',
    price: 'Según paquete',
    pill: 'EXPOSITOR',
    hint: 'Personal asignado a un stand de patrocinio.',
  },
};

export function encodeTicketId(data) {
  const payload = {
    n: data.name.trim(),
    e: data.email.trim(),
    p: data.pass,
    c: (data.company || '').trim(),
    r: (data.role || '').trim(),
  };
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeTicketId(id) {
  try {
    const padded = id.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(padded)));
    const raw = JSON.parse(json);
    if (!raw?.n || !raw?.p || !PASS_TYPES[raw.p]) return null;
    return {
      name: raw.n,
      email: raw.e || '',
      pass: raw.p,
      company: raw.c || '',
      role: raw.r || '',
    };
  } catch {
    return null;
  }
}

export function saveTicket(id, data) {
  try {
    localStorage.setItem(`fd2026_${id}`, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function loadTicket(id) {
  try {
    const raw = localStorage.getItem(`fd2026_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getPassInfo(passId) {
  return PASS_TYPES[passId] || PASS_TYPES.expo;
}

/** Código corto legible en el gafete (no es el token de URL completo). */
export function formatDisplayTicketId(ticketId) {
  let h = 5381;
  for (let i = 0; i < ticketId.length; i++) {
    h = (h * 33) ^ ticketId.charCodeAt(i);
  }
  const code = (h >>> 0).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
  return `FD26-${code}`;
}
