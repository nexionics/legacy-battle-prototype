import { useCallback } from 'react';
import { Alert } from 'react-native';
import { battlesStrings } from '@/features/battles/string';
import type { StatDuelConfirmScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';

export type StatDuelConfirmScreenViewProps = ReturnType<typeof useStatDuelConfirmScreen>;

export function useStatDuelConfirmScreen({
  navigation,
  route,
}: Pick<StatDuelConfirmScreenProps, 'navigation' | 'route'>) {
  const { visibility, battleMode, sport, game, player, statCategory, stake, opponent } =
    route?.params || {};

  const isSubmitting = useStatDuelStore((s) => s.isSubmitting);
  const setIsSubmitting = useStatDuelStore((s) => s.setIsSubmitting);
  const reset = useStatDuelStore((s) => s.reset);

  const onCreateBattle = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      reset();
      Alert.alert(battlesStrings.alerts.statDuelCreatedTitle, battlesStrings.alerts.statDuelCreatedBody, [
        { text: battlesStrings.common.ok, onPress: () => navigation.navigate('MainTabs') },
      ]);
    }, 1500);
  }, [navigation, reset, setIsSubmitting]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelOpponent', {
        visibility,
        battleMode,
        sport,
        game,
        player,
        statCategory,
        stake,
      });
    }
  }, [navigation, visibility, battleMode, sport, game, player, statCategory, stake]);

  return {
    visibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    opponent,
    isSubmitting,
    onCreateBattle,
    onBack,
  };
}
