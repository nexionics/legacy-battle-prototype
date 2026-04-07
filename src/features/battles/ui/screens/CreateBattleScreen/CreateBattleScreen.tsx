import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText, Screen, Input, AppModal } from '@/shared/ui';
import type { DropdownOption } from '@/shared/types';
import { battlesStrings } from '@/features/battles/string';
import type { CreateBattleScreenViewProps } from '../../hooks/useCreateBattleScreen';

function DropdownModal({
  visible,
  onClose,
  options,
  onSelect,
  title: modalTitle,
}: {
  visible: boolean;
  onClose: () => void;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  title: string;
}) {
  return (
    <AppModal visible={visible} onRequestClose={onClose} presentation="center" animationType="fade">
      <View style={styles.modalContent}>
        <AppText variant="h4" style={styles.modalTitle}>
          {modalTitle}
        </AppText>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.modalOption}
            onPress={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            <AppText variant="body2" style={{ textAlign: 'center' }}>
              {option.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </AppModal>
  );
}

export function CreateBattleScreen(props: CreateBattleScreenViewProps) {
  const {
    prefillEventId,
    title,
    eventId,
    stake,
    selectedTeam,
    selectedOutcome,
    showTeamPicker,
    showOutcomePicker,
    teamOptions,
    outcomeOptions,
    selectedTeamLabel,
    selectedOutcomeLabel,
    battleDescription,
    showTeamSetup,
    showPredictionPreview,
    createLoading,
    setTitle,
    setEventId,
    setStake,
    setSelectedTeam,
    setShowTeamPicker,
    setShowOutcomePicker,
    onBack,
    onCreate,
    onSelectOutcome,
  } = props;

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText variant="h4">{battlesStrings.createBattle.screenTitle}</AppText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          <Input
            label={battlesStrings.createBattle.titleLabel}
            value={title}
            onChangeText={setTitle}
            placeholder={battlesStrings.createBattle.titlePlaceholder}
            placeholderTextColor={colors.textSecondary}
            maxLength={100}
            required
            containerStyle={styles.inputGroup}
            inputTextStyle={styles.inputFont}
          />

          {showTeamSetup ? (
            <View style={styles.inputGroup}>
              <AppText variant="label" style={styles.label}>
                {battlesStrings.createBattle.battleSetup}
              </AppText>
              <AppText variant="helper" color={colors.textSecondary} style={styles.setupHint}>
                {battlesStrings.createBattle.setupHint}
              </AppText>

              <View style={styles.dropdownRow}>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowTeamPicker(true)}>
                  <AppText
                    variant="body2"
                    color={selectedTeam ? colors.text : colors.textSecondary}
                  >
                    {selectedTeamLabel}
                  </AppText>
                  <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowOutcomePicker(true)}
                >
                  <AppText
                    variant="body2"
                    color={selectedOutcome ? colors.text : colors.textSecondary}
                  >
                    {selectedOutcomeLabel}
                  </AppText>
                  <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {showPredictionPreview ? (
                <View style={styles.predictionPreview}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <AppText variant="body2" style={{ flex: 1 }}>
                    {battleDescription}
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Input
              label={battlesStrings.createBattle.eventIdLabel}
              value={eventId}
              onChangeText={setEventId}
              placeholder={battlesStrings.createBattle.eventIdPlaceholder}
              placeholderTextColor={colors.textSecondary}
              editable={!prefillEventId}
              wrapperStyle={eventId ? styles.inputDisabled : undefined}
              inputTextStyle={styles.inputFont}
            />
            {eventId ? (
              <AppText variant="helper" color={colors.textSecondary} style={styles.hint}>
                {battlesStrings.createBattle.linkedGame}
              </AppText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Input
              label={battlesStrings.createBattle.stakeLabel}
              value={stake}
              onChangeText={(text) => setStake(text.replace(/[^0-9]/g, ''))}
              placeholder={battlesStrings.createBattle.stakePlaceholder}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              inputTextStyle={styles.inputFont}
            />
            <AppText variant="helper" color={colors.textSecondary} style={styles.hint}>
              {battlesStrings.createBattle.stakeHint}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, createLoading && styles.createButtonDisabled]}
          onPress={onCreate}
          disabled={createLoading}
        >
          {createLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="flash" size={20} color={colors.white} />
              <AppText variant="buttonMd" color={colors.white}>
                {battlesStrings.createBattle.createButton}
              </AppText>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <DropdownModal
        visible={showTeamPicker}
        onClose={() => setShowTeamPicker(false)}
        options={teamOptions}
        onSelect={(value) => setSelectedTeam(value)}
        title={battlesStrings.createBattle.modalSelectTeam}
      />

      <DropdownModal
        visible={showOutcomePicker}
        onClose={() => setShowOutcomePicker(false)}
        options={outcomeOptions}
        onSelect={onSelectOutcome}
        title={battlesStrings.createBattle.modalSelectOutcome}
      />
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
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  form: {
    marginTop: spacing[4],
  },
  inputGroup: {
    marginBottom: spacing[4] * 1.5,
  },
  label: {
    marginBottom: spacing[2],
  },
  inputFont: {
    fontSize: fontSizes.sm,
  },
  hint: {
    marginTop: spacing[2] / 2,
  },
  setupHint: {
    marginBottom: spacing[4],
  },
  inputDisabled: {
    opacity: 0.7,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  predictionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
    backgroundColor: colors.primaryTint,
    padding: spacing[4],
    borderRadius: radii.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    marginTop: spacing[4],
    marginBottom: spacing[4] * 2,
    gap: spacing[2],
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
});
