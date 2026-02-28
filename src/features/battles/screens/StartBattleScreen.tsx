import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/shared/theme';

interface StartBattleScreenProps {
  navigation: any;
}

type SportType = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'SKILLS';

interface Sport {
  id: SportType;
  name: string;
  icon: string;
  color: string;
}

interface BattleCategory {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
}

const SPORTS: Sport[] = [
  { id: 'NFL', name: 'Football', icon: '🏈', color: '#013369' },
  { id: 'NBA', name: 'Basketball', icon: '🏀', color: '#C9082A' },
  { id: 'MLB', name: 'Baseball', icon: '⚾', color: '#002D72' },
  { id: 'NHL', name: 'Hockey', icon: '🏒', color: '#000000' },
  { id: 'SKILLS', name: 'Skills Battle', icon: '⚡', color: '#E53935' },
];

const BATTLE_CATEGORIES: BattleCategory[] = [
  {
    id: 'GAME_WINNER',
    name: 'Game Winner',
    description: 'Pick which team will win the game',
    icon: 'trophy',
    enabled: true,
  },
  {
    id: 'OVER_UNDER',
    name: 'Over/Under',
    description: 'Predict if the total score will be over or under',
    icon: 'stats-chart',
    enabled: false,
  },
  {
    id: 'STATS_BATTLE',
    name: 'Stats Battle',
    description: 'Compare player statistics',
    icon: 'bar-chart',
    enabled: false,
  },
];

export default function StartBattleScreen({ navigation }: StartBattleScreenProps) {
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);

  const handleSportSelect = (sport: SportType) => {
    setSelectedSport(sport);
  };

  const handleCategorySelect = (category: BattleCategory) => {
    if (!category.enabled || !selectedSport) return;
    
    navigation.navigate('AllUpcomingGames', {
      initialSport: selectedSport,
      mode: category.id,
    });
  };

  const handleBack = () => {
    if (selectedSport) {
      setSelectedSport(null);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedSport === 'SKILLS' ? 'Skills Battle' : selectedSport ? 'Select Battle Type' : 'Select a Sport'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedSport ? (
          <View style={styles.sportsGrid}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={styles.sportCard}
                onPress={() => handleSportSelect(sport.id)}
              >
                <View style={[styles.sportIconContainer, { backgroundColor: sport.color }]}>
                  <Text style={styles.sportIcon}>{sport.icon}</Text>
                </View>
                <Text style={styles.sportName}>{sport.name}</Text>
                <Text style={styles.sportId}>{sport.id === 'SKILLS' ? '' : sport.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : selectedSport === 'SKILLS' ? (
          <View style={styles.skillsContainer}>
            <View style={styles.skillsCard}>
              <View style={styles.skillsBadge}>
                <Ionicons name="videocam" size={14} color={COLORS.primary} />
                <Text style={styles.skillsBadgeText}>Neutral Attester Verifies</Text>
              </View>
              
              <View style={styles.skillsHeader}>
                <View style={styles.skillsIconContainer}>
                  <Text style={styles.skillsIcon}>⚡</Text>
                </View>
                <View style={styles.skillsInfo}>
                  <Text style={styles.skillsTitle}>Skill Battle</Text>
                  <Text style={styles.skillsSubtitle}>Showcase Your Skills With Proof</Text>
                </View>
              </View>
              
              <View style={styles.skillsFeatures}>
                <View style={styles.skillsFeature}>
                  <Ionicons name="videocam-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.skillsFeatureText}>Video Evidence Needed</Text>
                </View>
                <View style={styles.skillsFeature}>
                  <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.skillsFeatureText}>3 Neutral Attesters</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.comingSoonCard}>
              <Ionicons name="construct-outline" size={48} color={COLORS.primary} />
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
              <Text style={styles.comingSoonText}>
                Skills Battles will let you challenge friends with video proof of your skills. Neutral attesters will verify the winner.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            <View style={styles.selectedSportBadge}>
              <Text style={styles.selectedSportIcon}>
                {SPORTS.find(s => s.id === selectedSport)?.icon}
              </Text>
              <Text style={styles.selectedSportText}>{selectedSport}</Text>
            </View>
            
            <View style={styles.categoriesList}>
              {BATTLE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    !category.enabled && styles.categoryCardDisabled,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                  disabled={!category.enabled}
                >
                  <View style={[
                    styles.categoryIconContainer,
                    !category.enabled && styles.categoryIconDisabled,
                  ]}>
                    <Ionicons
                      name={category.icon}
                      size={28}
                      color={category.enabled ? COLORS.primary : COLORS.textSecondary}
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[
                      styles.categoryName,
                      !category.enabled && styles.categoryNameDisabled,
                    ]}>
                      {category.name}
                    </Text>
                    <Text style={styles.categoryDescription}>
                      {category.enabled ? category.description : 'Coming Soon'}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={category.enabled ? COLORS.textSecondary : COLORS.inputBorder}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
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
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SIZES.padding,
    paddingTop: SIZES.padding,
  },
  sportCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
  },
  sportIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sportIcon: {
    fontSize: 40,
  },
  sportName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sportId: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  categoriesContainer: {
    paddingTop: SIZES.padding,
  },
  selectedSportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
    gap: SIZES.base,
  },
  selectedSportIcon: {
    fontSize: 24,
  },
  selectedSportText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  categoriesList: {
    gap: SIZES.base,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    gap: SIZES.padding,
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconDisabled: {
    backgroundColor: COLORS.inputBackground,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryNameDisabled: {
    color: COLORS.textSecondary,
  },
  categoryDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  skillsContainer: {
    paddingTop: SIZES.padding,
  },
  skillsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  skillsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: SIZES.padding,
  },
  skillsBadgeText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  skillsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsIcon: {
    fontSize: 24,
  },
  skillsInfo: {
    flex: 1,
  },
  skillsTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  skillsSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  skillsFeatures: {
    gap: SIZES.base,
  },
  skillsFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  skillsFeatureText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  comingSoonCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
    alignItems: 'center',
  },
  comingSoonTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  comingSoonText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    lineHeight: 22,
  },
});
