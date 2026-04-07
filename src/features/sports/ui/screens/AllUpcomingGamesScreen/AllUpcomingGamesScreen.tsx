import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import If from '@/shared/ui/atoms/If';
import { AVAILABLE_SPORTS } from '@/features/sports/data/api/sports.api';
import type { SportFilter } from '@/shared/types';
import { allUpcomingGamesScreenStrings } from '@/features/sports/strings';
import type { AllUpcomingGamesScreenViewProps } from '../../hooks/useAllUpcomingGamesScreen';
import { AllUpcomingGamesListCard } from '../../components/AllUpcomingGamesListCard';

export function AllUpcomingGamesScreen(props: AllUpcomingGamesScreenViewProps) {
  const {
    games,
    gamesLoading,
    gamesRefreshing,
    gamesSelectedSport,
    onSportSelect,
    onRefresh,
    onBack,
    onBattle,
  } = props;

  const hasLiveGames = games.some((e) => e.strStatus === 'live');
  const showLoadedList = !gamesLoading && games.length > 0;
  const showEmpty = !gamesLoading && games.length === 0;

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h4">{allUpcomingGamesScreenStrings.title}</AppText>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {AVAILABLE_SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[styles.filterTab, gamesSelectedSport === sport.id && styles.filterTabActive]}
              onPress={() => onSportSelect(sport.id as SportFilter)}
            >
              <AppText style={{ fontSize: 16 }}>{sport.icon}</AppText>
              <AppText
                variant="label"
                color={gamesSelectedSport === sport.id ? colors.white : colors.textSecondary}
              >
                {sport.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={gamesRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <If condition={gamesLoading}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="body2" color={colors.textSecondary} style={{ marginTop: spacing[2] }}>
              {allUpcomingGamesScreenStrings.loading}
            </AppText>
          </View>
        </If>
        <If condition={showLoadedList}>
          <If condition={hasLiveGames}>
            <AppText variant="h6" color={colors.success} style={styles.sectionTitle}>
              {allUpcomingGamesScreenStrings.sectionLive}
            </AppText>
            {games
              .filter((e) => e.strStatus === 'live')
              .map((event) => (
                <AllUpcomingGamesListCard
                  key={event.idEvent}
                  event={event}
                  onBattle={() => onBattle(event)}
                />
              ))}
          </If>
          <AppText variant="h6" style={styles.sectionTitle}>
            {allUpcomingGamesScreenStrings.sectionUpcoming}
          </AppText>
          {games
            .filter((e) => e.strStatus !== 'live')
            .map((event) => (
              <AllUpcomingGamesListCard
                key={event.idEvent}
                event={event}
                onBattle={() => onBattle(event)}
              />
            ))}
        </If>
        <If condition={showEmpty}>
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <AppText variant="body2" color={colors.textSecondary} style={{ marginTop: spacing[4] }}>
              {allUpcomingGamesScreenStrings.emptyTitle}
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary} style={{ marginTop: 4 }}>
              {allUpcomingGamesScreenStrings.emptyHint}
            </AppText>
          </View>
        </If>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  filterScroll: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: spacing[2] / 2,
    marginRight: spacing[2],
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  sectionTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  loadingContainer: {
    padding: spacing[4] * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: spacing[4] * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
