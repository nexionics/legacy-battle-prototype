/**
 * Sports feature public API: HTTP data + display helpers + optional TheSportsDB fallback.
 */
export {
  fetchSportsLeagues,
  fetchSportsUpcoming,
  fetchSportsResults,
  fetchSportsEventById,
} from './sports.http';

export { mapSportsEventDtoToSportsEvent } from './mappers';

export {
  formatEventTime,
  formatScore,
  getSportIcon,
  AVAILABLE_SPORTS,
} from '../lib/sportsDisplay';

export {
  LEAGUE_IDS,
  getNextLeagueEvents,
  getPreviousLeagueEvents,
  getLeagueDetails,
  getTeamDetails,
  lookupTheSportsDbEventById,
} from '../lib/thesportsdbFallback';
