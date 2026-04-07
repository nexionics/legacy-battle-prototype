import { useCallback, useEffect } from 'react';
import type { BattleMode, StatDuelModeScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';

export type StatDuelModeScreenViewProps = ReturnType<typeof useStatDuelModeScreen>;

export function useStatDuelModeScreen({
  navigation,
  route,
}: Pick<StatDuelModeScreenProps, 'navigation' | 'route'>) {
  const { visibility } = route?.params || {};
  const battleMode = useStatDuelStore((s) => s.battleMode);
  const setBattleMode = useStatDuelStore((s) => s.setBattleMode);
  const setVisibility = useStatDuelStore((s) => s.setVisibility);

  useEffect(() => {
    if (visibility) {
      setVisibility(visibility);
    }
  }, [visibility, setVisibility]);

  const onSelectMode = useCallback(
    (mode: BattleMode) => {
      setBattleMode(mode);
    },
    [setBattleMode],
  );

  const onContinue = useCallback(() => {
    if (battleMode) {
      navigation.navigate('StatDuelDetails', {
        visibility,
        battleMode,
      });
    }
  }, [navigation, visibility, battleMode]);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    battleMode,
    onSelectMode,
    onContinue,
    onBack,
    canContinue: Boolean(battleMode),
  };
}
