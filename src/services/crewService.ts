import { supabase } from '../lib/supabaseClient';

export type CrewRequestStatus = 'pending' | 'accepted' | 'rejected';

export type CrewRequest = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: CrewRequestStatus;
  created_at: string;
  updated_at: string;
};

export type CrewMember = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type CrewRequestWithProfile = CrewRequest & {
  sender?: CrewMember;
  receiver?: CrewMember;
};

export const CrewService = {
  sendRequest: async (receiverId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
      .from('crew_requests')
      .insert({ sender_id: user.id, receiver_id: receiverId })
      .select()
      .single();

    return { data, error };
  },

  acceptRequest: async (requestId: string) => {
    const { data, error } = await supabase
      .from('crew_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    return { data, error };
  },

  rejectRequest: async (requestId: string) => {
    const { data, error } = await supabase
      .from('crew_requests')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    return { data, error };
  },

  removeCrewMember: async (requestId: string) => {
    const { error } = await supabase
      .from('crew_requests')
      .delete()
      .eq('id', requestId);

    return { error };
  },

  getCrewMembers: async (userId: string): Promise<{ data: CrewMember[]; error: any }> => {
    const { data: requests, error } = await supabase
      .from('crew_requests')
      .select('sender_id, receiver_id')
      .eq('status', 'accepted')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error || !requests || requests.length === 0) {
      return { data: [], error };
    }

    const memberIds = requests.map((r) =>
      r.sender_id === userId ? r.receiver_id : r.sender_id
    );

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', memberIds);

    return { data: profiles || [], error: profileError };
  },

  getPendingReceived: async (userId: string): Promise<{ data: CrewRequestWithProfile[]; error: any }> => {
    const { data, error } = await supabase
      .from('crew_requests')
      .select('*')
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [], error };
    }

    const senderIds = data.map((r) => r.sender_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', senderIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enriched: CrewRequestWithProfile[] = data.map((r) => ({
      ...r,
      sender: profileMap.get(r.sender_id) || undefined,
    }));

    return { data: enriched, error: null };
  },

  getPendingSent: async (userId: string): Promise<{ data: CrewRequestWithProfile[]; error: any }> => {
    const { data, error } = await supabase
      .from('crew_requests')
      .select('*')
      .eq('sender_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [], error };
    }

    const receiverIds = data.map((r) => r.receiver_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', receiverIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enriched: CrewRequestWithProfile[] = data.map((r) => ({
      ...r,
      receiver: profileMap.get(r.receiver_id) || undefined,
    }));

    return { data: enriched, error: null };
  },

  getRequestStatus: async (userId: string, otherUserId: string): Promise<CrewRequest | null> => {
    const { data } = await supabase
      .from('crew_requests')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .limit(1)
      .maybeSingle();

    return data;
  },

  getBattleSuggestions: async (userId: string): Promise<{ data: CrewMember[]; error: any }> => {
    const { data: participants, error: partError } = await supabase
      .from('battle_participants')
      .select('battle_id')
      .eq('user_id', userId);

    if (partError || !participants || participants.length === 0) {
      return { data: [], error: partError };
    }

    const battleIds = participants.map((p) => p.battle_id);

    const { data: coParticipants, error: coError } = await supabase
      .from('battle_participants')
      .select('user_id')
      .in('battle_id', battleIds)
      .neq('user_id', userId);

    if (coError || !coParticipants || coParticipants.length === 0) {
      return { data: [], error: coError };
    }

    const uniqueUserIds = [...new Set(coParticipants.map((p) => p.user_id))];

    const { data: existingRequests } = await supabase
      .from('crew_requests')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    const connectedIds = new Set<string>();
    (existingRequests || []).forEach((r) => {
      connectedIds.add(r.sender_id === userId ? r.receiver_id : r.sender_id);
    });

    const suggestableIds = uniqueUserIds.filter((id) => !connectedIds.has(id));

    if (suggestableIds.length === 0) {
      return { data: [], error: null };
    }

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', suggestableIds)
      .limit(10);

    return { data: profiles || [], error: profileError };
  },

  searchUsers: async (query: string, currentUserId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .neq('id', currentUserId)
      .limit(10);

    return { data: data || [], error };
  },
};
