import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';

function useDecorStyles() {
  const premium = usePremiumTheme();
  return useThemedStyles((p) => ({
    orb: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
    orb1: { width: 180, height: 180, backgroundColor: p.violet, top: -40, right: -50 },
    orb2: { width: 120, height: 120, backgroundColor: p.emerald, bottom: 120, left: -30, opacity: 0.25 },
    orb3: { width: 90, height: 90, backgroundColor: p.cyan, top: '40%', right: 20, opacity: 0.2 },
    orbLight: { position: 'absolute', borderRadius: 999 },
    light1: { width: 140, height: 140, backgroundColor: 'rgba(99, 102, 241, 0.12)', top: 60, right: -30 },
    light2: { width: 100, height: 100, backgroundColor: 'rgba(16, 185, 129, 0.1)', bottom: 200, left: -20 },
    light3: { width: 80, height: 80, backgroundColor: 'rgba(139, 92, 246, 0.08)', top: '35%', left: 30 },
    heroWrap: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
    heroGlow: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
    heroIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.25)',
    },
    floatingBadge: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: p.emerald,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: p.navy,
    },
    emojiDecor: { position: 'absolute', fontSize: 28, top: 0, left: -20 },
    emoji2: { left: undefined, right: -24, top: 20 },
    registerHero: { alignItems: 'center', marginBottom: 20, marginTop: 4 },
    registerIconBox: {
      width: 88,
      height: 88,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      ...p.shadowCard,
    },
    plusBadge: {
      position: 'absolute',
      bottom: -4,
      right: '35%',
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: p.emerald,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: p.surface,
    },
  }));
}

export function AuthDarkOrbs() {
  const styles = useDecorStyles();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />
    </View>
  );
}

export function AuthLightOrbs() {
  const styles = useDecorStyles();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.orbLight, styles.light1]} />
      <View style={[styles.orbLight, styles.light2]} />
      <View style={[styles.orbLight, styles.light3]} />
    </View>
  );
}

export function AuthHeroLock({ variant = 'dark' }) {
  const premium = usePremiumTheme();
  const styles = useDecorStyles();
  const isDark = variant === 'dark';
  return (
    <View style={styles.heroWrap}>
      <LinearGradient
        colors={
          isDark
            ? ['rgba(16,185,129,0.25)', 'rgba(99,102,241,0.2)']
            : ['rgba(99,102,241,0.12)', 'rgba(16,185,129,0.1)']
        }
        style={styles.heroGlow}
      >
        <View style={styles.heroIcon}>
          <Ionicons
            name="shield-checkmark"
            size={48}
            color={isDark ? premium.emeraldLight : premium.emerald}
          />
        </View>
        <View style={styles.floatingBadge}>
          <Ionicons name="lock-closed" size={20} color="#fff" />
        </View>
      </LinearGradient>
      {isDark ? (
        <>
          <Text style={styles.emojiDecor}>🛍️</Text>
          <Text style={[styles.emojiDecor, styles.emoji2]}>⌚</Text>
        </>
      ) : null}
    </View>
  );
}

export function AuthRegisterHero() {
  const premium = usePremiumTheme();
  const styles = useDecorStyles();
  return (
    <View style={styles.registerHero}>
      <LinearGradient
        colors={premium.gradientPrimary}
        style={styles.registerIconBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="person-add" size={40} color="#fff" />
      </LinearGradient>
      <View style={styles.plusBadge}>
        <Ionicons name="add" size={16} color="#fff" />
      </View>
    </View>
  );
}
