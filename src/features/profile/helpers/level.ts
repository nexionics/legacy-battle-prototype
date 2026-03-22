import type { LevelInfo } from '@/shared/types';

/**
 * Gets level info with progress calculation based on XP
 * @param xp Current XP value
 * @param currentLevel Current level from backend (optional, will calculate if not provided)
 */
export function getLevelInfo(xp: number, currentLevel?: string): LevelInfo {
  // Define level thresholds
  const levels = [
    { name: 'Rookie', minXp: 0, maxXp: 500, next: 'Challenger' },
    { name: 'Challenger', minXp: 500, maxXp: 1000, next: 'Veteran' },
    { name: 'Veteran', minXp: 1000, maxXp: 2000, next: 'Champion' },
    { name: 'Champion', minXp: 2000, maxXp: 3000, next: 'Legend' },
    { name: 'Legend', minXp: 3000, maxXp: Infinity, next: 'Legend' },
  ];

  // Find the current level based on XP or use provided level
  let levelData = levels.find((l) => xp >= l.minXp && xp < l.maxXp);

  // If currentLevel is provided from backend, use it
  if (currentLevel) {
    const backendLevel = levels.find((l) => l.name === currentLevel);
    if (backendLevel) {
      levelData = backendLevel;
    }
  }

  if (!levelData) {
    levelData = levels[levels.length - 1]; // Default to Legend
  }

  // Calculate progress within current level
  const xpInLevel = xp - levelData.minXp;
  const xpNeeded = levelData.maxXp - levelData.minXp;
  const progress = levelData.maxXp === Infinity ? 100 : (xpInLevel / xpNeeded) * 100;

  return {
    level: levelData.name,
    nextLevel: levelData.next,
    progress: Math.min(100, Math.max(0, progress)),
    nextXp: levelData.maxXp === Infinity ? levelData.minXp : levelData.maxXp,
  };
}

export function getLevelNumber(xp: number): number {
  if (xp >= 3000) return 15;
  if (xp >= 2000) return 12;
  if (xp >= 1000) return 8;
  if (xp >= 500) return 4;
  return 1;
}
