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
  biometricsEnabled: boolean;
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
