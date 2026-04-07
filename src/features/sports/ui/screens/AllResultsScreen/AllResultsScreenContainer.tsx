import type { AllResultsScreenProps } from '@/shared/types';
import { useAllResultsScreen } from '../../hooks/useAllResultsScreen';
import { AllResultsScreen } from './AllResultsScreen';

export default function AllResultsScreenContainer({ navigation }: AllResultsScreenProps) {
  const viewProps = useAllResultsScreen(navigation);
  return <AllResultsScreen {...viewProps} />;
}
