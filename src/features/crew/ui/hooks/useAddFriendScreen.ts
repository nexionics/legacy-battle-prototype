import { useState } from 'react';
import { Alert, Linking, Share } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { useAuth } from '@/shared/hooks/useAuth';
import type { AddFriendScreenProps } from '@/shared/types';
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

  const onInviteViaTextPress = async () => {
    const message = addFriendScreenStrings.inviteMessage;
    const url = `sms:&body=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return;
      }
      await Share.share({ message });
    } catch {
      await Share.share({ message });
    }
  };

  const onInviteViaEmailPress = async () => {
    const url = `mailto:?subject=${encodeURIComponent(addFriendScreenStrings.inviteEmailSubject)}&body=${encodeURIComponent(addFriendScreenStrings.inviteEmailBody)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          addFriendScreenStrings.alerts.genericTitle,
          addFriendScreenStrings.alerts.emailUnavailable,
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        addFriendScreenStrings.alerts.genericTitle,
        addFriendScreenStrings.alerts.emailOpenFailed,
      );
    }
  };

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
    onInviteViaTextPress,
    onInviteViaEmailPress,
    onBackPress: () => navigation.goBack(),
    strings: addFriendScreenStrings,
  };
}

export type UseAddFriendScreenReturn = ReturnType<typeof useAddFriendScreen>;
