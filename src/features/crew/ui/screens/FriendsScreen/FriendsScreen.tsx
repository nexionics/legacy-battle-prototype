import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import If from '@/shared/ui/atoms/If';
import { AppText, ErrorState, LoadingState, Screen } from '@/shared/ui';
import { colors, horizontalScale, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { FriendsScreenProps } from '@/shared/types';
import { CrewFilterTabs } from '../../components/CrewFilterTabs';
import { CrewMemberCard } from '../../components/CrewMemberCard';
import { CrewRequestCard } from '../../components/CrewRequestCard';
import { CrewScreenHeader } from '../../components/CrewScreenHeader';
import { CrewSuggestionCard } from '../../components/CrewSuggestionCard';
import type { UseFriendsScreenReturn } from '../../hooks/useFriendsScreen';

export type FriendsScreenViewProps = FriendsScreenProps & UseFriendsScreenReturn;

export function FriendsScreen({
  crewMembers,
  pendingReceived,
  suggestions,
  loading,
  refreshing,
  errorMessage,
  activeFilter,
  onRefresh,
  onBackPress,
  onAddCrewPress,
  onFilterChange,
  onSearchMembersPress,
  onChallengePress,
  onAcceptPress,
  onDeclinePress,
  onAddSuggestionPress,
  strings,
}: FriendsScreenViewProps) {
  return (
    <>
      <If condition={loading}>
        <Screen padding={0}>
          <LoadingState message={strings.loadingMessage} />
        </Screen>
      </If>

      <If condition={!loading && !!errorMessage}>
        <Screen padding={0}>
          <ErrorState
            title={strings.errorTitle}
            message={errorMessage ?? undefined}
            onRetry={onRefresh}
          />
        </Screen>
      </If>

      <If condition={!loading && !errorMessage}>
        <Screen padding={0}>
          <CrewScreenHeader
            title={strings.title}
            iconName="people-outline"
            onBackPress={onBackPress}
            rightActionIconName="person-add-outline"
            onRightActionPress={onAddCrewPress}
          />

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
          >
            <If condition={pendingReceived.length > 0}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.pendingIndicator} />
                  <AppText variant="h6">
                    {strings.pendingRequests} ({pendingReceived.length})
                  </AppText>
                </View>
                {pendingReceived.map((request) => (
                  <CrewRequestCard
                    key={request.id}
                    request={request}
                    onAcceptPress={(requestId) => void onAcceptPress(requestId)}
                    onDeclinePress={(requestId) => void onDeclinePress(requestId)}
                  />
                ))}
              </View>
            </If>

            <View style={styles.section}>
              <CrewFilterTabs
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                allLabel={strings.filters.all}
                activeLabel={strings.filters.active}
                rivalsLabel={strings.filters.rivals}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText variant="h6">
                  {strings.allMembersLabel} ({crewMembers.length})
                </AppText>
                <TouchableOpacity style={styles.sectionActionButton} onPress={onSearchMembersPress}>
                  <Ionicons name="search-outline" size={moderate(18)} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <If condition={activeFilter === 'rivals'}>
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={moderate(48)} color={colors.textSecondary} />
                  <AppText variant="h4" style={styles.emptyTitle}>
                    {strings.rivalsEmptyTitle}
                  </AppText>
                  <AppText variant="body2" color={colors.textSecondary} style={styles.emptySubtitle}>
                    {strings.rivalsEmptySubtitle}
                  </AppText>
                </View>
              </If>

              <If condition={activeFilter !== 'rivals' && crewMembers.length === 0}>
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={moderate(48)} color={colors.textSecondary} />
                  <AppText variant="h4" style={styles.emptyTitle}>
                    {strings.emptyTitle}
                  </AppText>
                  <AppText variant="body2" color={colors.textSecondary} style={styles.emptySubtitle}>
                    {strings.emptySubtitle}
                  </AppText>
                  <TouchableOpacity style={styles.emptyAddButton} onPress={onAddCrewPress}>
                    <Ionicons name="person-add-outline" size={moderate(18)} color={colors.white} />
                    <AppText variant="buttonMd" color={colors.white}>
                      {strings.findPeopleCta}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </If>

              <If condition={activeFilter !== 'rivals' && crewMembers.length > 0}>
                <View style={styles.memberCards}>
                  {crewMembers.map((member) => (
                    <CrewMemberCard
                      key={member.id}
                      member={member}
                      presenceLabel={strings.presenceLabel}
                      levelLabel={strings.levelLabel}
                      rivalryLabel={activeFilter === 'all' ? undefined : strings.rivalryLabel}
                      challengeLabel={strings.challengeCta}
                      onChallengePress={onChallengePress}
                    />
                  ))}
                </View>
              </If>
            </View>

            <If condition={suggestions.length > 0}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="flash" size={moderate(16)} color={colors.gold} />
                  <AppText variant="h6">{strings.suggestionsTitle}</AppText>
                </View>
                <AppText
                  variant="captionSm"
                  color={colors.textSecondary}
                  style={styles.suggestionsSubtitle}
                >
                  {strings.suggestionsSubtitle}
                </AppText>
                {suggestions.map((member) => (
                  <CrewSuggestionCard
                    key={member.id}
                    member={member}
                    onAddPress={(memberId) => void onAddSuggestionPress(memberId)}
                  />
                ))}
              </View>
            </If>
          </ScrollView>
        </Screen>
      </If>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  pendingIndicator: {
    width: horizontalScale(10),
    height: verticalScale(10),
    borderRadius: moderate(5),
    backgroundColor: colors.warning,
  },
  sectionActionButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCards: {
    gap: spacing[4],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4] * 3,
  },
  emptyTitle: {
    marginTop: spacing[4],
  },
  emptySubtitle: {
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    gap: spacing[2],
  },
  suggestionsSubtitle: {
    marginBottom: spacing[4],
    marginTop: -spacing[2],
  },
});
