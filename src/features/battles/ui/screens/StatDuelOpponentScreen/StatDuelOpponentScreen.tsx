import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import { AppText, Screen, AppModal, Avatar } from '@/shared/ui';
import { battlesStatDuelOpponentLevelRank, battlesStrings } from '@/features/battles/string';
import { getInitials } from '@/shared/utils';
import { ChooseOpponentSheet } from '../../components/ChooseOpponentSheet';
import type { StatDuelOpponentScreenViewProps } from '../../hooks/useStatDuelOpponentScreen';

export function StatDuelOpponentScreen(props: StatDuelOpponentScreenViewProps) {
  const {
    visibility,
    opponentPickerOpen,
    sheetSearchQuery,
    setSheetSearchQuery,
    openOpponentPicker,
    closeOpponentPicker,
    selectedOpponent,
    setSelectedOpponent,
    filteredSheetOpponents,
    onSelectOpponentFromSheet,
    onAddFriendFromSheet,
    canContinue,
    onContinue,
    onBack,
  } = props;

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <AppText variant="h4">{battlesStrings.common.createBattle}</AppText>
            <View style={styles.headerIcon}>
              <Ionicons name="barbell-outline" size={18} color={colors.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(5 / 6) * 100}%` }]} />
          </View>
          <View style={styles.progressBadge}>
            <AppText variant="captionSm" style={styles.progressBadgeText}>
              {battlesStrings.statDuel.progress5of6}
            </AppText>
          </View>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h3" style={styles.mainTitle}>
            {battlesStrings.statDuel.opponentTitle}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {battlesStrings.statDuel.opponentSubtitle}
          </AppText>
        </View>

        {visibility === 'private' ? (
          <>
            <AppText variant="captionSm" color={colors.text} style={styles.addOpponentLabel}>
              {battlesStrings.statDuel.addOpponent}
            </AppText>
            <TouchableOpacity
              style={styles.searchTrigger}
              onPress={openOpponentPicker}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={battlesStrings.statDuel.searchOpponentPlaceholder}
            >
              <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
              <AppText variant="body2" color={colors.textMuted} style={styles.searchTriggerText}>
                {battlesStrings.statDuel.searchOpponentPlaceholder}
              </AppText>
            </TouchableOpacity>

            {selectedOpponent ? (
              <View style={styles.selectedOpponentCard}>
                <AppText
                  variant="captionSm"
                  color={colors.textSecondary}
                  style={styles.selectedLabel}
                >
                  {battlesStrings.statDuel.selectedOpponent}
                </AppText>
                <View style={styles.selectedOpponentRow}>
                  <Avatar
                    initials={getInitials(selectedOpponent.display_name)}
                    size="sm"
                    backgroundColor={colors.primary}
                    borderColor={colors.primary}
                    textColor={colors.white}
                  />
                  <View style={styles.opponentInfo}>
                    <AppText variant="label">{selectedOpponent.display_name}</AppText>
                    <AppText variant="captionSm" color={colors.textSecondary}>
                      {selectedOpponent.subtitle ??
                        (selectedOpponent.username ? `@${selectedOpponent.username}` : '')}
                    </AppText>
                    {selectedOpponent.level != null &&
                    selectedOpponent.rankLabel &&
                    selectedOpponent.level > 0 ? (
                      <AppText variant="captionSm" color={colors.text} style={styles.selectedLevel}>
                        {battlesStatDuelOpponentLevelRank(
                          selectedOpponent.level,
                          selectedOpponent.rankLabel,
                        )}
                      </AppText>
                    ) : null}
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOpponent(null)}>
                    <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.publicBattleInfo}>
            <Ionicons name="globe-outline" size={48} color={colors.primary} />
            <AppText variant="h4" style={styles.publicBattleTitle}>
              {battlesStrings.statDuel.publicBattle}
            </AppText>
            <AppText variant="body2" color={colors.textSecondary} style={styles.publicBattleText}>
              {battlesStrings.statDuel.publicBattleBody}
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={onContinue}
          disabled={!canContinue}
        >
          <AppText variant="buttonLg" color={colors.white}>
            {battlesStrings.common.continue}
          </AppText>
          <View style={styles.continueIcon}>
            <AppText style={styles.continueIconText}>⚔</AppText>
          </View>
        </TouchableOpacity>
      </View>

      <AppModal
        visible={opponentPickerOpen}
        onRequestClose={closeOpponentPicker}
        presentation="bottom"
        animationType="slide"
      >
        <ChooseOpponentSheet
          searchQuery={sheetSearchQuery}
          onSearchChange={setSheetSearchQuery}
          opponents={filteredSheetOpponents}
          selectedOpponentId={selectedOpponent?.id ?? null}
          onSelectOpponent={onSelectOpponentFromSheet}
          onClose={closeOpponentPicker}
          onAddFriend={onAddFriendFromSheet}
          title={battlesStrings.statDuel.chooseFriendSheetTitle}
          searchPlaceholder={battlesStrings.statDuel.sheetSearchPlaceholder}
          addFriendLabel={battlesStrings.statDuel.sheetAddFriend}
        />
      </AppModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
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
    gap: spacing[2],
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  progressBar: {
    flex: 1,
    height: verticalScale(10),
    borderRadius: verticalScale(5),
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: verticalScale(5),
  },
  progressBadge: {
    minWidth: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
  },
  progressBadgeText: {
    fontWeight: '700',
  },
  titleSection: {
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  mainTitle: {
    fontWeight: '700',
  },
  addOpponentLabel: {
    marginBottom: spacing[2],
  },
  searchTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
    minHeight: verticalScale(48),
  },
  searchTriggerText: {
    flex: 1,
    paddingVertical: spacing[3],
  },
  opponentInfo: {
    flex: 1,
  },
  selectedLevel: {
    marginTop: spacing[1],
  },
  selectedOpponentCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedLabel: {
    marginBottom: spacing[2],
  },
  selectedOpponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  publicBattleInfo: {
    alignItems: 'center',
    paddingVertical: spacing[4] * 3,
  },
  publicBattleTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  publicBattleText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueIconText: {
    fontSize: 14,
  },
});
