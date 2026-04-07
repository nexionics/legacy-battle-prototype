import type { StatDuelChampionScreenProps } from '@/shared/types';
import { useStatDuelChampionScreen } from '../../hooks/useStatDuelChampionScreen';
import { StatDuelChampionScreen } from './StatDuelChampionScreen';

export default function StatDuelChampionScreenContainer({
  navigation,
  route,
}: StatDuelChampionScreenProps) {
  return <StatDuelChampionScreen {...useStatDuelChampionScreen({ navigation, route })} />;
}
