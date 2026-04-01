import type { SportsEvent } from '@/shared/types';
import type { SportsEventDto } from './types';

function formatTimeFromIso(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/** Maps backend sports event DTO to legacy `SportsEvent` shape used by cards. */
export function mapSportsEventDtoToSportsEvent(e: SportsEventDto): SportsEvent {
  const datePart = e.startTime?.split('T')[0] ?? '';
  const timeLocal = formatTimeFromIso(e.startTime);
  return {
    idEvent: e.id,
    strEvent: e.displayName || `${e.homeTeamName} vs ${e.awayTeamName}`,
    strSport: e.sport,
    strLeague: e.league,
    strLeagueBadge: '',
    strHomeTeam: e.homeTeamName,
    strAwayTeam: e.awayTeamName,
    intHomeScore: e.homeScore !== null && e.homeScore !== undefined ? String(e.homeScore) : null,
    intAwayScore: e.awayScore !== null && e.awayScore !== undefined ? String(e.awayScore) : null,
    strTimestamp: e.startTime,
    dateEvent: datePart,
    strTime: timeLocal,
    strTimeLocal: timeLocal,
    idHomeTeam: e.homeTeam?.id ?? '',
    strHomeTeamBadge: e.homeTeam?.logoUrl ?? '',
    idAwayTeam: e.awayTeam?.id ?? '',
    strAwayTeamBadge: e.awayTeam?.logoUrl ?? '',
    strVenue: e.venue ?? '',
    strCity: '',
    strPoster: null,
    strThumb: null,
    strStatus: e.status,
  };
}
