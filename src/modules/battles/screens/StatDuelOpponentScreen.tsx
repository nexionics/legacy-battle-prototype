import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../../shared/constants/theme';

interface StatDuelOpponentScreenProps {
  navigation: any;
  route: any;
}

const MOCK_OPPONENTS = [
  { id: '1', username: 'player1', display_name: 'Alex Johnson' },
  { id: '2', username: 'player2', display_name: 'Sarah Smith' },
  { id: '3', username: 'player3', display_name: 'Mike Brown' },
  { id: '4', username: 'player4', display_name: 'Emily Davis' },
  { id: '5', username: 'player5', display_name: 'Chris Wilson' },
];

export default function StatDuelOpponentScreen({ navigation, route }: StatDuelOpponentScreenProps) {
  const { visibility, battleMode, sport, game, player, statCategory, stake } = route?.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpponent, setSelectedOpponent] = useState<typeof MOCK_OPPONENTS[0] | null>(null);

  const filteredOpponents = MOCK_OPPONENTS.filter(o => 
    o.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    navigation.navigate('StatDuelConfirm', {
      visibility,
      battleMode,
      sport,
      game,
      player,
      statCategory,
      stake,
      opponent: selectedOpponent,
    });
  };

  const canContinue = selectedOpponent || visibility === 'public';

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelChampion', { visibility, battleMode, sport, game });
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
            <View style={[styles.progressFill, { width: '83%' }]} />
          </View>
          <Text style={styles.progressText}>5/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Pick An Opponent For Battle</Text>
          <Text style={styles.sectionSubtitle}>Pick Your Opponent And Players To Battle On.</Text>
        </View>

        {visibility === 'private' ? (
          <>
            <Text style={styles.inputLabel}>Add Opponent</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="search opponent"
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {searchQuery.length > 0 && (
              <View style={styles.searchResults}>
                {filteredOpponents.map((opponent) => (
                  <TouchableOpacity
                    key={opponent.id}
                    style={[
                      styles.opponentItem,
                      selectedOpponent?.id === opponent.id && styles.opponentItemSelected,
                    ]}
                    onPress={() => setSelectedOpponent(opponent)}
                  >
                    <View style={styles.opponentAvatar}>
                      <Text style={styles.opponentAvatarText}>
                        {getInitials(opponent.display_name)}
                      </Text>
                    </View>
                    <View style={styles.opponentInfo}>
                      <Text style={styles.opponentName}>{opponent.display_name}</Text>
                      <Text style={styles.opponentUsername}>@{opponent.username}</Text>
                    </View>
                    {selectedOpponent?.id === opponent.id && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedOpponent && (
              <View style={styles.selectedOpponentCard}>
                <Text style={styles.selectedLabel}>Selected Opponent</Text>
                <View style={styles.selectedOpponentRow}>
                  <View style={styles.opponentAvatar}>
                    <Text style={styles.opponentAvatarText}>
                      {getInitials(selectedOpponent.display_name)}
                    </Text>
                  </View>
                  <View style={styles.opponentInfo}>
                    <Text style={styles.opponentName}>{selectedOpponent.display_name}</Text>
                    <Text style={styles.opponentUsername}>@{selectedOpponent.username}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOpponent(null)}>
                    <Ionicons name="close-circle" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.publicBattleInfo}>
            <Ionicons name="globe-outline" size={48} color={COLORS.primary} />
            <Text style={styles.publicBattleTitle}>Public Battle</Text>
            <Text style={styles.publicBattleText}>
              This battle will be visible to all users on the Explore page. Anyone can join and accept your challenge.
            </Text>
          </View>
        )}
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
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
    paddingVertical: SIZES.padding,
  },
  searchResults: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  opponentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    gap: SIZES.base,
  },
  opponentItemSelected: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  opponentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentAvatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  opponentInfo: {
    flex: 1,
  },
  opponentName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  opponentUsername: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  selectedOpponentCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectedLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  selectedOpponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  publicBattleInfo: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 3,
  },
  publicBattleTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  publicBattleText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    lineHeight: 22,
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
