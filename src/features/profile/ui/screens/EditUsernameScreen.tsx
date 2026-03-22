import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

import { Screen, AuthHeader, Input, Button, AppText } from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/theme';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { EditUsernameScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { useToast } from '@/app/providers/useToast';
import { getCheckUsername } from '@/features/auth/data/api/authApi';
import { useUpdateProfile } from '../../data/mutations/useUpdateProfile';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { useProfile } from '@/features/profile/ui/hooks/useProfile';
import { profileKeys } from '../../data/keys';

export default function EditUsernameScreen({ navigation }: EditUsernameScreenProps) {
  const themeColors = useThemeColors();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { profile } = useProfile(user?.id);

  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const updateProfileMutation = useUpdateProfile(user?.id);

  // Initialize username from profile once loaded
  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  useEffect(() => {
    if (!username || username === profile?.username) {
      setIsAvailable(null);
      setStatusMessage('');
      return;
    }

    if (username.length < 3) {
      setIsAvailable(false);
      setStatusMessage('Username must be at least 3 characters');
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const result = await getCheckUsername(username);
        if (result.success) {
          setIsAvailable(result.data.available);
          setStatusMessage(result.data.message);
        } else {
          setIsAvailable(false);
          setStatusMessage('Error checking availability');
        }
      } catch (error) {
        setIsAvailable(false);
        setStatusMessage('Error checking availability');
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, profile?.username]);

  const handleSave = async () => {
    if (!username || username === profile?.username) {
      showToast('fail', 'Please enter a new username');
      return;
    }

    if (isAvailable === false) {
      showToast('fail', 'Please choose an available username');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ username });
      showToast('success', 'Username updated successfully');

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(user.id) });
      }

      navigation.goBack();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update username';
      showToast('fail', msg);
    }
  };

  return (
    <Screen padding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          logoSize={64}
          title="Edit Username"
          subtitle="Enter A Username To Start Creating Legacies"
          onBeforeBack={() => navigation.goBack()}
        />

        <View style={styles.form}>
          <View style={styles.inputSection}>
            <Input
              label="Enter Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              leftComponent={
                <Ionicons
                  name="person-outline"
                  size={sizes.icon20}
                  color={themeColors.textSecondary}
                />
              }
              rightComponent={
                isAvailable ? (
                  <Ionicons name="checkmark-circle" size={sizes.icon20} color={colors.success} />
                ) : null
              }
              editable={!updateProfileMutation.isPending}
            />
            {statusMessage ? (
              <AppText
                variant="body2"
                style={[styles.statusText, { color: isAvailable ? colors.success : colors.error }]}
              >
                {statusMessage}
              </AppText>
            ) : null}
          </View>

          <Button
            variant="primary"
            loading={updateProfileMutation.isPending || isChecking}
            disabled={!username || username === profile?.username || isAvailable === false}
            onPress={handleSave}
            style={styles.saveButton}
            rightIcon={
              <MaterialCommunityIcons name="fire" size={sizes.icon20} color={colors.white} />
            }
          >
            Change Username
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  form: {
    marginTop: spacing[4],
    gap: spacing[6],
  },
  inputSection: {
    gap: spacing[2],
  },
  statusText: {
    marginLeft: spacing[1],
  },
  saveButton: {
    marginTop: spacing[2],
  },
});
