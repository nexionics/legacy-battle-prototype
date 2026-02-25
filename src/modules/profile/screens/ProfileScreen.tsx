import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, AppText, LoadingState, ErrorState } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { useAuth } from '@/app/providers/AuthContext';
import { useAppTheme } from '@/app/providers/ThemeContext';
import type { UserProfile } from '@/shared/types';
import { ProfileRepo, BattleStats } from '@/modules/profile/services/profileRepo';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { signOut, user } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [battleStats, setBattleStats] = useState<BattleStats>({ wins: 0, losses: 0, challenges: 0 });
  const [crewCount, setCrewCount] = useState(0);
  const [pendingCrewCount, setPendingCrewCount] = useState(0);

  const loadBattleStats = async () => {
    if (!user) return;
    const stats = await ProfileRepo.getBattleStats(user.id);
    setBattleStats(stats);
  };

  const loadCrewCounts = async () => {
    if (!user) return;
    const result = await ProfileRepo.getCrewCounts(user.id);
    setCrewCount(result.crewCount);
    setPendingCrewCount(result.pendingCount);
  };

  const reloadProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await ProfileRepo.getProfileById(user.id);
    if (error) {
      console.error('Error loading profile', error);
      setError('Unable to load profile.');
    } else {
      setError(null);
      setProfile(data as UserProfile);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    reloadProfile();
    loadBattleStats();
    loadCrewCounts();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    const channel = ProfileRepo.subscribeToProfile(user.id, (nextProfile) => {
      setProfile(nextProfile);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await ProfileRepo.updateDisplayName(user.id, displayName);

    setSaving(false);

    if (error) {
      Alert.alert('Update Failed', error.message);
    } else {
      Alert.alert('Updated', 'Your profile was updated.');
      setIsEditing(false);
      if (profile) {
        setProfile({ ...profile, display_name: displayName });
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

  const getLevelInfo = (xp: number) => {
    if (xp >= 3000) return { level: 'Legend', nextLevel: 'Legend', progress: 100, nextXp: 3000 };
    if (xp >= 2000) return { level: 'Champion', nextLevel: 'Legend', progress: ((xp - 2000) / 1000) * 100, nextXp: 3000 };
    if (xp >= 1000) return { level: 'Veteran', nextLevel: 'Champion', progress: ((xp - 1000) / 1000) * 100, nextXp: 2000 };
    if (xp >= 500) return { level: 'Challenger', nextLevel: 'Veteran', progress: ((xp - 500) / 500) * 100, nextXp: 1000 };
    return { level: 'Rookie', nextLevel: 'Challenger', progress: (xp / 500) * 100, nextXp: 500 };
  };

  const levelInfo = getLevelInfo(xpValue);
  const levelNumber = xpValue >= 3000 ? 15 : xpValue >= 2000 ? 12 : xpValue >= 1000 ? 8 : xpValue >= 500 ? 4 : 1;

  if (loading) {
    return (
      <Screen>
        <LoadingState message="Loading profile..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState
          message={error}
          onRetry={() => {
            reloadProfile();
            loadBattleStats();
            loadCrewCounts();
          }}
        />
      </Screen>
    );
  }
  return (
    <Screen padding={0}>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <AppText style={styles.headerTitle}>Profile</AppText>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>{avatarInitials}</AppText>
            </View>
          </View>
          
          <AppText style={styles.username}>{profile?.display_name || profile?.username || 'User'}</AppText>
          <AppText style={styles.email}>{user?.email}</AppText>
          
          {/* Level Badge */}
          <View style={styles.levelBadgeContainer}>
            <AppText style={styles.trophyIcon}>🏆</AppText>
            <AppText style={styles.levelBadgeText}>
              {levelInfo.level} Level {levelNumber}
            </AppText>
            <AppText style={styles.levelXpText}>  {xpValue.toLocaleString()} XP</AppText>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <AppText style={[styles.statValue, styles.statValueGreen]}>{battleStats.wins}</AppText>
            <AppText style={styles.statLabel}>Wins</AppText>
          </View>
          <View style={[styles.statBox, styles.statBoxRed]}>
            <AppText style={[styles.statValue, styles.statValueRed]}>{battleStats.losses}</AppText>
            <AppText style={styles.statLabel}>Losses</AppText>
          </View>
          <View style={[styles.statBox, styles.statBoxBlue]}>
            <AppText style={[styles.statValue, styles.statValueBlue]}>{battleStats.challenges}</AppText>
            <AppText style={styles.statLabel}>Challenges</AppText>
          </View>
          <View style={[styles.statBox, styles.statBoxGray]}>
            <AppText style={styles.statValue}>{Number(walletBalance).toLocaleString()}</AppText>
            <AppText style={styles.statLabel}>BC Coins</AppText>
          </View>
        </View>

        {/* Legacy Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <AppText style={styles.rankTitle}>Legacy Rank</AppText>
            <AppText style={styles.rankLevel}>{levelInfo.level}</AppText>
          </View>
          <View style={styles.rankProgressContainer}>
            <View style={styles.rankProgressBar}>
              <View style={[styles.rankProgress, { width: `${levelInfo.progress}%` }]} />
            </View>
          </View>
          <View style={styles.rankFooter}>
            <AppText style={styles.rankXpText}>{xpValue.toLocaleString()} XP</AppText>
            <AppText style={styles.rankNextText}>{levelInfo.nextLevel}: {levelInfo.nextXp.toLocaleString()} XP</AppText>
          </View>
          
          {/* Battle Invitation */}
          <TouchableOpacity style={styles.invitationBanner}>
            <AppText style={styles.invitationText}>You Have Pending Battle Invites</AppText>
            <Ionicons name="arrow-forward" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Total BC Card */}
        <View style={styles.bcCard}>
          <View style={styles.bcLeft}>
            <AppText style={styles.bcLabel}>Total Bc</AppText>
            <AppText style={styles.bcValue}>{Number(walletBalance).toLocaleString()} BC</AppText>
          </View>
          <View style={styles.bcRight}>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewMoreButton}>
              <AppText style={styles.viewMoreText}>View More</AppText>
              <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* Achievements */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="trophy-outline" size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>Achievements</AppText>
            <View style={styles.menuRight}>
              <View style={styles.menuBadge}>
                <AppText style={styles.menuBadgeText}>12</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Statistics */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="stats-chart-outline" size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>Statistics</AppText>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Crew */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Friends')}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="people-outline" size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>Crew</AppText>
            <View style={styles.menuRight}>
              {pendingCrewCount > 0 && (
                <View style={styles.menuBadgePending}>
                  <AppText style={styles.menuBadgeText}>{pendingCrewCount}</AppText>
                </View>
              )}
              <View style={styles.menuBadge}>
                <AppText style={styles.menuBadgeText}>{crewCount}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Wallet */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="wallet-outline" size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>Wallet</AppText>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>Notifications</AppText>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>Help & Support</AppText>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Dark/Light Mode Toggle */}
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name={mode === 'dark' ? 'moon-outline' : 'sunny-outline'} size={22} color={colors.text} />
            </View>
            <AppText style={styles.menuItemText}>{mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</AppText>
            <View style={styles.menuRight}>
              <Switch
                value={mode === 'light'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.inputBorder, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.primary} />
          <AppText style={styles.logoutText}>Log Out</AppText>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  headerTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarContainer: {
    marginBottom: spacing[2],
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.inputBorder,
  },
  avatarText: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing[1],
  },
  email: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing[2],
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
  },
  trophyIcon: {
    fontSize: fontSizes.md,
    marginRight: spacing[1],
  },
  levelBadgeText: {
    color: colors.success,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  levelXpText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    borderWidth: 1,
  },
  statBoxGreen: {
    borderColor: '#22c55e',
  },
  statBoxRed: {
    borderColor: colors.primary,
  },
  statBoxBlue: {
    borderColor: '#3b82f6',
  },
  statBoxGray: {
    borderColor: colors.inputBorder,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statValueGreen: {
    color: '#22c55e',
  },
  statValueRed: {
    color: colors.primary,
  },
  statValueBlue: {
    color: '#3b82f6',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  rankCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  rankTitle: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  rankLevel: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  rankProgressContainer: {
    marginBottom: spacing[2],
  },
  rankProgressBar: {
    height: spacing[2],
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: radii.sm,
  },
  rankProgress: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.sm,
  },
  rankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  rankXpText: {
    color: colors.white,
    fontSize: fontSizes.xs,
  },
  rankNextText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSizes.xs,
  },
  invitationBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.lg,
    padding: spacing[4],
  },
  invitationText: {
    color: colors.white,
    fontSize: fontSizes.sm,
  },
  bcCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  bcLeft: {},
  bcLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing[1],
  },
  bcValue: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
  bcRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  viewMoreText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  socialCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  socialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  socialTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  moreDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  moreDetailsText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  socialSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing[4],
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  menuItemText: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  menuBadge: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minWidth: 28,
    alignItems: 'center',
  },
  menuBadgePending: {
    backgroundColor: colors.warning,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minWidth: 28,
    alignItems: 'center',
  },
  menuBadgeText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    marginBottom: spacing[6],
  },
  logoutText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
});
