import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import {
  AppText,
  Screen,
  ScreenHeader,
  TabBar,
  StatusBadge,
  LoadingState,
  EmptyState,
  ErrorState,
} from '@/shared/ui';
import If from '@/shared/ui/atoms/If';
import { battlesStrings } from '@/features/battles/string';
import { getStatusColor, formatRelativeDate } from '@/shared/utils';
import { BATTLES_LIST_TABS } from '@/shared/constants';
import type { BattlesScreenViewProps } from '../../hooks/useBattlesScreen';

export function BattlesScreen(props: BattlesScreenViewProps) {
  const {
    filteredBattles,
    listLoading,
    listRefreshing,
    listActiveTab,
    listError,
    onRefresh,
    onCreateBattle,
    onOpenBattleDetail,
    onTabChange,
    onRetry,
  } = props;

  const showList = !listLoading && !listError && filteredBattles.length > 0;
  const showEmpty = !listLoading && !listError && filteredBattles.length === 0;

  return (
    <Screen padding={0} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={listRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <ScreenHeader
          title={battlesStrings.battlesList.screenTitle}
          rightSlot={
            <TouchableOpacity style={styles.createButton} onPress={onCreateBattle}>
              <Ionicons name="add" size={20} color={colors.white} />
              <AppText variant="buttonMd" color={colors.white}>
                {battlesStrings.battlesList.create}
              </AppText>
            </TouchableOpacity>
          }
        />

        <TabBar tabs={BATTLES_LIST_TABS} activeTab={listActiveTab} onTabChange={onTabChange} />

        <If condition={listLoading}>
          <LoadingState message={battlesStrings.battlesList.loading} />
        </If>
        <If condition={!listLoading && !!listError}>
          <ErrorState
            message={listError?.message ?? battlesStrings.battlesList.loadFailed}
            onRetry={onRetry}
          />
        </If>
        <If condition={showEmpty}>
          <EmptyState
            title={battlesStrings.battlesList.emptyTitle(listActiveTab)}
            message={battlesStrings.battlesList.emptyMessage}
          >
            <TouchableOpacity style={styles.emptyButton} onPress={onCreateBattle}>
              <AppText variant="buttonMd" color={colors.white}>
                {battlesStrings.battlesList.createFirstBattle}
              </AppText>
            </TouchableOpacity>
          </EmptyState>
        </If>
        <If condition={showList}>
          {filteredBattles.map((battle) => (
            <View key={battle.id} style={styles.battleCard}>
              <View style={styles.battleHeader}>
                <View style={styles.battleLeft}>
                  <View style={styles.battleIcon}>
                    <AppText style={{ fontSize: 20 }}>⚔️</AppText>
                  </View>
                  <View>
                    <AppText variant="label" numberOfLines={1}>
                      {battle.title}
                    </AppText>
                    <AppText variant="captionSm" color={colors.textSecondary} numberOfLines={1}>
                      {battle.description || battlesStrings.battlesList.noDescription}
                    </AppText>
                  </View>
                </View>
                <StatusBadge label={battle.status} color={getStatusColor(battle.status)} />
              </View>
              <View style={styles.battleDetails}>
                <View style={styles.stakeInfo}>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    {battlesStrings.battlesList.stake}
                  </AppText>
                  <AppText variant="captionSm" style={{ fontWeight: 'bold' }}>
                    {battle.stake} BC
                  </AppText>
                </View>
                <View style={styles.timeInfo}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    {formatRelativeDate(battle.created_at)}
                  </AppText>
                </View>
              </View>
              <View style={styles.battleFooter}>
                <View style={styles.battleTypeBadge}>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    {battle.event_id
                      ? battlesStrings.battlesList.sportsEvent
                      : battlesStrings.battlesList.customBattle}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => onOpenBattleDetail(battle.id)}
                >
                  <AppText variant="buttonMd" color={colors.white}>
                    {battlesStrings.common.view}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </If>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: 4,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
  },
  battleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  battleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  battleIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  stakeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  battleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  battleTypeBadge: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
  },
});
