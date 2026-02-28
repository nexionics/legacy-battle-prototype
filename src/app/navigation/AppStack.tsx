import React from 'react';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  BattlesScreen,
  CreateBattleScreen,
  BattleDetailScreen,
  StartBattleScreen,
  BattleTypeScreen,
  ExploreScreen,
  BattleVisibilityScreen,
  StatDuelModeScreen,
  StatDuelDetailsScreen,
  StatDuelChampionScreen,
  StatDuelOpponentScreen,
  StatDuelConfirmScreen,
} from '@/features/battles';
import { FriendsScreen, AddFriendScreen } from '@/features/crew';
import { ProfileScreen, DevDebugScreen } from '@/features/profile';
import { HomeScreen, AllResultsScreen, AllUpcomingGamesScreen } from '@/features/sports';
import { RootStackParamList } from './types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/shared/theme';

const Tab = createBottomTabNavigator();

function CustomTabBarButton({ onPress }: any) {
  return (
    <TouchableOpacity style={tabStyles.customTabButton} onPress={onPress}>
      <Image
        source={require('../../assets/images/battle-now-button.png')}
        style={tabStyles.battleNowImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

function BattleNowPlaceholder() {
  return null;
}

function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: tabStyles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen as React.ComponentType<any>}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Battles"
        component={BattlesScreen as React.ComponentType<any>}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BattleNow"
        component={BattleNowPlaceholder}
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
        component={ProfileScreen as React.ComponentType<any>}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.inputBorder,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarLabel: { fontSize: 10, fontWeight: '500' },
  customTabButton: { top: -20, justifyContent: 'center', alignItems: 'center' },
  battleNowImage: { width: 70, height: 70 },
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const headerOptions: NativeStackNavigationOptions = { headerShown: false };

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
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
};

export default AppStack;
