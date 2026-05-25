import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function PremiumEmptyState({ icon, title, subtitle, buttonLabel, onButtonPress }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={48} color={premium.indigo} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {buttonLabel && onButtonPress ? (
        <TouchableOpacity onPress={onButtonPress} activeOpacity={0.9}>
          <LinearGradient colors={premium.gradientPrimary} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.btnText}>{buttonLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 40 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '800', color: premium.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: premium.textSecondary, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  btn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

