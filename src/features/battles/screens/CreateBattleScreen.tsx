import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/shared/theme';
import { BattleService } from '@/features/battles/api';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface CreateBattleScreenProps {
  navigation: any;
  route: any;
}

type OutcomeType = 'WIN' | 'LOSE';

interface DropdownOption {
  label: string;
  value: string;
}

export default function CreateBattleScreen({ navigation, route }: CreateBattleScreenProps) {
  const { user } = useAuth();

  const { prefillTitle, prefillEventId, prefillDescription, homeTeam, awayTeam, visibility } =
    route?.params || {};

  const [title, setTitle] = useState(prefillTitle || '');
  const [eventId, setEventId] = useState(prefillEventId || '');
  const [stake, setStake] = useState('0');
  const [loading, setLoading] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [showOutcomePicker, setShowOutcomePicker] = useState(false);

  const deriveTeamsFromTitle = (titleStr: string | undefined) => {
    if (!titleStr) return { home: undefined, away: undefined };
    const parts = titleStr.split(' vs ');
    if (parts.length === 2) {
      return { home: parts[0].trim(), away: parts[1].trim() };
    }
    return { home: undefined, away: undefined };
  };

  const { home: derivedHome, away: derivedAway } = deriveTeamsFromTitle(prefillTitle);
  const finalHomeTeam = homeTeam || derivedHome;
  const finalAwayTeam = awayTeam || derivedAway;

  const teamOptions: DropdownOption[] =
    finalHomeTeam && finalAwayTeam
      ? [
          { label: finalHomeTeam, value: 'home' },
          { label: finalAwayTeam, value: 'away' },
        ]
      : [];

  const outcomeOptions: DropdownOption[] = [
    { label: 'Will Win', value: 'WIN' },
    { label: 'Will Lose', value: 'LOSE' },
  ];

  const getSelectedTeamLabel = () => {
    if (!selectedTeam) return 'Select Team';
    const option = teamOptions.find((o) => o.value === selectedTeam);
    return option?.label || 'Select Team';
  };

  const getSelectedOutcomeLabel = () => {
    if (!selectedOutcome) return 'Select Outcome';
    const option = outcomeOptions.find((o) => o.value === selectedOutcome);
    return option?.label || 'Select Outcome';
  };

  const generateBattleDescription = () => {
    if (selectedTeam && selectedOutcome && teamOptions.length > 0) {
      const teamName = teamOptions.find((o) => o.value === selectedTeam)?.label;
      const outcome = selectedOutcome === 'WIN' ? 'will win' : 'will lose';
      return `I predict ${teamName} ${outcome}`;
    }
    return '';
  };

  const getCreatorWinningTeam = () => {
    if (!selectedTeam || !selectedOutcome || !finalHomeTeam || !finalAwayTeam) return undefined;
    const pickedHome = selectedTeam === 'home';
    const willWin = selectedOutcome === 'WIN';
    if (pickedHome && willWin) return finalHomeTeam;
    if (pickedHome && !willWin) return finalAwayTeam;
    if (!pickedHome && willWin) return finalAwayTeam;
    if (!pickedHome && !willWin) return finalHomeTeam;
    return undefined;
  };

  const onCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a battle title');
      return;
    }

    if (teamOptions.length > 0 && !selectedTeam) {
      Alert.alert('Error', 'Please select a team');
      return;
    }

    if (teamOptions.length > 0 && !selectedOutcome) {
      Alert.alert('Error', 'Please select an outcome');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a battle');
      return;
    }

    setLoading(true);

    const description = generateBattleDescription();
    const creatorPickTeam = getCreatorWinningTeam();

    const { data, error } = await BattleService.createBattle({
      creatorId: user.id,
      title: title.trim(),
      description: description || undefined,
      eventId: eventId.trim() || undefined,
      stake: parseInt(stake) || 0,
      creatorPick: creatorPickTeam,
      visibility: visibility || 'public',
    });

    setLoading(false);

    if (error) {
      Alert.alert('Failed', error.message);
      return;
    }

    navigation.goBack();
  };

  const DropdownModal = ({
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
  }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.modalOption}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <Text style={styles.modalOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Battle</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chiefs vs Bills - Who wins?"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Battle Setup - Team and Outcome Dropdowns */}
          {teamOptions.length > 0 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Battle Setup</Text>
              <Text style={styles.setupHint}>Select your prediction for this game</Text>

              <View style={styles.dropdownRow}>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowTeamPicker(true)}>
                  <Text style={[styles.dropdownText, !selectedTeam && styles.dropdownPlaceholder]}>
                    {getSelectedTeamLabel()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowOutcomePicker(true)}
                >
                  <Text
                    style={[styles.dropdownText, !selectedOutcome && styles.dropdownPlaceholder]}
                  >
                    {getSelectedOutcomeLabel()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {selectedTeam && selectedOutcome && (
                <View style={styles.predictionPreview}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.predictionText}>{generateBattleDescription()}</Text>
                </View>
              )}
            </View>
          )}

          {/* Event ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Game/Event ID</Text>
            <TextInput
              style={[styles.input, eventId && styles.inputDisabled]}
              placeholder="Sports event ID"
              placeholderTextColor={COLORS.textSecondary}
              value={eventId}
              onChangeText={setEventId}
              editable={!prefillEventId}
            />
            {eventId && <Text style={styles.hint}>Linked to live game data</Text>}
          </View>

          {/* Stake */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stake (BC)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={COLORS.textSecondary}
              value={stake}
              onChangeText={(text) => setStake(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Battle Coins to wager (optional)</Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={onCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="flash" size={20} color={COLORS.white} />
              <Text style={styles.createButtonText}>Create Battle</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <DropdownModal
        visible={showTeamPicker}
        onClose={() => setShowTeamPicker(false)}
        options={teamOptions}
        onSelect={(value) => setSelectedTeam(value)}
        title="Select Team"
      />

      <DropdownModal
        visible={showOutcomePicker}
        onClose={() => setShowOutcomePicker(false)}
        options={outcomeOptions}
        onSelect={(value) => setSelectedOutcome(value as OutcomeType)}
        title="Select Outcome"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  form: {
    marginTop: SIZES.padding,
  },
  inputGroup: {
    marginBottom: SIZES.padding * 1.5,
  },
  label: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    color: COLORS.text,
    fontSize: SIZES.font,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  setupHint: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.padding,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  dropdownPlaceholder: {
    color: COLORS.textSecondary,
  },
  predictionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginTop: SIZES.padding,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  predictionText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
    gap: SIZES.base,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  modalOptionText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    textAlign: 'center',
  },
});
