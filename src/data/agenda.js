/** Programa resumido — Nota Conceptual Honduras Fintech Day 2026 */

export const agendaMeta = {
  line: "20 ago 2026 · Hotel Copantl, SPS · 7:00 – 16:00 + cocktail",
  hint: "Pasa el cursor sobre un bloque para ver los salones en paralelo",
};

/**
 * @typedef {{ venue: string, text: string, closed?: boolean }} AgendaParallel
 * @typedef {{ time: string, title: string, note: string, accent?: boolean, parallel?: AgendaParallel[] }} AgendaMilestone
 */

/** @type {AgendaMilestone[]} */
export const agendaMilestones = [
  {
    time: "7:00",
    title: "Registro",
    note: "Lobby · app activa",
    parallel: [{ venue: "Lobby", text: "Check-in · app del evento activa" }],
  },
  {
    time: "8:00",
    title: "Apertura",
    note: "Keynote e inauguración · Napoleón V",
    accent: true,
    parallel: [
      {
        venue: "Napoleón V",
        text: "Inauguración · keynote · bienvenida AFINH",
      },
      { venue: "Napoleón II y III", text: "Cerrado", closed: true },
      { venue: "Napoleón I", text: "Cerrado", closed: true },
    ],
  },
  {
    time: "9:00",
    title: "Feria",
    note: "Napoleón VI — inauguración y coffee break",
    parallel: [
      {
        venue: "Napoleón VI",
        text: "Inauguración feria · coffee break · charla especial",
      },
      { venue: "Napoleón V", text: "Pausa — público en feria" },
      { venue: "Talleres · Academia", text: "Cerrado", closed: true },
    ],
  },
  {
    time: "10:00 – 15:45",
    title: "Programa en paralelo",
    note: "Conf. V · Talleres II/III · Academia I · Feria VI",
    parallel: [
      { venue: "Napoleón V", text: "Conferencias y paneles (sesiones 1–6)" },
      {
        venue: "Napoleón II y III",
        text: "Talleres cerrados · hasta 25 pax · registro previo",
      },
      { venue: "Napoleón I", text: "Academia — talleres universitarios" },
      { venue: "Napoleón VI", text: "Feria abierta · speed mentoring · DJ" },
    ],
  },
  {
    time: "12:00 – 13:30",
    title: "Receso",
    note: "Food court · almuerzo formal",
    parallel: [
      { venue: "Napoleón V · II/III · I", text: "Receso" },
      { venue: "Napoleón VI", text: "Feria reducida · food court digital" },
      { venue: "Napoleón IV", text: "Almuerzo formal 200–250 pax" },
    ],
  },
  {
    time: "15:45",
    title: "Cierre",
    note: "Reconocimientos oficiales",
    parallel: [
      { venue: "Napoleón V", text: "Cierre oficial · reconocimientos" },
      { venue: "Napoleón VI", text: "Feria en cierre operativo" },
      { venue: "Talleres · Academia", text: "Cerrado", closed: true },
    ],
  },
  {
    time: "16:00+",
    title: "Cocktail",
    note: "Bar externo · networking",
    accent: true,
    parallel: [
      {
        venue: "Sector externo",
        text: "Cocktail 100+ pax · La20 · música en vivo / DJ",
      },
      { venue: "App", text: "Networking por intereses activo" },
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

function buildParallelHtml(parallel) {
  if (!parallel?.length) return "";
  const items = parallel
    .map((p) => {
      const venueClass = p.closed ? "text-text-dim" : "text-accent";
      const textClass = p.closed ? "text-text-dim italic" : "text-text-mute";
      return `
          <li class="rounded-xl border border-white/5 bg-black/20 px-4 py-3.5 sm:px-5 sm:py-4">
            <span class="block font-display text-[10px] font-medium uppercase tracking-[0.14em] ${venueClass}">${escapeHtml(p.venue)}</span>
            <p class="mt-2 text-xs leading-relaxed sm:text-[13px] ${textClass}">${escapeHtml(p.text)}</p>
          </li>`;
    })
    .join("");

  return `
      <div class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
        <div class="overflow-hidden">
          <ul class="grid gap-3 border-t border-white/10 sm:mt-7 sm:grid-cols-2 sm:gap-4 mt-6 pt-8 " role="list" style="
    padding-top: 1rem;">
            ${items}
          </ul>
        </div>
      </div>`;
}

export function buildAgendaListHtml() {
  return agendaMilestones
    .map((item) => {
      const rowBg = item.accent ? "bg-accent/5" : "bg-white/[0.02]";
      const hoverBg = item.accent
        ? "lg:hover:bg-accent/10 lg:focus-within:bg-accent/10"
        : "lg:hover:bg-white/[0.05] lg:focus-within:bg-white/[0.05]";
      const timeColor = item.accent ? "text-accent" : "text-text-mute";
      const hasParallel = item.parallel?.length;
      const hint = hasParallel
        ? `<span class="hidden shrink-0 font-display text-[10px] uppercase tracking-[0.12em] text-text-dim opacity-0 transition-opacity duration-200 lg:inline lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">Salones</span>`
        : "";

      return `
        <li class="group px-6 py-5 transition-colors duration-200 sm:px-8 sm:py-6 ${rowBg} ${hoverBg}" tabindex="0">
          <div class="flex items-start gap-5 sm:gap-6 mb-4">
            <time class="w-[4.5rem] shrink-0 font-display text-xs font-medium tracking-wide ${timeColor} sm:w-24 sm:text-sm">${escapeHtml(item.time)}</time>
            <div class="min-w-0 flex-1">
              <p class="font-display text-sm font-medium tracking-[-0.01em] text-text">${escapeHtml(item.title)}</p>
              <p class="mt-0.5 text-xs leading-snug text-text-mute sm:text-[13px]">${escapeHtml(item.note)}</p>
            </div>
            ${hint}
          </div>
          ${buildParallelHtml(item.parallel)}
        </li>`;
    })
    .join("");
}
