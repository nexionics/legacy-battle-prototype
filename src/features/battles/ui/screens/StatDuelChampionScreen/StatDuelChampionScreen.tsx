import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Screen, ScreenHeader, ProgressBar, Avatar, SearchInput } from '@/shared/ui';
import { SelectionModal } from '@/shared/ui';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import { getInitials } from '@/shared/utils';
import type { StatDuelPlayer } from '@/shared/types';
import { DIRECTION_OPTIONS, STAKE_OPTIONS } from '@/shared/constants';
import { battlesFormatStakeBc, battlesStrings } from '@/features/battles/string';
import type { StatDuelChampionScreenViewProps } from '../../hooks/useStatDuelChampionScreen';

export function StatDuelChampionScreen(props: StatDuelChampionScreenViewProps) {
  const {
    player,
    statCategory,
    stake,
    direction,
    showPlayerModal,
    showStatModal,
    showStakeModal,
    showDirectionModal,
    setShowPlayerModal,
    setShowStatModal,
    setShowStakeModal,
    setShowDirectionModal,
    playerSearch,
    setPlayerSearch,
    isStandardMode,
    filteredPlayers,
    statOptions,
    selectedDirectionData,
    statDescription,
    canContinue,
    onContinue,
    onBack,
    onSelectPlayer,
    onSelectStatCategory,
    onSelectStake,
    onSelectDirection,
  } = props;

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={battlesStrings.common.createBattle}
          onBack={onBack}
          rightSlot={
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          }
        />

        <View style={styles.progressContainer}>
          <ProgressBar progress={0.66} />
          <AppText variant="label">{battlesStrings.statDuel.progress4of6}</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h4">{battlesStrings.statDuel.championHeading}</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {battlesStrings.statDuel.championSubtitle}
          </AppText>
        </View>

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            {battlesStrings.statDuel.pickPlayer}{' '}
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowPlayerModal(true)}>
            <AppText variant="body2" color={player ? colors.text : colors.muted}>
              {player ? player.name : battlesStrings.statDuel.pickPlayersPlaceholder}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            {battlesStrings.statDuel.statCategory}{' '}
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStatModal(true)}>
            <AppText variant="body2" color={statCategory ? colors.text : colors.muted}>
              {statCategory?.name || battlesStrings.statDuel.selectStatCategory}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isStandardMode ? (
          <View style={styles.dropdownContainer}>
            <AppText variant="label" color={colors.textSecondary}>
              {battlesStrings.statDuel.chooseDirection}{' '}
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowDirectionModal(true)}>
              <AppText variant="body2" color={direction ? colors.text : colors.muted}>
                {selectedDirectionData?.label || battlesStrings.statDuel.selectDirection}
              </AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            {battlesStrings.statDuel.stakeBc}{' '}
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStakeModal(true)}>
            <AppText variant="body2">{battlesFormatStakeBc(stake)}</AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {player && statCategory ? (
          <View style={styles.infoCard}>
            <AppText variant="label">{battlesStrings.statDuel.statDescription}</AppText>
            <AppText variant="body2" color={colors.textSecondary}>
              {statDescription}
            </AppText>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <AppText variant="label">{battlesStrings.statDuel.officialRules}</AppText>
          <AppText variant="captionSm" color={colors.textSecondary}>
            {battlesStrings.statDuel.championRulesSnippet}
          </AppText>
        </View>
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
          <AppText variant="body1">⚔</AppText>
        </TouchableOpacity>
      </View>

      <Modal visible={showPlayerModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlayerModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <AppText variant="h5">{battlesStrings.statDuel.searchPlayersTitle}</AppText>
              <TouchableOpacity onPress={() => setShowPlayerModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <SearchInput
              value={playerSearch}
              onChangeText={setPlayerSearch}
              placeholder={battlesStrings.statDuel.searchPlayersPlaceholder}
              style={styles.searchSpacing}
            />

            <View style={styles.filterTabs}>
              <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
                <Ionicons name="person-outline" size={16} color={colors.white} />
                <AppText variant="captionSm" color={colors.white}>
                  {battlesStrings.statDuel.filterPs}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Ionicons name="filter-outline" size={16} color={colors.textSecondary} />
                <AppText variant="captionSm" color={colors.textSecondary}>
                  {battlesStrings.statDuel.filterLabel}
                </AppText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.playerList}>
              {filteredPlayers.map((row) => (
                <TouchableOpacity
                  key={row.id}
                  style={styles.playerOption}
                  onPress={() => onSelectPlayer(row as StatDuelPlayer)}
                >
                  <Avatar
                    initials={getInitials(row.name)}
                    size="sm"
                    backgroundColor={colors.primary}
                    borderColor={colors.primary}
                    textColor={colors.white}
                  />
                  <View style={styles.playerInfo}>
                    <AppText variant="label">{row.name}</AppText>
                    <AppText variant="captionSm" color={colors.textSecondary}>
                      {row.position}
                    </AppText>
                  </View>
                  <View style={styles.playerTeamBadge}>
                    <AppText variant="captionSm">{row.team}</AppText>
                    <View style={styles.activeIndicator}>
                      <View style={styles.activeDot} />
                      <AppText variant="captionSm" color={colors.success}>
                        {battlesStrings.statDuel.playerActive}
                      </AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <SelectionModal
        visible={showStatModal}
        title={battlesStrings.statDuel.modalStatCategory}
        options={statOptions}
        selectedKey={statCategory?.id ?? undefined}
        onSelect={onSelectStatCategory}
        onClose={() => setShowStatModal(false)}
      />

      <SelectionModal
        visible={showStakeModal}
        title={battlesStrings.statDuel.modalStake}
        options={STAKE_OPTIONS}
        selectedKey={stake}
        onSelect={onSelectStake}
        onClose={() => setShowStakeModal(false)}
      />

      <SelectionModal
        visible={showDirectionModal}
        title={battlesStrings.statDuel.modalDirection}
        options={DIRECTION_OPTIONS}
        selectedKey={direction || undefined}
        onSelect={onSelectDirection}
        onClose={() => setShowDirectionModal(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
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
  titleSection: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  dropdownContainer: {
    marginBottom: spacing[4],
    gap: spacing[2],
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
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
    gap: spacing[2],
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
    paddingVertical: verticalScale(16),
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing[4],
    maxHeight: '80%',
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
  searchSpacing: {
    marginBottom: spacing[4],
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: spacing[1],
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  playerList: {
    maxHeight: 400,
  },
  playerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    gap: spacing[2],
  },
  playerInfo: {
    flex: 1,
  },
  playerTeamBadge: {
    alignItems: 'flex-end',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
});
