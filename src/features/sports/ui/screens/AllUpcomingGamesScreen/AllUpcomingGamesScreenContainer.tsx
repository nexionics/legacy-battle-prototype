import type { AllUpcomingGamesScreenProps, SportFilter } from '@/shared/types';
import { useAllUpcomingGamesScreen } from '../../hooks/useAllUpcomingGamesScreen';
import { AllUpcomingGamesScreen } from './AllUpcomingGamesScreen';

export default function AllUpcomingGamesScreenContainer({
  navigation,
  route,
}: AllUpcomingGamesScreenProps) {
  const initialSport = route.params?.initialSport as SportFilter | undefined;
  const viewProps = useAllUpcomingGamesScreen(navigation, initialSport);
  return <AllUpcomingGamesScreen {...viewProps} />;
}
