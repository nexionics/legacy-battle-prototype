import type { BattleVisibilityScreenProps } from '@/shared/types';
import { useBattleVisibilityScreen } from '../../hooks/useBattleVisibilityScreen';
import { BattleVisibilityScreen } from './BattleVisibilityScreen';

export default function BattleVisibilityScreenContainer(props: BattleVisibilityScreenProps) {
  return <BattleVisibilityScreen {...useBattleVisibilityScreen(props)} />;
}
