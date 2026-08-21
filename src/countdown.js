import { EVENT_COUNTDOWN_ISO } from './lib/site.js';

const LABELS = [
  { key: 'days', label: 'días' },
  { key: 'hours', label: 'hrs' },
  { key: 'minutes', label: 'min' },
  { key: 'seconds', label: 'seg' },
];

const TICK_INTERVAL_MS = 150;

export function initEventCountdown(root = document.getElementById('event-countdown')) {
  if (!root) return;

  const target = new Date(EVENT_COUNTDOWN_ISO).getTime();
  const cells = Object.fromEntries(
    LABELS.map(({ key }) => [key, root.querySelector(`[data-count="${key}"]`)]),
  );
  const labelEl = root.querySelector('.hero-countdown-label');

  const pad = (n) => String(n).padStart(2, '0');

  const render = (values) => {
    LABELS.forEach(({ key }) => {
      if (cells[key]) cells[key].textContent = pad(values[key]);
    });
  };

  const randomEndedValues = () => ({
    days: Math.floor(Math.random() * 100),
    hours: Math.floor(Math.random() * 24),
    minutes: Math.floor(Math.random() * 60),
    seconds: Math.floor(Math.random() * 60),
  });

  const tick = () => {
    const diff = target - Date.now();

    if (diff <= 0) {
      root.classList.add('is-live');
      if (labelEl) labelEl.textContent = 'Gracias por habernos acompañado';
      render(randomEndedValues());
      return;
    }

    root.classList.remove('is-live');
    if (labelEl) labelEl.textContent = 'Faltan para el evento';

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    render({ days, hours, minutes, seconds });
  };

  tick();
  window.setInterval(tick, TICK_INTERVAL_MS);
}
