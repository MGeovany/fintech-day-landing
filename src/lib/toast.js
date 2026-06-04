let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('ol');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', 'Notificaciones');
    document.body.appendChild(container);
  }
  return container;
}

export function toast(message, { type = 'default', duration = 4000 } = {}) {
  const c = getContainer();
  const li = document.createElement('li');
  li.className = `toast toast--${type}`;
  li.setAttribute('role', 'status');
  li.textContent = message;
  c.appendChild(li);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => li.classList.add('toast--visible'));
  });

  const dismiss = () => {
    li.classList.remove('toast--visible');
    li.addEventListener('transitionend', () => li.remove(), { once: true });
  };

  setTimeout(dismiss, duration);
  return dismiss;
}

export const toastError = (msg) => toast(msg, { type: 'error' });
export const toastSuccess = (msg) => toast(msg, { type: 'success' });
export const toastWarning = (msg) => toast(msg, { type: 'warning' });
