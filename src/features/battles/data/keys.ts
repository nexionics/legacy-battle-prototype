export const battlesKeys = {
  all: ['battles'] as const,
  lists: () => [...battlesKeys.all, 'list'] as const,
  list: (filters?: { page?: number; limit?: number }) =>
    [...battlesKeys.lists(), filters] as const,
  details: () => [...battlesKeys.all, 'detail'] as const,
  detail: (id: string) => [...battlesKeys.details(), id] as const,
  explore: () => [...battlesKeys.all, 'explore'] as const,
  exploreTab: (tab: string) => [...battlesKeys.explore(), tab] as const,
  quickPicks: (filters?: { page?: number; limit?: number }) =>
    [...battlesKeys.all, 'quickPicks', filters] as const,
  myActive: (filters?: { page?: number; limit?: number }) =>
    [...battlesKeys.all, 'myActive', filters] as const,
};
