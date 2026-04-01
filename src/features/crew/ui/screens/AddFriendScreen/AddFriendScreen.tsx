import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import If from '@/shared/ui/atoms/If';
import { AppText, Screen, SearchInput } from '@/shared/ui';
import { colors, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { AddFriendScreenProps } from '@/shared/types';
import { CrewSearchResultCard } from '../../components/CrewSearchResultCard';
import { CrewScreenHeader } from '../../components/CrewScreenHeader';
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
  inviteLink,
  inviteLinkLoading,
  inviteLinkErrorMessage,
  onCopyInviteLinkPress,
  onShareInviteLinkPress,
  onBackPress,
  onNotificationPress,
  strings,
}: AddFriendScreenViewProps) {
  return (
    <Screen padding={0}>
      <CrewScreenHeader
        title={strings.title}
        onBackPress={onBackPress}
        rightActionIconName="notifications-outline"
        onRightActionPress={onNotificationPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AppText variant="h2" style={styles.heroTitle}>
            {strings.pageHeading}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} style={styles.heroSubtitle}>
            {strings.pageSubtitle}
          </AppText>
        </View>

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

        <View style={[styles.card, styles.cardMutedBorder]}>
          <AppText variant="label" style={styles.cardTitle}>
            {strings.shareInviteLinkTitle}
          </AppText>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.cardSubtitle}>
            {strings.shareInviteLinkSubtitle}
          </AppText>

          <Pressable
            onPress={() => void onShareInviteLinkPress()}
            style={({ pressed }) => [styles.linkField, pressed && styles.linkFieldPressed]}
            accessibilityRole="button"
            accessibilityLabel="Share invite link"
          >
            {inviteLinkLoading && !inviteLink ? (
              <View style={styles.linkLoadingRow}>
                <ActivityIndicator size="small" color={colors.textSecondary} />
                <AppText variant="body2" color={colors.textSecondary} style={styles.linkLoadingText}>
                  {strings.linkLoading}
                </AppText>
              </View>
            ) : inviteLinkErrorMessage && !inviteLink ? (
              <AppText variant="body2" color={colors.error} numberOfLines={3}>
                {inviteLinkErrorMessage}
              </AppText>
            ) : (
              <AppText
                variant="body2"
                color={inviteLink ? colors.textSecondary : colors.textMuted}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {inviteLink ?? '—'}
              </AppText>
            )}
          </Pressable>

          <View style={styles.copyRow}>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => void onCopyInviteLinkPress()}
              activeOpacity={0.85}
              disabled={inviteLinkLoading && !inviteLink}
            >
              <Ionicons name="copy-outline" size={moderate(16)} color={colors.white} />
              <AppText variant="buttonMd" color={colors.white}>
                {strings.copyButton}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[6],
  },
  hero: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  heroTitle: {
    marginBottom: spacing[1],
  },
  heroSubtitle: {
    marginTop: 0,
  },
  card: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.card,
  },
  cardMutedBorder: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  cardTitle: {
    marginBottom: spacing[1],
  },
  cardSubtitle: {
    marginBottom: spacing[3],
  },
  linkField: {
    minHeight: verticalScale(48),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    justifyContent: 'center',
  },
  linkFieldPressed: {
    opacity: 0.85,
  },
  linkLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  linkLoadingText: {
    flex: 1,
  },
  copyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing[3],
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.primary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.md,
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
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
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
});
