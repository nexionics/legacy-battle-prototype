import { useQuery } from '@tanstack/react-query';
import { fetchSportsResults } from '../api/sports.http';
import { mapSportsEventDtoToSportsEvent } from '../api/mappers';
import { sportsKeys } from '../keys';

export function useRecentResultsQuery(limit = 50, page = 1) {
  return useQuery({
    queryKey: [...sportsKeys.recent(), { limit, page }] as const,
    queryFn: async () => {
      const res = await fetchSportsResults({ limit, page });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data.items.map(mapSportsEventDtoToSportsEvent);
    },
  });
}
