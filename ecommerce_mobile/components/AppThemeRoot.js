import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';

/** Applies status bar + root background from active theme */
export default function AppThemeRoot({ children }) {
  const { premium, loading, isDarkMode } = useTheme();

  if (loading) {
    return (
      <View style={[styles.boot, { backgroundColor: premium.background }]}>
        <ActivityIndicator size="large" color={premium.indigo} />
        <StatusBar style={premium.statusBarStyle} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: premium.background }]}>
      <StatusBar style={premium.statusBarStyle} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
