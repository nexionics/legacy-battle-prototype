import type { SportsEvent } from '@/shared/types';

export function formatEventTime(event: SportsEvent): string {
  const date = new Date(event.strTimestamp);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `Today ${event.strTimeLocal || event.strTime}`;
  if (diffDays === 1) return `Tomorrow ${event.strTimeLocal || event.strTime}`;
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName} ${event.strTimeLocal || event.strTime}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatScore(event: SportsEvent): string {
  if (event.intHomeScore !== null && event.intAwayScore !== null) {
    return `${event.intHomeScore} - ${event.intAwayScore}`;
  }
  return 'vs';
}

export function getSportIcon(sport: string): string {
  switch (sport.toLowerCase()) {
    case 'american football':
      return '🏈';
    case 'basketball':
      return '🏀';
    case 'baseball':
      return '⚾';
    case 'ice hockey':
      return '🏒';
    case 'soccer':
      return '⚽';
    default:
      return '🏆';
  }
}

export const AVAILABLE_SPORTS = [
  { id: 'ALL', name: 'All Sports', icon: '🏆' },
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
] as const;
