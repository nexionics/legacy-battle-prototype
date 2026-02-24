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
  getResultsBySport,
  SportsEvent,
  getSportIcon,
  AVAILABLE_SPORTS,
} from '../services/sportsApi';

interface AllResultsScreenProps {
  navigation: any;
}

type SportFilter = 'ALL' | 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'EPL';

const ResultCard = ({ event }: { event: SportsEvent }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.resultLeft}>
          <View style={styles.sportIcon}>
            <Text style={styles.sportIconText}>{getSportIcon(event.strSport)}</Text>
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
            </Text>
            <Text style={styles.resultSubtitle}>{event.strLeague}</Text>
          </View>
        </View>
        <View style={styles.finalBadge}>
          <Text style={styles.finalText}>Final</Text>
        </View>
      </View>
      
      <View style={styles.scoreSection}>
        <View style={styles.scoreContainer}>
          {event.strHomeTeamBadge && (
            <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
          )}
          <Text style={styles.scoreText}>
            {event.intHomeScore || '0'} - {event.intAwayScore || '0'}
          </Text>
          {event.strAwayTeamBadge && (
            <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
          )}
        </View>
        <View style={styles.venueInfo}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.venueText} numberOfLines={1}>{event.strVenue || 'TBD'}</Text>
        </View>
      </View>

      <View style={styles.resultFooter}>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.dateText}>{formatDate(event.strTimestamp || event.dateEvent)}</Text>
        </View>
        <View style={styles.sportBadge}>
          <Text style={styles.sportBadgeText}>{event.strSport}</Text>
        </View>
      </View>
    </View>
  );
};

export default function AllResultsScreen({ navigation }: AllResultsScreenProps) {
  const [results, setResults] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportFilter>('ALL');

  const loadResults = async (sport: SportFilter = selectedSport) => {
    setLoading(true);
    try {
      const data = await getResultsBySport(sport);
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const handleSportChange = (sport: SportFilter) => {
    setSelectedSport(sport);
    loadResults(sport);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadResults();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Results</Text>
        <View style={styles.placeholder} />
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

      {/* Results List */}
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
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading results...</Text>
          </View>
        ) : results.length > 0 ? (
          results.map((event) => (
            <ResultCard key={event.idEvent} event={event} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No results found</Text>
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
  placeholder: {
    width: 40,
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
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  resultLeft: {
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
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  resultSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  finalBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: SIZES.base,
  },
  finalText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  scoreText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  venueText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    maxWidth: 120,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  sportBadge: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sportBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});
