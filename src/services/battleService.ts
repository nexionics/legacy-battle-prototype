import { supabase } from '../lib/supabaseClient';

export type Battle = {
  id: string;
  creator_id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  stake: number;
  status: 'open' | 'active' | 'completed' | 'canceled';
  created_at: string;
  winner_id: string | null;
  resolved_at: string | null;
  final_outcome: Record<string, any> | null;
};

export type BattleParticipant = {
  id: string;
  battle_id?: string;
  user_id: string;
  pick: string | null;
  joined_at: string;
};

export type JoinBattleParams = {
  battleId: string;
  userId: string;
  pick: string;
};

export type CreateBattleParams = {
  creatorId: string;
  title: string;
  description?: string;
  eventId?: string;
  stake?: number;
};

export const BattleService = {
  createBattle: async ({ creatorId, title, description, eventId, stake }: CreateBattleParams) => {
    const { data, error } = await supabase
      .from('battles')
      .insert({
        creator_id: creatorId,
        title,
        description: description || null,
        event_id: eventId || null,
        stake: stake || 0,
      })
      .select()
      .single();

    return { data, error };
  },

  getBattles: async () => {
    return await supabase
      .from('battles')
      .select('*')
      .order('created_at', { ascending: false });
  },

  getBattlesByStatus: async (status: Battle['status']) => {
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

  subscribeToBattles: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:battles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'battles' },
        callback
      )
      .subscribe();
  },

  getBattleWithParticipants: async (battleId: string) => {
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
      .select('id, user_id, pick, joined_at')
      .eq('battle_id', battleId)
      .order('joined_at', { ascending: true });

    return { battle, participants: participants || [], error: participantsError };
  },

  joinBattle: async ({ battleId, userId, pick }: JoinBattleParams) => {
    const { data, error } = await supabase
      .from('battle_participants')
      .insert({
        battle_id: battleId,
        user_id: userId,
        pick,
      })
      .select()
      .single();

    if (error) {
      return { data, error };
    }

    const { data: participants, error: participantsError } = await supabase
      .from('battle_participants')
      .select('id')
      .eq('battle_id', battleId);

    if (!participantsError && (participants?.length || 0) >= 2) {
      await supabase
        .from('battles')
        .update({ status: 'active' })
        .eq('id', battleId);
    }

    return { data, error };
  },

  subscribeToParticipants: (battleId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`battle_participants:${battleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battle_participants',
          filter: `battle_id=eq.${battleId}`,
        },
        callback
      )
      .subscribe();
  },
};
