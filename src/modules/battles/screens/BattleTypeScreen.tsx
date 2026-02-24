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
import { COLORS, SIZES } from '../../../shared/constants/theme';

interface BattleTypeScreenProps {
  navigation: any;
}

type BattleType = 'GAME_DUEL' | 'STAT_DUEL' | 'SKILL_BATTLE';

interface BattleTypeOption {
  id: BattleType;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  features: { icon: keyof typeof Ionicons.glyphMap; text: string }[];
  enabled: boolean;
}

const BATTLE_TYPES: BattleTypeOption[] = [
  {
    id: 'GAME_DUEL',
    name: 'Game Duel',
    description: 'Head-to-Head On Any Game.',
    icon: '🏆',
    iconColor: '#FFD700',
    badge: 'Oracle Verifies',
    badgeColor: COLORS.primary,
    features: [
      { icon: 'checkmark-circle', text: 'Official Game Results' },
      { icon: 'flash', text: 'Instant Results' },
    ],
    enabled: true,
  },
  {
    id: 'STAT_DUEL',
    name: 'Stat Duel',
    description: 'Compete Using Real World Stats.',
    icon: '📊',
    iconColor: '#2196F3',
    badge: 'Oracle Verifies',
    badgeColor: COLORS.primary,
    features: [
      { icon: 'stats-chart', text: 'Official Stats' },
      { icon: 'flash', text: 'Instant Results' },
    ],
    enabled: true,
  },
  {
    id: 'SKILL_BATTLE',
    name: 'Skill Battle',
    description: 'Showcase Your Skills With Proof.',
    icon: '⚡',
    iconColor: COLORS.primary,
    badge: 'Neutral Attester Verifies',
    badgeColor: '#9C27B0',
    features: [
      { icon: 'videocam', text: 'Video Evidence Needed' },
      { icon: 'people', text: '3 Neutral Attesters' },
    ],
    enabled: false,
  },
];

export default function BattleTypeScreen({ navigation }: BattleTypeScreenProps) {
  const [selectedType, setSelectedType] = useState<BattleType | null>(null);

  const handleSelectType = (type: BattleTypeOption) => {
    if (!type.enabled) {
      return;
    }
    setSelectedType(type.id);
    
    if (type.id === 'GAME_DUEL') {
      navigation.navigate('StartBattle');
    } else if (type.id === 'STAT_DUEL') {
      navigation.navigate('StatDuelMode');
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
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Create Battle</Text>
            <View style={styles.headerIcon}>
              <Ionicons name="globe-outline" size={20} color={COLORS.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '16.67%' }]} />
          </View>
          <Text style={styles.progressText}>1/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Choose Battle Type</Text>
          <Text style={styles.sectionSubtitle}>Choose The Type Of Battle You Want To Create</Text>
        </View>

        {BATTLE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              selectedType === type.id && styles.typeCardSelected,
              !type.enabled && styles.typeCardDisabled,
            ]}
            onPress={() => handleSelectType(type)}
            activeOpacity={type.enabled ? 0.7 : 1}
          >
            <View style={styles.typeCardHeader}>
              <View style={[styles.badge, { backgroundColor: `${type.badgeColor}20` }]}>
                <Ionicons 
                  name={type.id === 'SKILL_BATTLE' ? 'eye' : 'shield-checkmark'} 
                  size={12} 
                  color={type.badgeColor} 
                />
                <Text style={[styles.badgeText, { color: type.badgeColor }]}>{type.badge}</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedType === type.id && styles.radioButtonSelected,
              ]}>
                {selectedType === type.id && <View style={styles.radioButtonInner} />}
              </View>
            </View>

            <View style={styles.typeCardContent}>
              <View style={styles.typeIconContainer}>
                <Text style={styles.typeIcon}>{type.icon}</Text>
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>{type.name}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
              </View>
            </View>

            <View style={styles.featuresList}>
              {type.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name={feature.icon} size={14} color={COLORS.primary} />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>

            {!type.enabled && (
              <View style={styles.comingSoonOverlay}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.oracleInfo}>
          <View style={styles.oracleIconContainer}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.oracleTextContainer}>
            <Text style={styles.oracleTitle}>Oracle Verified</Text>
            <Text style={styles.oracleDescription}>
              Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  typeCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  typeCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  typeCardDisabled: {
    opacity: 0.6,
  },
  typeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: SIZES.radius,
    gap: 4,
  },
  badgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
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
  typeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  typeDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  featuresList: {
    gap: SIZES.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: SIZES.radius,
  },
  comingSoonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  oracleInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding * 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SIZES.padding,
  },
  oracleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oracleTextContainer: {
    flex: 1,
  },
  oracleTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  oracleDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    lineHeight: 18,
  },
});
