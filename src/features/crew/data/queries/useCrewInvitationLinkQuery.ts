import { useQuery } from '@tanstack/react-query';
import { getCrewInvitationLink } from '../api/crew.api';
import { crewKeys } from '../keys';

export function useCrewInvitationLinkQuery() {
  return useQuery({
    queryKey: [...crewKeys.all, 'invitation', 'link'] as const,
    queryFn: async () => {
      const res = await getCrewInvitationLink();
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data.inviteLink;
    },
    staleTime: 60_000,
  });
}
