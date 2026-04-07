import type { StartBattleScreenProps } from '@/shared/types';
import { useStartBattleScreen } from '../../hooks/useStartBattleScreen';
import { StartBattleScreen } from './StartBattleScreen';

export default function StartBattleScreenContainer({ navigation }: StartBattleScreenProps) {
  return <StartBattleScreen {...useStartBattleScreen({ navigation })} />;
}
