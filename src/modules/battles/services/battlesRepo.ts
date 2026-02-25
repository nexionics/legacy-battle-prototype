import { supabase } from '@/shared/lib/supabaseClient';
import type { Battle, BattleParticipant, BattleStatus } from '@/shared/types';

export type BattleWithParticipants = {
  battle: Battle | null;
  participants: BattleParticipant[];
  error: unknown;
};

export type ExploreBattle = Battle & { participant_count?: number };
type ExploreBattleRow = ExploreBattle & { battle_participants?: { count: number }[] };

export const BattlesRepo = {
  getBattles: async () => {
    return await supabase
      .from('battles')
      .select('*')
      .order('created_at', { ascending: false });
  },

  getBattlesByStatus: async (status: BattleStatus) => {
    return await supabase
      .from('battles')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
  },

  getUserBattles: async (userId: string) => {
    return await supabase
      .from('battles')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });
  },

  getMyAcceptedBattles: async (userId: string, limit = 5) => {
    return await supabase
      .from('battles')
      .select('*, battle_participants(*)')
      .eq('creator_id', userId)
      .in('status', ['active', 'completed'])
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  getQuickPickBattles: async (userId: string, limit = 5) => {
    return await supabase
      .from('battles')
      .select('*, battle_participants(*)')
      .eq('status', 'open')
      .neq('creator_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  getBattleWithParticipants: async (battleId: string): Promise<BattleWithParticipants> => {
    const { data: battle, error: battleError } = await supabase
      .from('battles')
      .select('*')
      .eq('id', battleId)
      .single();

    if (battleError) {
      return { battle: null, participants: [], error: battleError };
    }

    const { data: participants, error: participantsError } = await supabase
      .from('battle_participants')
      .select('id, user_id, pick, joined_at, is_winner')
      .eq('battle_id', battleId)
      .order('joined_at', { ascending: true });

    return { battle, participants: (participants || []) as BattleParticipant[], error: participantsError };
  },

  getExploreBattles: async (tab: 'Trending' | 'Ending Soon' | 'New' | 'High Activity') => {
    let query = supabase
      .from('battles')
      .select(
        `
          id,
          title,
          status,
          created_at,
          stake,
          event_id,
          battle_participants(count)
        `
      )
      .eq('status', 'open');

    if (tab === 'Ending Soon') {
      query = query.order('created_at', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query.limit(10);
    if (error || !data) return { data: [], error };

    const battlesWithCount: ExploreBattle[] = (data as ExploreBattleRow[]).map((b) => ({
      ...b,
      participant_count: b.battle_participants?.[0]?.count || 0,
    }));

    return { data: battlesWithCount, error: null };
  },
};
