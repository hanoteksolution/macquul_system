import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors } from '../constants/colors';

const CustomBottomTabs = ({ children, initialTab = 0, navigation }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { name: 'Home', icon: '🏠', activeIcon: '🏠' },
    { name: 'Products', icon: '📦', activeIcon: '📦' },
    { name: 'Orders', icon: '📋', activeIcon: '📋' },
    { name: 'Profile', icon: '👤', activeIcon: '👤' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>
        {React.cloneElement(children[activeTab], { navigation })}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabIcon, activeTab === index && styles.activeTabIcon]}>
              {activeTab === index ? tab.activeIcon : tab.icon}
            </Text>
            <Text style={[styles.tabLabel, activeTab === index && styles.activeTabLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabLabel: {
    color: colors.primary,
  },
});

export default CustomBottomTabs;
