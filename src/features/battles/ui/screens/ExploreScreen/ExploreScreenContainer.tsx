import { useExploreScreen } from '../../hooks/useExploreScreen';
import { ExploreScreen } from './ExploreScreen';

export default function ExploreScreenContainer() {
  return <ExploreScreen {...useExploreScreen()} />;
}
