import type { Battle, BattleParticipant, BattleStatus, ExploreBattle } from '@/shared/types';
import type {
  BattleDetailDto,
  BattleListItemDto,
  BattleParticipantDetailDto,
} from './types';

export function mapApiBattleStatus(status: string): BattleStatus {
  const s = status.toLowerCase();
  if (s === 'pending') return 'open';
  if (s === 'active') return 'active';
  if (s === 'completed') return 'completed';
  if (s === 'canceled' || s === 'cancelled') return 'canceled';
  return 'open';
}

function listItemToBattle(row: BattleListItemDto, overrides?: Partial<Battle>): Battle {
  const title =
    row.event?.displayName?.trim() ||
    row.type.replace(/_/g, ' ') ||
    'Battle';
  return {
    id: row.id,
    creator_id: overrides?.creator_id ?? '',
    event_id: row.eventId,
    title,
    description: overrides?.description ?? null,
    stake: row.stakeAmount,
    status: mapApiBattleStatus(row.status),
    created_at: row.createdAt,
    winner_id: row.winnerId,
    resolved_at: row.resolvedAt,
    final_outcome:
      row.finalOutcome !== null && row.finalOutcome !== undefined
        ? (row.finalOutcome as Record<string, unknown>)
        : null,
    visibility: (row.visibility as Battle['visibility']) ?? 'public',
  };
}

export function mapBattleListItemToExploreBattle(row: BattleListItemDto): ExploreBattle {
  const base = listItemToBattle(row);
  return {
    ...base,
    participant_count: row._count?.participants ?? 0,
  };
}

export function mapParticipantDto(p: BattleParticipantDetailDto): BattleParticipant {
  return {
    id: p.id,
    battle_id: p.battleId,
    user_id: p.userId,
    pick: p.pick,
    joined_at: p.createdAt,
    is_winner: p.isWinner,
  };
}

export function mapBattleDetailDto(d: BattleDetailDto): {
  battle: Battle;
  participants: BattleParticipant[];
} {
  const summaryShape: BattleListItemDto = {
    id: d.id,
    eventId: d.eventId,
    type: d.type,
    status: d.status,
    winnerId: d.winnerId,
    visibility: d.visibility,
    mode: d.mode,
    sport: d.sport,
    week: d.week,
    stakeAmount: d.stakeAmount,
    statCategoryId: d.statCategoryId,
    finalOutcome: d.finalOutcome,
    resolvedAt: d.resolvedAt,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    ruleSetId: d.ruleSetId,
    event: d.event,
    _count: { participants: d.participants?.length ?? 0 },
  };
  const creatorId = d.participants[0]?.userId ?? '';
  const battle = listItemToBattle(summaryShape, { creator_id: creatorId });
  const participants = (d.participants ?? []).map(mapParticipantDto);
  return { battle, participants };
}
