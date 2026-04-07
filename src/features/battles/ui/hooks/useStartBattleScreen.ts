import { useCallback, useMemo } from 'react';
import { battlesStrings } from '@/features/battles/string';
import type { Sport, BattleCategory, StartBattleScreenProps } from '@/shared/types';
import { useBattlesStore } from '@/features/battles/data/store/battles.store';

export type StartBattleScreenViewProps = ReturnType<typeof useStartBattleScreen>;

export function useStartBattleScreen({
  navigation,
}: Pick<StartBattleScreenProps, 'navigation'>) {
  const selectedSport = useBattlesStore((s) => s.selectedSport);
  const setSelectedSport = useBattlesStore((s) => s.setSelectedSport);

  const onSportSelect = useCallback(
    (sport: Sport['id']) => {
      setSelectedSport(sport);
    },
    [setSelectedSport],
  );

  const onCategorySelect = useCallback(
    (category: BattleCategory) => {
      if (!category.enabled || !selectedSport) return;

      navigation.navigate('AllUpcomingGames', {
        initialSport: selectedSport,
        mode: category.id,
      });
    },
    [navigation, selectedSport],
  );

  const onBack = useCallback(() => {
    if (selectedSport) {
      setSelectedSport(null);
    } else {
      navigation.goBack();
    }
  }, [navigation, selectedSport, setSelectedSport]);

  const headerTitle = useMemo(() => {
    if (selectedSport === 'SKILLS') return battlesStrings.startBattle.headerSkills;
    if (selectedSport) return battlesStrings.startBattle.headerSelectType;
    return battlesStrings.startBattle.headerSelectSport;
  }, [selectedSport]);

  return {
    selectedSport,
    onSportSelect,
    onCategorySelect,
    onBack,
    headerTitle,
  };
}
