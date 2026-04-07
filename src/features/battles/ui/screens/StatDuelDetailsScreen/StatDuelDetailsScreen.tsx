import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen, AppModal } from '@/shared/ui';
import { STAT_DUEL_SPORTS } from '@/shared/constants';
import { battlesStrings } from '@/features/battles/string';
import type { StatDuelDetailsScreenViewProps } from '../../hooks/useStatDuelDetailsScreen';

function DropdownButton({
  label,
  value,
  placeholder,
  onPress,
  required = false,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  onPress: () => void;
  required?: boolean;
}) {
  return (
    <View style={styles.dropdownContainer}>
      <AppText variant="captionSm" color={colors.textSecondary}>
        {label}
        {required && ' *'}{' '}
        <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
      </AppText>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <AppText variant="body2" color={value ? colors.text : colors.textMuted}>
          {value || placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

export function StatDuelDetailsScreen(props: StatDuelDetailsScreenViewProps) {
  const {
    effectiveBattleMode,
    isStandardMode,
    isFantasyMode,
    selectedSport,
    selectedGame,
    selectedPosition,
    startTime,
    endTime,
    showSportModal,
    showGameModal,
    showPositionModal,
    setShowSportModal,
    setShowGameModal,
    setShowPositionModal,
    selectedSportData,
    selectedGameData,
    selectedPositionData,
    filteredGames,
    availablePositions,
    canContinue,
    onContinue,
    onBack,
    onSelectSport,
    onSelectGame,
    onSelectPosition,
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
              <Ionicons name="globe-outline" size={18} color={colors.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <AppText variant="label">{battlesStrings.statDuel.progress3of6}</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h3">{battlesStrings.statDuel.detailsTitle}</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {isFantasyMode
              ? battlesStrings.statDuel.detailsSubtitleFantasy
              : battlesStrings.statDuel.detailsSubtitleStandard}
          </AppText>
        </View>

        <View style={styles.modeIndicator}>
          <AppText variant="captionSm" style={{ fontWeight: '600' }}>
            {battlesStrings.statDuel.modeLabel}{' '}
            {effectiveBattleMode === 'STANDARD'
              ? battlesStrings.statDuel.modeStandard
              : effectiveBattleMode === 'FANTASY'
                ? battlesStrings.statDuel.modeFantasy
                : battlesStrings.statDuel.modeBothPicks}
          </AppText>
        </View>

        <DropdownButton
          label={battlesStrings.statDuel.chooseSport}
          value={selectedSportData ? `${selectedSportData.icon} ${selectedSportData.name}` : null}
          placeholder={battlesStrings.statDuel.selectSport}
          onPress={() => setShowSportModal(true)}
          required
        />

        {isStandardMode ? (
          <DropdownButton
            label={battlesStrings.statDuel.chooseEvent}
            value={selectedGameData?.name || null}
            placeholder={battlesStrings.statDuel.selectEvent}
            onPress={() => setShowGameModal(true)}
            required
          />
        ) : null}

        <DropdownButton
          label={battlesStrings.statDuel.choosePosition}
          value={selectedPositionData?.name || null}
          placeholder={battlesStrings.statDuel.selectPosition}
          onPress={() => setShowPositionModal(true)}
          required
        />

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <AppText variant="captionSm" color={colors.textSecondary} style={styles.dropdownLabel}>
              {battlesStrings.statDuel.startTime}{' '}
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown}>
              <AppText variant="body2">{startTime}</AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.timeColumn}>
            <AppText variant="captionSm" color={colors.textSecondary} style={styles.dropdownLabel}>
              {battlesStrings.statDuel.endTime}{' '}
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown}>
              <AppText variant="body2">{endTime}</AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lockTimeContainer}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <AppText variant="captionSm">
            {isStandardMode
              ? battlesStrings.statDuel.lockStandard
              : battlesStrings.statDuel.lockFantasy}
          </AppText>
        </View>

        {isFantasyMode ? (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <AppText
              variant="captionSm"
              color={colors.textSecondary}
              style={{ flex: 1, lineHeight: 18 }}
            >
              {battlesStrings.statDuel.fantasyInfo}
            </AppText>
          </View>
        ) : null}
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
        visible={showSportModal}
        onRequestClose={() => setShowSportModal(false)}
        presentation="bottom"
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <AppText variant="h4">{battlesStrings.statDuel.selectSport}</AppText>
            <TouchableOpacity onPress={() => setShowSportModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {STAT_DUEL_SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={styles.modalOption}
              onPress={() => onSelectSport(sport.id)}
            >
              <AppText style={styles.modalOptionIcon}>{sport.icon}</AppText>
              <AppText variant="body2" style={{ flex: 1 }}>
                {sport.name}
              </AppText>
              {selectedSport === sport.id ? (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </AppModal>

      <AppModal
        visible={showGameModal}
        onRequestClose={() => setShowGameModal(false)}
        presentation="bottom"
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <AppText variant="h4">{battlesStrings.statDuel.selectEvent}</AppText>
            <TouchableOpacity onPress={() => setShowGameModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.modalOption}
                onPress={() => onSelectGame(game.id)}
              >
                <AppText variant="body2" style={{ flex: 1 }}>
                  {game.name}
                </AppText>
                {selectedGame === game.id ? (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            ))
          ) : (
            <AppText variant="body2" color={colors.textSecondary} style={styles.noOptionsText}>
              {battlesStrings.statDuel.selectSportFirst}
            </AppText>
          )}
        </View>
      </AppModal>

      <AppModal
        visible={showPositionModal}
        onRequestClose={() => setShowPositionModal(false)}
        presentation="bottom"
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <AppText variant="h4">{battlesStrings.statDuel.selectPosition}</AppText>
            <TouchableOpacity onPress={() => setShowPositionModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {availablePositions.length > 0 ? (
            availablePositions.map((position) => (
              <TouchableOpacity
                key={position.id}
                style={styles.modalOption}
                onPress={() => onSelectPosition(position.id)}
              >
                <AppText variant="body2" style={{ flex: 1 }}>
                  {position.name}
                </AppText>
                {selectedPosition === position.id ? (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            ))
          ) : (
            <AppText variant="body2" color={colors.textSecondary} style={styles.noOptionsText}>
              {battlesStrings.statDuel.selectSportFirst}
            </AppText>
          )}
        </View>
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
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  titleSection: {
    marginBottom: spacing[4],
  },
  modeIndicator: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[2],
    marginBottom: spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dropdownContainer: {
    marginBottom: spacing[4],
  },
  dropdownLabel: {
    marginBottom: spacing[2],
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  timeColumn: {
    flex: 1,
  },
  lockTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueIconText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.lg * 2,
    borderTopRightRadius: radii.lg * 2,
    padding: spacing[4],
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    gap: spacing[2],
  },
  modalOptionIcon: {
    fontSize: 20,
  },
  noOptionsText: {
    textAlign: 'center',
    paddingVertical: spacing[4] * 2,
  },
});
