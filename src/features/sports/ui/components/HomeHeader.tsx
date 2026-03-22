import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes } from '@/shared/theme';

export type HomeHeaderProps = {
  displayName?: string | null;
  username?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  level?: string | null;
};

export function HomeHeader({ displayName, username, email, avatarUrl }: HomeHeaderProps) {
  const avatarInitials = (displayName || username || email || 'U').substring(0, 2).toUpperCase();
  const nameLine = displayName || username || email?.split('@')[0] || 'Player';

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <AppText variant="body1" style={styles.avatarText}>
                {avatarInitials}
              </AppText>
            )}
          </View>
        </View>
        <View style={styles.welcomeContainer}>
          <AppText variant="captionLg" style={styles.welcomeText}>
            Welcome Back
          </AppText>
          <AppText variant="h4" style={styles.usernameText}>
            {nameLine}
          </AppText>
        </View>
      </View>
      <TouchableOpacity style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  welcomeContainer: {},
  welcomeText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  usernameText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
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
    backgroundColor: colors.primary,
  },
});
