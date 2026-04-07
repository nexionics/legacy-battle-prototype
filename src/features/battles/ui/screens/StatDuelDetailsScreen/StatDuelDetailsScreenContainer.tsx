import type { StatDuelDetailsScreenProps } from '@/shared/types';
import { useStatDuelDetailsScreen } from '../../hooks/useStatDuelDetailsScreen';
import { StatDuelDetailsScreen } from './StatDuelDetailsScreen';

export default function StatDuelDetailsScreenContainer({
  navigation,
  route,
}: StatDuelDetailsScreenProps) {
  return <StatDuelDetailsScreen {...useStatDuelDetailsScreen({ navigation, route })} />;
}
