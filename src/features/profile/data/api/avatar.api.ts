import { authenticatedHttp } from '@/shared/lib/httpClient';
import type { ApiResponse } from '@/shared/types';
import { Platform } from 'react-native';

export async function uploadAvatar(
  uri: string,
): Promise<ApiResponse<{ message: string; reference: string }>> {
  const formData = new FormData();

  const filename = uri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append('file', {
    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    name: filename,
    type,
  } as any);

  const response = await authenticatedHttp.post<
    ApiResponse<{ message: string; reference: string }>
  >('/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
