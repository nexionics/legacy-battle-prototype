import type { StatDuelOpponentScreenProps } from '@/shared/types';
import { useStatDuelOpponentScreen } from '../../hooks/useStatDuelOpponentScreen';
import { StatDuelOpponentScreen } from './StatDuelOpponentScreen';

export default function StatDuelOpponentScreenContainer({
  navigation,
  route,
}: StatDuelOpponentScreenProps) {
  return <StatDuelOpponentScreen {...useStatDuelOpponentScreen({ navigation, route })} />;
}
