import { getLastTicketId, getSavedAttendee } from './ticket-store.js';

export function updateNavAuthCta() {
  const cta = document.getElementById('nav-auth-cta');
  const label = document.getElementById('nav-auth-label');
  if (!cta || !label) return;

  const ticketId = getLastTicketId();
  const attendee = ticketId ? getSavedAttendee() : null;

  if (ticketId && attendee) {
    cta.href = `/ticket/${ticketId}`;
    cta.setAttribute('aria-label', `Ver tu perfil — ${attendee.name}`);
    label.textContent = 'Perfil';
    cta.classList.add('nav-cta--profile');
    cta.dataset.authState = 'profile';
    return;
  }

  cta.href = '/registro';
  cta.setAttribute('aria-label', 'Registrarse — obtener tu pase');
  label.textContent = 'Sign up';
  cta.classList.remove('nav-cta--profile');
  cta.dataset.authState = 'signup';
}
