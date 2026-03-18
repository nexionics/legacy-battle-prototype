import type { GestureResponderEvent } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

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

/** Props for the custom Battle Now tab bar button. */
export interface CustomTabBarButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

/** Props for the MainTabs screen (tab navigator) when used inside the root stack. */
export type MainTabsScreenProps = RootStackScreenProps<'MainTabs'>;
