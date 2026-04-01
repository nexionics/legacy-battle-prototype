import { authenticatedHttp } from '@/shared/lib/httpClient';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';
import type {
  BattleDetailDto,
  BattleDetailResponse,
  BattleListItemDto,
  BattlesExploreDataDto,
  BattlesExploreResponse,
  CreateBattlePayload,
  CreateBattleResponse,
  InviteBattleResponse,
  InviteToBattlePayload,
  JoinBattlePayload,
  JoinBattleResponse,
  PaginatedBattlesDto,
  PaginatedBattlesResponse,
} from './types';

export type { CreateBattlePayload, JoinBattlePayload, InviteToBattlePayload } from './types';

type PaginationParams = {
  limit?: number;
  page?: number;
};

function buildPageQuery({ limit = 20, page = 1 }: PaginationParams = {}): string {
  return `limit=${encodeURIComponent(String(limit))}&page=${encodeURIComponent(String(page))}`;
}

export async function fetchBattlesPage(
  params?: PaginationParams,
): Promise<PaginatedBattlesResponse> {
  const path = `/battles?${buildPageQuery(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<PaginatedBattlesDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchBattlesExplore(): Promise<BattlesExploreResponse> {
  const path = '/battles/explore';
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<BattlesExploreDataDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchBattleDetail(battleId: string): Promise<BattleDetailResponse> {
  const path = `/battles/${encodeURIComponent(battleId)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<BattleDetailDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchBattlesQuickPicks(
  params?: PaginationParams,
): Promise<PaginatedBattlesResponse> {
  const path = `/battles/quick-picks?${buildPageQuery(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<PaginatedBattlesDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function fetchMyActiveBattles(
  params?: PaginationParams,
): Promise<PaginatedBattlesResponse> {
  const path = `/battles/my-active?${buildPageQuery(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<PaginatedBattlesDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function createBattleRequest(
  payload: CreateBattlePayload,
): Promise<CreateBattleResponse> {
  const path = '/battles';
  try {
    const res = await authenticatedHttp.post(path, payload);
    return parseApiResponse<BattleListItemDto>(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function joinBattleRequest(
  battleId: string,
  body: JoinBattlePayload,
): Promise<JoinBattleResponse> {
  const path = `/battles/${encodeURIComponent(battleId)}/join`;
  try {
    const res = await authenticatedHttp.post(path, body);
    return parseApiResponse(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function inviteToBattleRequest(
  battleId: string,
  body: InviteToBattlePayload,
): Promise<InviteBattleResponse> {
  const path = `/battles/${encodeURIComponent(battleId)}/invite`;
  try {
    const res = await authenticatedHttp.post(path, body);
    return parseApiResponse(path, res.status, res.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
