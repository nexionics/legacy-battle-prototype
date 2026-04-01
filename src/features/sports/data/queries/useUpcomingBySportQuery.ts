import { useQuery } from '@tanstack/react-query';
import { fetchSportsUpcoming } from '../api/sports.http';
import { mapSportsEventDtoToSportsEvent } from '../api/mappers';
import { eventMatchesSportFilter } from '../lib/sportFilter';
import { sportsKeys } from '../keys';
import type { SportFilter } from '@/shared/types';

export function useUpcomingBySportQuery(sport: SportFilter) {
  return useQuery({
    queryKey: sportsKeys.upcomingBySport(sport),
    queryFn: async () => {
      const res = await fetchSportsUpcoming({ limit: 100, page: 1 });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      const events = res.data.items.map(mapSportsEventDtoToSportsEvent);
      return events.filter((e) => eventMatchesSportFilter(e, sport));
    },
  });
}
