import { useQuery } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import {
  getProfileById,
  getBattleStats,
  getCrewCounts,
  getCrewMembersPreview,
} from '../api/profile.api';

async function fetchProfileWithStats(userId: string) {
  const profileRes = await getProfileById(userId);
  if (!profileRes.success) throw new Error('Profile fetch failed');

  const [statsRes, crewRes, previewRes] = await Promise.all([
    getBattleStats(userId),
    getCrewCounts(userId),
    getCrewMembersPreview(3),
  ]);

  if (!statsRes.success) throw new Error('Stats fetch failed');
  if (!crewRes.success) throw new Error('Crew counts fetch failed');

  const crewPreviewMembers = previewRes.success ? previewRes.data.items : [];

  return {
    profile: profileRes.data,
    battleStats: statsRes.data,
    crewCount: crewRes.data.members,
    followingCount: crewRes.data.following,
    crewPreviewMembers,
  };
}

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ''),
    queryFn: () => fetchProfileWithStats(userId!),
    enabled: !!userId,
  });
}
