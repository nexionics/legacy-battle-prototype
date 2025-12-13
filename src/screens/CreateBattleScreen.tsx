import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { BattleService } from '../services/battleService';
import { useAuth } from '../contexts/AuthContext';

interface CreateBattleScreenProps {
  navigation: any;
}

export default function CreateBattleScreen({ navigation }: CreateBattleScreenProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventId, setEventId] = useState('');
  const [stake, setStake] = useState('0');
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a battle title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a battle');
      return;
    }

    setLoading(true);

    const { data, error } = await BattleService.createBattle({
      creatorId: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      eventId: eventId.trim() || undefined,
      stake: parseInt(stake) || 0,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Failed', error.message);
      return;
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Battle</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chiefs vs Bills - Who wins?"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add more details about this battle..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Event ID (optional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Game/Event ID (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Sports event ID (for future integration)"
              placeholderTextColor={COLORS.textSecondary}
              value={eventId}
              onChangeText={setEventId}
            />
            <Text style={styles.hint}>Leave blank for custom battles</Text>
          </View>

          {/* Stake */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stake (BC)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={COLORS.textSecondary}
              value={stake}
              onChangeText={(text) => setStake(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Battle Coins to wager (optional)</Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity 
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={onCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="flash" size={20} color={COLORS.white} />
              <Text style={styles.createButtonText}>Create Battle</Text>
            </>
          )}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  form: {
    marginTop: SIZES.padding,
  },
  inputGroup: {
    marginBottom: SIZES.padding * 1.5,
  },
  label: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    color: COLORS.text,
    fontSize: SIZES.font,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
    gap: SIZES.base,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});
