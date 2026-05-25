import React from 'react';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { View, Text, StyleSheet } from 'react-native';

export function getPasswordStrength(password, theme) {
  const muted = theme?.textMuted ?? '#94a3b8';
  const emerald = theme?.emerald ?? '#10b981';
  if (!password) return { score: 0, label: '', color: muted };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: 'Weak', color: '#f43f5e' };
  if (score <= 3) return { score: 2, label: 'Fair', color: '#f59e0b' };
  return { score: 3, label: 'Strong', color: emerald };
}

export default function PasswordStrengthBar({ password }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const { score, label, color } = getPasswordStrength(password, premium);
  if (!password) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.segment, i <= score && { backgroundColor: color }]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { flexDirection: 'row', alignItems: 'center', marginTop: -8, marginBottom: 12, gap: 10 },
  bars: { flex: 1, flexDirection: 'row', gap: 6 },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: premium.border,
  },
  label: { fontSize: 12, fontWeight: '700', minWidth: 44 },
});

