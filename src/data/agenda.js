/** Programa detallado - Honduras Fintech Day 2026 · Hotel Copantl */

export const agendaMeta = {
  line: "20 de agosto 2026 · Hotel Copantl, San Pedro Sula · 7:00 – 16:00 + cocktail",
  hint: "Cada bloque muestra qué ocurre en paralelo por salón.",
  venue: "Hotel Copantl - San Pedro Sula",
};

/**
 * @typedef {{ venue: string, text: string, details?: string[] }} AgendaParallel
 * @typedef {{ time: string, title: string, note: string, accent?: boolean, parallel?: AgendaParallel[] }} AgendaMilestone
 */

/** @type {AgendaMilestone[]} */
export const agendaMilestones = [
  {
    time: "7:00 – 7:55",
    title: "Registro y bienvenida",
    note: "Lobby · credenciales · app del evento",
    parallel: [
      {
        venue: "Lobby principal",
        text: "Check-in · entrega de gafete · activación app",
        details: [
          "Registro Full Pass y Expo Pass",
          "Mesa de información AFINH",
          "Soporte técnico app / networking",
        ],
      },
    ],
  },
  {
    time: "8:00 – 8:45",
    title: "Apertura oficial",
    note: "Keynote e inauguración del evento",
    accent: true,
    parallel: [
      {
        venue: "Napoleón V",
        text: "Ceremonia de apertura y keynote",
        details: [
          "Bienvenida AFINH y autoridades",
          "Keynote de apertura - visión fintech HN",
          "Presentación de agenda y salones",
        ],
      },
    ],
  },
  {
    time: "9:00 – 9:45",
    title: "Inauguración de la feria",
    note: "Napoleón VI · coffee break",
    parallel: [
      {
        venue: "Napoleón VI",
        text: "Apertura oficial de la feria tecnológica",
        details: [
          "Recorrido inaugural por pasillos de expo",
          "Charla especial en escenario expo",
          "Coffee break patrocinado",
        ],
      },
      { venue: "Napoleón V", text: "Transición - asistentes hacia feria" },
    ],
  },
  {
    time: "10:00 – 10:45",
    title: "Sesión 1",
    note: "Programa en paralelo - bloque 1",
    parallel: [
      {
        venue: "Napoleón V",
        text: "Conferencias y paneles - sesión 1",
        details: [
          "Panel: regulación y sandbox",
          "Tendencias pagos digitales",
          "Q&A con reguladores e industria",
        ],
      },
      {
        venue: "Napoleón II y III",
        text: "Taller 1 (cupos limitados)",
        details: [
          "Hasta 25 participantes",
          "Registro previo obligatorio",
          "Enfoque hands-on producto / tech",
        ],
      },
      {
        venue: "Napoleón I",
        text: "Academia - bloque universitario 1",
        details: [
          "Talleres con universidades aliadas",
          "Introducción a fintech para estudiantes",
        ],
      },
      {
        venue: "Napoleón VI",
        text: "Feria en operación plena",
        details: [
          "40–50 stands activos",
          "Demos en vivo",
          "Primeras rondas speed mentoring",
        ],
      },
    ],
  },
  {
    time: "10:45 – 11:00",
    title: "Coffee break",
    note: "Networking entre sesiones",
    parallel: [
      { venue: "Napoleón V · VI", text: "Pausa · networking en pasillos y feria" },
      { venue: "Talleres II/III", text: "Intermedio taller 1" },
    ],
  },
  {
    time: "11:00 – 11:45",
    title: "Sesión 2",
    note: "Programa en paralelo - bloque 2",
    parallel: [
      {
        venue: "Napoleón V",
        text: "Conferencias y paneles - sesión 2",
        details: [
          "Panel: banca digital e inclusión",
          "Casos de éxito startups locales",
        ],
      },
      {
        venue: "Napoleón II y III",
        text: "Taller 2",
        details: ["Segundo bloque cerrado", "Continúa registro previo"],
      },
      {
        venue: "Napoleón I",
        text: "Academia - bloque 2",
        details: ["Competencias / retos estudiantiles", "Mentorías cortas"],
      },
      {
        venue: "Napoleón VI",
        text: "Feria + mentoring",
        details: ["Stands · DJ ambiente · rondas 1:1"],
      },
    ],
  },
  {
    time: "12:00 – 13:30",
    title: "Receso y almuerzo",
    note: "Food court · almuerzo formal",
    parallel: [
      {
        venue: "Napoleón V · II/III · I",
        text: "Receso de conferencias y talleres",
        details: ["Pausa para almuerzo libre o networking"],
      },
      {
        venue: "Napoleón VI",
        text: "Feria en modo reducido",
        details: [
          "Food court digital / patrocinadores",
          "Stands con operación ligera",
        ],
      },
      {
        venue: "Napoleón IV",
        text: "Almuerzo formal",
        details: [
          "200–250 personas · invitación",
          "Patrocinadores y VIPs",
        ],
      },
    ],
  },
  {
    time: "13:30 – 14:15",
    title: "Sesión 3",
    note: "Programa en paralelo - bloque 3",
    parallel: [
      {
        venue: "Napoleón V",
        text: "Conferencias - sesión 3",
        details: [
          "Panel: inversión y venture en la región",
          "Scale-ups y expansión regional",
        ],
      },
      {
        venue: "Napoleón II y III",
        text: "Taller 3",
        details: ["Último bloque de talleres cerrados"],
      },
      {
        venue: "Napoleón I",
        text: "Academia - bloque 3",
        details: ["Pitch estudiantil · premios academia"],
      },
      {
        venue: "Napoleón VI",
        text: "Feria plena post-almuerzo",
        details: ["Mayor afluencia de público expo"],
      },
    ],
  },
  {
    time: "14:30 – 15:15",
    title: "Sesión 4",
    note: "Programa en paralelo - bloque 4",
    parallel: [
      {
        venue: "Napoleón V",
        text: "Conferencias - sesión 4",
        details: [
          "Panel: ciberseguridad y fraude",
          "IA aplicada a servicios financieros",
        ],
      },
      {
        venue: "Napoleón VI",
        text: "Feria · últimas demos",
        details: ["Rondas finales de mentoring", "Premios en stands (según patrocinio)"],
      },
    ],
  },
  {
    time: "15:45 – 16:00",
    title: "Cierre oficial",
    note: "Reconocimientos y agradecimientos",
    accent: true,
    parallel: [
      {
        venue: "Napoleón V",
        text: "Ceremonia de clausura",
        details: [
          "Resumen del día · métricas del evento",
          "Reconocimientos a patrocinadores y aliados",
          "Anuncios y próximos pasos AFINH",
        ],
      },
    ],
  },
  {
    time: "16:00 en adelante",
    title: "Cocktail de networking",
    note: "Bar externo · música en vivo / DJ",
    accent: true,
    parallel: [
      {
        venue: "Sector externo (La20)",
        text: "Cocktail 100+ personas",
        details: [
          "Networking informal post-evento",
          "Música en vivo o DJ",
          "Bebidas y finger food",
        ],
      },
      {
        venue: "App del evento",
        text: "Networking digital activo",
        details: [
          "Match por intereses y rol",
          "Continuidad de contactos del día",
        ],
      },
    ],
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDetailsHtml(details) {
  if (!details?.length) return "";
  const items = details.map((d) => `<li>${escapeHtml(d)}</li>`).join("");
  return `<ul class="agenda-parallel-details" role="list">${items}</ul>`;
}

function buildParallelHtml(parallel) {
  const active = (parallel || []).filter((p) => !p.closed);
  if (!active.length) return "";

  const items = active
    .map(
      (p) => `
          <li class="rounded-xl border border-white/5 bg-black/25 px-4 py-3.5 sm:px-5 sm:py-4">
            <span class="block font-display text-[10px] font-medium uppercase tracking-[0.14em] text-accent">${escapeHtml(p.venue)}</span>
            <p class="mt-2 text-xs leading-relaxed sm:text-[13px] text-text-mute">${escapeHtml(p.text)}</p>
            ${buildDetailsHtml(p.details)}
          </li>`,
    )
    .join("");

  return `
      <div class="agenda-parallel-wrap mt-5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
        <p class="mb-3 font-display text-[10px] uppercase tracking-[0.14em] text-text-dim">Por salón</p>
        <ul class="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3" role="list">
          ${items}
        </ul>
      </div>`;
}

export function buildAgendaListHtml() {
  return agendaMilestones
    .map((item) => {
      const rowBg = item.accent ? "bg-accent/5" : "bg-white/[0.02]";
      const timeColor = item.accent ? "text-accent" : "text-text-mute";

      return `
        <li class="px-6 py-5 sm:px-8 sm:py-7 ${rowBg}" tabindex="0">
          <div class="flex items-start gap-5 sm:gap-6">
            <time class="w-[5.5rem] shrink-0 font-display text-xs font-medium tracking-wide ${timeColor} sm:w-28 sm:text-sm">${escapeHtml(item.time)}</time>
            <div class="min-w-0 flex-1">
              <p class="font-display text-sm font-medium tracking-[-0.01em] text-text sm:text-base">${escapeHtml(item.title)}</p>
              <p class="mt-1 text-xs leading-relaxed text-text-mute sm:text-[13px]">${escapeHtml(item.note)}</p>
            </div>
          </div>
          ${buildParallelHtml(item.parallel)}
        </li>`;
    })
    .join("");
}
