import type { CreateBattleScreenProps } from '@/shared/types';
import { useCreateBattleScreen } from '../../hooks/useCreateBattleScreen';
import { CreateBattleScreen } from './CreateBattleScreen';

export default function CreateBattleScreenContainer({
  navigation,
  route,
}: CreateBattleScreenProps) {
  return <CreateBattleScreen {...useCreateBattleScreen({ navigation, route })} />;
}
