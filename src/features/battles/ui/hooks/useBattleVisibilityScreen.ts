import { useCallback, useMemo } from 'react';
import type { BattleVisibilityScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';

export type BattleVisibilityScreenViewProps = ReturnType<typeof useBattleVisibilityScreen>;

export function useBattleVisibilityScreen({
  navigation,
  route,
}: Pick<BattleVisibilityScreenProps, 'navigation' | 'route'>) {
  const { prefillTitle, prefillEventId, homeTeam, awayTeam } = route?.params || {};
  const setStatDuelVisibility = useStatDuelStore((s) => s.setVisibility);

  const hasGameData = useMemo(
    () => Boolean(prefillTitle && prefillEventId),
    [prefillTitle, prefillEventId],
  );

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSelectVisibility = useCallback(
    (visibility: 'private' | 'public' | 'crew') => {
      setStatDuelVisibility(visibility);
      if (hasGameData) {
        navigation.navigate('CreateBattle', {
          prefillTitle,
          prefillEventId,
          homeTeam,
          awayTeam,
          visibility,
        });
      } else {
        navigation.navigate('BattleType', { visibility });
      }
    },
    [
      navigation,
      hasGameData,
      prefillTitle,
      prefillEventId,
      homeTeam,
      awayTeam,
      setStatDuelVisibility,
    ],
  );

  return { onBack, onSelectVisibility };
}
