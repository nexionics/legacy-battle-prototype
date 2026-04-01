import type { ApiResponse } from '@/shared/types';

export interface SportsTeamRefDto {
  id: string;
  displayName: string;
  abbreviation: string;
  logoUrl: string | null;
}

export interface SportsLeagueRefDto {
  id: string;
  providerId: string;
  name: string;
  sport: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SportsLeagueDto {
  id: string;
  providerId: string;
  name: string;
  sport: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SportsEventDto {
  id: string;
  provider: string;
  providerEventId: string;
  sport: string;
  league: string;
  leagueId: string;
  startTime: string;
  status: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeamAbbr: string | null;
  awayTeamAbbr: string | null;
  displayName: string;
  venue: string | null;
  createdAt: string;
  updatedAt: string;
  homeTeam?: SportsTeamRefDto | null;
  awayTeam?: SportsTeamRefDto | null;
  leagueRef?: SportsLeagueRefDto | null;
}

export interface PaginatedSportsEventsDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: SportsEventDto[];
}

export type LeaguesListResponse = ApiResponse<SportsLeagueDto[]>;
export type PaginatedSportsEventsResponse = ApiResponse<PaginatedSportsEventsDto>;
export type SportsEventDetailResponse = ApiResponse<SportsEventDto>;
