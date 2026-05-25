import './register.css';
import {
  PASS_TYPES,
  encodeTicketId,
  saveTicket,
} from './lib/ticket-store.js';

export function mountRegister() {
  document.title = 'Registro — Honduras Fintech Day 2026';
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
    });
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
    };

    if (!data.name || !data.email || !PASS_TYPES[data.pass]) {
      return;
    }

    const id = encodeTicketId(data);
    saveTicket(id, data);
    window.location.href = `/ticket/${id}`;
  });
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
          <label class="register-field">
            <span>Nombre completo</span>
            <input type="text" name="name" required autocomplete="name" placeholder="Tu nombre" />
          </label>

          <label class="register-field">
            <span>Correo electrónico</span>
            <input type="email" name="email" required autocomplete="email" placeholder="tu@email.com" />
          </label>

          <fieldset class="register-fieldset">
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
          </fieldset>

          <div id="stand-fields" class="register-stand-fields hidden">
            <label class="register-field">
              <span>Empresa / stand</span>
              <input type="text" name="company" placeholder="Nombre del expositor o stand" />
            </label>
          </div>

          <label class="register-field">
            <span>Rol o cargo</span>
            <input type="text" name="role" required placeholder="Ej. CEO, Developer, Estudiante…" />
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
