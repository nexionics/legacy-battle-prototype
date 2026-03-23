import type { ComponentProps } from 'react';

type IoniconsComponent = typeof import('@expo/vector-icons').Ionicons;

/** Row in Account Details (username / email) with leading icon and edit affordance. */
export type AccountDetailsInfoRowProps = {
  icon: ComponentProps<IoniconsComponent>['name'];
  label: string;
  value: string;
  onEdit: () => void;
};

/** Level info for XP progression display */
export interface LevelInfo {
  level: string;
  nextLevel: string;
  progress: number;
  nextXp: number;
}

/** Profile store connection status */
export type ConnectionStatus = 'idle' | 'ok' | 'error' | 'testing';

/** User Preferences Model from /preferences */
export interface UserPreferences {
  id: string;
  userId: string;
  rememberMe: boolean;
  pushEnabled: boolean;
  bcUpdatesEnabled: boolean;
  challengeDetailsEnabled: boolean;
  systemUpdatesEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for PATCH /preferences */
export type UpdateUserPreferences = Partial<
  Omit<UserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

export interface CrewCounts {
  members: number;
  following: number;
}
