import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { useAuth } from '@/shared/hooks/useAuth';
import type { CrewMemberFilter, FriendsScreenProps } from '@/shared/types';
import { useAcceptRequest, useDeclineRequest, useSendCrewRequest } from '../../data/mutations/useCrewMutations';
import { friendsScreenStrings } from '../../string';
import { useCrew } from './useCrew';

function getApiErrorMessage(result: { success: boolean; error?: { message: string } }, fallback: string) {
  if (!result.success && result.error?.message) {
    return result.error.message;
  }
  return fallback;
}

export function useFriendsScreen({ navigation }: Pick<FriendsScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<CrewMemberFilter>('all');
  const { crewMembers, pendingReceived, suggestions, friendsLoading, friendsRefreshing, friendsError, refetch } =
    useCrew(user?.id);

  const acceptMutation = useAcceptRequest();
  const declineMutation = useDeclineRequest();
  const sendRequestMutation = useSendCrewRequest();

  const onAcceptPress = async (requestId: string) => {
    const result = await acceptMutation.mutateAsync(requestId);
    if (!result.success) {
      Alert.alert(
        friendsScreenStrings.alerts.genericTitle,
        getApiErrorMessage(result, friendsScreenStrings.alerts.acceptFailed),
      );
    }
  };

  const onDeclinePress = async (requestId: string) => {
    const result = await declineMutation.mutateAsync(requestId);
    if (!result.success) {
      Alert.alert(
        friendsScreenStrings.alerts.genericTitle,
        getApiErrorMessage(result, friendsScreenStrings.alerts.declineFailed),
      );
    }
  };

  const onAddSuggestionPress = async (memberId: string) => {
    const result = await sendRequestMutation.mutateAsync(memberId);
    if (!result.success) {
      Alert.alert(
        friendsScreenStrings.alerts.genericTitle,
        getApiErrorMessage(result, friendsScreenStrings.alerts.sendFailed),
      );
      return;
    }

    Alert.alert(
      friendsScreenStrings.alerts.requestSentTitle,
      friendsScreenStrings.alerts.requestSentMessage,
    );
  };

  const filteredCrewMembers = useMemo(() => {
    if (activeFilter === 'rivals') {
      return [];
    }
    return crewMembers;
  }, [activeFilter, crewMembers]);

  return {
    crewMembers: filteredCrewMembers,
    pendingReceived,
    suggestions,
    activeFilter,
    loading: friendsLoading,
    refreshing: friendsRefreshing,
    errorMessage: friendsError,
    onRefresh: () => {
      void refetch();
    },
    onBackPress: () => navigation.goBack(),
    onAddCrewPress: () => navigation.navigate('AddFriend'),
    onFilterChange: setActiveFilter,
    onSearchMembersPress: () => showToast('success', friendsScreenStrings.alerts.searchComingSoon),
    onChallengePress: (_memberId: string, _memberName: string) =>
      showToast('success', friendsScreenStrings.alerts.challengeComingSoon),
    onAcceptPress,
    onDeclinePress,
    onAddSuggestionPress,
    strings: friendsScreenStrings,
  };
}

export type UseFriendsScreenReturn = ReturnType<typeof useFriendsScreen>;
