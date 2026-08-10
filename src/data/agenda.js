/** Programa detallado - Honduras Fintech Day 2026 · Hotel Copantl
 *
 * Fuente: PROGRAMA_AGENDA HFD26 - actualizado 10 agosto 2026.xlsx
 * Los salones marcados CERRADO en la fuente se omiten en el render.
 *
 * `track` define el color y la columna del bloque. Los tres tracks principales
 * (conectado / conocimiento / academia) ocupan una columna fija en desktop, de
 * modo que lo que ocurre en paralelo queda alineado verticalmente. El resto
 * (feria, salon4, networking, general) se muestra como actividad de apoyo.
 */

export const agendaMeta = {
  line: "20 de agosto 2026 · Hotel Copantl, San Pedro Sula · 7:00 - 16:35 + cocktail",
  hint: "Las columnas son salones simultáneos: en un mismo horario podés elegir una sola. Programa sujeto a cambios.",
  venue: "Hotel Copantl - San Pedro Sula",
};

/** Tracks principales: una columna fija cada uno en desktop. */
export const agendaTracks = {
  conectado: { venue: "Napoleón V · Conectado", col: 1 },
  conocimiento: { venue: "Napoleón II · Conocimiento", col: 2 },
  academia: { venue: "Academia", col: 3 },
};

/** Actividades de apoyo: no compiten por la atención en un solo salón. */
const asideTracks = {
  feria: { venue: "Napoleón VI · Feria" },
  salon4: { venue: "Napoleón IV" },
  networking: { venue: "Conexiones · Networking" },
  general: { venue: "Plenaria" },
};

/**
 * @typedef {"conectado"|"conocimiento"|"academia"|"feria"|"salon4"|"networking"|"general"} AgendaTrack
 * @typedef {{ track: AgendaTrack, text: string, venue?: string, details?: string[] }} AgendaParallel
 * @typedef {{ time: string, title: string, note: string, accent?: boolean, parallel?: AgendaParallel[] }} AgendaMilestone
 */

