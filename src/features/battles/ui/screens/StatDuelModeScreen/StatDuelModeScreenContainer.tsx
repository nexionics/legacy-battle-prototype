import type { StatDuelModeScreenProps } from '@/shared/types';
import { useStatDuelModeScreen } from '../../hooks/useStatDuelModeScreen';
import { StatDuelModeScreen } from './StatDuelModeScreen';

export default function StatDuelModeScreenContainer({
  navigation,
  route,
}: StatDuelModeScreenProps) {
  return <StatDuelModeScreen {...useStatDuelModeScreen({ navigation, route })} />;
}
