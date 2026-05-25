import loader from './components/loader.html?raw';
import cursor from './components/cursor.html?raw';
import noise from './components/noise.html?raw';
import nav from './components/nav.html?raw';
import hero from './components/hero.html?raw';
import stats from './components/stats.html?raw';
import recap2025 from './components/recap-2025.html?raw';
import sobre from './components/sobre.html?raw';
import objectives from './components/objectives.html?raw';
import audience from './components/audience.html?raw';
import { buildAgendaSectionHtml } from './agenda-render.js';
import activitiesRaw from './components/activities.html?raw';
import feriaImg from './assets/afinh2025_image-275.jpg?url';
import conferenciasImg from './assets/afinh2025_image-276.jpg?url';
import talleresImg from './assets/afinh2025_image-232.jpg?url';
import academiaImg from './assets/afinh2025_image-222.jpg?url';
import coctelImg from './assets/afinh2025_image-274.jpg?url';
import sponsorship from './components/sponsorship.html?raw';
import aliadosRaw from './components/aliados.html?raw';
import { buildSponsorMarqueeHtml } from './sponsors.js';
import ctaFinalRaw from './components/cta-final.html?raw';
import ctaImg from './assets/afinh2025_image-277.jpg?url';
import footer from './components/footer.html?raw';

const ctaFinal = ctaFinalRaw.replace('__CTA_IMG__', ctaImg);

const activities = activitiesRaw
  .replace('__FERIA_IMG__', feriaImg)
  .replace('__CONFERENCIAS_IMG__', conferenciasImg)
  .replace('__TALLERES_IMG__', talleresImg)
  .replace('__ACADEMIA_IMG__', academiaImg)
  .replace('__COCTEL_IMG__', coctelImg);

const aliados = aliadosRaw.replace('__SPONSOR_MARQUEE__', buildSponsorMarqueeHtml());

export function mountLayout(root = document.getElementById('app')) {
  if (!root) return;

  root.innerHTML = [
    loader,
    cursor,
    noise,
    nav,
    hero,
    stats,
    recap2025,
    // sobre,      // Objetivo general — comentado temporalmente
    // objectives, // Objetivos específicos — comentado temporalmente
    audience,
    buildAgendaSectionHtml(),
    activities,
    sponsorship,
    aliados,
    ctaFinal,
    '</main>',
    footer,
  ].join('\n');
}
