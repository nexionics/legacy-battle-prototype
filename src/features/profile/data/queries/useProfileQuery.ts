import { useQuery } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import { getProfileById, getBattleStats, getCrewCounts } from '../api/profile.api';
import type { UserProfile } from '@/shared/types';

async function fetchProfileWithStats(userId: string) {
  const profileRes = await getProfileById(userId);
  if (!profileRes.success) throw new Error('Profile fetch failed');

  const [statsRes, crewRes] = await Promise.all([getBattleStats(userId), getCrewCounts(userId)]);

  if (!statsRes.success) throw new Error('Stats fetch failed');
  if (!crewRes.success) throw new Error('Crew counts fetch failed');

  return {
    profile: profileRes.data,
    battleStats: statsRes.data,
    crewCount: crewRes.data.members,
    followingCount: crewRes.data.following,
  };
}

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ''),
    queryFn: () => fetchProfileWithStats(userId!),
    enabled: !!userId,
  });
}
