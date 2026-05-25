import './register.css';
import {
  PASS_TYPES,
  encodeTicketId,
  saveTicket,
} from './lib/ticket-store.js';
import { SITE_NAME, absoluteUrl } from './lib/site.js';

export function mountRegister() {
  document.title = `Registro — ${SITE_NAME}`;
  setRegisterMeta();
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = renderForm();
  document.body.classList.add('on-register-page');

  const form = document.getElementById('register-form');
  const passInputs = form.querySelectorAll('input[name="pass"]');
  const standFields = document.getElementById('stand-fields');

  passInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const isStand = form.querySelector('input[name="pass"]:checked')?.value === 'stand';
      standFields?.classList.toggle('hidden', !isStand);
      clearFieldError(form, 'pass');
      if (!isStand) clearFieldError(form, 'company');
    });
  });

  form.querySelectorAll('input[name="name"], input[name="email"], input[name="company"], input[name="role"]').forEach((input) => {
    input.addEventListener('input', () => clearFieldError(form, input.name));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      pass: fd.get('pass'),
      company: String(fd.get('company') || '').trim(),
      role: String(fd.get('role') || '').trim(),
    };

    const errors = validateRegisterData(data);
    if (Object.keys(errors).length > 0) {
      showFormErrors(form, errors);
      const firstKey = Object.keys(errors)[0];
      const firstEl = form.querySelector(`[data-field="${firstKey}"] input, [data-field="${firstKey}"]`);
      const focusTarget = firstEl?.matches('input') ? firstEl : firstEl?.querySelector('input');
      focusTarget?.focus();
      return;
    }

    clearAllErrors(form);
    const id = encodeTicketId(data);
    saveTicket(id, data);
    window.location.href = `/ticket/${id}`;
  });
}

