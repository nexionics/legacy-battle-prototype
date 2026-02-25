export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  OTPVerification: undefined;
  CreateUsername: undefined;
};

export type TabParamList = {
  Home: undefined;
  Battles: undefined;
  BattleNow: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  CreateBattle: undefined;
  BattleDetail: { battleId: string };
  AllResults: { initialSport?: string } | undefined;
  AllUpcomingGames: { initialSport?: string } | undefined;
  StartBattle: undefined;
  BattleType: undefined;
  DevDebug: undefined;
  Friends: undefined;
  BattleVisibility: {
    prefillTitle?: string;
    prefillEventId?: string;
    homeTeam?: string;
    awayTeam?: string;
  } | undefined;
  AddFriend: undefined;
  StatDuelMode: undefined;
  StatDuelDetails: undefined;
  StatDuelChampion: undefined;
  StatDuelOpponent: undefined;
  StatDuelConfirm: undefined;
};

export type RootStackParamList = AuthStackParamList & {
  MainTabs: undefined;
  DevDebug: undefined;
};
