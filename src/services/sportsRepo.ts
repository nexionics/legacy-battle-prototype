// src/services/sportsRepo.ts
// Reads normalized events from Supabase sports_events table
import { supabase } from '../lib/supabaseClient';

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
};

export const SportsRepo = {
  // Next N days (scheduled/live)
  async getUpcomingBySport(sport: string, daysAhead = 7): Promise<RepoGame[]> {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + daysAhead);

    const sportFilter = sport === 'ALL' ? undefined : sport;

    let query = supabase
      .from('sports_events')
      .select(
        'id,provider,provider_event_id,sport,league,start_time,status,home_team,away_team,home_score,away_score,home_team_abbr,away_team_abbr,display_name,venue'
      )
      .gte('start_time', now.toISOString())
      .lte('start_time', end.toISOString())
      .in('status', ['scheduled', 'live'])
      .order('start_time', { ascending: true });

    if (sportFilter) query = query.eq('sport', sportFilter);

    const { data, error } = await query;
    if (error) {
      console.error('SportsRepo.getUpcomingBySport error', error);
      return [];
    }
    return (data || []) as RepoGame[];
  },

  // Past N days (final)
  async getResultsBySport(sport: string, daysBack = 7): Promise<RepoGame[]> {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - daysBack);

    const sportFilter = sport === 'ALL' ? undefined : sport;

    let query = supabase
      .from('sports_events')
      .select(
        'id,provider,provider_event_id,sport,league,start_time,status,home_team,away_team,home_score,away_score,home_team_abbr,away_team_abbr,display_name,venue'
      )
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
    return (data || []) as RepoGame[];
  },

  // Lookup a single event by canonical id (sports_events.id)
  async getEventByCanonicalId(canonicalId: string): Promise<RepoGame | null> {
    const { data, error } = await supabase
      .from('sports_events')
      .select(
        'id,provider,provider_event_id,sport,league,start_time,status,home_team,away_team,home_score,away_score,home_team_abbr,away_team_abbr,display_name,venue,raw'
      )
      .eq('id', canonicalId)
      .single();

    if (error) {
      console.error('SportsRepo.getEventByCanonicalId error', error);
      return null;
    }
    return data as RepoGame;
  },

  // Lookup by provider + provider_event_id (used during migration/fallback)
  async getEventByProviderId(provider: string, providerEventId: string): Promise<RepoGame | null> {
    const { data, error } = await supabase
      .from('sports_events')
      .select(
        'id,provider,provider_event_id,sport,league,start_time,status,home_team,away_team,home_score,away_score,home_team_abbr,away_team_abbr,display_name,venue,raw'
      )
      .eq('provider', provider)
      .eq('provider_event_id', providerEventId)
      .single();

    if (error) return null;
    return data as RepoGame;
  },
};
