import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import premiumAlert from '../../../utils/premiumAlert';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

const PROVIDERS = [
  { id: 'google', name: 'Google', icon: 'logo-google', color: '#ea4335' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877f2' },
  { id: 'apple', name: 'Apple', icon: 'logo-apple' },
];

export default function SocialLoginRow({ variant = 'dark' }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const isDark = variant === 'dark';

  const onPress = (name) => {
    premiumAlert('Coming soon', `${name} sign-in will be available in a future update.`, [{ text: 'OK' }], { variant: 'info' });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.dividerRow}>
        <View style={[styles.line, isDark && styles.lineDark]} />
        <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>Or continue with</Text>
        <View style={[styles.line, isDark && styles.lineDark]} />
      </View>
      <View style={styles.row}>
        {PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
            onPress={() => onPress(p.name)}
            activeOpacity={0.88}
          >
            <Ionicons
              name={p.icon}
              size={24}
              color={p.color ?? (isDark ? '#fff' : premium.text)}
            />
            <Text style={[styles.name, isDark && styles.nameDark]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { marginTop: 28 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: premium.border },
  lineDark: { backgroundColor: premium.glassDarkBorder },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    fontWeight: '600',
    color: premium.textMuted,
  },
  dividerTextDark: { color: premium.textOnDarkMuted },
  row: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: premium.radiusMd,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: premium.white,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  cardDark: {
    backgroundColor: premium.glassDark,
    borderColor: premium.glassDarkBorder,
  },
  name: { fontSize: 12, fontWeight: '600', color: premium.textSecondary, marginTop: 6 },
  nameDark: { color: premium.textOnDarkMuted },
});