function setRegisterMeta() {
  const description = `Regístrate al ${SITE_NAME}: 20 de agosto en San Pedro Sula. Expo Pass gratuito o Full Pass con acceso a charlas, workshop y almuerzo.`;
  setMetaTag('description', description);
  setMetaTag('robots', 'noindex, follow');
  setMetaTag('og:title', `Registro — ${SITE_NAME}`, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:url', absoluteUrl('/registro'), true);
  setCanonicalLink(absoluteUrl('/registro'));
}

function setMetaTag(key, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalLink(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterData(data) {
  const errors = {};

  if (!data.name) {
    errors.name = 'Ingresa tu nombre completo.';
  } else if (data.name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!data.email) {
    errors.email = 'Ingresa tu correo electrónico.';
  } else if (!EMAIL_RE.test(data.email)) {
    errors.email = 'Ingresa un correo válido (ej. nombre@empresa.com).';
  }

  if (!data.pass || !PASS_TYPES[data.pass]) {
    errors.pass = 'Selecciona un tipo de entrada.';
  }

  if (data.pass === 'stand' && !data.company) {
    errors.company = 'Indica el nombre de la empresa o stand.';
  }

  if (!data.role) {
    errors.role = 'Indica tu rol o cargo.';
  } else if (data.role.length < 2) {
    errors.role = 'El rol debe tener al menos 2 caracteres.';
  }

  return errors;
}

function showFormErrors(form, errors) {
  clearAllErrors(form);

  const keys = Object.keys(errors);
  const summary = form.querySelector('#register-form-summary');
  if (summary) {
    summary.hidden = false;
    summary.textContent =
      keys.length === 1
        ? errors[keys[0]]
        : `Revisa ${keys.length} campos antes de continuar.`;
  }

  keys.forEach((field) => {
    const wrap = form.querySelector(`[data-field="${field}"]`);
    if (!wrap) return;
    wrap.classList.add('register-field--error');
    const msg = wrap.querySelector('.register-error');
    if (msg) {
      msg.textContent = errors[field];
      msg.hidden = false;
    }
  });
}

function clearFieldError(form, field) {
  const wrap = form.querySelector(`[data-field="${field}"]`);
  if (!wrap) return;
  wrap.classList.remove('register-field--error');
  const msg = wrap.querySelector('.register-error');
  if (msg) {
    msg.textContent = '';
    msg.hidden = true;
  }
  updateErrorSummary(form);
}

function clearAllErrors(form) {
  form.querySelectorAll('[data-field]').forEach((wrap) => {
    wrap.classList.remove('register-field--error');
    const msg = wrap.querySelector('.register-error');
    if (msg) {
      msg.textContent = '';
      msg.hidden = true;
    }
  });
  const summary = form.querySelector('#register-form-summary');
  if (summary) {
    summary.hidden = true;
    summary.textContent = '';
  }
}

function updateErrorSummary(form) {
  const remaining = form.querySelectorAll('.register-error:not([hidden])');
  const visible = [...remaining].filter((el) => el.textContent.trim());
  const summary = form.querySelector('#register-form-summary');
  if (!summary) return;
  if (visible.length === 0) {
    summary.hidden = true;
    summary.textContent = '';
  } else if (visible.length === 1) {
    summary.textContent = visible[0].textContent;
  } else {
    summary.textContent = `Revisa ${visible.length} campos antes de continuar.`;
  }
}

function renderForm() {
  const passes = Object.values(PASS_TYPES);

  return `
    <div class="register-page">
      <a href="/" class="register-back">← Inicio</a>

      <div class="register-shell">
        <header class="register-head">
          <span class="register-eyebrow"><span class="register-dot"></span> Entradas</span>
          <h1 class="register-title">Obtén tu pase</h1>
          <p class="register-lead">
            Completa el formulario y genera tu badge digital para el
            <strong>20 de agosto de 2026</strong> en San Pedro Sula.
          </p>
        </header>

        <form id="register-form" class="register-form" novalidate>
          <p id="register-form-summary" class="register-form-summary" role="alert" hidden></p>

          <label class="register-field" data-field="name">
            <span>Nombre completo</span>
            <input type="text" name="name" autocomplete="name" placeholder="Tu nombre" aria-describedby="error-name" />
            <span id="error-name" class="register-error" role="alert" hidden></span>
          </label>

          <label class="register-field" data-field="email">
            <span>Correo electrónico</span>
            <input type="email" name="email" autocomplete="email" placeholder="tu@email.com" aria-describedby="error-email" />
            <span id="error-email" class="register-error" role="alert" hidden></span>
          </label>

          <fieldset class="register-fieldset" data-field="pass">
            <legend>Tipo de entrada</legend>
            <div class="register-pass-grid">
              ${passes
                .map(
                  (p, i) => `
                <label class="register-pass">
                  <input type="radio" name="pass" value="${p.id}" ${i === 0 ? 'checked' : ''} required />
                  <span class="register-pass-card">
                    <span class="register-pass-top">
                      <span class="register-pass-label">${p.label}</span>
                      <span class="register-pass-price">${p.price}</span>
                    </span>
                    <span class="register-pass-hint">${p.hint}</span>
                  </span>
                </label>`,
                )
                .join('')}
            </div>
            <span id="error-pass" class="register-error" role="alert" hidden></span>
          </fieldset>

          <div id="stand-fields" class="register-stand-fields hidden">
            <label class="register-field" data-field="company">
              <span>Empresa / stand</span>
              <input type="text" name="company" placeholder="Nombre del expositor o stand" aria-describedby="error-company" />
              <span id="error-company" class="register-error" role="alert" hidden></span>
            </label>
          </div>

          <label class="register-field" data-field="role">
            <span>Rol o cargo</span>
            <input type="text" name="role" placeholder="Ej. CEO, Developer, Estudiante…" aria-describedby="error-role" />
            <span id="error-role" class="register-error" role="alert" hidden></span>
          </label>

          <div class="register-note">
            <p><strong>Importante:</strong> Full Pass incluye almuerzo (cupos limitados). Expo Pass es solo feria. Stand requiere paquete de patrocinio activo.</p>
            <p>El pago de $65 se coordina con AFINH tras el registro. Este formulario genera tu badge de participación.</p>
          </div>

          <button type="submit" class="register-submit">Generar mi badge</button>
        </form>
      </div>
    </div>
  `;
}
