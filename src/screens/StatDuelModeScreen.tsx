import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface StatDuelModeScreenProps {
  navigation: any;
  route: any;
}

type BattleMode = 'STANDARD' | 'FANTASY' | 'BOTH_PICKS';

interface BattleModeOption {
  id: BattleMode;
  name: string;
  description: string;
  features: { color: string; text: string }[];
  borderColor: string;
}

const BATTLE_MODES: BattleModeOption[] = [
  {
    id: 'STANDARD',
    name: 'Standard',
    description: 'Both Players Pick Athletes From The Same Game.',
    features: [
      { color: COLORS.primary, text: 'Pick From The Same Game' },
      { color: '#FFD700', text: 'Locks At Game Kickoff' },
    ],
    borderColor: COLORS.text,
  },
  {
    id: 'FANTASY',
    name: 'Fantasy Mode',
    description: 'Both Players Can Pick Athletes From Different Games, Same Week.',
    features: [
      { color: COLORS.primary, text: 'Any Match This Week' },
      { color: '#FFD700', text: 'Locks At Earliest Kickoff' },
    ],
    borderColor: COLORS.text,
  },
  {
    id: 'BOTH_PICKS',
    name: 'Both Picks',
    description: 'Both Players Pick Athletes From The Same Game And Battle On A Specific Stat.',
    features: [],
    borderColor: COLORS.primary,
  },
];

export default function StatDuelModeScreen({ navigation, route }: StatDuelModeScreenProps) {
  const { visibility } = route?.params || {};
  const [selectedMode, setSelectedMode] = useState<BattleMode | null>(null);

  const handleSelectMode = (mode: BattleMode) => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (selectedMode) {
      navigation.navigate('StatDuelDetails', { 
        visibility,
        battleMode: selectedMode,
      });
    }
  };

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
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>2/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Select Battle Mode</Text>
          <Text style={styles.sectionSubtitle}>Choose How Your Battle Will Be Resolved</Text>
        </View>

        {BATTLE_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeCard,
              selectedMode === mode.id && styles.modeCardSelected,
              { borderColor: selectedMode === mode.id ? COLORS.primary : mode.borderColor === COLORS.primary ? COLORS.primary : COLORS.inputBorder },
            ]}
            onPress={() => handleSelectMode(mode.id)}
          >
            <View style={styles.modeCardHeader}>
              <View style={styles.modeInfo}>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedMode === mode.id && styles.radioButtonSelected,
              ]}>
                {selectedMode === mode.id && <View style={styles.radioButtonInner} />}
              </View>
            </View>

            {mode.features.length > 0 && (
              <View style={styles.featuresList}>
                {mode.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureDot, { backgroundColor: feature.color }]} />
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !selectedMode && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedMode}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <View style={styles.continueIcon}>
            <Text style={styles.continueIconText}>⚔</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  modeCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
  },
  modeCardSelected: {
    borderWidth: 2,
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modeInfo: {
    flex: 1,
    marginRight: SIZES.padding,
  },
  modeName: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    lineHeight: 18,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  featuresList: {
    marginTop: SIZES.padding,
    gap: SIZES.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
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
});
