import { useQuery } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import { getUserPreferences } from '../api/preferences.api';

export function usePreferencesQuery() {
  return useQuery({
    queryKey: profileKeys.preferences(),
    queryFn: getUserPreferences,
  });
}
