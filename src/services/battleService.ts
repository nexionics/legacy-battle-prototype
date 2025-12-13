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
};
