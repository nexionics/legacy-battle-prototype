import { useQuery } from '@tanstack/react-query';
import { fetchSportsUpcoming } from '../api/sports.http';
import { mapSportsEventDtoToSportsEvent } from '../api/mappers';
import { sportsKeys } from '../keys';

export function useUpcomingGamesQuery(limit = 50, page = 1) {
  return useQuery({
    queryKey: [...sportsKeys.upcoming(), { limit, page }] as const,
    queryFn: async () => {
      const res = await fetchSportsUpcoming({ limit, page });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data.items.map(mapSportsEventDtoToSportsEvent);
    },
  });
}
