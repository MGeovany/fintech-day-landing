import './register.css';
import {
  PASS_TYPES,
  encodeTicketId,
  saveTicket,
} from './lib/ticket-store.js';
import { SITE_NAME, absoluteUrl } from './lib/site.js';
import { toast, toastError } from './lib/toast.js';
import { supabase } from './lib/supabase.js';

export function mountRegister() {
  document.title = `Registro - ${SITE_NAME}`;
  setRegisterMeta();
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = renderForm();
  document.body.classList.add('on-register-page');

  const form = document.getElementById('register-form');
  const passInputs = form.querySelectorAll('input[name="pass"]');
  const standFields = document.getElementById('stand-fields');
  const fullFields = document.getElementById('full-fields');
  const roleField = document.getElementById('role-field');

  const updateFieldVisibility = (pass) => {
    standFields?.classList.toggle('hidden', pass !== 'stand');
    fullFields?.classList.toggle('hidden', pass !== 'full');
    roleField?.classList.toggle('hidden', pass === 'stand');
  };

  // Set initial visibility for the default selected pass
  const initialPass = form.querySelector('input[name="pass"]:checked')?.value || 'full';
  updateFieldVisibility(initialPass);

  passInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const pass = form.querySelector('input[name="pass"]:checked')?.value;
      updateFieldVisibility(pass);
      clearFieldError(form, 'pass');
      if (pass !== 'stand') clearFieldError(form, 'company');
      if (pass !== 'full') clearFieldError(form, 'team');
    });
  });

  form.querySelectorAll('input[name="name"], input[name="email"], input[name="company"], input[name="role"], input[name="team"]').forEach((input) => {
    input.addEventListener('input', () => clearFieldError(form, input.name));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const pass = fd.get('pass');
    const data = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      pass,
      company: String(fd.get('company') || '').trim(),
      role: String(fd.get('role') || '').trim(),
      team: String(fd.get('team') || '').trim(),
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
    const submitBtn = form.querySelector('.register-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando…';

    submitRegistration(data)
      .then(({ ticketId }) => {
        saveTicket(ticketId, data);
        window.location.href = `/ticket/${ticketId}`;
      })
      .catch(async (err) => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generar mi badge';

        if (err.code === 409) {
          toast('Este usuario ya tiene un ticket asignado. Te llevamos a tu badge…', {
            type: 'warning',
            duration: 2500,
          });
          if (err.ticketId) {
            setTimeout(() => {
              window.location.href = `/ticket/${err.ticketId}`;
            }, 1500);
          }
          return;
        }

        // Fallback: try Supabase client directly if configured
        if (supabase) {
          try {
            const { data: reg, error } = await supabase
              .from('registrations')
              .insert([{
                name: data.name,
                email: data.email.toLowerCase(),
                pass: data.pass,
                company: data.company,
                role: data.role,
                team: data.team,
              }])
              .select('id')
              .single();

            if (!error && reg?.id) {
              saveTicket(reg.id, data);
              window.location.href = `/ticket/${reg.id}`;
              return;
            }
          } catch {
            // fall through to local badge
          }
        }

        // Last resort: local-only badge
        const id = encodeTicketId(data);
        saveTicket(id, data);
        window.location.href = `/ticket/${id}`;
      });
  });
}

function setRegisterMeta() {
  const description = `Regístrate al ${SITE_NAME}: 20 de agosto en San Pedro Sula. Expo Pass gratuito o Full Pass con acceso a charlas, workshop y almuerzo.`;
  setMetaTag('description', description);
  setMetaTag('robots', 'noindex, follow');
  setMetaTag('og:title', `Registro - ${SITE_NAME}`, true);
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

class RegistrationError extends Error {
  constructor(message, code, ticketId) {
    super(message);
    this.code = code;
    this.ticketId = ticketId;
  }
}

async function submitRegistration(data) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de conexión' }));
    throw new RegistrationError(err.error || 'Error al registrar', res.status, err.ticketId);
  }
  return res.json();
}

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

  if (data.pass !== 'stand') {
    if (!data.role) {
      errors.role = 'Indica tu rol o cargo.';
    } else if (data.role.length < 2) {
      errors.role = 'El rol debe tener al menos 2 caracteres.';
    }
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

          <div id="full-fields" class="register-stand-fields hidden">
            <label class="register-field" data-field="team">
              <span>Nombre del equipo <span class="register-field-optional">(opcional)</span></span>
              <input type="text" name="team" placeholder="Ej. Equipo Innovación, Startup HN…" aria-describedby="error-team" />
              <span id="error-team" class="register-error" role="alert" hidden></span>
            </label>
          </div>

          <div id="stand-fields" class="register-stand-fields hidden">
            <label class="register-field" data-field="company">
              <span>Empresa / stand</span>
              <input type="text" name="company" placeholder="Nombre del expositor o stand" aria-describedby="error-company" />
              <span id="error-company" class="register-error" role="alert" hidden></span>
            </label>
          </div>

          <div id="role-field">
            <label class="register-field" data-field="role">
              <span>Rol o cargo</span>
              <input type="text" name="role" placeholder="Ej. CEO, Developer, Estudiante…" aria-describedby="error-role" />
              <span id="error-role" class="register-error" role="alert" hidden></span>
            </label>
          </div>

          <div class="register-note">
            <p><strong>Importante:</strong> Este badge es solo ilustrativo. Para adquirir tu entrada oficial y garantizar tu lugar deberás completar el pago en el siguiente paso.</p>
            <p>Full Pass ($65 USD) incluye charlas, workshop y almuerzo. Expo Pass es gratuito. Stand requiere paquete de patrocinio activo.</p>
          </div>

          <button type="submit" class="register-submit">Generar mi badge →</button>
        </form>
      </div>
    </div>
  `;
}
