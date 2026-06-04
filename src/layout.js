import loader from './components/loader.html?raw';
import cursor from './components/cursor.html?raw';
import noise from './components/noise.html?raw';
import nav from './components/nav.html?raw';
import hero from './components/hero.html?raw';
import stats from './components/stats.html?raw';
// import recap2025 from './components/recap-2025.html?raw';
import sobre from './components/sobre.html?raw';
import objectives from './components/objectives.html?raw';
import audience from './components/audience.html?raw';
import activitiesRaw from './components/activities.html?raw';
import feriaImg from './assets/afinh2025_image-275.jpg?url';
import conferenciasImg from './assets/afinh2025_image-276.jpg?url';
import talleresImg from './assets/afinh2025_talleres-2025.png?url';
import academiaImg from './assets/afinh2025_image-222.jpg?url';
import coctelImg from './assets/afinh2025_image-274.jpg?url';
import sponsorship from './components/sponsorship.html?raw';
import ctaFinalRaw from './components/cta-final.html?raw';
import ctaImg from './assets/afinh2025_image-277.jpg?url';
import footer from './components/footer.html?raw';
import { CONTACT_EMAIL } from './lib/site.js';

const ctaFinal = ctaFinalRaw
  .replace('__CTA_IMG__', ctaImg)
  .replaceAll('__CONTACT_EMAIL__', CONTACT_EMAIL);

const sponsorshipSection = sponsorship.replaceAll('__CONTACT_EMAIL__', CONTACT_EMAIL);

const activities = activitiesRaw
  .replace('__FERIA_IMG__', feriaImg)
  .replace('__CONFERENCIAS_IMG__', conferenciasImg)
  .replace('__TALLERES_IMG__', talleresImg)
  .replace('__ACADEMIA_IMG__', academiaImg)
  .replace('__COCTEL_IMG__', coctelImg);

export function mountLayout(root = document.getElementById('app')) {
  if (!root) return;

  root.innerHTML = [
    loader,
    cursor,
    noise,
    nav,
    hero,
    stats,
    // recap2025,  // Edición 2025 — comentado temporalmente
    // sobre,      // Objetivo general — comentado temporalmente
    // objectives, // Objetivos específicos — comentado temporalmente
    audience,
    activities,
    sponsorshipSection,
    ctaFinal,
    '</main>',
    footer.replaceAll('__CONTACT_EMAIL__', CONTACT_EMAIL),
  ].join('\n');
}
