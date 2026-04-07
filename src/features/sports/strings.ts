/** Namespaced copy for sports feature screens (i18n-friendly). */

export const homeScreenStrings = {
  loadingMessage: 'Loading home feed...',
  startBattleCta: 'Start Battle Now',
} as const;

export const allResultsScreenStrings = {
  title: 'All Results',
  sectionLast7Days: 'Last 7 Days',
  loading: 'Loading results...',
  emptyTitle: 'No results found',
  emptyHint: 'Try selecting a different sport',
  finalBadge: 'Final',
  venueTbd: 'TBD',
} as const;

export const allUpcomingGamesScreenStrings = {
  title: 'Upcoming Games',
  loading: 'Loading games...',
  sectionLive: 'Live Now',
  sectionUpcoming: 'Upcoming',
  emptyTitle: 'No upcoming games',
  emptyHint: 'Try selecting a different sport',
  battleCta: 'Battle',
  venueTbd: 'TBD',
} as const;