/** @type {AgendaMilestone[]} */
export const agendaMilestones = [
  {
    time: "7:00 - 8:00",
    title: "Registro y bienvenida",
    note: "Lobby · app del evento activa",
    parallel: [
      {
        track: "general",
        venue: "Lobby / Registro",
        text: "Lobby / Registro. App activa.",
      },
      {
        track: "networking",
        text: "Disponible todo el día - reuniones 1 a 1",
      },
    ],
  },
  {
    time: "8:00 - 8:15",
    title: "Bienvenida",
    note: "Palabras de inicio",
    accent: true,
    parallel: [
      {
        track: "conectado",
        text: "Bienvenida. Palabras de inicio.",
        details: [
          "Julia Johannsen, representante Grupo BID, Honduras",
          "Carlos Roberto Andino Zuniga, Subgerente de Operaciones, BCH",
          "Mauricio Escalante, Presidente Asociación Fintech de Honduras",
        ],
      },
    ],
  },
  {
    time: "8:15 - 8:30",
    title: "Estado Fintech HN",
    note: "Agenda AFINH",
    parallel: [
      {
        track: "conectado",
        text: "Estado Fintech HN - Agenda AFINH.",
        details: [
          "Oliver Arévalo, Gerente Regional, Vana. Miembro de Junta Directiva AFINH",
          "David Ortíz, Sub Gerente General de Zafra Cloud | CTO Grupo Pentos, Miembro Junta Directiva AFINH",
        ],
      },
    ],
  },
  {
    time: "8:30 - 9:00",
    title: "Infraestructura financiera digital 2030",
    note: "Keynote de apertura",
    parallel: [
      {
        track: "conectado",
        text: "Infraestructura Financiera digital 2030: El Futuro del Sistema Financiero en Mercados Emergentes.",
        details: [
          "Nayam Hanashiro, Director de Producto, Integraciones y Ecosistema, Clara",
        ],
      },
    ],
  },
  {
    time: "9:00 - 9:30",
    title: "Inauguración de la feria",
    note: "Coffee break",
    parallel: [
      {
        track: "general",
        venue: "Napoleón V · VI",
        text: "Inauguración feria y coffee break",
      },
    ],
  },
  {
    time: "9:30 - 10:00",
    title: "Impacto social y pagos internacionales",
    note: "Abre la feria con +25 stands",
    parallel: [
      {
        track: "conectado",
        text: "Fintech con impacto social: el modelo de AAvance y lo que Honduras puede replicar para acelerar la inclusión financiera femenina.",
        details: ["Magreth Gutiérrez, CEO, Aavance"],
      },
      {
        track: "conocimiento",
        text: "Mastercard Move: Nuevas oportunidades para los pagos internacionales de personas y PyMEs en Honduras.",
        details: ["Gonzalo González, Senior Sales Representative, Mastercard"],
      },
      {
        track: "feria",
        text: "Feria abierta. +25 stands.",
        details: [
          "Speed mentoring. Impact Hub.",
          "Túnel del desarrollo del dinero, BCH.",
        ],
      },
    ],
  },
  {
    time: "10:00 - 10:30",
    title: "Sistemas de pago y adquirencia",
    note: "Panel principal + experiencia fullstack",
    parallel: [
      {
        track: "conectado",
        text: "Panel: Innovación y tendencias en sistemas de pago.",
        details: [
          "Miguel Sarti, Business Development Manager, Visa",
          "José Herrera, Regional Manager Central America, Caribbean, Colombia & Ecuador, DLocal",
          "Darwin Gabourel, Director Regional, n1co Business",
          "Moderador: Jimmy Amador, CEO, Clinpays",
        ],
      },
      {
        track: "conocimiento",
        text: "Expertos en Adquirencia: La experiencia Fullstack de SERFINSA.",
        details: [
          "Javier Mayorga, Director de Negocios",
          "Milagro Mena, Gerente de Mercadeo y Desarrollo de Productos",
          "SERFINSA",
        ],
      },
    ],
  },
  {
    time: "10:30 - 11:00",
    title: "Tokenización y crédito retail",
    note: "Remesas tokenizadas · experiencia de crédito",
    parallel: [
      {
        track: "conectado",
        text: "De Remesas a Activos Tokenizados: La Nueva Arquitectura Financiera de Centroamérica.",
        details: ["Juan Diego Sol, Gerente Regional, IBEX"],
      },
      {
        track: "conocimiento",
        text: "Transformando la Experiencia del Crédito Retail",
        details: [
          "Edwin Flores, Gerente General",
          "Irene Sinclair, Coordinadora BI",
          "Dennis Gradiz, Gerente de IT",
          "CREDIDEMO",
        ],
      },
    ],
  },
  {
    time: "11:00 - 11:30",
    title: "Ciberfraude e inteligencia artificial",
    note: "Defensa contra fraude · IA empresarial",
    parallel: [
      {
        track: "conectado",
        text: "Ciber fraude en la era de la IA, ¿cómo nos protegemos?",
        details: [
          "Luis Alejandro Anderson Rivera, Senior Management Consultant para Mastercard en la región",
          "Mastercard",
        ],
      },
      {
        track: "conocimiento",
        text: "Conversemos sobre Inteligencia Artificial Empresarial",
        details: [
          "Stanley Marrder, CEO, Eniver",
          "Moderadora: Erica Jensen, Directora Ejecutiva, Asociación Fintech de Honduras",
        ],
      },
    ],
  },
  {
    time: "11:30 - 12:00",
    title: "Talento joven y crédito en el punto de venta",
    note: "Transformación digital · QR con crédito",
    parallel: [
      {
        track: "conectado",
        text: "\"El rol de los jóvenes en la transformación digital\"",
        details: [
          "Mario René Guevara Galeano, Especialista en Transformación Digital, Innovación y Desarrollo de Negocios, DIGER",
        ],
      },
      {
        track: "conocimiento",
        text: "CrediQR: El QR que convierte cada compra en una oportunidad de crédito.",
        details: ["Gustavo Defilpo, CEO, BeClever"],
      },
    ],
  },
  {
    time: "12:00 - 13:30",
    title: "Almuerzo",
    note: "Receso general",
    parallel: [
      {
        track: "general",
        venue: "Napoleón V · II",
        text: "Almuerzo / Receso",
      },
      { track: "salon4", text: "Almuerzo formal 250 pax" },
    ],
  },
  {
    time: "13:30 - 14:00",
    title: "Regulación, cobranza y Academia",
    note: "Panel del regulador · taller de IA para jóvenes",
    parallel: [
      {
        track: "conectado",
        text: "Panel: Inclusión Financiera desde la perspectiva del regulador.",
        details: [
          "Carlos Andino, Subgerente de Operaciones, BCH",
          "Sidia Gómez, Especialista del HUB de Innovación Financiera, CNBS",
          "José Andonis Lavaire, Director Ejecutivo, Consuccop",
          "Moderador: Ricardo Irias, CEO, SUBE",
        ],
      },
      {
        track: "conocimiento",
        text: "Cobranza Inteligente: de la mora a la acción.",
        details: ["Lisseth Leal, CEO, D2i"],
      },
      {
        track: "academia",
        text: "Taller Academia 1: \"Jóvenes que construyen con AI\"",
        details: [
          "Cesar Alejandro Maldonado, Gerente de Proyectos Digitales, DIGER · Consultor en Transformación Digital y Ciberseguridad",
        ],
      },
    ],
  },
  {
    time: "14:00 - 14:30",
    title: "Banca digital, crédito y tokenización",
    note: "Evolución del sistema · taller de tokenización",
    parallel: [
      {
        track: "conectado",
        text: "Evolución del sistema financiero digital.",
        details: ["Juan Carlos Garavito, CEO, WAU"],
      },
      {
        track: "conocimiento",
        text: "PreCredit",
        details: ["Cassandra Escobar, Gerente de Producto, PreCredit"],
      },
      {
        track: "academia",
        text: "Taller Academia 2. ¿Qué es tokenización?",
        details: ["Juan Diego Sol y Carlos Alfaro, IBEX"],
      },
    ],
  },
  {
    time: "14:30 - 15:00",
    title: "IA en crédito y orquestación de pagos",
    note: "Crédito digital · orquestación · casos de inclusión",
    parallel: [
      {
        track: "conectado",
        text: "De años a semanas: cómo las plataformas impulsadas por IA democratizan el crédito digital.",
        details: ["Erick González, Gerente de Tecnología, BOWPI"],
      },
      {
        track: "conocimiento",
        text: "Pagos: Orquestación para ganar",
        details: ["Jimmy Amador, CEO, Clinpays"],
      },
      {
        track: "academia",
        text: "Taller Academia 3. Inclusión Financiera, casos de éxito.",
        details: ["Magreth Gutiérrez, Aavance"],
      },
    ],
  },
  {
    time: "15:00 - 15:30",
    title: "Open Finance y transformación digital",
    note: "Riesgo sistémico · workshop · IA técnica",
    parallel: [
      {
        track: "conectado",
        text: "Open Finance en Economías Emergentes: ¿Oportunidad o Riesgo Sistémico?",
        details: ["Edwin Zancipa, LATAM Fintech Hub"],
      },
      {
        track: "conocimiento",
        text: "¿Qué Está Frenando tu Transformación Digital? Un workshop donde convertimos los retos de tu institución en soluciones reales.",
        details: [
          "Erick González, Gerente de Tecnología",
          "Raquel Andrade, Business Development Manager",
          "BOWPI",
        ],
      },
      {
        track: "academia",
        text: "Taller Academia 4. Inteligencia Artificial, un enfoque técnico",
        details: ["Stanley Marrder"],
      },
    ],
  },
  {
    time: "15:30 - 16:00",
    title: "Democratizando los pagos",
    note: "El acceso como motor de crecimiento",
    parallel: [
      {
        track: "conectado",
        text: "Democratizando los pagos: el acceso como motor de crecimiento",
        details: [
          "Ricardo Rodríguez Campollo, Director de Account Executive (Guatemala, El Salvador y Honduras), Visa",
        ],
      },
    ],
  },
  {
    time: "16:00 - 16:30",
    title: "Firechat: Venture Capital",
    note: "Financiamiento como aliado para crecer",
    parallel: [
      {
        track: "conectado",
        text: "Firechat. Venture Capital, más que un financiamiento un aliado para crecer.",
        details: [
          "Allan Boruchowicz, Fundador y Socio Director, Carao Ventures",
          "Moderadora: Gladys Morena, Grupo BID",
        ],
      },
    ],
  },
  {
    time: "16:30 - 16:35",
    title: "Cierre oficial",
    note: "Palabras de cierre y agradecimientos",
    accent: true,
    parallel: [
      { track: "conectado", text: "Palabras de cierre y agradecimientos." },
    ],
  },
  {
    time: "16:35 +",
    title: "Cocktail de cierre",
    note: "Networking de cierre",
    accent: true,
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function venueOf(item) {
  return item.venue || agendaTracks[item.track]?.venue || asideTracks[item.track]?.venue || "";
}

function isMainTrack(item) {
  return Boolean(agendaTracks[item.track]);
}

function buildDetailsHtml(details) {
  if (!details?.length) return "";
  const items = details.map((d) => `<li>${escapeHtml(d)}</li>`).join("");
  return `<ul class="agenda-parallel-details" role="list">${items}</ul>`;
}

/** Tarjeta de salón: hereda su color y su columna del track. */
function buildTrackCardHtml(item) {
  const col = agendaTracks[item.track]?.col;
  const colClass = col ? ` agenda-col-${col}` : "";

  return `
          <li class="agenda-track agenda-track--${escapeHtml(item.track)}${colClass}">
            <span class="agenda-track-venue">${escapeHtml(venueOf(item))}</span>
            <p class="agenda-track-text">${escapeHtml(item.text)}</p>
            ${buildDetailsHtml(item.details)}
          </li>`;
}

/** Actividades de apoyo: chips discretos, sin columna asignada. */
function buildAsideHtml(items) {
  if (!items.length) return "";

  const chips = items
    .map((item) => {
      const extra = item.details?.length
        ? ` <span class="agenda-aside-extra">${escapeHtml(item.details.join(" · "))}</span>`
        : "";
      return `
            <li class="agenda-aside-item agenda-track--${escapeHtml(item.track)}">
              <span class="agenda-aside-venue">${escapeHtml(venueOf(item))}</span>
              <span class="agenda-aside-text">${escapeHtml(item.text)}${extra}</span>
            </li>`;
    })
    .join("");

  return `
        <ul class="agenda-aside" role="list">${chips}
        </ul>`;
}

function buildParallelHtml(parallel) {
  const items = parallel || [];
  const main = items.filter(isMainTrack);
  const aside = items.filter((item) => !isMainTrack(item));
  if (!main.length && !aside.length) return "";

  const soloClass = main.length > 1 ? "" : " agenda-tracks--solo";
  const grid = main.length
    ? `
        <ul class="agenda-tracks${soloClass}" role="list">${main.map(buildTrackCardHtml).join("")}
        </ul>`
    : "";

  return `
      <div class="agenda-parallel-wrap">${grid}${buildAsideHtml(aside)}
      </div>`;
}

/** Cuántas sesiones compiten en el mismo horario (la feria cuenta, el lobby no). */
function concurrentCount(parallel) {
  return (parallel || []).filter(
    (item) => item.track !== "general" && item.track !== "networking",
  ).length;
}

function buildBadgeHtml(count) {
  if (count < 2) return "";
  return `
              <span class="agenda-badge">
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                  <rect x="0.5" y="2" width="2.4" height="8" rx="1.2" fill="currentColor" />
                  <rect x="4.8" y="0.5" width="2.4" height="11" rx="1.2" fill="currentColor" />
                  <rect x="9.1" y="3.5" width="2.4" height="5" rx="1.2" fill="currentColor" />
                </svg>
                ${count} en paralelo
              </span>`;
}

/** Encabezado de columnas: sólo visible cuando la grilla es de 3 columnas. */
export function buildAgendaTracksHeadHtml() {
  const cells = Object.entries(agendaTracks)
    .map(
      ([key, track]) => `
          <li class="agenda-head-item agenda-track--${key} agenda-col-${track.col}">${escapeHtml(track.venue)}</li>`,
    )
    .join("");

  return `
      <div class="agenda-head">
        <p class="agenda-head-label">Salones simultáneos</p>
        <ul class="agenda-tracks" role="list">${cells}
        </ul>
      </div>`;
}

export function buildAgendaListHtml() {
  return agendaMilestones
    .map((item) => {
      const rowBg = item.accent ? "bg-accent/5" : "bg-white/[0.02]";
      const timeColor = item.accent ? "text-accent" : "text-text-mute";

      return `
        <li class="agenda-row px-6 py-5 sm:px-8 sm:py-7 ${rowBg}" tabindex="0">
          <div class="agenda-row-head flex items-start gap-5 sm:gap-6">
            <time class="w-[5.5rem] shrink-0 font-display text-xs font-medium tracking-wide ${timeColor} sm:w-28 sm:text-sm">${escapeHtml(item.time)}</time>
            <div class="min-w-0 flex-1">
              <p class="font-display text-sm font-medium tracking-[-0.01em] text-text sm:text-base">${escapeHtml(item.title)}</p>
              <p class="mt-1 text-xs leading-relaxed text-text-mute sm:text-[13px]">${escapeHtml(item.note)}</p>
            </div>${buildBadgeHtml(concurrentCount(item.parallel))}
          </div>
          ${buildParallelHtml(item.parallel)}
        </li>`;
    })
    .join("");
}
