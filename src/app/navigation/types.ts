import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  OTPVerification: undefined;
  CreateUsername: undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Battles: undefined;
  BattleNow: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CreateBattle: undefined;
  BattleDetail: { battleId: string };
  AllResults: { initialSport?: string } | undefined;
  AllUpcomingGames: { initialSport?: string } | undefined;
  StartBattle: undefined;
  BattleType: undefined;
  DevDebug: undefined;
  Friends: undefined;
  BattleVisibility:
    | {
        prefillTitle?: string;
        prefillEventId?: string;
        homeTeam?: string;
        awayTeam?: string;
      }
    | undefined;
  AddFriend: undefined;
  StatDuelMode: undefined;
  StatDuelDetails: undefined;
  StatDuelChampion: undefined;
  StatDuelOpponent: undefined;
  StatDuelConfirm: undefined;
};

export type AuthScreenProps<ScreenName extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, ScreenName>;

export type TabScreenProps<ScreenName extends keyof TabStackParamList> =
  BottomTabScreenProps<TabStackParamList, ScreenName>;

export type RootStackScreenProps<ScreenName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, ScreenName>;

export type AppStackParamList = RootStackParamList;
export type TabParamList = TabStackParamList;
