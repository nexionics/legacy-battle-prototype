import { useCallback, useMemo } from 'react';
import type { StatDuelOpponentScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import { MOCK_OPPONENTS } from '@/shared/constants';

export type StatDuelOpponentScreenViewProps = ReturnType<typeof useStatDuelOpponentScreen>;

export function useStatDuelOpponentScreen({
  navigation,
  route,
}: Pick<StatDuelOpponentScreenProps, 'navigation' | 'route'>) {
  const { visibility, battleMode, sport, game, player, statCategory, stake } = route?.params || {};

  const opponentSearchQuery = useStatDuelStore((s) => s.opponentSearchQuery);
  const selectedOpponent = useStatDuelStore((s) => s.selectedOpponent);
  const setOpponentSearchQuery = useStatDuelStore((s) => s.setOpponentSearchQuery);
  const setSelectedOpponent = useStatDuelStore((s) => s.setSelectedOpponent);

  const filteredOpponents = useMemo(
    () =>
      MOCK_OPPONENTS.filter(
        (o) =>
          o.display_name.toLowerCase().includes(opponentSearchQuery.toLowerCase()) ||
          (o.username?.toLowerCase().includes(opponentSearchQuery.toLowerCase()) ?? false),
      ),
    [opponentSearchQuery],
  );

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
    opponentSearchQuery,
    selectedOpponent,
    setOpponentSearchQuery,
    setSelectedOpponent,
    filteredOpponents,
    canContinue,
    onContinue,
    onBack,
  };
}
