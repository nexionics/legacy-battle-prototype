import type { StyleProp, TextInputProps, TextProps, ViewStyle } from 'react-native';
import type { AuthHeaderVariant, IconNameEnum } from '@/shared/utils/enum';
import type { TypographyVariant } from '@/shared/theme';
import type { SportsEvent } from './domain';
import type { Battle, BattleParticipant } from './domain';
import type { LevelInfo } from './profile';
import type {
  CrewMemberFilter,
  CrewRequestItem,
  CrewUserSummary,
  CrewUserWithStatus,
} from './crew';

// ─── Shared UI Atoms ───────────────────────────────────────────────────────

export type ViewPropStyle = StyleProp<ViewStyle>;

export type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export interface DividerProps {
  label?: string;
  style?: ViewStyle;
}

export interface StatusBadgeProps {
  label: string;
  color: string;
  textColor?: string;
  style?: ViewStyle;
}

export interface IconCircleProps {
  size?: number;
  backgroundColor?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface AppTextProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  color?: string;
  style?: TextProps['style'];
}

// ─── Shared UI Molecules ───────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

export type ButtonProps = {
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  hitSlop?: { top?: number; bottom?: number; left?: number; right?: number } | number;
};

export type LabeledSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  required?: boolean;
  /** Lock icon + visibility toggle; internal state per field. Ignores `leftComponent` / `rightComponent` / `secureTextEntry`. */
  isPassword?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  wrapperStyle?: ViewStyle;
  inputTextStyle?: TextInputProps['style'];
  showSuccessBorder?: boolean;
  isFocused?: boolean;
};

export interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  centerIcon?: React.ReactNode;
  style?: ViewStyle;
}

export interface AuthHeaderProps {
  variant: AuthHeaderVariant;
  icon?: IconNameEnum;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  logoSize?: number;
  canGoBack?: boolean;
  disabled?: boolean;
  /** Runs immediately before `navigation.goBack()` (e.g. reset form state). */
  onBeforeBack?: () => void;
  showTitleHand?: boolean;
  titleHandSize?: number;
  style?: ViewStyle;
}

/** Tiled watermark text behind auth (and similar) screens. */
export interface PatternBackgroundProps {
  text: string;
  /** Number of repeated tiles (default 20). */
  repeatCount?: number;
  style?: ViewStyle;
}

export interface AuthOrGoogleFooterProps {
  orLabel: string;
  googleButtonLabel: string;
  footerLeadText: string;
  footerLinkLabel: string;
  onGooglePress: () => void;
  onFooterLinkPress: () => void;
  googleLoading?: boolean;
  googleDisabled?: boolean;
  style?: ViewStyle;
}

export interface ProgressBarProps {
  progress: number;
  label?: string;
  style?: ViewStyle;
}

export interface DropdownFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onPress: () => void;
  required?: boolean;
  style?: ViewStyle;
}

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export interface MenuRowProps {
  /** Ionicons glyph name - use string for flexibility across shared types */
  icon: string;
  label: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  showChevron?: boolean;
  style?: ViewStyle;
}

export interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  showChevron?: boolean;
  iconColor?: string;
  iconBgColor?: string;
  style?: ViewStyle;
}

export interface SettingSectionProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  style?: ViewStyle;
  leftIcon?: React.ReactNode | null;
  rightSlot?: React.ReactNode | null;
  showClearButton?: boolean;
  variant?: 'default' | 'compact';
  label?: string;
}

export interface Tab {
  key: string;
  label: string;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export type SplashVideoProps = {
  onFinish: () => void;
};

export interface BattleNowCurvedLabelProps {
  focused?: boolean;
}

// ─── Shared UI Organisms ────────────────────────────────────────────────────

export type EmptyStateProps = {
  title: string;
  message?: string;
  children?: React.ReactNode;
};

export type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export type LoadingStateProps = {
  message?: string;
};

export interface ToastProps {
  type: 'success' | 'fail';
  message: string;
  visible: boolean;
  onClose: () => void;
}

export interface ToastContextProps {
  showToast: (type: 'success' | 'fail', message: string) => void;
}

/** Centered confirm/cancel dialog; theme-aware when rendered under ThemeProvider. */
export interface ActionPromptModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface SelectionOption<T extends string = string> {
  key: T;
  label: string;
  subtitle?: string;
}

export interface SelectionModalProps<T extends string = string> {
  visible: boolean;
  title: string;
  options: SelectionOption<T>[];
  selectedKey?: T;
  onSelect: (key: T) => void;
  onClose: () => void;
  style?: ViewStyle;
}

// ─── Screen & Layout ────────────────────────────────────────────────────────

import type { Edge } from 'react-native-safe-area-context';

export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: number;
  style?: ViewStyle;
  edges?: Edge[];
};

// ─── Feature Component Props ────────────────────────────────────────────────

export interface LevelCardProps {
  levelInfo: LevelInfo;
  xp: number;
  ctaLabel: string;
  onCtaPress: () => void;
}

