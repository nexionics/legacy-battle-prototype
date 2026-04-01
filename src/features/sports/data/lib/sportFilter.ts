import type { SportFilter } from '@/shared/types';
import type { SportsEvent } from '@/shared/types';

/** Client-side filter when `/sports/upcoming` returns a mixed feed. */
export function eventMatchesSportFilter(event: SportsEvent, filter: SportFilter): boolean {
  if (filter === 'ALL') return true;
  const sport = event.strSport.toLowerCase();
  const league = event.strLeague.toLowerCase();
  switch (filter) {
    case 'NFL':
      return sport.includes('american football') || league.includes('nfl');
    case 'NBA':
      return sport.includes('basketball') || league.includes('nba');
    case 'MLB':
      return sport.includes('baseball') || league.includes('mlb');
    case 'NHL':
      return sport.includes('hockey') || league.includes('nhl');
    case 'MLS':
      return league.includes('mls') || (sport.includes('soccer') && league.includes('mls'));
    case 'EPL':
      return league.includes('premier') || league.includes('epl');
    default:
      return true;
  }
}
