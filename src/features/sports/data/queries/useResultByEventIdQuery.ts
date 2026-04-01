import { useQuery } from '@tanstack/react-query';
import { fetchSportsEventById } from '../api/sports.http';
import { mapSportsEventDtoToSportsEvent } from '../api/mappers';
import { lookupTheSportsDbEventById } from '../lib/thesportsdbFallback';
import { sportsKeys } from '../keys';

const ENABLE_FALLBACK = process.env.EXPO_PUBLIC_ENABLE_SPORTS_FALLBACK === 'true';

export function useResultByEventIdQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: sportsKeys.result(eventId ?? ''),
    queryFn: async () => {
      const res = await fetchSportsEventById(eventId!);
      if (res.success && res.data) {
        return mapSportsEventDtoToSportsEvent(res.data);
      }
      if (ENABLE_FALLBACK) {
        const legacy = await lookupTheSportsDbEventById(eventId!);
        if (legacy) return legacy;
      }
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return null;
    },
    enabled: !!eventId,
    refetchInterval: 60_000,
  });
}
