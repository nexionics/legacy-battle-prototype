export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
  preferences: () => [...profileKeys.all, 'preferences'] as const,
};
