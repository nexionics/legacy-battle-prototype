import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/shared/theme';

interface CreateUsernameScreenProps {
  navigation: any;
}

export default function CreateUsernameScreen({ navigation }: CreateUsernameScreenProps) {
  const [username, setUsername] = useState('Nazasmart');
  const isAvailable = username.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LB</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create A Username</Text>
          <Text style={styles.subtitle}>Enter A Username To Start Your Legacy</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Username</Text>
          <View style={[styles.inputWrapper, isAvailable && styles.inputWrapperValid]}>
            <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor={COLORS.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {isAvailable && (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              </View>
            )}
          </View>
          {isAvailable && (
            <Text style={styles.availableText}>Username Is Available</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.startButtonText}>Start Battle</Text>
          <View style={styles.battleIcon}>
            <Text style={styles.battleIconText}>⚔</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  header: {
    paddingTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    marginBottom: SIZES.padding * 2,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
  },
  inputWrapperValid: {
    borderColor: COLORS.success,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.medium,
    paddingVertical: SIZES.padding,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableText: {
    color: COLORS.success,
    fontSize: SIZES.small,
    marginTop: SIZES.base,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  battleIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleIconText: {
    fontSize: 16,
  },
});