export interface WalletCardProps {
  walletBalance: string;
  actionLabel: string;
  onPress: () => void;
}

export interface ProfileStatItem {
  label: string;
  value: string;
  accentColor?: string;
}

export interface StatsGridProps {
  items: ProfileStatItem[];
}

export interface ProfileHeaderProps {
  displayName: string | undefined;
  username: string | undefined;
  email: string | undefined;
  xp: number;
  avatarUrl?: string | null;
  level?: string;
  onBackPress: () => void;
  onSettingsPress: () => void;
}

export interface ProfileCrewCardProps {
  title: string;
  crewCount: number;
  /** Shown when `crewCount === 0` instead of a fake avatar stack. */
  emptyHint: string;
  /** First crew members for the stacked preview; image if `avatarUrl` set, else initials. */
  crewPreviewMembers: CrewUserSummary[];
  buttonLabel: string;
  onPress: () => void;
}

export interface ProfileActivityItem {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  timestamp: string;
}

export interface ProfileActivityCardProps {
  title: string;
  items: ProfileActivityItem[];
}

export interface ProfileMenuProps {
  crewCount: number;
  followingCount: number;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onAchievementsPress: () => void;
  onStatisticsPress: () => void;
  onCrewPress: () => void;
  onWalletPress: () => void;
  onNotificationsPress: () => void;
  onLogout: () => void;
  onHelpPress?: () => void;
}

export interface UserRowProps {
  initials: string;
  name: string;
  subtitle?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
  rightSlot?: React.ReactNode;
  style?: ViewStyle;
}

export type CategoryPillsProps<T extends string> = {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
};

export type UpcomingGamesSectionProps = {
  upcomingGames: SportsEvent[];
  loading: boolean;
  onRefresh: () => void;
  onViewAll: () => void;
  onJoin: (event: SportsEvent) => void;
};

export type UpcomingGameCardProps = {
  event: SportsEvent;
  onJoin: () => void;
};

export type QuickPicksSectionProps = {
  quickPicks: Battle[];
  onViewAll: () => void;
  onPickPress: (battleId: string) => void;
};

export type MyBattlesSectionProps = {
  myBattles: Battle[];
  onViewAll: () => void;
  onBattlePress: (battleId: string) => void;
};

export type RecentResultsSectionProps = {
  recentResults: SportsEvent[];
  loading: boolean;
  onViewAll: () => void;
};

export type RecentResultCardProps = {
  event: SportsEvent;
};

export interface ExploreBattleCardProps {
  battle: {
    id: string;
    title: string;
    status: string;
    created_at: string;
    stake: number;
    event_id: string | null;
    participant_count?: number;
  };
  activeTab: string;
}

export interface JoinBattleSectionProps {
  canJoin: boolean;
  alreadyJoined: boolean;
  isCreator: boolean;
  isHeadToHeadBattle: boolean;
  isHeadToHeadReady: boolean;
  creatorWinningTeam?: string | null;
  joinerWinningTeam: string | null;
  homeTeamName?: string;
  awayTeamName?: string;
  pick: string;
  onPickChange: (pick: string) => void;
  joining: boolean;
  onJoin: () => void;
}

export interface BattleInfoCardProps {
  battle: Battle;
  isCreator: boolean;
}

export interface ParticipantsListProps {
  participants: BattleParticipant[];
  currentUserId?: string;
}

export interface WinnerCardProps {
  battle: Battle;
  winnerName: string;
  pendingResolution: boolean;
}

export interface ScoreDisplayProps {
  gameScore: SportsEvent;
  isCompleted: boolean;
}

export interface CrewScreenHeaderProps {
  title: string;
  iconName: string;
  onBackPress: () => void;
  rightActionIconName?: string;
  onRightActionPress?: () => void;
}

export interface CrewRequestCardProps {
  request: CrewRequestItem;
  onAcceptPress: (requestId: string) => void;
  onDeclinePress: (requestId: string) => void;
}

export interface CrewMemberTileProps {
  member: CrewUserSummary;
}

export interface CrewMemberCardProps {
  member: CrewUserSummary;
  presenceLabel: string;
  levelLabel: string;
  rivalryLabel?: string;
  challengeLabel: string;
  onChallengePress: (memberId: string, memberName: string) => void;
}

export interface CrewSuggestionCardProps {
  member: CrewUserSummary;
  onAddPress: (memberId: string) => void;
}

export interface CrewFilterTabsProps {
  activeFilter: CrewMemberFilter;
  onFilterChange: (filter: CrewMemberFilter) => void;
  allLabel: string;
  activeLabel: string;
  rivalsLabel: string;
}

export interface CrewSearchResultCardProps {
  result: CrewUserWithStatus;
  onAddFriendPress: (friendId: string, friendName: string) => void;
  isSubmitting?: boolean;
}

export interface CrewInviteOptionProps {
  iconName: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export interface IconProps {
  fill?: string;
  [key: string]: unknown;
}

export type NormalizedCheckUsername = {
  available: boolean;
  message: string;
};
