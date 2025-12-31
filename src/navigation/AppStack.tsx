// src/navigation/AppStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import {
  HomeScreen,
  BattlesScreen,
  CreateBattleScreen,
  BattleDetailScreen,
  AllResultsScreen,
  AllUpcomingGamesScreen,
  StartBattleScreen,
  BattleTypeScreen,
  ExploreScreen,
  ProfileScreen,
  DevDebugScreen,
  FriendsScreen,
  BattleVisibilityScreen,
  AddFriendScreen,
  StatDuelModeScreen,
  StatDuelDetailsScreen,
  StatDuelChampionScreen,
  StatDuelOpponentScreen,
  StatDuelConfirmScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBarButton({ onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.customTabButton}
      onPress={onPress}
    >
      <Image
        source={require('../../assets/battle-now-button.png')}
        style={styles.battleNowImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Battles"
        component={BattlesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BattleNow"
        component={HomeScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('BattleVisibility');
          },
        }}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CreateBattle" component={CreateBattleScreen} />
      <Stack.Screen name="BattleDetail" component={BattleDetailScreen} />
      <Stack.Screen name="AllResults" component={AllResultsScreen} />
      <Stack.Screen name="AllUpcomingGames" component={AllUpcomingGamesScreen} />
      <Stack.Screen name="StartBattle" component={StartBattleScreen} />
      <Stack.Screen name="BattleType" component={BattleTypeScreen} />
      <Stack.Screen name="DevDebug" component={DevDebugScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="BattleVisibility" component={BattleVisibilityScreen} />
      <Stack.Screen name="AddFriend" component={AddFriendScreen} />
      <Stack.Screen name="StatDuelMode" component={StatDuelModeScreen} />
      <Stack.Screen name="StatDuelDetails" component={StatDuelDetailsScreen} />
      <Stack.Screen name="StatDuelChampion" component={StatDuelChampionScreen} />
      <Stack.Screen name="StatDuelOpponent" component={StatDuelOpponentScreen} />
      <Stack.Screen name="StatDuelConfirm" component={StatDuelConfirmScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.inputBorder,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  customTabButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleNowImage: {
    width: 70,
    height: 70,
  },
});
