import {
  getLastTicketId,
  getSavedAttendee,
  formatDisplayTicketId,
} from './ticket-store.js';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function navDisplayName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || fullName;
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (`${first} ${last}`.length <= 18) return `${first} ${last}`;
  return first.length <= 14 ? first : `${first.slice(0, 12)}…`;
}

export function updateNavAuthCta() {
  const cta = document.getElementById('nav-auth-cta');
  const label = document.getElementById('nav-auth-label');
  if (!cta || !label) return;

  const ticketId = getLastTicketId();
  const attendee = ticketId ? getSavedAttendee() : null;

  if (ticketId && attendee) {
    const name = navDisplayName(attendee.name);
    const ticketNo = `#${formatDisplayTicketId(ticketId)}`;

    cta.href = `/ticket/${ticketId}`;
    cta.setAttribute('aria-label', `Ver tu pase - ${attendee.name}, ${ticketNo}`);
    label.innerHTML = `<span class="nav-auth-user"><span class="nav-auth-name">${escapeHtml(name)}</span><span class="nav-auth-ticket">${escapeHtml(ticketNo)}</span></span>`;
    cta.classList.add('nav-cta--profile');
    cta.dataset.authState = 'profile';
    return;
  }

  cta.href = '/registro';
  cta.setAttribute('aria-label', 'Registrarse - obtener tu pase');
  label.textContent = 'Sign up';
  cta.classList.remove('nav-cta--profile');
  cta.dataset.authState = 'signup';
}
