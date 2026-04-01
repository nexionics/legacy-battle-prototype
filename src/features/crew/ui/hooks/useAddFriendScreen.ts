import { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from '@/app/providers/useToast';
import { useAuth } from '@/shared/hooks/useAuth';
import type { AddFriendScreenProps } from '@/shared/types';
import { useCrewInvitationLinkQuery } from '../../data/queries/useCrewInvitationLinkQuery';
import { addFriendScreenStrings } from '../../string';
import { useAddFriend } from './useAddFriend';

function isAlreadySentMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes('pending') || normalized.includes('already');
}

export function useAddFriendScreen({ navigation }: Pick<AddFriendScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [submittingFriendId, setSubmittingFriendId] = useState<string | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    searchError,
    hasSearched,
    handleSearch,
    handleAddFriend,
  } = useAddFriend(user?.id);

  const {
    data: inviteLink,
    isLoading: inviteLinkLoading,
    isError: inviteLinkError,
    error: inviteLinkQueryError,
    refetch: refetchInviteLink,
  } = useCrewInvitationLinkQuery();

  const inviteLinkErrorMessage = useMemo(() => {
    if (!inviteLinkError || !inviteLinkQueryError) return null;
    return inviteLinkQueryError instanceof Error
      ? inviteLinkQueryError.message
      : addFriendScreenStrings.linkUnavailable;
  }, [inviteLinkError, inviteLinkQueryError]);

  const onAddFriendPress = async (friendId: string, friendName: string) => {
    setSubmittingFriendId(friendId);
    try {
      const result = await handleAddFriend(friendId);
      if (!result.success) {
        const message = result.error.message;
        const toastMessage = isAlreadySentMessage(message)
          ? addFriendScreenStrings.alerts.alreadySentMessage
          : message;
        showToast('fail', toastMessage);
        return;
      }

      showToast('success', addFriendScreenStrings.alerts.requestSentMessage(friendName));
    } finally {
      setSubmittingFriendId(null);
    }
  };

  const onCopyInviteLinkPress = useCallback(async () => {
    let link = inviteLink;
    if (!link) {
      const { data, isError } = await refetchInviteLink();
      if (isError || !data) {
        showToast('fail', inviteLinkErrorMessage ?? addFriendScreenStrings.linkUnavailable);
        return;
      }
      link = data;
    }
    try {
      await Clipboard.setStringAsync(link);
      showToast('success', addFriendScreenStrings.success.copiedLink);
    } catch {
      showToast('fail', addFriendScreenStrings.errors.copyFailed);
    }
  }, [inviteLink, inviteLinkErrorMessage, refetchInviteLink, showToast]);

  const onShareInviteLinkPress = useCallback(async () => {
    let link = inviteLink;
    if (!link) {
      const { data, isError } = await refetchInviteLink();
      if (isError || !data) {
        showToast('fail', inviteLinkErrorMessage ?? addFriendScreenStrings.linkUnavailable);
        return;
      }
      link = data;
    }
    try {
      await Share.share({ message: link, url: link });
    } catch {
      showToast('fail', addFriendScreenStrings.errors.shareFailed);
    }
  }, [inviteLink, inviteLinkErrorMessage, refetchInviteLink, showToast]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    searchError,
    hasSearched,
    submittingFriendId,
    onSearchPress: handleSearch,
    onAddFriendPress,
    inviteLink,
    inviteLinkLoading,
    inviteLinkErrorMessage,
    onCopyInviteLinkPress,
    onShareInviteLinkPress,
    onBackPress: () => navigation.goBack(),
    onNotificationPress: () => undefined,
    strings: addFriendScreenStrings,
  };
}

export type UseAddFriendScreenReturn = ReturnType<typeof useAddFriendScreen>;
