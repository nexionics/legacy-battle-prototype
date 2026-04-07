import { useCallback } from 'react';
import { Alert } from 'react-native';
import { battlesStrings } from '@/features/battles/string';
import type { StatDuelConfirmScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import { useCreateBattle } from '@/features/battles/data/mutations/useCreateBattle';
import { buildStatDuelCreatePayload } from '@/features/battles/data/api/buildStatDuelCreatePayload';
import { useAuth } from '@/shared/hooks/useAuth';

export type StatDuelConfirmScreenViewProps = ReturnType<typeof useStatDuelConfirmScreen>;

export function useStatDuelConfirmScreen({
  navigation,
  route,
}: Pick<StatDuelConfirmScreenProps, 'navigation' | 'route'>) {
  const { user } = useAuth();
  const {
    visibility: routeVisibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    opponent,
  } = route?.params || {};
  const storeVisibility = useStatDuelStore((s) => s.visibility);
  const direction = useStatDuelStore((s) => s.direction);
  const startTime = useStatDuelStore((s) => s.startTime);
  const reset = useStatDuelStore((s) => s.reset);

  const visibility = routeVisibility ?? storeVisibility ?? null;

  const createMutation = useCreateBattle();
  const isSubmitting = createMutation.isPending;

  const onCreateBattle = useCallback(async () => {
    if (!user) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createLoginRequired);
      return;
    }
    if (!player?.id || !statCategory?.id) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createGenericFailure);
      return;
    }
    if (visibility === 'private' && !opponent?.id) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createGenericFailure);
      return;
    }
    const needsEvent =
      battleMode === 'STANDARD' || battleMode === 'BOTH_PICKS' || battleMode == null;
    if (needsEvent && !game?.id) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createGenericFailure);
      return;
    }
    if ((battleMode === 'STANDARD' || battleMode === 'BOTH_PICKS') && !direction) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createGenericFailure);
      return;
    }

    const payload = buildStatDuelCreatePayload({
      battleMode,
      visibility,
      sport,
      game: game ?? null,
      player,
      statCategory,
      stake,
      opponent: opponent ?? null,
      direction,
      week: startTime,
    });

    try {
      await createMutation.mutateAsync(payload);
      reset();
      Alert.alert(battlesStrings.alerts.statDuelCreatedTitle, battlesStrings.alerts.statDuelCreatedBody, [
        { text: battlesStrings.common.ok, onPress: () => navigation.navigate('MainTabs') },
      ]);
    } catch (e) {
      Alert.alert(
        battlesStrings.common.failed,
        e instanceof Error ? e.message : battlesStrings.alerts.createGenericFailure,
      );
    }
  }, [
    user,
    battleMode,
    visibility,
    sport,
    game,
    player,
    statCategory,
    stake,
    opponent,
    direction,
    startTime,
    createMutation,
    reset,
    navigation,
  ]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelOpponent', {
        visibility: visibility ?? undefined,
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
