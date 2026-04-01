import type { ApiResponse } from '@/shared/types';

/** Embedded sports event on battle list/detail responses (API camelCase). */
export interface BattleSportsEventDto {
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
  raw: unknown | null;
  createdAt: string;
  updatedAt: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
}

export interface BattleParticipantCountDto {
  participants: number;
}

/** Battle row from list / explore / quick-picks / my-active. */
export interface BattleListItemDto {
  id: string;
  eventId: string | null;
  type: string;
  status: string;
  winnerId: string | null;
  visibility: string;
  mode: string;
  sport: string | null;
  week: string | null;
  stakeAmount: number;
  statCategoryId: string | null;
  finalOutcome: unknown | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ruleSetId: string | null;
  event: BattleSportsEventDto | null;
  _count?: BattleParticipantCountDto;
}

export interface PaginatedBattlesDto {
  items: BattleListItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BattlesExploreDataDto {
  trending: BattleListItemDto[];
  ending: BattleListItemDto[];
  /** API uses the key `new` */
  'new': BattleListItemDto[];
  highActivity: BattleListItemDto[];
}

export interface BattleParticipantProfileDto {
  displayName: string | null;
  avatarUrl: string | null;
  username: string | null;
}

export interface BattleParticipantUserDto {
  id: string;
  profile: BattleParticipantProfileDto;
}

export interface BattleParticipantDetailDto {
  id: string;
  battleId: string;
  userId: string;
  pick: string | null;
  playerId: string | null;
  expectation: string | null;
  isWinner: boolean | null;
  createdAt: string;
  updatedAt: string;
  user: BattleParticipantUserDto;
}

/** Full battle with participants (GET /battles/:id). */
export interface BattleDetailDto extends Omit<BattleListItemDto, '_count'> {
  participants: BattleParticipantDetailDto[];
}

/** POST /battles */
export interface CreateBattlePayload {
  type: string;
  mode: string;
  eventId?: string | null;
  sport?: string | null;
  week?: string | null;
  playerId?: string | null;
  expectation?: string | null;
  stakeAmount?: number;
  opponentId?: string | null;
  visibility?: string;
  initialMetadata?: Record<string, unknown>;
}

export interface JoinBattlePayload {
  pick: string;
}

export interface InviteToBattlePayload {
  inviteeEmail: string;
}

export type PaginatedBattlesResponse = ApiResponse<PaginatedBattlesDto>;
export type BattlesExploreResponse = ApiResponse<BattlesExploreDataDto>;
export type BattleDetailResponse = ApiResponse<BattleDetailDto>;
export type CreateBattleResponse = ApiResponse<BattleListItemDto>;
export type JoinBattleResponse = ApiResponse<unknown>;
export type InviteBattleResponse = ApiResponse<unknown>;
