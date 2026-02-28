import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/shared/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CrewService, CrewRepo } from '@/features/crew/api';

type SearchResult = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  requestStatus?: string;
};

export default function AddFriendScreen({ navigation }: any) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username to search');
      return;
    }

    if (!user) return;

    setSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await CrewRepo.searchUsers(searchQuery, user.id);

      if (error) {
        Alert.alert('Error', 'Failed to search for users');
      } else {
        const enriched: SearchResult[] = [];
        for (const profile of data) {
          const existing = await CrewRepo.getRequestStatus(user.id, profile.id);
          enriched.push({
            ...profile,
            requestStatus: existing?.status,
          });
        }
        setSearchResults(enriched);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to search for users');
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (friendId: string, friendName: string) => {
    const { error } = await CrewService.sendRequestById(friendId);
    if (error) {
      if (error && 'code' in error && error.code === '23505') {
        Alert.alert('Already Sent', 'You already have a pending request with this user.');
      } else {
        Alert.alert('Error', error.message || 'Failed to send crew request');
      }
    } else {
      Alert.alert('Crew Request Sent', `A crew request has been sent to ${friendName}`);
      setSearchResults((prev) =>
        prev.map((r) => (r.id === friendId ? { ...r, requestStatus: 'pending' } : r)),
      );
    }
  };

  const handleInviteViaText = async () => {
    const message = `Hey! Join me on Legacy Battle - the ultimate sports prediction app! Download it here: [App Store Link]`;
    const url = `sms:&body=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to share
        await Share.share({ message });
      }
    } catch (error) {
      console.error('Error opening SMS:', error);
      await Share.share({ message });
    }
  };

  const handleInviteViaEmail = async () => {
    const subject = 'Join me on Legacy Battle!';
    const body = `Hey!\n\nI've been using Legacy Battle to make sports predictions and challenge friends. You should join me!\n\nDownload the app here: [App Store Link]\n\nSee you on the battlefield!`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Email is not available on this device');
      }
    } catch (error) {
      console.error('Error opening email:', error);
      Alert.alert('Error', 'Could not open email app');
    }
  };

  const getInitials = (name: string | null, username: string | null) => {
    const displayName = name || username || 'U';
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Crew</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search for Crew</Text>
          <Text style={styles.sectionSubtitle}>Find people by username</Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter username"
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {searching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : hasSearched && searchResults.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="person-outline" size={32} color={COLORS.textSecondary} />
              <Text style={styles.noResultsText}>No users found</Text>
              <Text style={styles.noResultsSubtext}>Try a different email or username</Text>
            </View>
          ) : (
            searchResults.map((result) => (
              <View key={result.id} style={styles.resultItem}>
                <View style={styles.resultAvatar}>
                  <Text style={styles.resultAvatarText}>
                    {getInitials(result.display_name, result.username)}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>
                    {result.display_name || result.username || 'Unknown'}
                  </Text>
                  <Text style={styles.resultUsername}>@{result.username || 'no-username'}</Text>
                </View>
                {result.requestStatus === 'accepted' ? (
                  <View style={[styles.addButton, styles.addButtonDone]}>
                    <Ionicons name="checkmark" size={18} color={COLORS.white} />
                  </View>
                ) : result.requestStatus === 'pending' ? (
                  <View style={[styles.addButton, styles.addButtonPending]}>
                    <Ionicons name="time" size={18} color={COLORS.white} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      handleAddFriend(result.id, result.display_name || result.username || 'User')
                    }
                  >
                    <Ionicons name="person-add" size={18} color={COLORS.white} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Invite Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invite to Crew</Text>
          <Text style={styles.sectionSubtitle}>Invite people who aren't on Legacy Battle yet</Text>

          <TouchableOpacity style={styles.inviteOption} onPress={handleInviteViaText}>
            <View style={styles.inviteIconContainer}>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.inviteTextContainer}>
              <Text style={styles.inviteTitle}>Invite via Text Message</Text>
              <Text style={styles.inviteSubtitle}>Send an SMS invitation to your contacts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.inviteOption} onPress={handleInviteViaEmail}>
            <View style={styles.inviteIconContainer}>
              <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.inviteTextContainer}>
              <Text style={styles.inviteTitle}>Invite via Email</Text>
              <Text style={styles.inviteSubtitle}>Send an email invitation</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
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
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 36,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginBottom: SIZES.padding,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
    paddingVertical: SIZES.padding,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 2,
    gap: SIZES.base,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  noResultsText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
    marginTop: SIZES.base,
  },
  noResultsSubtext: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.base,
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  resultName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  resultUsername: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDone: {
    backgroundColor: '#22c55e',
  },
  addButtonPending: {
    backgroundColor: '#f59e0b',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginVertical: SIZES.padding,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    paddingHorizontal: SIZES.padding,
  },
  inviteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  inviteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteTextContainer: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  inviteTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  inviteSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: 2,
  },
});
