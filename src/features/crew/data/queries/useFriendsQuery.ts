import { useQuery } from '@tanstack/react-query';
import { crewKeys } from '../keys';
import { getCrewMembers, getCrewSuggestions, getReceivedCrewRequests } from '../api/crew.api';

function getErrorMessage(error: { message: string }): never {
  throw new Error(error.message);
}

async function fetchFriendsData() {
  const [membersRes, pendingRes, suggestionsRes] = await Promise.all([
    getCrewMembers(),
    getReceivedCrewRequests(),
    getCrewSuggestions(),
  ]);

  if (!membersRes.success) {
    getErrorMessage(membersRes.error);
  }
  if (!pendingRes.success) {
    getErrorMessage(pendingRes.error);
  }
  if (!suggestionsRes.success) {
    getErrorMessage(suggestionsRes.error);
  }

  return {
    crewMembers: membersRes.data.items,
    pendingReceived: pendingRes.data.items,
    suggestions: suggestionsRes.data.items,
  };
}

export function useFriendsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: crewKeys.friends(userId ?? ''),
    queryFn: fetchFriendsData,
    enabled: !!userId,
  });
}
