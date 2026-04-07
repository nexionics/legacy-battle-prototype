import type { StatDuelConfirmScreenProps } from '@/shared/types';
import { useStatDuelConfirmScreen } from '../../hooks/useStatDuelConfirmScreen';
import { StatDuelConfirmScreen } from './StatDuelConfirmScreen';

export default function StatDuelConfirmScreenContainer({
  navigation,
  route,
}: StatDuelConfirmScreenProps) {
  return <StatDuelConfirmScreen {...useStatDuelConfirmScreen({ navigation, route })} />;
}
