import { authenticatedHttp } from '@/shared/lib/httpClient';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';
import type {
  CrewInvitationLinkResponse,
  CrewMembersResponse,
  CrewRequestResponseStatus,
  CrewRequestStatusResponse,
  CrewRequestsResponse,
  CrewSearchResponse,
  CrewSuggestionsResponse,
  RespondToCrewRequestResponse,
  SendCrewRequestResponse,
} from './types';

type PaginationParams = {
  limit?: number;
  page?: number;
};

function buildQueryString({ limit = 20, page = 1 }: PaginationParams = {}): string {
  return `limit=${encodeURIComponent(String(limit))}&page=${encodeURIComponent(String(page))}`;
}

export async function getCrewMembers(params?: PaginationParams): Promise<CrewMembersResponse> {
  const path = `/crew/members?${buildQueryString(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getReceivedCrewRequests(params?: PaginationParams): Promise<CrewRequestsResponse> {
  const path = `/crew/requests/received?${buildQueryString(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getSentCrewRequests(params?: PaginationParams): Promise<CrewRequestsResponse> {
  const path = `/crew/requests/sent?${buildQueryString(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getCrewSuggestions(params?: PaginationParams): Promise<CrewSuggestionsResponse> {
  const path = `/crew/suggestions?${buildQueryString(params)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getCrewRequestStatus(userId: string): Promise<CrewRequestStatusResponse> {
  const path = `/crew/request-status/${encodeURIComponent(userId)}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function searchCrewUsers(
  query: string,
  params?: PaginationParams,
): Promise<CrewSearchResponse> {
  const q = encodeURIComponent(query.trim());
  const path = `/crew/search?${buildQueryString(params)}&q=${q}`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function sendCrewRequest(receiverId: string): Promise<SendCrewRequestResponse> {
  const path = '/crew/request';
  try {
    const res = await authenticatedHttp.post(path, { receiverId });
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function respondToCrewRequest(
  requestId: string,
  status: CrewRequestResponseStatus,
): Promise<RespondToCrewRequestResponse> {
  const path = `/crew/request/${encodeURIComponent(requestId)}/respond`;
  try {
    const res = await authenticatedHttp.post(path, { status });
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getCrewInvitationLink(): Promise<CrewInvitationLinkResponse> {
  const path = '/crew/invitation/link';
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
