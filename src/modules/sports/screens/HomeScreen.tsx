import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card } from '../../../shared/ui';
import { colors, spacing, fontSizes, radii } from '../../../shared/theme';
import {
  getUpcomingGames,
  getRecentResults,
  SportsEvent,
  formatEventTime,
  getSportIcon,
} from '../services/sportsApi';
import { BattleService, Battle } from '../../battles/services/battleService';
import { useAuth } from '../../../app/providers/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

const UpcomingGameCard = ({ event, onJoin }: { event: SportsEvent; onJoin: () => void }) => (
  <View style={styles.battleCard}>
    <View style={styles.battleCardLeft}>
      <View style={styles.battleIcon}>
        <AppText style={styles.battleIconText}>{getSportIcon(event.strSport)}</AppText>
      </View>
      <View style={styles.battleInfo}>
        <AppText style={styles.battleTitle} numberOfLines={1}>
          {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
        </AppText>
        <AppText style={styles.battleSubtitle}>{event.strLeague}</AppText>
        <AppText style={styles.battleTime}>{formatEventTime(event)}</AppText>
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
        <AppText style={styles.joinButtonText}>Battle</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

const RecentResultCard = ({ event }: { event: SportsEvent }) => (
  <View style={styles.myBattleCard}>
    <View style={styles.myBattleHeader}>
      <View style={styles.myBattleLeft}>
        <View style={styles.battleIcon}>
          <AppText style={styles.battleIconText}>{getSportIcon(event.strSport)}</AppText>
        </View>
        <View style={styles.battleInfo}>
          <AppText style={styles.battleTitle} numberOfLines={1}>
            {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
          </AppText>
          <AppText style={styles.battleSubtitle}>{event.strLeague}</AppText>
        </View>
      </View>
      <View style={[styles.statusBadge, styles.statusCompleted]}>
        <AppText style={styles.statusText}>Final</AppText>
      </View>
    </View>
    <View style={styles.myBattleDetails}>
      <View style={styles.scoreContainer}>
        {event.strHomeTeamBadge && (
          <Image source={{ uri: event.strHomeTeamBadge }} style={styles.smallBadge} />
        )}
        <AppText style={styles.scoreText}>
          {event.intHomeScore || '0'} - {event.intAwayScore || '0'}
        </AppText>
        {event.strAwayTeamBadge && (
          <Image source={{ uri: event.strAwayTeamBadge }} style={styles.smallBadge} />
        )}
      </View>
      <View style={styles.timeInfo}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <AppText style={styles.timeText} numberOfLines={1}>{event.strVenue || 'TBD'}</AppText>
      </View>
    </View>
    <View style={styles.myBattleFooter}>
      <View style={styles.statDuelBadge}>
        <AppText style={styles.statDuelText}>{event.strSport}</AppText>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <AppText style={styles.viewButtonText}>View</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const [upcomingGames, setUpcomingGames] = useState<SportsEvent[]>([]);
  const [recentResults, setRecentResults] = useState<SportsEvent[]>([]);
  const [quickPicks, setQuickPicks] = useState<Battle[]>([]);
  const [myBattles, setMyBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [upcoming, recent] = await Promise.all([
        getUpcomingGames(),
        getRecentResults(),
      ]);
      setUpcomingGames(upcoming.slice(0, 5));
      setRecentResults(recent.slice(0, 5));

      if (user?.id) {
        const [quickPicksResult, myBattlesResult] = await Promise.all([
          BattleService.getQuickPickBattles(user.id, 5),
          BattleService.getMyAcceptedBattles(user.id, 5),
        ]);
        if (quickPicksResult.data) setQuickPicks(quickPicksResult.data);
        if (myBattlesResult.data) setMyBattles(myBattlesResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <AppText style={styles.avatarText}>LB</AppText>
              </View>
            </View>
            <View style={styles.welcomeContainer}>
              <AppText style={styles.welcomeText}>Welcome Back</AppText>
              <AppText style={styles.usernameText}>Champion</AppText>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Total XP</AppText>
              <AppText style={styles.statValue}>1,247 XP</AppText>
            </View>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Battle Coins</AppText>
              <AppText style={styles.statValue}>2,000 BC</AppText>
            </View>
          </View>
          <TouchableOpacity style={styles.inviteBanner}>
            <AppText style={styles.inviteText}>Live sports data from TheSportsDB</AppText>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Quick Picks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Quick Picks</AppText>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Battles')}
            >
              <AppText style={styles.seeAllText}>View All</AppText>
              <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {quickPicks.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickPicks.map((battle) => (
                <TouchableOpacity
                  key={battle.id}
                  style={styles.quickPickCard}
                  onPress={() => navigation.navigate('BattleDetail', { battleId: battle.id })}
                >
                  <View style={styles.quickPickHeader}>
                    <View style={styles.quickPickIcon}>
                      <Ionicons name="flash" size={20} color={colors.primary} />
                    </View>
                    <View style={[styles.statusBadge, styles.statusOpen]}>
                      <AppText style={styles.statusText}>Open</AppText>
                    </View>
                  </View>
                  <AppText style={styles.quickPickTitle} numberOfLines={2}>{battle.title}</AppText>
                  <View style={styles.quickPickFooter}>
                    <AppText style={styles.quickPickStake}>{battle.stake} BC</AppText>
                    <TouchableOpacity 
                      style={styles.quickPickJoin}
                      onPress={() => navigation.navigate('BattleDetail', { battleId: battle.id })}
                    >
                      <AppText style={styles.quickPickJoinText}>Join</AppText>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No open battles to join yet</AppText>
            </View>
          )}
        </View>

        {/* My Battles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>My Battles</AppText>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Battles')}
            >
              <AppText style={styles.seeAllText}>View All</AppText>
              <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {myBattles.length > 0 ? (
            myBattles.map((battle) => (
              <TouchableOpacity
                key={battle.id}
                style={styles.myBattleItem}
                onPress={() => navigation.navigate('BattleDetail', { battleId: battle.id })}
              >
                <View style={styles.myBattleItemLeft}>
                  <View style={styles.battleIcon}>
                    <Ionicons name="trophy" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.myBattleItemInfo}>
                    <AppText style={styles.myBattleItemTitle} numberOfLines={1}>{battle.title}</AppText>
                    <AppText style={styles.myBattleItemStake}>{battle.stake} BC</AppText>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge, 
                  battle.status === 'active' ? styles.statusActive : styles.statusCompleted
                ]}>
                  <AppText style={styles.statusText}>
                    {battle.status === 'active' ? 'Active' : 'Completed'}
                  </AppText>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No active battles yet</AppText>
            </View>
          )}
        </View>

        {/* Upcoming Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Upcoming Games</AppText>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.seeAllButton} onPress={loadAllData}>
                <Ionicons name="refresh-outline" size={14} color={colors.textSecondary} />
                <AppText style={styles.seeAllText}>Refresh</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => navigation.navigate('AllUpcomingGames')}
              >
                <AppText style={styles.seeAllText}>View All</AppText>
                <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText style={styles.loadingText}>Loading live sports data...</AppText>
            </View>
          ) : upcomingGames.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {upcomingGames.map((event) => (
                <UpcomingGameCard
                  key={event.idEvent}
                  event={event}
                  onJoin={() => {
                    navigation.navigate('BattleVisibility', {
                      prefillTitle: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
                      prefillEventId: event.idEvent,
                      homeTeam: event.strHomeTeam,
                      awayTeam: event.strAwayTeam,
                    });
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No upcoming games found</AppText>
            </View>
          )}
        </View>

        {/* Start Battle Button */}
        <TouchableOpacity 
          style={styles.startBattleButton}
          onPress={() => navigation.navigate('BattleType')}
        >
          <AppText style={styles.startBattleText}>Start Battle Now</AppText>
          <Ionicons name="flash" size={20} color={colors.white} />
        </TouchableOpacity>

        {/* Recent Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Recent Results</AppText>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('AllResults')}
            >
              <AppText style={styles.seeAllText}>See All</AppText>
              <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : recentResults.length > 0 ? (
            recentResults.map((event) => (
              <RecentResultCard key={event.idEvent} event={event} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No recent results</AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  welcomeContainer: {},
  welcomeText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  usernameText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  notificationButton:{
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
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
    backgroundColor: colors.primary,
  },
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  statItem: {},
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSizes.xs,
  },
  statValue: {
    color: colors.white,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: radii.lg,
    padding: spacing[2],
  },
  inviteText: {
    color: colors.white,
    fontSize: fontSizes.xs,
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  headerButtons:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  seeAllText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  battleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing[4],
    marginRight: spacing[2],
    minWidth: 300,
  },
  battleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  battleIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleIconText: {
    fontSize: 20,
  },
  battleInfo: {},
  battleTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  battleSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  battleTime: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  battleCardRight: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  sponsorBadge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  sponsorText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  startBattleButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  startBattleText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  startBattleIcon: {
    fontSize: 16,
  },
  myBattleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  myBattleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  myBattleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  statusBadge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  statusActive: {
    backgroundColor: colors.primary,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusOpen: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  myBattleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  opponentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  myBattleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statDuelBadge: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  statDuelText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
  },
  viewButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  teamLogos: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  smallBadge: {
    width: 20,
    height: 20,
    borderRadius: radii.sm,
  },
  scoreText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  loadingContainer:{
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginTop: spacing[2],
  },
  emptyContainer: {
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  quickPickCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginRight: spacing[2],
    width: 180,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  quickPickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  quickPickIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickPickTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    marginBottom: spacing[2],
    minHeight: 40,
  },
  quickPickFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickPickStake: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  quickPickJoin: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    borderRadius: radii.lg,
  },
  quickPickJoinText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  myBattleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  myBattleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  myBattleItemInfo: {
    flex: 1,
  },
  myBattleItemTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  myBattleItemStake: {
    color: colors.primary,
    fontSize: fontSizes.xs,
  },
});
