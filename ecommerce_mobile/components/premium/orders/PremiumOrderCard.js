import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import {
  getStatusMeta,
  formatOrderDate,
  getOrderTotal,
  getOrderItemCount,
} from '../../../utils/orderStatus';

const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function TrackingBar({ step, premium, styles }) {
  const progress = Math.min(1, (step + 1) / STEPS.length);
  return (
    <View style={styles.trackWrap}>
      <View style={styles.trackBg}>
        <LinearGradient
          colors={[premium.indigo, premium.emerald]}
          style={[styles.trackFill, { width: `${progress * 100}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <View style={styles.trackLabels}>
        {STEPS.map((label, i) => (
          <Text
            key={label}
            style={[styles.trackLabel, i <= step && styles.trackLabelActive]}
            numberOfLines={1}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function PremiumOrderCard({ order, onPress }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const scale = useRef(new Animated.Value(1)).current;
  const meta = getStatusMeta(order?.status);
  const total = getOrderTotal(order);
  const itemCount = getOrderItemCount(order);
  const cancelled = meta.label === 'Cancelled';

  const pressIn = () => Animated.spring(scale, { toValue: 0.985, useNativeDriver: true, friction: 8 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <View style={styles.card}>
          <LinearGradient
            colors={['rgba(99,102,241,0.06)', 'rgba(255,255,255,0)']}
            style={styles.cardGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.topRow}>
            <LinearGradient colors={meta.gradient} style={styles.iconBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name={meta.icon} size={22} color="#fff" />
            </LinearGradient>

            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <View style={[styles.badge, { backgroundColor: meta.bg }]}>
                  <View style={[styles.pulse, { backgroundColor: meta.color }]} />
                  <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color={premium.textMuted} />
                <Text style={styles.date}>{formatOrderDate(order.created_at || order.date)}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="cube-outline" size={13} color={premium.textMuted} />
                <Text style={styles.items}>
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View style={styles.totalCol}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {!cancelled ? <TrackingBar step={meta.step} premium={premium} styles={styles} /> : null}

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Ionicons name="document-text-outline" size={16} color={premium.indigo} />
              <Text style={styles.footerText}>View order details</Text>
            </View>
            <View style={styles.chevronWrap}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (premium) => ({

  wrap: { marginBottom: 14 },
  card: {
    backgroundColor: premium.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: premium.glassBorder,
    overflow: 'hidden',
    ...premium.shadowCard,
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', zIndex: 1 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  orderId: { fontSize: 16, fontWeight: '900', color: premium.text },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  pulse: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  date: { fontSize: 12, color: premium.textSecondary, fontWeight: '500' },
  items: { fontSize: 12, color: premium.textSecondary, fontWeight: '500' },
  totalCol: { alignItems: 'flex-end', marginLeft: 8 },
  totalLabel: { fontSize: 10, fontWeight: '600', color: premium.textMuted, textTransform: 'uppercase' },
  total: { fontSize: 18, fontWeight: '900', color: premium.emerald, marginTop: 2 },
  trackWrap: { marginTop: 14, zIndex: 1 },
  trackBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: premium.background,
    overflow: 'hidden',
  },
  trackFill: { height: '100%', borderRadius: 3 },
  trackLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  trackLabel: { fontSize: 9, fontWeight: '600', color: premium.textMuted, flex: 1, textAlign: 'center' },
  trackLabelActive: { color: premium.indigo, fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: premium.border,
    zIndex: 1,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 13, fontWeight: '700', color: premium.indigo },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: premium.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

