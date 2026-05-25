const path = window.location.pathname.replace(/\/$/, '') || '/';
const ticketMatch = path.match(/^\/ticket\/([^/]+)$/);

if (path === '/registro') {
  import('./register.js').then((m) => m.mountRegister());
} else if (ticketMatch) {
  import('./ticket.js').then((m) =>
    m.mountTicket(decodeURIComponent(ticketMatch[1])),
  );
} else {
  import('./landing.js').then((m) => m.bootLanding());
}
