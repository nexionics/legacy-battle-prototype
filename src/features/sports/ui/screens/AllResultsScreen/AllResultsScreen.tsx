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
import { allResultsScreenStrings } from '@/features/sports/strings';
import type { AllResultsScreenViewProps } from '../../hooks/useAllResultsScreen';
import { AllResultsEventCard } from '../../components/AllResultsEventCard';

export function AllResultsScreen(props: AllResultsScreenViewProps) {
  const {
    results,
    resultsLoading,
    resultsRefreshing,
    resultsSelectedSport,
    onSportSelect,
    onRefresh,
    onBack,
  } = props;

  const showList = !resultsLoading && results.length > 0;
  const showEmpty = !resultsLoading && results.length === 0;

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h4">{allResultsScreenStrings.title}</AppText>
        <View style={styles.placeholder} />
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
              style={[
                styles.filterTab,
                resultsSelectedSport === sport.id && styles.filterTabActive,
              ]}
              onPress={() => onSportSelect(sport.id as SportFilter)}
            >
              <AppText style={{ fontSize: 16 }}>{sport.icon}</AppText>
              <AppText
                variant="label"
                color={resultsSelectedSport === sport.id ? colors.white : colors.textSecondary}
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
            refreshing={resultsRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <AppText variant="h6" style={styles.sectionTitle}>
          {allResultsScreenStrings.sectionLast7Days}
        </AppText>

        <If condition={resultsLoading}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="body2" color={colors.textSecondary} style={{ marginTop: spacing[2] }}>
              {allResultsScreenStrings.loading}
            </AppText>
          </View>
        </If>
        <If condition={showList}>
          {results.map((event) => (
            <AllResultsEventCard key={event.idEvent} event={event} />
          ))}
        </If>
        <If condition={showEmpty}>
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={colors.textSecondary} />
            <AppText variant="body2" color={colors.textSecondary} style={{ marginTop: spacing[4] }}>
              {allResultsScreenStrings.emptyTitle}
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary} style={{ marginTop: 4 }}>
              {allResultsScreenStrings.emptyHint}
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
  placeholder: {
    width: 40,
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
