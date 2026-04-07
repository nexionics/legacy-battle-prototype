import { useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { battlesStrings } from '@/features/battles/string';
import { useAuth } from '@/shared/hooks/useAuth';
import { deriveTeamsFromTitle } from '@/shared/utils';
import { useBattleDetail } from './useBattleDetail';
import type { BattleDetailScreenProps } from '@/shared/types';

export type BattleDetailScreenViewProps = ReturnType<typeof useBattleDetailScreen>;

export function useBattleDetailScreen({
  navigation,
  route,
}: Pick<BattleDetailScreenProps, 'navigation' | 'route'>) {
  const { user } = useAuth();
  const battleId = route.params?.battleId;

  const {
    battle,
    participants,
    gameScore,
    isLoading: detailLoading,
    pick,
    setPick,
    joinBattle,
    joining,
  } = useBattleDetail(battleId);

  const alreadyJoined = useMemo(
    () => participants.some((p) => p.user_id === user?.id),
    [participants, user?.id],
  );
  const isCreator = battle?.creator_id === user?.id;
  const canJoin = battle?.status === 'open' && !alreadyJoined && !isCreator;

  const { home: derivedHomeTeam, away: derivedAwayTeam } = deriveTeamsFromTitle(battle?.title);
  const homeTeamName = gameScore?.strHomeTeam || derivedHomeTeam;
  const awayTeamName = gameScore?.strAwayTeam || derivedAwayTeam;

  const creatorParticipant = participants.find((p) => p.user_id === battle?.creator_id);
  const creatorWinningTeam = creatorParticipant?.pick;

  const isHeadToHeadBattle = Boolean(creatorParticipant && homeTeamName && awayTeamName);

  const joinerWinningTeam = useMemo(() => {
    if (!homeTeamName || !awayTeamName || !creatorWinningTeam) return null;
    if (creatorWinningTeam === homeTeamName) return awayTeamName;
    if (creatorWinningTeam === awayTeamName) return homeTeamName;
    return null;
  }, [homeTeamName, awayTeamName, creatorWinningTeam]);

  const isHeadToHeadReady = isHeadToHeadBattle && Boolean(joinerWinningTeam);

  useEffect(() => {
    if (canJoin && joinerWinningTeam) {
      setPick(joinerWinningTeam);
    }
  }, [canJoin, joinerWinningTeam, setPick]);

  const handleJoin = useCallback(async () => {
    let effectivePick = pick.trim();

    if (isHeadToHeadReady && joinerWinningTeam) {
      effectivePick = joinerWinningTeam;
    }

    if (!effectivePick) {
      Alert.alert(battlesStrings.alerts.joinPickRequiredTitle, battlesStrings.alerts.joinPickRequiredBody);
      return;
    }

    if (!user) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.joinLoginRequired);
      return;
    }

    try {
      await joinBattle(effectivePick);
      setPick('');
      Alert.alert(battlesStrings.alerts.joinSuccessTitle, battlesStrings.alerts.joinSuccessBody);
    } catch (e) {
      Alert.alert(
        battlesStrings.alerts.joinFailedTitle,
        e instanceof Error ? e.message : battlesStrings.alerts.joinUnknownError,
      );
    }
  }, [
    pick,
    isHeadToHeadReady,
    joinerWinningTeam,
    user,
    joinBattle,
    setPick,
  ]);

  const matchEnded =
    gameScore && gameScore.intHomeScore !== null && gameScore.intAwayScore !== null;
  const pendingResolution = battle?.status === 'active' && matchEnded;

  const getWinnerName = useCallback(
    (winnerId: string | null) => {
      if (!winnerId) return battlesStrings.battleDetail.noWinner;
      const winner = participants.find((p) => p.user_id === winnerId);
      if (winner?.user_id === user?.id) return battlesStrings.battleDetail.you;
      return battlesStrings.battleDetail.playerPreview(winnerId.slice(0, 8));
    },
    [participants, user?.id],
  );

  const winnerName = battle ? getWinnerName(battle.winner_id) : battlesStrings.battleDetail.noWinner;

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    user,
    battle,
    participants,
    gameScore,
    detailLoading,
    pick,
    setPick,
    joining,
    isCreator: Boolean(isCreator),
    canJoin: Boolean(canJoin),
    alreadyJoined,
    isHeadToHeadBattle,
    isHeadToHeadReady,
    creatorWinningTeam,
    joinerWinningTeam,
    homeTeamName: homeTeamName ?? '',
    awayTeamName: awayTeamName ?? '',
    pendingResolution: Boolean(pendingResolution),
    winnerName,
    handleJoin,
    onBack,
  };
}
