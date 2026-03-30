import { useMutation, useQueryClient } from '@tanstack/react-query';
import { respondToCrewRequest, sendCrewRequest } from '../api/crew.api';
import { crewKeys } from '../keys';

function invalidateCrewQueries(queryClient: ReturnType<typeof useQueryClient>): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: crewKeys.all }).then(() => undefined);
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => respondToCrewRequest(requestId, 'accepted'),
    onSuccess: async () => {
      await invalidateCrewQueries(queryClient);
    },
  });
}

export function useDeclineRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => respondToCrewRequest(requestId, 'declined'),
    onSuccess: async () => {
      await invalidateCrewQueries(queryClient);
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => respondToCrewRequest(requestId, 'cancelled'),
    onSuccess: async () => {
      await invalidateCrewQueries(queryClient);
    },
  });
}

export function useSendCrewRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) => sendCrewRequest(receiverId),
    onSuccess: async () => {
      await invalidateCrewQueries(queryClient);
    },
  });
}
