import { authenticatedHttp } from '@/shared/lib/httpClient';
import type { ApiResponse, CrewUserSummary, UserProfile, BattleStats, CrewCounts } from '@/shared/types';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';

type PaginatedCrewMembers = {
  items: CrewUserSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export async function getProfileById(userId: string): Promise<ApiResponse<UserProfile>> {
  return (await authenticatedHttp.get(`/profile/${userId}`)).data;
}

export async function updateProfile(data: {
  username?: string;
  displayName?: string;
  bio?: string;
}) {
  return authenticatedHttp.patch(`/profile`, data);
}

export function subscribeToProfile(_userId: string, _onUpdate: (profile: UserProfile) => void) {
  return { unsubscribe: () => {} };
}

export async function getBattleStats(userId: string): Promise<ApiResponse<BattleStats>> {
  return (await authenticatedHttp.get(`/profile/${userId}/stats`)).data;
}

export async function getCrewCounts(userId: string): Promise<ApiResponse<CrewCounts>> {
  return (await authenticatedHttp.get(`/profile/${userId}/crew-counts`)).data;
}

/** First page of crew members for profile preview (same endpoint as crew feature; avoids cross-feature imports). */
export async function getCrewMembersPreview(limit = 3): Promise<ApiResponse<PaginatedCrewMembers>> {
  const path = `/crew/members?limit=${encodeURIComponent(String(limit))}&page=1`;
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<PaginatedCrewMembers>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return (await authenticatedHttp.patch('/profile/change-password', { oldPassword, newPassword }))
    .data;
}

export async function requestEmailChange(
  newEmail: string,
): Promise<ApiResponse<{ reference: string }>> {
  return (await authenticatedHttp.post('/profile/request-email-change', { newEmail })).data;
}

export async function verifyEmailChange(
  code: string,
  reference: string,
  newEmail: string,
): Promise<ApiResponse<{ message: string }>> {
  return (
    await authenticatedHttp.post('/profile/verify-email-change', {
      code,
      reference,
      newEmail,
    })
  ).data;
}

export async function resendEmailChangeOtp(
  newEmail: string,
): Promise<ApiResponse<{ reference: string }>> {
  return (
    await authenticatedHttp.post('/profile/resend-email-change-otp', {
      newEmail,
    })
  ).data;
}
