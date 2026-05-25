import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

const TRUST = [
  { icon: 'lock-closed-outline', title: 'Secure Checkout', sub: 'Encrypted' },
  { icon: 'refresh-outline', title: 'Easy Returns', sub: '7-day policy' },
  { icon: 'car-outline', title: 'Fast Delivery', sub: 'Track order' },
  { icon: 'headset-outline', title: '24/7 Support', sub: 'Always here' },
];

export default function CartTrustBar() {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      {TRUST.map((t) => (
        <View key={t.title} style={styles.item}>
          <Ionicons name={t.icon} size={18} color={premium.indigo} />
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  item: { flex: 1, alignItems: 'center' },
  title: { fontSize: 9, fontWeight: '800', color: premium.text, marginTop: 4, textAlign: 'center' },
  sub: { fontSize: 8, color: premium.textMuted, textAlign: 'center', marginTop: 1 },
});

