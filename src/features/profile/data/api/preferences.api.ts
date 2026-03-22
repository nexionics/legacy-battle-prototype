import { authenticatedHttp } from '@/shared/lib/httpClient';
import type { UserPreferences, UpdateUserPreferences, ApiResponse } from '@/shared/types';

export async function getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
  const response = await authenticatedHttp.get<ApiResponse<UserPreferences>>('/preferences');
  return response.data;
}

export async function updateUserPreferences(
  payload: UpdateUserPreferences,
): Promise<ApiResponse<{ message: string; reference: string }>> {
  const response = await authenticatedHttp.patch<
    ApiResponse<{ message: string; reference: string }>
  >('/preferences', payload);
  return response.data;
}
