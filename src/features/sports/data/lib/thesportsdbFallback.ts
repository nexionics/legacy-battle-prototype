import type { League, SportsEvent, Team } from '@/shared/types';

const DEMO_API_KEY = '1' + '2' + '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${DEMO_API_KEY}`;

export const LEAGUE_IDS = {
  NFL: '4391',
  NBA: '4387',
  MLB: '4424',
  NHL: '4380',
  MLS: '4346',
  EPL: '4328',
} as const;

export async function getNextLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export async function getPreviousLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventspastleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export async function getLeagueDetails(leagueId: string): Promise<League | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.leagues?.[0] || null;
  } catch {
    return null;
  }
}

export async function getTeamDetails(teamId: string): Promise<Team | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
    const data = await response.json();
    return data.teams?.[0] || null;
  } catch {
    return null;
  }
}

export async function lookupTheSportsDbEventById(eventId: string): Promise<SportsEvent | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
    const data = await response.json();
    return data.events?.[0] || null;
  } catch {
    return null;
  }
}
