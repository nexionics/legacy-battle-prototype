import { useQuery } from '@tanstack/react-query';
import { fetchSportsResults } from '../api/sports.http';
import { mapSportsEventDtoToSportsEvent } from '../api/mappers';
import { eventMatchesSportFilter } from '../lib/sportFilter';
import { sportsKeys } from '../keys';
import type { SportFilter } from '@/shared/types';

export function useResultsBySportQuery(sport: SportFilter) {
  return useQuery({
    queryKey: sportsKeys.resultsBySport(sport),
    queryFn: async () => {
      const res = await fetchSportsResults({ limit: 100, page: 1 });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      const events = res.data.items.map(mapSportsEventDtoToSportsEvent);
      return events.filter((e) => eventMatchesSportFilter(e, sport));
    },
  });
}
