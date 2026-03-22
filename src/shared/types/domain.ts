export type UserProfile = {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  favoriteSports: string[];
  xp: number;
  level: string;
  wins: number;
  losses: number;
  challenges: number;
  walletBalance?: number;
  createdAt: string;
  updatedAt: string;
};

export type BattleStatus = 'open' | 'active' | 'completed' | 'canceled';

export type Battle = {
  id: string;
  creator_id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  stake: number;
  status: BattleStatus;
  created_at: string;
  winner_id: string | null;
  resolved_at: string | null;
  final_outcome: Record<string, unknown> | null;
  visibility?: 'private' | 'public' | 'crew';
};

export type BattleParticipant = {
  id: string;
  battle_id?: string;
  user_id: string;
  pick: string | null;
  joined_at: string;
  is_winner?: boolean | null;
};

export type SportsTeam = {
  id: string;
  display_name: string | null;
  abbreviation: string | null;
  logo_url: string | null;
};

export type SportsEvent = {
  idEvent: string;
  strEvent: string;
  strSport: string;
  strLeague: string;
  strLeagueBadge: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strTimestamp: string;
  dateEvent: string;
  strTime: string;
  strTimeLocal: string;
  idHomeTeam: string;
  strHomeTeamBadge: string;
  idAwayTeam: string;
  strAwayTeamBadge: string;
  strVenue: string;
  strCity: string;
  strPoster: string | null;
  strThumb: string | null;
  strStatus: string;
};

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

export type XpEvent = {
  id: string;
  user_id: string;
  xp: number;
  reason?: string | null;
  created_at: string;
};
