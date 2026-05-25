import loader from './components/loader.html?raw';
import cursor from './components/cursor.html?raw';
import noise from './components/noise.html?raw';
import nav from './components/nav.html?raw';
import hero from './components/hero.html?raw';
import stats from './components/stats.html?raw';
import sobre from './components/sobre.html?raw';
import objectives from './components/objectives.html?raw';
import audience from './components/audience.html?raw';
import activities from './components/activities.html?raw';
import digital from './components/digital.html?raw';
import sponsorship from './components/sponsorship.html?raw';
import stands from './components/stands.html?raw';
import ctaFinal from './components/cta-final.html?raw';
import footer from './components/footer.html?raw';

export function mountLayout(root = document.getElementById('app')) {
  if (!root) return;

  root.innerHTML = [
    loader,
    cursor,
    noise,
    nav,
    hero,
    stats,
    sobre,
    objectives,
    audience,
    activities,
    digital,
    sponsorship,
    stands,
    ctaFinal,
    '</main>',
    footer,
  ].join('\n');
}
