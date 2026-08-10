/** Programa detallado - Honduras Fintech Day 2026 · Hotel Copantl
 *
 * Fuente: PROGRAMA_AGENDA HFD26 - actualizado 10 agosto 2026.xlsx
 * Los salones marcados CERRADO en la fuente se omiten en el render.
 */

export const agendaMeta = {
  line: "20 de agosto 2026 · Hotel Copantl, San Pedro Sula · 7:00 - 16:35 + cocktail",
  hint: "Cada bloque muestra qué ocurre en paralelo por salón. El área de Conexiones está disponible todo el día para reuniones 1 a 1. Programa sujeto a cambios.",
  venue: "Hotel Copantl - San Pedro Sula",
};

/**
 * @typedef {{ venue: string, text: string, details?: string[] }} AgendaParallel
 * @typedef {{ time: string, title: string, note: string, accent?: boolean, parallel?: AgendaParallel[] }} AgendaMilestone
 */

/** @type {AgendaMilestone[]} */
export const agendaMilestones = [
  {
    time: "7:00 - 8:00",
    title: "Registro y bienvenida",
    note: "Lobby · app del evento activa",
    parallel: [
      { venue: "Lobby / Registro", text: "Lobby / Registro. App activa." },
      {
        venue: "Conexiones (Networking)",
        text: "Disponible todo el día - reuniones 1 a 1",
      },
    ],
  },
  {
    time: "8:00 - 8:15",
    title: "Bienvenida",
    note: "Palabras de inicio · Napoleón V",
    accent: true,
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
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
    note: "Agenda AFINH · Napoleón V",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
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
    note: "Keynote · Napoleón V",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
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
      { venue: "Napoleón V · VI", text: "Inauguración feria y coffee break" },
    ],
  },
  {
    time: "9:30 - 10:00",
    title: "Inclusión financiera y pagos internacionales",
    note: "Conectado · Conocimiento · Feria",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "Fintech con impacto social: el modelo de AAvance y lo que Honduras puede replicar para acelerar la inclusión financiera femenina.",
        details: ["Magreth Gutiérrez, CEO, Aavance"],
      },
      {
        venue: "Napoleón II (Conocimiento)",
        text: "Mastercard Move: Nuevas oportunidades para los pagos internacionales de personas y PyMEs en Honduras.",
        details: ["Gonzalo González, Senior Sales Representative, Mastercard"],
      },
      {
        venue: "Napoleón VI (Feria)",
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
    note: "Conectado · Conocimiento",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "Panel: Innovación y tendencias en sistemas de pago.",
        details: [
          "Miguel Sarti, Business Development Manager, Visa",
          "José Herrera, Regional Manager Central America, Caribbean, Colombia & Ecuador, DLocal",
          "Darwin Gabourel, Director Regional, n1co Business",
          "Moderador: Jimmy Amador, CEO, Clinpays",
        ],
      },
      {
        venue: "Napoleón II (Conocimiento)",
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
    note: "Conectado · Conocimiento",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "De Remesas a Activos Tokenizados: La Nueva Arquitectura Financiera de Centroamérica.",
        details: ["Juan Diego Sol, Gerente Regional, IBEX"],
      },
      {
        venue: "Napoleón II (Conocimiento)",
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
    note: "Conectado · Conocimiento",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "Ciber fraude en la era de la IA, ¿cómo nos protegemos?",
        details: [
          "Luis Alejandro Anderson Rivera, Senior Management Consultant para Mastercard en la región",
          "Mastercard",
        ],
      },
      {
        venue: "Napoleón II (Conocimiento)",
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
    title: "Jóvenes y crédito con QR",
    note: "Conectado · Conocimiento",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "\"El rol de los jóvenes en la transformación digital\"",
        details: [
          "Mario René Guevara Galeano, Especialista en Transformación Digital, Innovación y Desarrollo de Negocios, DIGER",
        ],
      },
      {
        venue: "Napoleón II (Conocimiento)",
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
      { venue: "Napoleón V · II", text: "Almuerzo / Receso" },
      { venue: "Napoleón IV", text: "Almuerzo formal 250 pax" },
    ],
  },
  {
    time: "13:30 - 14:00",
    title: "Regulación, cobranza y Academia",
    note: "Conectado · Conocimiento · Academia",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "Panel: Inclusión Financiera desde la perspectiva del regulador.",
        details: [
          "Carlos Andino, Subgerente de Operaciones, BCH",
          "Sidia Gómez, Especialista del HUB de Innovación Financiera, CNBS",
          "José Andonis Lavaire, Director Ejecutivo, Consuccop",
          "Moderador: Ricardo Irias, CEO, SUBE",
        ],
      },
      {
        venue: "Napoleón II (Conocimiento)",
        text: "Cobranza Inteligente: de la mora a la acción.",
        details: ["Lisseth Leal, CEO, D2i"],
      },
      {
        venue: "Academia",
        text: "Taller Academia 1: \"Jóvenes que construyen con AI\"",
        details: [
          "Cesar Alejandro Maldonado, Gerente de Proyectos Digitales, DIGER · Consultor en Transformación Digital y Ciberseguridad",
        ],
      },
    ],
  },
  {
    time: "14:00 - 14:30",
    title: "Sistema financiero digital y tokenización",
    note: "Conectado · Conocimiento · Academia",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "Evolución del sistema financiero digital.",
        details: ["Juan Carlos Garavito, CEO, WAU"],
      },
      {
        venue: "Napoleón II (Conocimiento)",
        text: "PreCredit",
        details: ["Cassandra Escobar, Gerente de Producto, PreCredit"],
      },
      {
        venue: "Academia",
        text: "Taller Academia 2. ¿Qué es tokenización?",
        details: ["Juan Diego Sol y Carlos Alfaro, IBEX"],
      },
    ],
  },
  {
    time: "14:30 - 15:00",
    title: "IA en crédito y orquestación de pagos",
    note: "Conectado · Conocimiento · Academia",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "De años a semanas: cómo las plataformas impulsadas por IA democratizan el crédito digital.",
        details: ["Erick González, Gerente de Tecnología, BOWPI"],
      },
      {
        venue: "Napoleón II (Conocimiento)",
        text: "Pagos: Orquestación para ganar",
        details: ["Jimmy Amador, CEO, Clinpays"],
      },
      {
        venue: "Academia",
        text: "Taller Academia 3. Inclusión Financiera, casos de éxito.",
        details: ["Magreth Gutiérrez, Aavance"],
      },
    ],
  },
  {
    time: "15:00 - 15:30",
    title: "Open Finance y transformación digital",
    note: "Conectado · Conocimiento · Academia",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
        text: "Open Finance en Economías Emergentes: ¿Oportunidad o Riesgo Sistémico?",
        details: ["Edwin Zancipa, LATAM Fintech Hub"],
      },
      {
        venue: "Napoleón II (Conocimiento)",
        text: "¿Qué Está Frenando tu Transformación Digital? Un workshop donde convertimos los retos de tu institución en soluciones reales.",
        details: [
          "Erick González, Gerente de Tecnología",
          "Raquel Andrade, Business Development Manager",
          "BOWPI",
        ],
      },
      {
        venue: "Academia",
        text: "Taller Academia 4. Inteligencia Artificial, un enfoque técnico",
        details: ["Stanley Marrder"],
      },
    ],
  },
  {
    time: "15:30 - 16:00",
    title: "Democratizando los pagos",
    note: "Napoleón V",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
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
    note: "Napoleón V",
    parallel: [
      {
        venue: "Napoleón V (Conectado)",
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
      {
        venue: "Napoleón V (Conectado)",
        text: "Palabras de cierre y agradecimientos.",
      },
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
