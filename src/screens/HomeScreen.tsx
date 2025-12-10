import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface HomeScreenProps {
  navigation: any;
}

const BattleCard = ({ title, subtitle, time, onJoin }: any) => (
  <View style={styles.battleCard}>
    <View style={styles.battleCardLeft}>
      <View style={styles.battleIcon}>
        <Text style={styles.battleIconText}>🏈</Text>
      </View>
      <View style={styles.battleInfo}>
        <Text style={styles.battleTitle}>{title}</Text>
        <Text style={styles.battleSubtitle}>{subtitle}</Text>
        <Text style={styles.battleTime}>{time}</Text>
      </View>
    </View>
    <View style={styles.battleCardRight}>
      <View style={styles.sponsorBadge}>
        <Text style={styles.sponsorText}>Nike</Text>
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MyBattleCard = ({ title, subtitle, opponent, endsIn, status }: any) => (
  <View style={styles.myBattleCard}>
    <View style={styles.myBattleHeader}>
      <View style={styles.myBattleLeft}>
        <View style={styles.battleIcon}>
          <Text style={styles.battleIconText}>🏈</Text>
        </View>
        <View style={styles.battleInfo}>
          <Text style={styles.battleTitle}>{title}</Text>
          <Text style={styles.battleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, status === 'Active' && styles.statusActive]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <View style={styles.myBattleDetails}>
      <View style={styles.opponentInfo}>
        <View style={styles.opponentAvatar}>
          <Ionicons name="person" size={16} color={COLORS.textSecondary} />
        </View>
        <Text style={styles.opponentText}>Vs {opponent}</Text>
      </View>
      <View style={styles.timeInfo}>
        <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.timeText}>Ends In {endsIn}</Text>
      </View>
    </View>
    <View style={styles.myBattleFooter}>
      <View style={styles.statDuelBadge}>
        <Text style={styles.statDuelText}>Stat Duel</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>LB</Text>
              </View>
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.usernameText}>Champion 🏆</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>1,247 XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Bc</Text>
              <Text style={styles.statValue}>2,000 BC</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.inviteBanner}>
            <Text style={styles.inviteText}>Chinaza Smart Invited You To A Battle</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Quick Picks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Picks</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BattleCard
              title="Mahomes Vs Burrow"
              subtitle="QB Passing Yards Duel"
              time="Sunday 1:00 PM"
              onJoin={() => {}}
            />
          </ScrollView>
        </View>

        {/* Start Battle Button */}
        <TouchableOpacity style={styles.startBattleButton}>
          <Text style={styles.startBattleText}>Start Battle</Text>
          <Text style={styles.startBattleIcon}>⚔</Text>
        </TouchableOpacity>

        {/* My Battle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Battle</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <MyBattleCard
            title="Mahomes Vs Burrow"
            subtitle="QB Passing Yards Duel"
            opponent="@Mike_jordan23"
            endsIn="2h 15m"
            status="Active"
          />
          <MyBattleCard
            title="Mahomes Vs Burrow"
            subtitle="QB Passing Yards Duel"
            opponent="@Mike_jordan23"
            endsIn="2h 15m"
            status="Active"
          />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeContainer: {},
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  usernameText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.primary,
  },
  statsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  statItem: {},
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SIZES.small,
  },
  statValue: {
    color: COLORS.white,
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: SIZES.radius,
    padding: SIZES.base,
  },
  inviteText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
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
  battleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SIZES.padding,
    marginRight: SIZES.base,
    minWidth: 300,
  },
  battleCardLeft: {
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
  battleTime: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  battleCardRight: {
    alignItems: 'flex-end',
    gap: SIZES.base,
  },
  sponsorBadge: {
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sponsorText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  startBattleButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  startBattleText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  startBattleIcon: {
    fontSize: 16,
  },
  myBattleCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  myBattleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  myBattleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  statusBadge: {
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: COLORS.primary,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  myBattleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  opponentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
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
  myBattleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statDuelBadge: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statDuelText: {
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
