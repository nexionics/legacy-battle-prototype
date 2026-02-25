// Sports API Service
// Primary: Supabase sports_events (our Sports Data Repo)
// Fallback: TheSportsDB (when EXPO_PUBLIC_ENABLE_SPORTS_FALLBACK=true)

import { SportsRepo, RepoGame } from './sportsRepo';
import type { SportsEvent } from '@/shared/types';
export type { SportsEvent } from '@/shared/types';

// Fallback flag - set to true to enable TheSportsDB fallback when repo is empty
const ENABLE_FALLBACK = process.env.EXPO_PUBLIC_ENABLE_SPORTS_FALLBACK === 'true';

// TheSportsDB config (fallback only)
const DEMO_API_KEY = '1' + '2' + '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${DEMO_API_KEY}`;

// Map sport names from repo format to TheSportsDB format
function mapSportToDisplay(sport: string): string {
  switch (sport.toUpperCase()) {
    case 'NBA':
      return 'Basketball';
    case 'NFL':
      return 'American Football';
    case 'MLB':
      return 'Baseball';
    case 'NHL':
      return 'Ice Hockey';
    default:
      return sport;
  }
}

// Convert RepoGame to SportsEvent format (so screens don't need to change)
function repoGameToSportsEvent(game: RepoGame): SportsEvent {
  return {
    idEvent: game.id, // Use canonical UUID as idEvent
    strEvent: game.display_name || `${game.home_team} vs ${game.away_team}`,
    strSport: mapSportToDisplay(game.sport),
    strLeague: game.league,
    strLeagueBadge: '',
    strHomeTeam: game.home_team || '',
    strAwayTeam: game.away_team || '',
    intHomeScore: game.home_score !== null ? String(game.home_score) : null,
    intAwayScore: game.away_score !== null ? String(game.away_score) : null,
    strTimestamp: game.start_time || '',
    dateEvent: game.start_time ? game.start_time.split('T')[0] : '',
    strTime: game.start_time ? new Date(game.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
    strTimeLocal: game.start_time ? new Date(game.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
    idHomeTeam: '',
    strHomeTeamBadge: '',
    idAwayTeam: '',
    strAwayTeamBadge: '',
    strVenue: game.venue || '',
    strCity: '',
    strPoster: null,
    strThumb: null,
    strStatus: game.status,
  };
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strSport: string;
  strLeague: string;
  strStadium: string;
  strStadiumThumb: string | null;
  strDescriptionEN: string | null;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueBadge: string;
  strCountry: string;
}

// League IDs
export const LEAGUE_IDS = {
  NFL: '4391',
  NBA: '4387',
  MLB: '4424',
  NHL: '4380',
  MLS: '4346',
  EPL: '4328', // English Premier League
};

// Fetch next events for a league
export async function getNextLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching next league events:', error);
    return [];
  }
}

// Fetch previous events for a league (with scores)
export async function getPreviousLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventspastleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching previous league events:', error);
    return [];
  }
}

// Fetch league details
export async function getLeagueDetails(leagueId: string): Promise<League | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.leagues?.[0] || null;
  } catch (error) {
    console.error('Error fetching league details:', error);
    return null;
  }
}

// Fetch team details
export async function getTeamDetails(teamId: string): Promise<Team | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
    const data = await response.json();
    return data.teams?.[0] || null;
  } catch (error) {
    console.error('Error fetching team details:', error);
    return null;
  }
}

