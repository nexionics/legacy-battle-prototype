import type { BattleTypeScreenProps } from '@/shared/types';
import { useBattleTypeScreen } from '../../hooks/useBattleTypeScreen';
import { BattleTypeScreen } from './BattleTypeScreen';

export default function BattleTypeScreenContainer({ navigation, route }: BattleTypeScreenProps) {
  return <BattleTypeScreen {...useBattleTypeScreen({ navigation, route })} />;
}
