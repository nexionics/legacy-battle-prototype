import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { CrewService, CrewMember, CrewRequestWithProfile } from '../services/crewService';

export default function FriendsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [pendingReceived, setPendingReceived] = useState<CrewRequestWithProfile[]>([]);
  const [suggestions, setSuggestions] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;

    const [crewResult, pendingResult, suggestionsResult] = await Promise.all([
      CrewService.getCrewMembers(user.id),
      CrewService.getPendingReceived(user.id),
      CrewService.getBattleSuggestions(user.id),
    ]);

    setCrewMembers(crewResult.data);
    setPendingReceived(pendingResult.data);
    setSuggestions(suggestionsResult.data);
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAccept = async (requestId: string) => {
    const { error } = await CrewService.acceptRequest(requestId);
    if (error) {
      Alert.alert('Error', 'Failed to accept request');
    } else {
      loadData();
    }
  };

  const handleReject = async (requestId: string) => {
    const { error } = await CrewService.rejectRequest(requestId);
    if (error) {
      Alert.alert('Error', 'Failed to reject request');
    } else {
      loadData();
    }
  };

  const handleAddSuggestion = async (memberId: string) => {
    const { error } = await CrewService.sendRequest(memberId);
    if (error) {
      if ('code' in error && error.code === '23505') {
        Alert.alert('Already Sent', 'You already have a pending request with this user.');
      } else {
        Alert.alert('Error', error.message || 'Failed to send request');
      }
    } else {
      Alert.alert('Sent', 'Crew request sent!');
      setSuggestions((prev) => prev.filter((s) => s.id !== memberId));
    }
  };

  const getInitials = (name: string | null, username: string | null) => {
    const displayName = name || username || 'U';
    return displayName.substring(0, 2).toUpperCase();
  };

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

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Crew</Text>
          <Ionicons name="people-outline" size={18} color={COLORS.primary} />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFriend')}>
          <Ionicons name="person-add-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {pendingReceived.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.pendingIndicator} />
              <Text style={styles.sectionTitle}>Pending Requests ({pendingReceived.length})</Text>
            </View>
            {pendingReceived.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestAvatar}>
                  <Text style={styles.requestAvatarText}>
                    {getInitials(request.sender?.display_name ?? null, request.sender?.username ?? null)}
                  </Text>
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>
                    {request.sender?.display_name || request.sender?.username || 'Unknown'}
                  </Text>
                  <Text style={styles.requestUsername}>
                    @{request.sender?.username || 'user'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAccept(request.id)}
                >
                  <Ionicons name="checkmark" size={18} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(request.id)}
                >
                  <Ionicons name="close" size={18} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Crew ({crewMembers.length})</Text>
          </View>
          {crewMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No crew members yet</Text>
              <Text style={styles.emptySubtext}>Add people to your crew to challenge them!</Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate('AddFriend')}
              >
                <Ionicons name="person-add-outline" size={18} color={COLORS.white} />
                <Text style={styles.emptyAddButtonText}>Find People</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.crewGrid}>
              {crewMembers.map((member) => (
                <TouchableOpacity key={member.id} style={styles.crewItem}>
                  <View style={styles.crewAvatarContainer}>
                    <View style={styles.crewAvatar}>
                      <Text style={styles.crewAvatarText}>
                        {getInitials(member.display_name, member.username)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.crewName} numberOfLines={1}>
                    {member.display_name || member.username}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {suggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={16} color="#FFD700" />
              <Text style={styles.sectionTitle}>Suggested from Battles</Text>
            </View>
            <Text style={styles.suggestSubtext}>People you've battled with</Text>
            {suggestions.map((member) => (
              <View key={member.id} style={styles.suggestionCard}>
                <View style={styles.requestAvatar}>
                  <Text style={styles.requestAvatarText}>
                    {getInitials(member.display_name, member.username)}
                  </Text>
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>
                    {member.display_name || member.username || 'Unknown'}
                  </Text>
                  <Text style={styles.requestUsername}>
                    @{member.username || 'user'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addSuggestionButton}
                  onPress={() => handleAddSuggestion(member.id)}
                >
                  <Ionicons name="person-add" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
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
    gap: SIZES.base,
  },
  pendingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f59e0b',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestAvatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  requestInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  requestName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  requestUsername: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.base,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.base,
  },
  crewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding,
  },
  crewItem: {
    alignItems: 'center',
    width: 80,
  },
  crewAvatarContainer: {
    marginBottom: SIZES.base,
  },
  crewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  crewAvatarText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  crewName: {
    color: COLORS.text,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 3,
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
    marginBottom: SIZES.padding,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: SIZES.base,
  },
  emptyAddButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  suggestSubtext: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.padding,
    marginTop: -SIZES.base,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  addSuggestionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.base,
  },
});
