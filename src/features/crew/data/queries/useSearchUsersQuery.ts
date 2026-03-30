import { useQuery } from '@tanstack/react-query';
import { crewKeys } from '../keys';
import { getCrewRequestStatus, searchCrewUsers } from '../api/crew.api';
import type { CrewRequestStatusData, CrewUserWithStatus } from '@/shared/types';

async function fetchRequestStatus(userId: string): Promise<CrewRequestStatusData | null> {
  const response = await getCrewRequestStatus(userId);
  if (!response.success) {
    return null;
  }
  return response.data;
}

export function useSearchUsersQuery(query: string, userId: string | undefined) {
  return useQuery({
    queryKey: crewKeys.search(query, userId ?? ''),
    queryFn: async (): Promise<CrewUserWithStatus[]> => {
      const response = await searchCrewUsers(query);
      if (!response.success) {
        throw new Error(response.error.message);
      }

      const users = response.data.items;
      if (users.length === 0) {
        return [];
      }

      const statuses = await Promise.all(users.map((user) => fetchRequestStatus(user.id)));

      return users.map((user, index) => {
        const status = statuses[index];
        return {
          ...user,
          requestStatus: status?.status,
          requestId: status?.requestId,
          isSender: status?.isSender,
        };
      });
    },
    enabled: !!userId && !!query.trim(),
  });
}
