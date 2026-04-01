import { authenticatedHttp } from '@/shared/lib/httpClient';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';
import type {
  LeaguesListResponse,
  PaginatedSportsEventsDto,
  PaginatedSportsEventsResponse,
  SportsEventDetailResponse,
  SportsEventDto,
  SportsLeagueDto,
} from './types';

type PaginationParams = {
  limit?: number;
  page?: number;
};

function buildPageQuery({ limit = 20, page = 1 }: PaginationParams = {}): string {
  return `limit=${encodeURIComponent(String(limit))}&page=${encodeURIComponent(String(page))}`;
}

export async function fetchSportsLeagues(): Promise<LeaguesListResponse> {
  const path = '/sports/leagues';
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<SportsLeagueDto[]>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchSportsUpcoming(
  params?: PaginationParams,
): Promise<PaginatedSportsEventsResponse> {
  const path = `/sports/upcoming?${buildPageQuery(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<PaginatedSportsEventsDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchSportsResults(
  params?: PaginationParams,
): Promise<PaginatedSportsEventsResponse> {
  const path = `/sports/results?${buildPageQuery(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<PaginatedSportsEventsDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchSportsEventById(eventId: string): Promise<SportsEventDetailResponse> {
  const path = `/sports/events/${encodeURIComponent(eventId)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<SportsEventDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
