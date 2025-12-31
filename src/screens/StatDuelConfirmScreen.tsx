import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface StatDuelConfirmScreenProps {
  navigation: any;
  route: any;
}

export default function StatDuelConfirmScreen({ navigation, route }: StatDuelConfirmScreenProps) {
  const { 
    visibility, 
    battleMode, 
    sport, 
    game, 
    player, 
    statCategory, 
    stake, 
    opponent 
  } = route?.params || {};
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBattle = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Battle Created!',
        'Your Stat Duel has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    }, 1500);
  };

  const getBattleModeLabel = () => {
    switch (battleMode) {
      case 'STANDARD': return 'Standard';
      case 'FANTASY': return 'Fantasy Mode';
      case 'BOTH_PICKS': return 'Both Picks';
      default: return battleMode;
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelOpponent', { visibility, battleMode, sport, game, player, statCategory, stake });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
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
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>6/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Confirm Challenge Details</Text>
          <Text style={styles.sectionSubtitle}>Confirm The Details Of Your Battle</Text>
        </View>

        {/* Battle Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryLabel}>Stat Category:</Text>
            <Text style={styles.summaryValue}>{statCategory?.name || 'Passing Yards'} (H2H)</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryLabel}>Game/Event:</Text>
            <Text style={styles.summaryValue}>{game?.name || 'Chiefs vs Bills, Week 5'}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryLabel}>Player:</Text>
            <Text style={[styles.summaryValue, styles.primaryText]}>
              {player?.name || 'Mahomes'}
            </Text>
          </View>
        </View>

        {/* Lock Time */}
        <View style={styles.lockTimeContainer}>
          <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
          <Text style={styles.lockTimeText}>Lock: "Locks At Kickoff — Sun 8:00 PM</Text>
        </View>

        {/* Official Rules */}
        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Official Rules</Text>
          <Text style={styles.rulesText}>
            Tie Rule: If Both QBs Have Same Passing Yards — Tie.{'\n'}
            Minimum Attempts: x10 Passes Required For Each QB.{'\n'}
            Evidence: Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.{'\n'}
            Info Note: *Rules Are Automatically Enforced At Resolution
          </Text>
        </View>

        {/* Oracle Verified */}
        <View style={styles.oracleContainer}>
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

        {/* Additional Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Battle Mode</Text>
            <Text style={styles.detailValue}>{getBattleModeLabel()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Visibility</Text>
            <Text style={styles.detailValue}>{visibility === 'private' ? 'Private' : 'Public'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stake</Text>
            <Text style={styles.detailValue}>{stake} BC</Text>
          </View>
          {opponent && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Opponent</Text>
              <Text style={styles.detailValue}>{opponent.display_name}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.lockTimeFooter}>
          <Ionicons name="lock-closed" size={14} color={COLORS.primary} />
          <Text style={styles.lockTimeFooterText}>Lock Time: Locks At Kickoff (8:00 PM)</Text>
        </View>
        <TouchableOpacity 
          style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]}
          onPress={handleCreateBattle}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Continue</Text>
              <View style={styles.continueIcon}>
                <Text style={styles.continueIconText}>⚔</Text>
              </View>
            </>
          )}
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
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    gap: SIZES.base,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.primary,
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
  rulesContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  rulesTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  rulesText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    lineHeight: 20,
  },
  oracleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
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
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  lockTimeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base / 2,
    marginBottom: SIZES.padding,
  },
  lockTimeFooterText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
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
    opacity: 0.7,
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
