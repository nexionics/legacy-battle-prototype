import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../../shared/constants/theme';

interface BattleVisibilityScreenProps {
  navigation: any;
  route: any;
}

export default function BattleVisibilityScreen({ navigation, route }: BattleVisibilityScreenProps) {
  // Check if we have game data passed from AllUpcomingGamesScreen
  const { prefillTitle, prefillEventId, homeTeam, awayTeam } = route?.params || {};
  const hasGameData = !!prefillTitle && !!prefillEventId;

  const handleSelectVisibility = (visibility: 'private' | 'public' | 'crew') => {
    if (hasGameData) {
      navigation.navigate('CreateBattle', {
        prefillTitle,
        prefillEventId,
        homeTeam,
        awayTeam,
        visibility,
      });
    } else {
      navigation.navigate('BattleType', { visibility });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Select Battle Type</Text>
          <Text style={styles.subtitle}>Choose The Type Of Battle You Want To Create</Text>
        </View>

        {/* Private Option */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleSelectVisibility('private')}
        >
          <View style={styles.optionIconContainer}>
            <View style={styles.privateIcon}>
              <Ionicons name="shield" size={24} color="#FFD700" />
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={10} color={COLORS.white} />
              </View>
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Private</Text>
            <Text style={styles.optionDescription}>Only Invited Opponent Can Join</Text>
          </View>
        </TouchableOpacity>

        {/* Crew Only Option */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleSelectVisibility('crew')}
        >
          <View style={styles.optionIconContainer}>
            <View style={styles.crewIcon}>
              <Ionicons name="people" size={24} color="#22c55e" />
              <View style={styles.crewBadge}>
                <Ionicons name="star" size={10} color={COLORS.white} />
              </View>
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Crew Only</Text>
            <Text style={styles.optionDescription}>Only Your Crew Members Can Join This Battle</Text>
          </View>
        </TouchableOpacity>

        {/* Public Option */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleSelectVisibility('public')}
        >
          <View style={styles.optionIconContainer}>
            <View style={styles.publicIcon}>
              <Ionicons name="globe" size={24} color="#4FC3F7" />
              <View style={styles.peopleBadge}>
                <Ionicons name="people" size={10} color={COLORS.white} />
              </View>
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Public</Text>
            <Text style={styles.optionDescription}>Anyone Can Join The Battle From The Explore Page</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    paddingVertical: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '300',
    marginBottom: SIZES.base,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  optionIconContainer: {
    marginRight: SIZES.padding,
  },
  privateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4FC3F7',
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publicIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4FC3F7',
    position: 'relative',
  },
  peopleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
    position: 'relative' as const,
  },
  crewBadge: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
});