// Get upcoming games from multiple leagues (repo first, then fallback)
export async function getUpcomingGames(): Promise<SportsEvent[]> {
  try {
    // Try Supabase repo first
    const repoGames = await SportsRepo.getUpcomingBySport('ALL', 7);
    if (repoGames.length > 0) {
      return repoGames.map(repoGameToSportsEvent);
    }

    // Fallback to TheSportsDB if enabled and repo is empty
    if (!ENABLE_FALLBACK) return [];

    const [nflEvents, nbaEvents] = await Promise.all([
      getNextLeagueEvents(LEAGUE_IDS.NFL),
      getNextLeagueEvents(LEAGUE_IDS.NBA),
    ]);
    
    // Combine and sort by date
    const allEvents = [...nflEvents, ...nbaEvents];
    allEvents.sort((a, b) => new Date(a.strTimestamp).getTime() - new Date(b.strTimestamp).getTime());
    
    return allEvents;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
}

// Get recent results from multiple leagues (repo first, then fallback)
export async function getRecentResults(): Promise<SportsEvent[]> {
  try {
    // Try Supabase repo first
    const repoGames = await SportsRepo.getResultsBySport('ALL', 7);
    if (repoGames.length > 0) {
      return repoGames.map(repoGameToSportsEvent);
    }

    // Fallback to TheSportsDB if enabled and repo is empty
    if (!ENABLE_FALLBACK) return [];

    const [nflEvents, nbaEvents] = await Promise.all([
      getPreviousLeagueEvents(LEAGUE_IDS.NFL),
      getPreviousLeagueEvents(LEAGUE_IDS.NBA),
    ]);
    
    // Combine and sort by date (most recent first)
    const allEvents = [...nflEvents, ...nbaEvents];
    allEvents.sort((a, b) => new Date(b.strTimestamp).getTime() - new Date(a.strTimestamp).getTime());
    
    return allEvents;
  } catch (error) {
    console.error('Error fetching recent results:', error);
    return [];
  }
}

// Format event time for display
export function formatEventTime(event: SportsEvent): string {
  const date = new Date(event.strTimestamp);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Today ${event.strTimeLocal || event.strTime}`;
  } else if (diffDays === 1) {
    return `Tomorrow ${event.strTimeLocal || event.strTime}`;
  } else if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName} ${event.strTimeLocal || event.strTime}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Format score for display
export function formatScore(event: SportsEvent): string {
  if (event.intHomeScore !== null && event.intAwayScore !== null) {
    return `${event.intHomeScore} - ${event.intAwayScore}`;
  }
  return 'vs';
}

// Get sport icon/emoji
export function getSportIcon(sport: string): string {
  switch (sport.toLowerCase()) {
    case 'american football':
      return '🏈';
    case 'basketball':
      return '🏀';
    case 'baseball':
      return '⚾';
    case 'ice hockey':
      return '🏒';
    case 'soccer':
      return '⚽';
    default:
      return '🏆';
  }
}

// Get results for a specific sport (last 7 days) - repo first, then fallback
export async function getResultsBySport(sport: 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'EPL' | 'ALL'): Promise<SportsEvent[]> {
  try {
    // Try Supabase repo first
    const repoGames = await SportsRepo.getResultsBySport(sport, 7);
    if (repoGames.length > 0) {
      return repoGames.map(repoGameToSportsEvent);
    }

    // Fallback to TheSportsDB if enabled and repo is empty
    if (!ENABLE_FALLBACK) return [];

    let events: SportsEvent[] = [];
    
    if (sport === 'ALL') {
      // Fetch from all major leagues
      const [nfl, nba, mlb, nhl] = await Promise.all([
        getPreviousLeagueEvents(LEAGUE_IDS.NFL),
        getPreviousLeagueEvents(LEAGUE_IDS.NBA),
        getPreviousLeagueEvents(LEAGUE_IDS.MLB),
        getPreviousLeagueEvents(LEAGUE_IDS.NHL),
      ]);
      events = [...nfl, ...nba, ...mlb, ...nhl];
    } else {
      events = await getPreviousLeagueEvents(LEAGUE_IDS[sport]);
    }
    
    // Filter to last 7 days and sort by date (most recent first)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.strTimestamp || event.dateEvent);
      return eventDate >= sevenDaysAgo;
    });
    
    filteredEvents.sort((a, b) => 
      new Date(b.strTimestamp || b.dateEvent).getTime() - new Date(a.strTimestamp || a.dateEvent).getTime()
    );
    
    return filteredEvents;
  } catch (error) {
    console.error('Error fetching results by sport:', error);
    return [];
  }
}

// Get upcoming games for a specific sport (next 7 days) - repo first, then fallback
export async function getUpcomingBySport(sport: 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'EPL' | 'ALL'): Promise<SportsEvent[]> {
  try {
    // Try Supabase repo first
    const repoGames = await SportsRepo.getUpcomingBySport(sport, 7);
    if (repoGames.length > 0) {
      return repoGames.map(repoGameToSportsEvent);
    }

    // Fallback to TheSportsDB if enabled and repo is empty
    if (!ENABLE_FALLBACK) return [];

    let events: SportsEvent[] = [];
    
    if (sport === 'ALL') {
      const [nfl, nba, mlb, nhl] = await Promise.all([
        getNextLeagueEvents(LEAGUE_IDS.NFL),
        getNextLeagueEvents(LEAGUE_IDS.NBA),
        getNextLeagueEvents(LEAGUE_IDS.MLB),
        getNextLeagueEvents(LEAGUE_IDS.NHL),
      ]);
      events = [...nfl, ...nba, ...mlb, ...nhl];
    } else {
      events = await getNextLeagueEvents(LEAGUE_IDS[sport]);
    }
    
    // Filter to next 7 days and sort by date (soonest first)
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.strTimestamp || event.dateEvent);
      return eventDate >= now && eventDate <= sevenDaysFromNow;
    });
    
    filteredEvents.sort((a, b) => 
      new Date(a.strTimestamp || a.dateEvent).getTime() - new Date(b.strTimestamp || b.dateEvent).getTime()
    );
    
    return filteredEvents;
  } catch (error) {
    console.error('Error fetching upcoming games by sport:', error);
    return [];
  }
}

// Helper to check if a string is a UUID
function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// Get event result by event ID (for battle resolution) - repo first, then fallback
// eventId can be either a canonical UUID (sports_events.id) or a legacy provider ID
export async function getResultByEventId(eventId: string): Promise<{ data: SportsEvent | null; error: Error | null }> {
  try {
    // Map legacy event IDs (provider IDs) to canonical sports_events IDs when possible.
    // First: try canonical lookup if it looks like a UUID
    if (isUuid(eventId)) {
      const canonical = await SportsRepo.getEventByCanonicalId(eventId);
      if (canonical) {
        return { data: repoGameToSportsEvent(canonical), error: null };
      }
    }

    // Second: try lookup by provider ID (for legacy battles using TheSportsDB IDs)
    const byProvider = await SportsRepo.getEventByProviderId('thesportsdb', eventId);
    if (byProvider) {
      return { data: repoGameToSportsEvent(byProvider), error: null };
    }

    // Also try ESPN provider ID
    const byEspn = await SportsRepo.getEventByProviderId('espn', eventId);
    if (byEspn) {
      return { data: repoGameToSportsEvent(byEspn), error: null };
    }

    // Fallback to TheSportsDB if enabled
    if (!ENABLE_FALLBACK) {
      return { data: null, error: null };
    }

    const response = await fetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
    const data = await response.json();
    return { data: data.events?.[0] || null, error: null };
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return { data: null, error: error as Error };
  }
}

// Available sports for filtering
export const AVAILABLE_SPORTS = [
  { id: 'ALL', name: 'All Sports', icon: '🏆' },
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
] as const;
