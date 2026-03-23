import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen, AuthHeader, Input, Button } from '@/shared/ui';
import { spacing, sizes } from '@/shared/theme';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { EditEmailScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '@/features/auth/data/store/auth.store';

export default function EditEmailScreen({ navigation }: EditEmailScreenProps) {
  const themeColors = useThemeColors();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState(user?.email || '');

  const handleVerify = () => {
    if (!email) {
      showToast('fail', 'Please enter an email address');
      return;
    }
    navigation.navigate('VerifyEmailOTP', { email });
  };

  return (
    <Screen padding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          logoSize={64}
          title="Edit Email Address"
          subtitle="Edit Your Email Address"
          onBeforeBack={() => navigation.goBack()}
        />

        <View style={styles.form}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftComponent={
              <Ionicons name="mail-outline" size={sizes.icon20} color={themeColors.textSecondary} />
            }
          />

          <Button variant="primary" onPress={handleVerify} style={styles.saveButton}>
            Verify Email
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
  saveButton: {
    marginTop: spacing[2],
  },
});
