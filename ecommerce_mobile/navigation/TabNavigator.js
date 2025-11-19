import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

// Import screens - ALL MINIMAL TEST SCREENS
import TestHomeScreen from '../screens/TestHomeScreen';
import TestProductsScreen from '../screens/TestProductsScreen';
import TestOrdersScreen from '../screens/TestOrdersScreen';
import TestProfileScreen from '../screens/TestProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Products: focused ? '📦' : '📋',
    Orders: focused ? '📋' : '📄',
    Profile: focused ? '👤' : '👥',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.iconText, { opacity: focused ? 1 : 0.6 }]}>
        {icons[name]}
      </Text>
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={TestHomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Products" 
        component={TestProductsScreen}
        options={{ tabBarLabel: 'Products' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={TestOrdersScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={TestProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
});
