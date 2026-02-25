import { supabase } from '@/shared/lib/supabaseClient';
import type { Battle, BattleParticipant } from '@/shared/types';

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
  creatorPick?: string;
  visibility?: 'private' | 'public' | 'crew';
};

export const BattleService = {
  createBattle: async ({ creatorId, title, description, eventId, stake, creatorPick, visibility }: CreateBattleParams) => {
    const { data: battle, error } = await supabase
      .from('battles')
      .insert({
        creator_id: creatorId,
        title,
        description: description || null,
        event_id: eventId || null,
        stake: stake || 0,
        visibility: visibility || 'public',
      })
      .select()
      .single();

    if (error || !battle) {
      return { data: battle, error };
    }

    if (creatorPick) {
      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battle.id,
          user_id: creatorId,
          pick: creatorPick,
        });

      if (participantError) {
        console.error('Error inserting creator participant:', participantError);
      }
    }

    return { data: battle, error };
  },

  subscribeToBattles: (callback: (payload: any) => void) => {
    // Realtime keeps battle lists fresh without client-side polling.
    return supabase
      .channel('public:battles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'battles' },
        callback
      )
      .subscribe();
  },

  joinBattle: async ({ battleId, userId, pick }: JoinBattleParams) => {
    const { data: battle, error: battleError } = await supabase
      .from('battles')
      .select('creator_id, visibility')
      .eq('id', battleId)
      .single();

    if (battleError || !battle) {
      return { data: null, error: battleError || { message: 'Battle not found' } };
    }

    if (battle.visibility === 'crew') {
      const { data: crewLink } = await supabase
        .from('crew_requests')
        .select('id')
        .eq('status', 'accepted')
        .or(
          `and(requester_id.eq.${battle.creator_id},requested_id.eq.${userId}),and(requester_id.eq.${userId},requested_id.eq.${battle.creator_id})`
        )
        .limit(1)
        .maybeSingle();

      if (!crewLink) {
        return { data: null, error: { message: 'This battle is crew-only. You must be in the creator\'s crew to join.' } };
      }
    }

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
    // Realtime participant updates drive live battle detail refreshes.
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

  removeChannel: (channel: ReturnType<typeof supabase.channel>) => {
    supabase.removeChannel(channel);
  },

};
