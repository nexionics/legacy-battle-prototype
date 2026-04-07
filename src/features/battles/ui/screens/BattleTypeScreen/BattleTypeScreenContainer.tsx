import type { BattleTypeScreenProps } from '@/shared/types';
import { useBattleTypeScreen } from '../../hooks/useBattleTypeScreen';
import { BattleTypeScreen } from './BattleTypeScreen';

export default function BattleTypeScreenContainer({ navigation }: BattleTypeScreenProps) {
  return <BattleTypeScreen {...useBattleTypeScreen(navigation)} />;
}
