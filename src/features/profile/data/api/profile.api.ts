import { authenticatedHttp } from '@/shared/lib/httpClient';
import type { ApiResponse, UserProfile, BattleStats, CrewCounts } from '@/shared/types';

export async function getProfileById(userId: string): Promise<ApiResponse<UserProfile>> {
  return (await authenticatedHttp.get(`/profile/${userId}`)).data;
}

export async function updateDisplayName(userId: string, displayName: string) {
  // Assuming the legacy update still exists or will be moved to /profile patch
  // For now, keeping it as is or using a placeholder if backend endpoint is known.
  // The user didn't provide a PATCH /profile/{id} endpoint yet, but mentioned updating avatar.
  return authenticatedHttp.patch(`/profile`, { displayName });
}

export function subscribeToProfile(_userId: string, _onUpdate: (profile: UserProfile) => void) {
  // Real-time subscription might need a different approach with REST + Sockets or just polling/invalidation.
  // For now, returning a dummy unsubscribe to avoid breaking existing hooks.
  return { unsubscribe: () => {} };
}

export async function getBattleStats(userId: string): Promise<ApiResponse<BattleStats>> {
  return (await authenticatedHttp.get(`/profile/${userId}/stats`)).data;
}

export async function getCrewCounts(userId: string): Promise<ApiResponse<CrewCounts>> {
  return (await authenticatedHttp.get(`/profile/${userId}/crew-counts`)).data;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return (await authenticatedHttp.patch('/profile/change-password', { oldPassword, newPassword }))
    .data;
}
