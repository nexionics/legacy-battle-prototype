import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, radii } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import { useToast } from '@/app/providers/useToast';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useProfile } from '@/features/profile/ui/hooks/useProfile';
import { useProfileStore } from '@/features/profile/data/store/profile.store';
import { useUpdateAvatar } from '../../data/mutations/useUpdateAvatar';
import type { AccountDetailsScreenProps } from '@/shared/types';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';

export default function AccountDetailsScreen({ navigation }: AccountDetailsScreenProps) {
  const colors = useThemeColors();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { avatarVersion, setAvatarVersion } = useProfileStore();
  const updateAvatar = useUpdateAvatar(user?.id);
  const { showToast } = useToast();

  const displayName = profile?.displayName || 'Legacy Battles';
  const email = user?.email || 'legend@legacybattles.com';
  const avatarUrl = profile?.avatarUrl ? `${profile.avatarUrl}?v=${avatarVersion}` : null;

  const handleEditAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      try {
        await updateAvatar.mutateAsync(result.assets[0].uri);
        setAvatarVersion(Date.now());
        showToast('success', 'Avatar updated successfully.');
      } catch (error) {
        showToast('fail', 'Failed to update avatar. Please try again.');
      }
    }
  };

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title="Account Details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.card }]}>
                <Ionicons name="person" size={24} color={colors.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.editBadge,
                { backgroundColor: colors.primary, borderColor: colors.background },
              ]}
              onPress={handleEditAvatar}
              disabled={updateAvatar.isPending}
            >
              {updateAvatar.isPending ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="camera" size={12} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Rows */}
        <View style={styles.infoContainer}>
          <InfoRow
            icon="person-outline"
            label="Username"
            value={displayName}
            onEdit={() => navigation.navigate('EditUsername')}
          />
          <View style={[styles.divider, { backgroundColor: colors.inputBorder }]} />
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={email}
            onEdit={() => navigation.navigate('EditEmail')}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  onEdit: () => void;
}

function InfoRow({ icon, label, value, onEdit }: InfoRowProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon as any}
          size={24}
          color={colors.textSecondary}
          style={styles.rowIcon}
        />
        <View style={styles.rowStack}>
          <AppText variant="body2" style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {label}
          </AppText>
          <AppText variant="body1" style={{ color: colors.text, fontSize: 18, fontWeight: '500' }}>
            {value}
          </AppText>
        </View>
      </View>
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <MaterialCommunityIcons
          name="account-edit-outline"
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing[6],
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 0.56,
    borderColor: '#FF0000',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.56,
    borderColor: '#FF0000',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  infoContainer: {
    width: '100%',
    maxWidth: 366,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  rowStack: {
    flex: 1,
  },
  rowIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  editButton: {
    padding: spacing[1],
  },
  divider: {
    height: 0.5,
    width: '100%',
    opacity: 0.5,
  },
});
