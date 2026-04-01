import { useBattleQuery } from '../../data/queries';
import { useBattlesStore } from '../../data/store/battles.store';
import { useJoinBattle } from '../../data/mutations/useJoinBattle';
import { useResultByEventIdQuery } from '@/features/sports/data/queries/useResultByEventIdQuery';

export function useBattleDetail(battleId: string | undefined) {
  const battleQuery = useBattleQuery(battleId);
  const { battle, participants, error } = battleQuery.data ?? {
    battle: null,
    participants: [],
    error: null,
  };
  const gameScoreQuery = useResultByEventIdQuery(battle?.event_id ?? undefined);
  const { pick, setPick } = useBattlesStore();
  const joinMutation = useJoinBattle(battleId);

  return {
    battle,
    participants,
    gameScore: gameScoreQuery.data ?? null,
    isLoading: battleQuery.isLoading,
    error,
    pick,
    setPick,
    joinBattle: joinMutation.mutateAsync,
    joining: joinMutation.isPending,
  };
}
