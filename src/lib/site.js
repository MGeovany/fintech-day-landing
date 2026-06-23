// Single source of truth for site URL, branding and social channels.

export const SITE_URL = 'https://fintechday.thefndrs.com';
export const SITE_HOSTNAME = 'fintechday.thefndrs.com';
export const SITE_NAME = 'Honduras Fintech Day 2026';
export const SITE_SHORT_NAME = 'Fintech Day HN';
export const SITE_TAGLINE = 'El evento fintech más grande de Honduras';
export const SITE_LOCALE = 'es_HN';
export const SITE_LANG = 'es';

export const EVENT_NAME = 'Honduras Fintech Day 2026';
export const EVENT_START_ISO = '2026-08-20T08:00:00-06:00';
/** Apertura de puertas / registro - cuenta regresiva del hero */
export const EVENT_COUNTDOWN_ISO = '2026-08-20T07:00:00-06:00';
export const EVENT_END_ISO = '2026-08-20T18:00:00-06:00';
export const EVENT_DATE_DISPLAY = '20 de agosto, 2026';
export const EVENT_CITY = 'San Pedro Sula';
export const EVENT_COUNTRY = 'Honduras';
export const EVENT_COUNTRY_CODE = 'HN';

export const ORGANIZER_NAME = 'AFINH';
export const ORGANIZER_LEGAL = 'Asociación Hondureña de Instituciones de Tecnología Financiera';

export const CONTACT_EMAIL = 'direccionejecutiva@hondurasfintech.com';

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/fintechday/',
};

export const HASHTAG = '#FintechDayHN';

export const OG_IMAGE_PATH = '/og-share.svg';
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
