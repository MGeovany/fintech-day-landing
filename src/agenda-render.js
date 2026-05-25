import agendaRaw from './components/agenda.html?raw';
import { agendaMeta, buildAgendaListHtml } from './data/agenda.js';

export function buildAgendaSectionHtml() {
  return agendaRaw
    .replace('__AGENDA_META__', agendaMeta.line)
    .replace('__AGENDA_HINT__', agendaMeta.hint)
    .replace('__AGENDA_LIST__', buildAgendaListHtml());
}
