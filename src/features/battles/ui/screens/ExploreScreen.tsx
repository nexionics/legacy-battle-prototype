import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors as staticColors, spacing } from '@/shared/theme';
import { AppText, Screen, SearchInput } from '@/shared/ui';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { useExploreBattles } from '@/features/battles/ui/hooks';
import { CategoryPills } from '@/features/battles/ui/components/CategoryPills';
import { ExploreBattleCard } from '@/features/battles/ui/components/ExploreBattleCard';
import { CategoriesSection } from '@/features/battles/ui/components/CategoriesSection';
import { TopPlayersSection } from '@/features/battles/ui/components/TopPlayersSection';
import { EXPLORE_TABS, EXPLORE_TAB_SUBTITLES } from '@/shared/constants';

export default function ExploreScreen() {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const { exploreActiveTab, exploreBattles, exploreLoading, setExploreActiveTab } =
    useExploreBattles();

  return (
    <Screen scroll padding={spacing[4]}>
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerCenter}>
          <AppText variant="h4" style={{ color: colors.text }}>
            Explore
          </AppText>
          <Ionicons name="search-outline" size={18} color={colors.primary} />
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="notifications-outline" size={20} color={staticColors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          variant="compact"
          style={styles.searchInputFlex}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color={colors.text} />
          <AppText variant="body2" style={{ color: colors.text }}>
            Filter
          </AppText>
        </TouchableOpacity>
      </View>

      <CategoryPills
        tabs={EXPLORE_TABS}
        activeTab={exploreActiveTab}
        onTabChange={setExploreActiveTab}
      />

      <View style={styles.sectionTitleContainer}>
        <AppText variant="h4" style={{ color: colors.text }}>
          {exploreActiveTab}.
        </AppText>
        <AppText variant="captionSm" style={{ color: colors.textSecondary }}>
          {EXPLORE_TAB_SUBTITLES[exploreActiveTab]}
        </AppText>
      </View>

      {exploreLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : exploreBattles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant="body2" style={{ color: colors.textSecondary }}>
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
  headerSide: {
    width: 36,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  searchInputFlex: {
    flex: 1,
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
