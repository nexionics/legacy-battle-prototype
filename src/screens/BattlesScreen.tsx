import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { BattleService, Battle } from '../services/battleService';
import { supabase } from '../lib/supabaseClient';

interface BattlesScreenProps {
  navigation: any;
}

type TabType = 'open' | 'active' | 'completed';

export default function BattlesScreen({ navigation }: BattlesScreenProps) {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('open');

  const loadBattles = async () => {
    const { data, error } = await BattleService.getBattles();
    if (error) {
      console.error('Error loading battles', error);
    } else {
      setBattles(data || []);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadBattles();

    const channel = BattleService.subscribeToBattles((payload) => {
      loadBattles();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBattles();
  };

  const filteredBattles = battles.filter((battle) => {
    if (activeTab === 'open') return battle.status === 'open';
    if (activeTab === 'active') return battle.status === 'active';
    if (activeTab === 'completed') return battle.status === 'completed' || battle.status === 'canceled';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#4CAF50';
      case 'active':
        return COLORS.primary;
      case 'completed':
        return COLORS.textSecondary;
      case 'canceled':
        return COLORS.textSecondary;
      default:
        return COLORS.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Battles</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateBattle')}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'open' && styles.tabActive]}
            onPress={() => setActiveTab('open')}
          >
            <Text style={[styles.tabText, activeTab === 'open' && styles.tabTextActive]}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filteredBattles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No {activeTab} battles yet</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('CreateBattle')}
            >
              <Text style={styles.emptyButtonText}>Create Your First Battle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Battle Cards */
          filteredBattles.map((battle) => (
            <View key={battle.id} style={styles.battleCard}>
              <View style={styles.battleHeader}>
                <View style={styles.battleLeft}>
                  <View style={styles.battleIcon}>
                    <Text style={styles.battleIconText}>⚔️</Text>
                  </View>
                  <View style={styles.battleInfo}>
                    <Text style={styles.battleTitle} numberOfLines={1}>{battle.title}</Text>
                    <Text style={styles.battleSubtitle} numberOfLines={1}>
                      {battle.description || 'No description'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(battle.status) }]}>
                  <Text style={styles.statusText}>{battle.status.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.battleDetails}>
                <View style={styles.stakeInfo}>
                  <Text style={styles.stakeLabel}>Stake:</Text>
                  <Text style={styles.stakeValue}>{battle.stake} BC</Text>
                </View>
                <View style={styles.timeInfo}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.timeText}>{formatDate(battle.created_at)}</Text>
                </View>
              </View>
              <View style={styles.battleFooter}>
                <View style={styles.battleTypeBadge}>
                  <Text style={styles.battleTypeText}>
                    {battle.event_id ? 'Sports Event' : 'Custom Battle'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: 4,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  tab: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  battleCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  battleLeft: {
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
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  battleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  stakeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stakeLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  stakeValue: {
    color: COLORS.text,
    fontSize: SIZES.small,
    fontWeight: 'bold',
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
  battleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  battleTypeBadge: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  battleTypeText: {
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
});
