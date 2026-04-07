import { useCallback, useMemo } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@/app/navigation/types';
import { colors } from '@/shared/theme';
import { useBattlesStore } from '@/features/battles/data/store/battles.store';
import type { BattleTypeOption } from '@/shared/types';
import { BATTLE_TYPES } from '@/shared/constants';

const resolveBattleTypes = (): BattleTypeOption[] =>
  BATTLE_TYPES.map((t) => ({
    ...t,
    iconColor:
      t.iconColor in colors ? (colors as Record<string, string>)[t.iconColor] : t.iconColor,
    badgeColor:
      t.badgeColor in colors ? (colors as Record<string, string>)[t.badgeColor] : t.badgeColor,
  })) as BattleTypeOption[];

const BATTLE_TYPES_RESOLVED = resolveBattleTypes();

export type BattleTypeScreenViewProps = ReturnType<typeof useBattleTypeScreen>;

export function useBattleTypeScreen(navigation: NativeStackNavigationProp<AppStackParamList>) {
  const selectedType = useBattlesStore((s) => s.selectedType);
  const setSelectedType = useBattlesStore((s) => s.setSelectedType);

  const battleTypes = useMemo(() => BATTLE_TYPES_RESOLVED, []);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSelectType = useCallback(
    (type: BattleTypeOption) => {
      if (!type.enabled) {
        return;
      }
      setSelectedType(type.id);

      if (type.id === 'GAME_DUEL') {
        navigation.navigate('StartBattle');
      } else if (type.id === 'STAT_DUEL') {
        navigation.navigate('StatDuelMode');
      }
    },
    [navigation, setSelectedType],
  );

  return {
    selectedType,
    battleTypes,
    onBack,
    onSelectType,
  };
}
