import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { supabase } from '../lib/supabaseClient';

type FilterTab = 'Trending' | 'Ending Soon' | 'New' | 'High Activity';

type Battle = {
  id: string;
  title: string;
  battle_type: string;
  entry_fee: number;
  status: string;
  created_at: string;
  event_start_time: string | null;
  participant_count?: number;
};

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('Trending');
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs: FilterTab[] = ['Trending', 'Ending Soon', 'New', 'High Activity'];

  useEffect(() => {
    loadBattles();
  }, [activeTab]);

  const loadBattles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('battles')
        .select(`
          id,
          title,
          battle_type,
          entry_fee,
          status,
          created_at,
          event_start_time,
          battle_participants(count)
        `)
        .eq('status', 'open');

      if (activeTab === 'Ending Soon') {
        query = query.order('event_start_time', { ascending: true });
      } else if (activeTab === 'New') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(10);

      if (error) {
        console.error('Error loading battles:', error);
      } else {
        const battlesWithCount = (data || []).map((b: any) => ({
          ...b,
          participant_count: b.battle_participants?.[0]?.count || 0,
        }));
        setBattles(battlesWithCount);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'Trending':
        return 'Trending Battles';
      case 'Ending Soon':
        return 'Challenges That Are About To End';
      case 'New':
        return 'Battle That Are New';
      case 'High Activity':
        return 'All New Battle Created';
      default:
        return '';
    }
  };

  const formatTimeRemaining = (eventTime: string | null) => {
    if (!eventTime) return 'TBD';
    const now = new Date();
    const event = new Date(eventTime);
    const diff = event.getTime() - now.getTime();
    if (diff <= 0) return 'Started';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Explore</Text>
            <Ionicons name="search-outline" size={18} color={COLORS.primary} />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color={COLORS.text} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{activeTab}.</Text>
          <Text style={styles.sectionSubtitle}>{getTabSubtitle()}</Text>
        </View>

        {/* Battle Cards */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : battles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No battles found</Text>
          </View>
        ) : (
          battles.map((battle) => (
            <View key={battle.id} style={styles.battleCard}>
              <View style={styles.battleTags}>
                <View style={[styles.tag, activeTab === 'Trending' && styles.tagRed, activeTab === 'Ending Soon' && styles.tagRed, activeTab === 'New' && styles.tagGreen, activeTab === 'High Activity' && styles.tagBlue]}>
                  <Text style={styles.tagText}>{activeTab === 'Trending' ? 'Ongoing' : activeTab}</Text>
                </View>
                <View style={styles.tagOutline}>
                  <Ionicons name="football-outline" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.tagOutlineText}>{battle.battle_type || 'Game Pick'}</Text>
                </View>
                <View style={styles.entryFee}>
                  <Text style={styles.entryFeeIcon}>🪙</Text>
                  <Text style={styles.entryFeeText}>{battle.entry_fee || 50} Bc Entry</Text>
                </View>
              </View>
              
              <Text style={styles.battleTitle}>{battle.title || 'Super Bowl QB Passing Yards Duel'}</Text>
              
              <View style={styles.battlePlayers}>
                <View style={styles.playerBadge}>
                  <Text style={styles.playerBadgeText}>🏈</Text>
                </View>
                <Text style={styles.playerName}>Mahomes</Text>
                <Text style={styles.vsText}>Vs</Text>
                <View style={styles.playerBadge}>
                  <Text style={styles.playerBadgeText}>🏈</Text>
                </View>
                <Text style={styles.playerName}>Burrow</Text>
              </View>
              
              <View style={styles.battleFooter}>
                <View style={styles.battleInfo}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.battleInfoText}>Ends In {formatTimeRemaining(battle.event_start_time)}</Text>
                </View>
                {activeTab === 'Trending' && (
                  <View style={styles.battleInfo}>
                    <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.battleInfoText}>{battle.participant_count || 247} Joined</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Keep existing sections below */}
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.categorySectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {['Football', 'Basketball', 'Baseball', 'Soccer'].map((category) => (
              <TouchableOpacity key={category} style={styles.categoryCard}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryIconText}>
                    {category === 'Football' ? '🏈' : 
                     category === 'Basketball' ? '🏀' : 
                     category === 'Baseball' ? '⚾' : '⚽'}
                  </Text>
                </View>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Players */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categorySectionTitle}>Top Players</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Champion', 'Legend', 'Pro', 'Master'].map((player, index) => (
              <View key={player} style={styles.topPlayerCard}>
                <View style={styles.topPlayerAvatar}>
                  <Text style={styles.topPlayerAvatarText}>{index + 1}</Text>
                </View>
                <Text style={styles.topPlayerName}>{player}</Text>
                <Text style={styles.topPlayerXP}>{(5000 - index * 500)} XP</Text>
              </View>
            ))}
          </ScrollView>
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
    gap: 6,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    gap: SIZES.base,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  tab: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
  },
  sectionTitleContainer: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  loadingContainer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  battleCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  battleTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.base,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  tagRed: {
    backgroundColor: COLORS.primary,
  },
  tagGreen: {
    backgroundColor: '#22c55e',
  },
  tagBlue: {
    backgroundColor: '#3b82f6',
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tagOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  tagOutlineText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  entryFee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryFeeIcon: {
    fontSize: 12,
  },
  entryFeeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  battleTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  battlePlayers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.base,
  },
  playerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerBadgeText: {
    fontSize: 12,
  },
  playerName: {
    color: COLORS.text,
    fontSize: SIZES.small,
  },
  vsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  battleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
  },
  battleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  battleInfoText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginLeft: 'auto',
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: SIZES.padding * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  categorySectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    gap: SIZES.base,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  topPlayerCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginRight: SIZES.base,
    minWidth: 100,
  },
  topPlayerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  topPlayerAvatarText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  topPlayerName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  topPlayerXP: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
});
