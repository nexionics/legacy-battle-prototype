import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../../shared/constants/theme';
import {
  getUpcomingBySport,
  SportsEvent,
  getSportIcon,
  formatEventTime,
  AVAILABLE_SPORTS,
} from '../services/sportsApi';

interface AllUpcomingGamesScreenProps {
  navigation: any;
  route: any;
}

type SportFilter = 'ALL' | 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'EPL';

const UpcomingGameCard = ({ event, onBattle }: { event: SportsEvent; onBattle: () => void }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.gameCard}>
      <View style={styles.gameHeader}>
        <View style={styles.gameLeft}>
          <View style={styles.sportIcon}>
            <Text style={styles.sportIconText}>{getSportIcon(event.strSport)}</Text>
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle} numberOfLines={1}>
              {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
            </Text>
            <Text style={styles.gameSubtitle}>{event.strLeague}</Text>
          </View>
        </View>
        <View style={styles.teamLogos}>
          {event.strHomeTeamBadge && (
            <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
          )}
          {event.strAwayTeamBadge && (
            <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
          )}
        </View>
      </View>
      
      <View style={styles.gameDetails}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.timeText}>{formatEventTime(event)}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.dateText}>{formatDate(event.strTimestamp || event.dateEvent)}</Text>
        </View>
      </View>

      <View style={styles.gameFooter}>
        <View style={styles.venueContainer}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.venueText} numberOfLines={1}>{event.strVenue || 'TBD'}</Text>
        </View>
        <TouchableOpacity style={styles.battleButton} onPress={onBattle}>
          <Ionicons name="flash" size={16} color={COLORS.white} />
          <Text style={styles.battleButtonText}>Battle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AllUpcomingGamesScreen({ navigation, route }: AllUpcomingGamesScreenProps) {
  const { initialSport } = route?.params || {};
  
  const [games, setGames] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportFilter>(initialSport || 'ALL');

  const loadGames = async (sport: SportFilter = selectedSport) => {
    setLoading(true);
    try {
      const data = await getUpcomingBySport(sport);
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleSportChange = (sport: SportFilter) => {
    setSelectedSport(sport);
    loadGames(sport);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGames();
  };

  const handleBattle = (event: SportsEvent) => {
    // Navigate to BattleVisibility first to choose Private/Public
    // Then it will go directly to CreateBattle with the game data
    navigation.navigate('BattleVisibility', {
      prefillTitle: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
      prefillEventId: event.idEvent,
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Games</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Sport Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {AVAILABLE_SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.filterTab,
                selectedSport === sport.id && styles.filterTabActive,
              ]}
              onPress={() => handleSportChange(sport.id as SportFilter)}
            >
              <Text style={styles.filterIcon}>{sport.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  selectedSport === sport.id && styles.filterTextActive,
                ]}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Games List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        ) : games.length > 0 ? (
          <>
            {games.some(e => e.strStatus === 'live') && (
              <>
                <Text style={styles.liveTitle}>Live Now</Text>
                {games.filter(e => e.strStatus === 'live').map((event) => (
                  <UpcomingGameCard
                    key={event.idEvent}
                    event={event}
                    onBattle={() => handleBattle(event)}
                  />
                ))}
              </>
            )}
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {games.filter(e => e.strStatus !== 'live').map((event) => (
              <UpcomingGameCard
                key={event.idEvent}
                event={event}
                onBattle={() => handleBattle(event)}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No upcoming games</Text>
            <Text style={styles.emptySubtext}>Try selecting a different sport</Text>
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
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  filterScroll: {
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: SIZES.base / 2,
    marginRight: SIZES.base,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  liveTitle: {
    color: COLORS.success,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  loadingContainer: {
    padding: SIZES.padding * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginTop: SIZES.base,
  },
  emptyContainer: {
    padding: SIZES.padding * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  gameCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  gameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    flex: 1,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportIconText: {
    fontSize: 20,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  gameSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  teamLogos: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: SIZES.base,
  },
  teamBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: COLORS.text,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  venueText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    maxWidth: 180,
  },
  battleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: 4,
  },
  battleButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});
