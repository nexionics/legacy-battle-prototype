import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface StatDuelDetailsScreenProps {
  navigation: any;
  route: any;
}

const SPORTS = [
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
];

const MOCK_GAMES = [
  { id: '1', name: 'Chiefs vs Bills, Week 5', sport: 'NFL' },
  { id: '2', name: 'Cowboys vs Eagles, Week 5', sport: 'NFL' },
  { id: '3', name: 'Lakers vs Celtics', sport: 'NBA' },
  { id: '4', name: 'Warriors vs Suns', sport: 'NBA' },
];

const BATTLE_TYPES = [
  { id: 'private', name: 'Private' },
  { id: 'public', name: 'Public' },
];

export default function StatDuelDetailsScreen({ navigation, route }: StatDuelDetailsScreenProps) {
  const { visibility, battleMode } = route?.params || {};
  
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedBattleType, setSelectedBattleType] = useState<string>(visibility || 'private');
  const [startTime, setStartTime] = useState<string>('Auto');
  const [endTime, setEndTime] = useState<string>('Auto');
  
  const [showSportModal, setShowSportModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showBattleTypeModal, setShowBattleTypeModal] = useState(false);

  const filteredGames = selectedSport 
    ? MOCK_GAMES.filter(g => g.sport === selectedSport)
    : MOCK_GAMES;

  const selectedSportData = SPORTS.find(s => s.id === selectedSport);
  const selectedGameData = MOCK_GAMES.find(g => g.id === selectedGame);

  const handleContinue = () => {
    navigation.navigate('StatDuelChampion', {
      visibility: selectedBattleType,
      battleMode,
      sport: selectedSport,
      game: selectedGameData,
    });
  };

  const canContinue = selectedSport && selectedGame;

  const DropdownButton = ({ 
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
  }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>
        {label}{required && ' *'} <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
      </Text>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Create Battle</Text>
            <View style={styles.headerIcon}>
              <Ionicons name="globe-outline" size={18} color={COLORS.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>3/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Create Battle</Text>
          <Text style={styles.sectionSubtitle}>Add Battle Details To Create Battle</Text>
        </View>

        <DropdownButton
          label="Choose Sport"
          value={selectedSportData ? `${selectedSportData.icon} ${selectedSportData.name}` : null}
          placeholder="Select Game"
          onPress={() => setShowSportModal(true)}
          required
        />

        <DropdownButton
          label="Choose Event"
          value={selectedGameData?.name || null}
          placeholder="Select Event"
          onPress={() => setShowGameModal(true)}
          required
        />

        <DropdownButton
          label="Battle Type"
          value={selectedBattleType === 'private' ? 'Private' : 'Public'}
          placeholder="Select Type"
          onPress={() => setShowBattleTypeModal(true)}
          required
        />

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.dropdownLabel}>
              Start Time <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            </Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{startTime}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.timeColumn}>
            <Text style={styles.dropdownLabel}>
              End Time <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            </Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{endTime}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lockTimeContainer}>
          <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
          <Text style={styles.lockTimeText}>Lock Time: Locks At Kickoff (8:00 PM)</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <View style={styles.continueIcon}>
            <Text style={styles.continueIconText}>⚔</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sport Selection Modal */}
      <Modal visible={showSportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Sport</Text>
              <TouchableOpacity onPress={() => setShowSportModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedSport(sport.id);
                  setSelectedGame(null);
                  setShowSportModal(false);
                }}
              >
                <Text style={styles.modalOptionIcon}>{sport.icon}</Text>
                <Text style={styles.modalOptionText}>{sport.name}</Text>
                {selectedSport === sport.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Game Selection Modal */}
      <Modal visible={showGameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Event</Text>
              <TouchableOpacity onPress={() => setShowGameModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedGame(game.id);
                    setShowGameModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{game.name}</Text>
                  {selectedGame === game.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noOptionsText}>Select a sport first</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Battle Type Modal */}
      <Modal visible={showBattleTypeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Battle Type</Text>
              <TouchableOpacity onPress={() => setShowBattleTypeModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {BATTLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedBattleType(type.id);
                  setShowBattleTypeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{type.name}</Text>
                {selectedBattleType === type.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  dropdownContainer: {
    marginBottom: SIZES.padding,
  },
  dropdownLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  dropdownPlaceholder: {
    color: COLORS.textMuted,
  },
  timeRow: {
    flexDirection: 'row',
    gap: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  timeColumn: {
    flex: 1,
  },
  lockTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  lockTimeText: {
    color: COLORS.text,
    fontSize: SIZES.small,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    gap: SIZES.base,
  },
  modalOptionIcon: {
    fontSize: 20,
  },
  modalOptionText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  noOptionsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    paddingVertical: SIZES.padding * 2,
  },
});
