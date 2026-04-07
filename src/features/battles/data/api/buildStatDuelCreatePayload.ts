import type {
  BattleMode,
  StatDuelOpponent,
  StatDuelPlayer,
  StatDuelStatCategory,
} from '@/shared/types';
import type { BattleVisibilityParam, StatDuelGameParam } from '@/shared/types/navigation';
import type { CreateBattlePayload } from './types';

type BuildStatDuelCreateInput = {
  battleMode: BattleMode | null | undefined;
  visibility: BattleVisibilityParam | null;
  sport: string | null | undefined;
  game: StatDuelGameParam | null | undefined;
  player: StatDuelPlayer | null | undefined;
  statCategory: StatDuelStatCategory | null | undefined;
  stake: string | undefined;
  opponent: StatDuelOpponent | null | undefined;
  direction: string | null | undefined;
  /** Fantasy week label when not "Auto" (from stat duel store). */
  week: string | null | undefined;
};

/** Maps app stat-duel wizard state → POST /battles body (see docs/BATTLE.md). */
export function buildStatDuelCreatePayload(input: BuildStatDuelCreateInput): CreateBattlePayload {
  const isFantasy = input.battleMode === 'FANTASY';
  const isStandard =
    input.battleMode === 'STANDARD' ||
    input.battleMode === 'BOTH_PICKS' ||
    input.battleMode == null;

  const statId = input.statCategory?.id ?? '';
  const expectation = buildStatDuelExpectation(statId, input.direction, isFantasy);

  const visibility =
    input.visibility === 'private'
      ? 'private'
      : input.visibility === 'crew'
        ? 'public'
        : 'public';

  const stakeAmount = Math.max(0, parseInt(input.stake ?? '0', 10) || 0);

  const modeForApi: string =
    input.battleMode === 'FANTASY'
      ? 'FANTASY'
      : input.battleMode === 'BOTH_PICKS'
        ? 'BOTH_PICKS'
        : 'STANDARD';

  const weekFromStore =
    input.week && input.week !== 'Auto' ? input.week : undefined;

  return {
    type: 'STAT_DUEL',
    mode: modeForApi,
    stakeAmount,
    visibility,
    playerId: input.player?.id ?? null,
    expectation,
    eventId: isStandard ? input.game?.id ?? null : null,
    sport: isFantasy ? input.sport ?? null : null,
    week: isFantasy ? weekFromStore ?? null : null,
    opponentId:
      input.visibility === 'private' && input.opponent?.id ? input.opponent.id : null,
    initialMetadata: {
      statCategoryName: input.statCategory?.name,
      statCategoryId: input.statCategory?.id,
      playerName: input.player?.name,
      gameName: input.game?.name,
      direction: input.direction,
      battleMode: input.battleMode,
    },
  };
}

function buildStatDuelExpectation(
  statCategoryId: string,
  direction: string | null | undefined,
  isFantasy: boolean,
): string {
  if (!statCategoryId) {
    return '';
  }
  if (isFantasy || !direction) {
    return `most_${statCategoryId}`;
  }
  const dir = direction === 'LEAST' ? 'least' : 'most';
  return `${dir}_${statCategoryId}`;
}
