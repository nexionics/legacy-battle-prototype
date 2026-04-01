import { useQuery } from '@tanstack/react-query';
import { fetchSportsLeagues } from '../api/sports.http';
import { sportsKeys } from '../keys';

export function useSportsLeaguesQuery() {
  return useQuery({
    queryKey: sportsKeys.leagues(),
    queryFn: async () => {
      const res = await fetchSportsLeagues();
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
  });
}
