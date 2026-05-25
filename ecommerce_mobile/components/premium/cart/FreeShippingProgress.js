import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/cartPricing';

export default function FreeShippingProgress({ subtotal }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const qualifies = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <LinearGradient
      colors={['rgba(99,102,241,0.12)', 'rgba(139,92,246,0.06)']}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.text}>
        {qualifies
          ? 'You qualify for FREE shipping!'
          : `You are $${remaining.toFixed(2)} away from FREE shipping!`}
      </Text>
      <View style={styles.track}>
        <LinearGradient
          colors={[premium.indigo, premium.violet, premium.cyan]}
          style={[styles.fill, { width: `${Math.max(progress * 100, 8)}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <View style={[styles.truck, { left: `${Math.min(progress * 100, 92)}%` }]}>
          <Ionicons name="car-outline" size={14} color={premium.indigo} />
        </View>
      </View>
    </LinearGradient>
  );
}

const createStyles = (premium) => ({

  card: {
    borderRadius: premium.radiusMd,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: premium.glassBorder,
  },
  text: { fontSize: 13, fontWeight: '700', color: premium.indigo, marginBottom: 12 },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    overflow: 'visible',
    position: 'relative',
  },
  fill: { height: '100%', borderRadius: 5 },
  truck: {
    position: 'absolute',
    top: -6,
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
});

