// src/services/sportsRepo.ts
// Reads normalized events from Supabase sports_events table
import { supabase } from '../lib/supabaseClient';

// Team metadata from sports_teams join
export type TeamInfo = {
  id: string;
  display_name: string | null;
  abbreviation: string | null;
  logo_url: string | null;
};

export type RepoGame = {
  id: string;                 // canonical sports_events.id (uuid)
  provider: string;
  provider_event_id: string;
  sport: string;
  league: string;
  start_time: string | null;
  status: 'scheduled' | 'live' | 'final';
  home_team: string | null;
  away_team: string | null;
  home_score: number | null;
  away_score: number | null;
  home_team_abbr?: string | null;
  away_team_abbr?: string | null;
  display_name?: string | null;
  venue?: string | null;
  raw?: object;
  // Team metadata from joins
  home_team_info?: TeamInfo | null;
  away_team_info?: TeamInfo | null;
};

// Select query with team joins
const SELECT_WITH_TEAMS = `
  id, provider, provider_event_id, sport, league,
  start_time, status,
  home_team, away_team,
  home_score, away_score,
  home_team_abbr, away_team_abbr,
  display_name, venue,
  home_team_info:home_team_id ( id, display_name, abbreviation, logo_url ),
  away_team_info:away_team_id ( id, display_name, abbreviation, logo_url )
`;

// Select query with team joins and raw (for single event lookups)
const SELECT_WITH_TEAMS_AND_RAW = `
  id, provider, provider_event_id, sport, league,
  start_time, status,
  home_team, away_team,
  home_score, away_score,
  home_team_abbr, away_team_abbr,
  display_name, venue, raw,
  home_team_info:home_team_id ( id, display_name, abbreviation, logo_url ),
  away_team_info:away_team_id ( id, display_name, abbreviation, logo_url )
`;

// Transform raw Supabase response to RepoGame
function transformToRepoGame(row: any): RepoGame {
  return {
    id: row.id,
    provider: row.provider,
    provider_event_id: row.provider_event_id,
    sport: row.sport,
    league: row.league,
    start_time: row.start_time,
    status: row.status,
    home_team: row.home_team,
    away_team: row.away_team,
    home_score: row.home_score,
    away_score: row.away_score,
    home_team_abbr: row.home_team_abbr,
    away_team_abbr: row.away_team_abbr,
    display_name: row.display_name,
    venue: row.venue,
    raw: row.raw,
    home_team_info: row.home_team_info || null,
    away_team_info: row.away_team_info || null,
  };
}

export const SportsRepo = {
  // Next N days (scheduled) + currently live games
  async getUpcomingBySport(sport: string, daysAhead = 7): Promise<RepoGame[]> {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + daysAhead);

    const sportFilter = sport === 'ALL' ? undefined : sport;

    let scheduledQuery = supabase
      .from('sports_events')
      .select(SELECT_WITH_TEAMS)
      .gte('start_time', now.toISOString())
      .lte('start_time', end.toISOString())
      .eq('status', 'scheduled')
      .order('start_time', { ascending: true });

    if (sportFilter) scheduledQuery = scheduledQuery.eq('sport', sportFilter);

    let liveQuery = supabase
      .from('sports_events')
      .select(SELECT_WITH_TEAMS)
      .eq('status', 'live')
      .order('start_time', { ascending: true });

    if (sportFilter) liveQuery = liveQuery.eq('sport', sportFilter);

    const [scheduledResult, liveResult] = await Promise.all([
      scheduledQuery,
      liveQuery,
    ]);

    if (scheduledResult.error) {
      console.error('SportsRepo.getUpcomingBySport scheduled error', scheduledResult.error);
    }
    if (liveResult.error) {
      console.error('SportsRepo.getUpcomingBySport live error', liveResult.error);
    }

    const scheduled = (scheduledResult.data || []).map(transformToRepoGame);
    const live = (liveResult.data || []).map(transformToRepoGame);

    return [...live, ...scheduled];
  },

  // Past N days (final)
  async getResultsBySport(sport: string, daysBack = 7): Promise<RepoGame[]> {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - daysBack);

    const sportFilter = sport === 'ALL' ? undefined : sport;

    let query = supabase
      .from('sports_events')
      .select(SELECT_WITH_TEAMS)
      .gte('start_time', start.toISOString())
      .lte('start_time', now.toISOString())
      .eq('status', 'final')
      .order('start_time', { ascending: false });

    if (sportFilter) query = query.eq('sport', sportFilter);

    const { data, error } = await query;
    if (error) {
      console.error('SportsRepo.getResultsBySport error', error);
      return [];
    }
    return (data || []).map(transformToRepoGame);
  },

  // Lookup a single event by canonical id (sports_events.id)
  async getEventByCanonicalId(canonicalId: string): Promise<RepoGame | null> {
    const { data, error } = await supabase
      .from('sports_events')
      .select(SELECT_WITH_TEAMS_AND_RAW)
      .eq('id', canonicalId)
      .single();

    if (error) {
      console.error('SportsRepo.getEventByCanonicalId error', error);
      return null;
    }
    return transformToRepoGame(data);
  },

  // Lookup by provider + provider_event_id (used during migration/fallback)
  async getEventByProviderId(provider: string, providerEventId: string): Promise<RepoGame | null> {
    const { data, error } = await supabase
      .from('sports_events')
      .select(SELECT_WITH_TEAMS_AND_RAW)
      .eq('provider', provider)
      .eq('provider_event_id', providerEventId)
      .single();

    if (error) return null;
    return transformToRepoGame(data);
  },
};
