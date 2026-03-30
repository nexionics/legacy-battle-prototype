export type CrewApiRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type CrewMemberFilter = 'all' | 'active' | 'rivals';

export type CrewRequestResponseStatus = Extract<
  CrewApiRequestStatus,
  'accepted' | 'declined' | 'cancelled'
>;

export interface CrewUserSummary {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio?: string | null;
}

export interface CrewRequestUserSummary {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface CrewRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  status: CrewApiRequestStatus;
  createdAt: string;
  updatedAt: string;
  sender?: CrewRequestUserSummary;
  receiver?: CrewRequestUserSummary;
}

export interface CrewRequestStatusData {
  status: CrewApiRequestStatus;
  isSender: boolean;
  requestId: string;
}

export interface CrewUserWithStatus extends CrewUserSummary {
  requestStatus?: CrewApiRequestStatus;
  requestId?: string;
  isSender?: boolean;
}
