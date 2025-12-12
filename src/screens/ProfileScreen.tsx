import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: string;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
};

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile', error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setDisplayName(profile.display_name || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profiles-change')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        display_name: displayName,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Update Failed', error.message);
    } else {
      Alert.alert('Updated', 'Your profile was updated.');
      setIsEditing(false);
      if (profile) {
        setProfile({ ...profile, username, display_name: displayName });
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  const walletBalance = Number(profile?.wallet_balance || 0).toFixed(2);
  const xpValue = profile?.xp || 0;
  const levelValue = profile?.level || 'Challenger';
  const avatarInitials = (profile?.display_name || profile?.username || user?.email || 'U')
    .substring(0, 2)
    .toUpperCase();

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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{levelValue}</Text>
            </View>
          </View>
          
          {isEditing ? (
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Display Name</Text>
              <TextInput
                style={styles.editInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter display name"
                placeholderTextColor={COLORS.textSecondary}
              />
              <Text style={styles.editLabel}>Username</Text>
              <TextInput
                style={styles.editInput}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setIsEditing(false);
                    setUsername(profile?.username || '');
                    setDisplayName(profile?.display_name || '');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={saveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.username}>{profile?.display_name || 'Set Display Name'}</Text>
              <Text style={styles.handle}>@{profile?.username || 'set_username'}</Text>
              <TouchableOpacity 
                style={styles.editProfileButton} 
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={14} color={COLORS.primary} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Battles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
        </View>

        {/* XP Card */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>Experience Points</Text>
            <Text style={styles.xpValue}>{xpValue.toLocaleString()} XP</Text>
          </View>
          <View style={styles.xpProgressContainer}>
            <View style={styles.xpProgressBar}>
              <View style={[styles.xpProgress, { width: `${Math.min((xpValue % 1000) / 10, 100)}%` }]} />
            </View>
            <Text style={styles.xpProgressText}>{1000 - (xpValue % 1000)} XP to next level</Text>
          </View>
        </View>

        {/* Battle Coins Card */}
        <View style={styles.coinsCard}>
          <View style={styles.coinsLeft}>
            <View style={styles.coinIcon}>
              <Text style={styles.coinIconText}>🪙</Text>
            </View>
            <View>
              <Text style={styles.coinsLabel}>Battle Coins</Text>
              <Text style={styles.coinsValue}>{walletBalance} BC</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addCoinsButton}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.addCoinsText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {[
            { icon: 'trophy-outline', label: 'Achievements', badge: '12' },
            { icon: 'stats-chart-outline', label: 'Statistics' },
            { icon: 'people-outline', label: 'Friends', badge: '5' },
            { icon: 'wallet-outline', label: 'Wallet' },
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.text} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.base,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: SIZES.radius,
  },
  levelText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  username: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  handle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginBottom: SIZES.padding,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.inputBorder,
  },
  xpCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  xpTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  xpValue: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  xpProgressContainer: {},
  xpProgressBar: {
    height: 8,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 4,
    marginBottom: SIZES.base,
  },
  xpProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  xpProgressText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  coinsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  coinsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIconText: {
    fontSize: 20,
  },
  coinsLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  coinsValue: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  addCoinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: 4,
  },
  addCoinsText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  menuSection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  menuBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: SIZES.radius,
  },
  menuBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editSection: {
    width: '100%',
    marginBottom: SIZES.padding,
  },
  editLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: 4,
    marginTop: SIZES.base,
  },
  editInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    color: COLORS.text,
    fontSize: SIZES.font,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding,
    gap: SIZES.base,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SIZES.padding,
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
});
