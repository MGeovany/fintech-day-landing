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

export function toast(message, { type = 'default', duration = 4000, action = null } = {}) {
  const c = getContainer();
  const li = document.createElement('li');
  li.className = `toast toast--${type}`;
  li.setAttribute('role', 'status');

  const text = document.createElement('span');
  text.className = 'toast-message';
  text.textContent = message;
  li.appendChild(text);

  if (action) {
    const btn = document.createElement('a');
    btn.className = 'toast-action';
    btn.href = action.href;
    btn.textContent = action.label;
    li.appendChild(btn);
  }

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
