import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@/features/sports';
import { BattlesScreen, ExploreScreen } from '@/features/battles';
import { ProfileScreen } from '@/features/profile';
import {
  colors,
  Sizes,
  verticalScale,
  horizontalScale,
  FontFamily,
} from '@/shared/theme';
import type {
  TabStackParamList,
  TabScreenProps,
  CustomTabBarButtonProps,
  MainTabsScreenProps,
} from './types';

const Tab = createBottomTabNavigator<TabStackParamList>();

function CustomTabBarButton({ onPress }: CustomTabBarButtonProps) {
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

export function MainTabs({ navigation }: MainTabsScreenProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: tabStyles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen as React.ComponentType<TabScreenProps<'Home'>>}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Battles"
        component={BattlesScreen as React.ComponentType<TabScreenProps<'Battles'>>}
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
        component={ExploreScreen as React.ComponentType<TabScreenProps<'Explore'>>}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen as React.ComponentType<TabScreenProps<'Profile'>>}
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
    backgroundColor: colors.background,
    borderTopColor: colors.inputBorder,
    borderTopWidth: 1,
    height: verticalScale(70),
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(10),
  },
  tabBarLabel: {
    fontSize: Sizes.font10,
    fontFamily: FontFamily.montserratMedium,
  },
  customTabButton: {
    top: -verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleNowImage: {
    width: horizontalScale(70),
    height: verticalScale(70),
  },
});
