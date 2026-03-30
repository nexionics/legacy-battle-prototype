import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import If from '@/shared/ui/atoms/If';
import { AppText, Screen, SearchInput } from '@/shared/ui';
import { colors, radii, spacing } from '@/shared/theme';
import type { AddFriendScreenProps } from '@/shared/types';
import { CrewInviteOption } from '../../components/CrewInviteOption';
import { CrewScreenHeader } from '../../components/CrewScreenHeader';
import { CrewSearchResultCard } from '../../components/CrewSearchResultCard';
import type { UseAddFriendScreenReturn } from '../../hooks/useAddFriendScreen';

export type AddFriendScreenViewProps = AddFriendScreenProps & UseAddFriendScreenReturn;

export function AddFriendScreen({
  searchQuery,
  setSearchQuery,
  searchResults,
  searching,
  searchError,
  hasSearched,
  submittingFriendId,
  onSearchPress,
  onAddFriendPress,
  onInviteViaTextPress,
  onInviteViaEmailPress,
  onBackPress,
  strings,
}: AddFriendScreenViewProps) {
  return (
    <Screen padding={0}>
      <CrewScreenHeader title={strings.title} iconName="people-outline" onBackPress={onBackPress} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            {strings.searchTitle}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} style={styles.sectionSubtitle}>
            {strings.searchSubtitle}
          </AppText>

          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={strings.searchPlaceholder}
              onSubmit={onSearchPress}
              style={styles.searchInputWrapper}
            />
            <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
              <AppText variant="buttonMd" color={colors.white}>
                {strings.searchButton}
              </AppText>
            </TouchableOpacity>
          </View>

          <If condition={searching}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <AppText variant="body2" color={colors.textSecondary}>
                {strings.searchingMessage}
              </AppText>
            </View>
          </If>

          <If condition={!searching && !!searchError}>
            <View style={styles.noResultsContainer}>
              <Ionicons name="alert-circle-outline" size={32} color={colors.warning} />
              <AppText variant="label" style={styles.errorTitle}>
                {strings.alerts.genericTitle}
              </AppText>
              <AppText variant="captionSm" color={colors.textSecondary} style={styles.errorSubtitle}>
                {searchError}
              </AppText>
            </View>
          </If>

          <If condition={!searching && !searchError && hasSearched && searchResults.length === 0}>
            <View style={styles.noResultsContainer}>
              <Ionicons name="person-outline" size={32} color={colors.textSecondary} />
              <AppText variant="label" style={styles.emptyTitle}>
                {strings.emptyTitle}
              </AppText>
              <AppText variant="captionSm" color={colors.textSecondary} style={styles.emptySubtitle}>
                {strings.emptySubtitle}
              </AppText>
            </View>
          </If>

          <If condition={!searching && !searchError}>
            {searchResults.map((result) => (
              <CrewSearchResultCard
                key={result.id}
                result={result}
                isSubmitting={submittingFriendId === result.id}
                onAddFriendPress={(friendId, friendName) =>
                  void onAddFriendPress(friendId, friendName)
                }
              />
            ))}
          </If>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.dividerLabel}>
            {strings.dividerLabel}
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            {strings.inviteTitle}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} style={styles.sectionSubtitle}>
            {strings.inviteSubtitle}
          </AppText>

          <CrewInviteOption
            iconName="chatbubble-outline"
            title={strings.inviteViaTextTitle}
            subtitle={strings.inviteViaTextSubtitle}
            onPress={() => void onInviteViaTextPress()}
          />

          <CrewInviteOption
            iconName="mail-outline"
            title={strings.inviteViaEmailTitle}
            subtitle={strings.inviteViaEmailSubtitle}
            onPress={() => void onInviteViaEmailPress()}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[1],
  },
  sectionSubtitle: {
    marginBottom: spacing[4],
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4] * 2,
    gap: spacing[2],
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4] * 2,
  },
  errorTitle: {
    marginTop: spacing[2],
  },
  errorSubtitle: {
    marginTop: spacing[1],
    textAlign: 'center',
  },
  emptyTitle: {
    marginTop: spacing[2],
  },
  emptySubtitle: {
    marginTop: spacing[1],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginVertical: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  dividerLabel: {
    paddingHorizontal: spacing[4],
  },
});
