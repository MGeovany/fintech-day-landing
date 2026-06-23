/** Tipos de entrada - Nota Conceptual Fintech Day 2026 */

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
    hint: 'Acceso a la feria tecnológica.',
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
    t: (data.team || '').trim(),
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
      team: raw.t || '',
    };
  } catch {
    return null;
  }
}

export const LAST_TICKET_KEY = 'fd2026_last';

export function saveTicket(id, data) {
  try {
    localStorage.setItem(`fd2026_${id}`, JSON.stringify(data));
    localStorage.setItem(LAST_TICKET_KEY, id);
  } catch {
    /* quota */
  }
}

/** ID del último pase reclamado en este dispositivo. */
export function getLastTicketId() {
  try {
    const last = localStorage.getItem(LAST_TICKET_KEY);
    if (last && decodeTicketId(last)) return last;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('fd2026_') || key === LAST_TICKET_KEY) continue;
      const id = key.slice(7);
      if (decodeTicketId(id)) {
        localStorage.setItem(LAST_TICKET_KEY, id);
        return id;
      }
    }
  } catch {
    /* private mode / blocked */
  }
  return null;
}

export function getSavedAttendee() {
  const id = getLastTicketId();
  if (!id) return null;
  return decodeTicketId(id) || loadTicket(id);
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
