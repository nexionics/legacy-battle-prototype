import type { BattleDetailScreenProps } from '@/shared/types';
import { useBattleDetailScreen } from '../../hooks/useBattleDetailScreen';
import { BattleDetailScreen } from './BattleDetailScreen';

export default function BattleDetailScreenContainer({ navigation, route }: BattleDetailScreenProps) {
  return <BattleDetailScreen {...useBattleDetailScreen({ navigation, route })} />;
}
