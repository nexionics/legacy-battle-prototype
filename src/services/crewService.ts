import { supabase } from '../lib/supabaseClient';

export type CrewRequestStatus = 'pending' | 'accepted' | 'declined' | 'canceled';

export type CrewRequest = {
  id: string;
  requester_id: string;
  requested_id: string;
  status: CrewRequestStatus;
  created_at: string;
  responded_at: string | null;
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
  sendRequest: async (username: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: { message: 'Not authenticated' } };

    const { data, error } = await supabase.functions.invoke('crew-request', {
      body: { username },
    });

    if (error) {
      return { data: null, error: { message: error.message || 'Failed to send request' } };
    }

    if (data?.error) {
      return { data: null, error: { message: data.error, code: data.existingStatus === 'pending' ? '23505' : undefined } };
    }

    return { data: data?.request ?? null, error: null };
  },

  sendRequestById: async (receiverId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: { message: 'Not authenticated' } };

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', receiverId)
      .single();

    if (!profile?.username) {
      return { data: null, error: { message: 'Could not find user' } };
    }

    return CrewService.sendRequest(profile.username);
  },

  respondToRequest: async (requestId: string, action: 'accept' | 'decline' | 'cancel') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: { message: 'Not authenticated' } };

    const { data, error } = await supabase.functions.invoke('crew-respond', {
      body: { request_id: requestId, action },
    });

    if (error) {
      return { data: null, error: { message: error.message || 'Failed to respond' } };
    }

    if (data?.error) {
      return { data: null, error: { message: data.error } };
    }

    return { data, error: null };
  },

  acceptRequest: async (requestId: string) => {
    return CrewService.respondToRequest(requestId, 'accept');
  },

  declineRequest: async (requestId: string) => {
    return CrewService.respondToRequest(requestId, 'decline');
  },

  cancelRequest: async (requestId: string) => {
    return CrewService.respondToRequest(requestId, 'cancel');
  },

  getCrewMembers: async (userId: string): Promise<{ data: CrewMember[]; error: unknown }> => {
    const { data: members, error } = await supabase
      .from('crew_members')
      .select('crew_user_id')
      .eq('user_id', userId);

    if (error || !members || members.length === 0) {
      return { data: [], error };
    }

    const memberIds = members.map((m) => m.crew_user_id);

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', memberIds);

    return { data: profiles || [], error: profileError };
  },

  getPendingReceived: async (userId: string): Promise<{ data: CrewRequestWithProfile[]; error: unknown }> => {
    const { data, error } = await supabase
      .from('crew_requests')
      .select('*')
      .eq('requested_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [], error };
    }

    const requesterIds = data.map((r) => r.requester_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', requesterIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enriched: CrewRequestWithProfile[] = data.map((r) => ({
      ...r,
      sender: profileMap.get(r.requester_id) || undefined,
    }));

    return { data: enriched, error: null };
  },

  getPendingSent: async (userId: string): Promise<{ data: CrewRequestWithProfile[]; error: unknown }> => {
    const { data, error } = await supabase
      .from('crew_requests')
      .select('*')
      .eq('requester_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [], error };
    }

    const requestedIds = data.map((r) => r.requested_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', requestedIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enriched: CrewRequestWithProfile[] = data.map((r) => ({
      ...r,
      receiver: profileMap.get(r.requested_id) || undefined,
    }));

    return { data: enriched, error: null };
  },

  getRequestStatus: async (userId: string, otherUserId: string): Promise<CrewRequest | null> => {
    const { data } = await supabase
      .from('crew_requests')
      .select('*')
      .or(
        `and(requester_id.eq.${userId},requested_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},requested_id.eq.${userId})`
      )
      .in('status', ['pending', 'accepted'])
      .limit(1)
      .maybeSingle();

    return data;
  },

  getBattleSuggestions: async (userId: string): Promise<{ data: CrewMember[]; error: unknown }> => {
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

    const { data: crewRows } = await supabase
      .from('crew_members')
      .select('crew_user_id')
      .eq('user_id', userId);

    const { data: pendingRequests } = await supabase
      .from('crew_requests')
      .select('requester_id, requested_id')
      .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
      .in('status', ['pending', 'accepted']);

    const connectedIds = new Set<string>();
    (crewRows || []).forEach((r) => connectedIds.add(r.crew_user_id));
    (pendingRequests || []).forEach((r) => {
      connectedIds.add(r.requester_id === userId ? r.requested_id : r.requester_id);
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
