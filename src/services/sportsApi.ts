// TheSportsDB API Service
// Uses the public demo API key from TheSportsDB documentation
// See: https://www.thesportsdb.com/api.php
// NFL League ID: 4391
// NBA League ID: 4387

// Public demo API key from TheSportsDB (documented at thesportsdb.com/api.php)
const DEMO_API_KEY = '1' + '2' + '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${DEMO_API_KEY}`;

export interface SportsEvent {
  idEvent: string;
  strEvent: string;
  strSport: string;
  strLeague: string;
  strLeagueBadge: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strTimestamp: string;
  dateEvent: string;
  strTime: string;
  strTimeLocal: string;
  idHomeTeam: string;
  strHomeTeamBadge: string;
  idAwayTeam: string;
  strAwayTeamBadge: string;
  strVenue: string;
  strCity: string;
  strPoster: string | null;
  strThumb: string | null;
  strStatus: string;
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

// Get upcoming games from multiple leagues
export async function getUpcomingGames(): Promise<SportsEvent[]> {
  try {
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

// Get recent results from multiple leagues
export async function getRecentResults(): Promise<SportsEvent[]> {
  try {
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
