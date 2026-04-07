import { useCallback, useMemo, useState } from 'react';
import type { StatDuelOpponent, StatDuelOpponentScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import { MOCK_OPPONENTS } from '@/shared/constants';

export type StatDuelOpponentScreenViewProps = ReturnType<typeof useStatDuelOpponentScreen>;

export function useStatDuelOpponentScreen({
  navigation,
  route,
}: Pick<StatDuelOpponentScreenProps, 'navigation' | 'route'>) {
  const { visibility, battleMode, sport, game, player, statCategory, stake } = route?.params || {};

  const selectedOpponent = useStatDuelStore((s) => s.selectedOpponent);
  const setSelectedOpponent = useStatDuelStore((s) => s.setSelectedOpponent);

  const [opponentPickerOpen, setOpponentPickerOpen] = useState(false);
  const [sheetSearchQuery, setSheetSearchQuery] = useState('');

  const filteredSheetOpponents = useMemo(
    () =>
      MOCK_OPPONENTS.filter(
        (o) =>
          o.display_name.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ||
          (o.username?.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ?? false) ||
          (o.subtitle?.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ?? false),
      ),
    [sheetSearchQuery],
  );

  const openOpponentPicker = useCallback(() => {
    setSheetSearchQuery('');
    setOpponentPickerOpen(true);
  }, []);

  const closeOpponentPicker = useCallback(() => {
    setOpponentPickerOpen(false);
  }, []);

  const onSelectOpponentFromSheet = useCallback(
    (opponent: StatDuelOpponent) => {
      setSelectedOpponent(opponent);
      closeOpponentPicker();
    },
    [setSelectedOpponent, closeOpponentPicker],
  );

  const onAddFriendFromSheet = useCallback(() => {
    closeOpponentPicker();
    navigation.navigate('AddFriend');
  }, [navigation, closeOpponentPicker]);

  const canContinue = Boolean(selectedOpponent || visibility === 'public');

  const onContinue = useCallback(() => {
    navigation.navigate('StatDuelConfirm', {
      visibility,
      battleMode,
      sport,
      game,
      player,
      statCategory,
      stake,
      opponent: selectedOpponent,
    });
  }, [
    navigation,
    visibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    selectedOpponent,
  ]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelChampion', { visibility, battleMode, sport, game });
    }
  }, [navigation, visibility, battleMode, sport, game]);

  return {
    visibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    opponentPickerOpen,
    sheetSearchQuery,
    setSheetSearchQuery,
    openOpponentPicker,
    closeOpponentPicker,
    selectedOpponent,
    setSelectedOpponent,
    filteredSheetOpponents,
    onSelectOpponentFromSheet,
    onAddFriendFromSheet,
    canContinue,
    onContinue,
    onBack,
  };
}
