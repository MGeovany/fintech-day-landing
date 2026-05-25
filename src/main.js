const ticketMatch = window.location.pathname.match(/^\/ticket\/([^/]+)\/?$/);

if (ticketMatch) {
  import('./ticket.js').then((m) => m.mountTicket(decodeURIComponent(ticketMatch[1])));
} else {
  import('./landing.js').then((m) => m.bootLanding());
}
