import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

type Friend = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_online: boolean;
};

export default function FriendsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    setLoading(true);
    
    // For now, we'll show mock friends data since we don't have a friends table yet
    // In a real implementation, you would query a friends table
    const mockFriends: Friend[] = [
      { id: '1', username: 'player1', display_name: 'Alex Johnson', avatar_url: null, is_online: true },
      { id: '2', username: 'player2', display_name: 'Sarah Smith', avatar_url: null, is_online: true },
      { id: '3', username: 'player3', display_name: 'Mike Brown', avatar_url: null, is_online: false },
      { id: '4', username: 'player4', display_name: 'Emily Davis', avatar_url: null, is_online: true },
      { id: '5', username: 'player5', display_name: 'Chris Wilson', avatar_url: null, is_online: false },
    ];
    
    setFriends(mockFriends);
    setLoading(false);
  };

  const getInitials = (name: string | null, username: string | null) => {
    const displayName = name || username || 'U';
    return displayName.substring(0, 2).toUpperCase();
  };

  const onlineFriends = friends.filter(f => f.is_online);
  const offlineFriends = friends.filter(f => !f.is_online);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Friends</Text>
          <Ionicons name="people-outline" size={18} color={COLORS.primary} />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Online Friends Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.sectionTitle}>Online ({onlineFriends.length})</Text>
          </View>
          <View style={styles.friendsGrid}>
            {onlineFriends.map((friend) => (
              <TouchableOpacity key={friend.id} style={styles.friendItem}>
                <View style={styles.friendAvatarContainer}>
                  <View style={[styles.friendAvatar, styles.friendAvatarOnline]}>
                    <Text style={styles.friendAvatarText}>
                      {getInitials(friend.display_name, friend.username)}
                    </Text>
                  </View>
                  <View style={[styles.statusDot, styles.statusOnline]} />
                </View>
                <Text style={styles.friendName} numberOfLines={1}>
                  {friend.display_name || friend.username}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Offline Friends Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.offlineIndicator} />
            <Text style={styles.sectionTitle}>Offline ({offlineFriends.length})</Text>
          </View>
          <View style={styles.friendsGrid}>
            {offlineFriends.map((friend) => (
              <TouchableOpacity key={friend.id} style={styles.friendItem}>
                <View style={styles.friendAvatarContainer}>
                  <View style={[styles.friendAvatar, styles.friendAvatarOffline]}>
                    <Text style={[styles.friendAvatarText, styles.friendAvatarTextOffline]}>
                      {getInitials(friend.display_name, friend.username)}
                    </Text>
                  </View>
                  <View style={[styles.statusDot, styles.statusOffline]} />
                </View>
                <Text style={[styles.friendName, styles.friendNameOffline]} numberOfLines={1}>
                  {friend.display_name || friend.username}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Empty State */}
        {friends.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No friends yet</Text>
            <Text style={styles.emptySubtext}>Add friends to challenge them to battles!</Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: SIZES.base,
  },
  offlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6b7280',
    marginRight: SIZES.base,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding,
  },
  friendItem: {
    alignItems: 'center',
    width: 80,
  },
  friendAvatarContainer: {
    position: 'relative',
    marginBottom: SIZES.base,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  friendAvatarOnline: {
    backgroundColor: COLORS.card,
    borderColor: '#22c55e',
  },
  friendAvatarOffline: {
    backgroundColor: COLORS.card,
    borderColor: '#6b7280',
  },
  friendAvatarText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendAvatarTextOffline: {
    color: COLORS.textSecondary,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  statusOnline: {
    backgroundColor: '#22c55e',
  },
  statusOffline: {
    backgroundColor: '#6b7280',
  },
  friendName: {
    color: COLORS.text,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  friendNameOffline: {
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginTop: SIZES.base,
  },
});
