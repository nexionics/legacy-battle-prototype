import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import {
  getUpcomingGames,
  getRecentResults,
  SportsEvent,
  formatEventTime,
  getSportIcon,
} from '../services/sportsApi';

interface HomeScreenProps {
  navigation: any;
}

const UpcomingGameCard = ({ event, onJoin }: { event: SportsEvent; onJoin: () => void }) => (
  <View style={styles.battleCard}>
    <View style={styles.battleCardLeft}>
      <View style={styles.battleIcon}>
        <Text style={styles.battleIconText}>{getSportIcon(event.strSport)}</Text>
      </View>
      <View style={styles.battleInfo}>
        <Text style={styles.battleTitle} numberOfLines={1}>
          {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
        </Text>
        <Text style={styles.battleSubtitle}>{event.strLeague}</Text>
        <Text style={styles.battleTime}>{formatEventTime(event)}</Text>
      </View>
    </View>
    <View style={styles.battleCardRight}>
      <View style={styles.teamLogos}>
        {event.strHomeTeamBadge && (
          <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
        )}
        {event.strAwayTeamBadge && (
          <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
        )}
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
        <Text style={styles.joinButtonText}>Battle</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RecentResultCard = ({ event }: { event: SportsEvent }) => (
  <View style={styles.myBattleCard}>
    <View style={styles.myBattleHeader}>
      <View style={styles.myBattleLeft}>
        <View style={styles.battleIcon}>
          <Text style={styles.battleIconText}>{getSportIcon(event.strSport)}</Text>
        </View>
        <View style={styles.battleInfo}>
          <Text style={styles.battleTitle} numberOfLines={1}>
            {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
          </Text>
          <Text style={styles.battleSubtitle}>{event.strLeague}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, styles.statusCompleted]}>
        <Text style={styles.statusText}>Final</Text>
      </View>
    </View>
    <View style={styles.myBattleDetails}>
      <View style={styles.scoreContainer}>
        {event.strHomeTeamBadge && (
          <Image source={{ uri: event.strHomeTeamBadge }} style={styles.smallBadge} />
        )}
        <Text style={styles.scoreText}>
          {event.intHomeScore || '0'} - {event.intAwayScore || '0'}
        </Text>
        {event.strAwayTeamBadge && (
          <Image source={{ uri: event.strAwayTeamBadge }} style={styles.smallBadge} />
        )}
      </View>
      <View style={styles.timeInfo}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.timeText} numberOfLines={1}>{event.strVenue || 'TBD'}</Text>
      </View>
    </View>
    <View style={styles.myBattleFooter}>
      <View style={styles.statDuelBadge}>
        <Text style={styles.statDuelText}>{event.strSport}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [upcomingGames, setUpcomingGames] = useState<SportsEvent[]>([]);
  const [recentResults, setRecentResults] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSportsData();
  }, []);

  const loadSportsData = async () => {
    setLoading(true);
    try {
      const [upcoming, recent] = await Promise.all([
        getUpcomingGames(),
        getRecentResults(),
      ]);
      setUpcomingGames(upcoming.slice(0, 5));
      setRecentResults(recent.slice(0, 5));
    } catch (error) {
      console.error('Error loading sports data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>LB</Text>
              </View>
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.usernameText}>Champion</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total XP</Text>
              <Text style={styles.statValue}>1,247 XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Battle Coins</Text>
              <Text style={styles.statValue}>2,000 BC</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.inviteBanner}>
            <Text style={styles.inviteText}>Live sports data from TheSportsDB</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Upcoming Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Games</Text>
            <TouchableOpacity style={styles.seeAllButton} onPress={loadSportsData}>
              <Ionicons name="refresh-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.seeAllText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading live sports data...</Text>
            </View>
          ) : upcomingGames.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {upcomingGames.map((event) => (
                <UpcomingGameCard
                  key={event.idEvent}
                  event={event}
                  onJoin={() => {}}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming games found</Text>
            </View>
          )}
        </View>

        {/* Start Battle Button */}
        <TouchableOpacity style={styles.startBattleButton}>
          <Text style={styles.startBattleText}>Start Battle</Text>
          <Ionicons name="flash" size={20} color={COLORS.white} />
        </TouchableOpacity>

        {/* Recent Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Results</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('AllResults')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : recentResults.length > 0 ? (
            recentResults.map((event) => (
              <RecentResultCard key={event.idEvent} event={event} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent results</Text>
            </View>
          )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeContainer: {},
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  usernameText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  statsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  statItem: {},
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SIZES.small,
  },
  statValue: {
    color: COLORS.white,
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: SIZES.radius,
    padding: SIZES.base,
  },
  inviteText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  battleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SIZES.padding,
    marginRight: SIZES.base,
    minWidth: 300,
  },
  battleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  battleIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleIconText: {
    fontSize: 20,
  },
  battleInfo: {},
  battleTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  battleSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  battleTime: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  battleCardRight: {
    alignItems: 'flex-end',
    gap: SIZES.base,
  },
  sponsorBadge: {
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sponsorText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  startBattleButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  startBattleText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  startBattleIcon: {
    fontSize: 16,
  },
  myBattleCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  myBattleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  myBattleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  statusBadge: {
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: COLORS.primary,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  myBattleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  opponentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  myBattleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statDuelBadge: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statDuelText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  teamLogos: {
    flexDirection: 'row',
    gap: 4,
  },
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  smallBadge: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  scoreText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: SIZES.base,
  },
  emptyContainer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
});
