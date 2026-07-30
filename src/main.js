const path = window.location.pathname.replace(/\/$/, '') || '/';
const ticketMatch = path.match(/^\/ticket\/([^/]+)$/);

if (path === '/registro') {
  window.location.replace('https://even2.app/fintechday2026/');
} else if (ticketMatch) {
  import('./ticket.js').then((m) =>
    m.mountTicket(decodeURIComponent(ticketMatch[1])),
  );
} else {
  import('./landing.js').then((m) => m.bootLanding());
}
