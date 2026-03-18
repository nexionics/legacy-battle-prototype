import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { useExploreBattles } from '@/features/battles/ui/hooks';
import { CategoryPills } from '@/features/battles/ui/components/CategoryPills';
import { ExploreBattleCard } from '@/features/battles/ui/components/ExploreBattleCard';
import { CategoriesSection } from '@/features/battles/ui/components/CategoriesSection';
import { TopPlayersSection } from '@/features/battles/ui/components/TopPlayersSection';
import type { ExploreTab } from '@/features/battles/data/types';

const TABS: ExploreTab[] = ['Trending', 'Ending Soon', 'New', 'High Activity'];

const TAB_SUBTITLES: Record<ExploreTab, string> = {
  Trending: 'Trending Battles',
  'Ending Soon': 'Challenges That Are About To End',
  New: 'Battle That Are New',
  'High Activity': 'All New Battle Created',
};

export default function ExploreScreen() {
  const {
    exploreActiveTab,
    exploreBattles,
    exploreLoading,
    setExploreActiveTab,
  } = useExploreBattles();

  return (
    <Screen scroll padding={spacing[4]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText variant="h4">Explore</AppText>
          <Ionicons name="search-outline" size={18} color={colors.primary} />
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color={colors.text} />
          <AppText variant="body2">Filter</AppText>
        </TouchableOpacity>
      </View>

      <CategoryPills tabs={TABS} activeTab={exploreActiveTab} onTabChange={setExploreActiveTab} />

      <View style={styles.sectionTitleContainer}>
        <AppText variant="h4">{exploreActiveTab}.</AppText>
        <AppText variant="captionSm" color={colors.textSecondary}>
          {TAB_SUBTITLES[exploreActiveTab]}
        </AppText>
      </View>

      {exploreLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : exploreBattles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant="body2" color={colors.textSecondary}>
            No battles found
          </AppText>
        </View>
      ) : (
        exploreBattles.map((battle) => (
          <ExploreBattleCard key={battle.id} battle={battle} activeTab={exploreActiveTab} />
        ))
      )}

      <CategoriesSection />
      <TopPlayersSection />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitleContainer: {
    marginBottom: spacing[4],
  },
  loadingContainer: {
    padding: spacing[4] * 2,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing[4] * 2,
    alignItems: 'center',
  },
});
