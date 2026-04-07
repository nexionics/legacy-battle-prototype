import { useState, useCallback } from 'react';
import { useExploreBattles } from './useExploreBattles';

export type ExploreScreenViewProps = ReturnType<typeof useExploreScreen>;

export function useExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { exploreActiveTab, exploreBattles, exploreLoading, setExploreActiveTab } =
    useExploreBattles();

  const onSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  return {
    searchQuery,
    onSearchChange,
    exploreActiveTab,
    exploreBattles,
    exploreLoading,
    setExploreActiveTab,
  };
}
