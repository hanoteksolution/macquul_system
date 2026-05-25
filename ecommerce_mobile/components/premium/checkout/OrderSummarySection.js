import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

function SummaryRow({ label, value, highlight, styles }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, highlight && styles.rowHighlight]}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
    </View>
  );
}

export default function OrderSummarySection({ cart, totals }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <LinearGradient colors={[premium.indigo, premium.violet]} style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </LinearGradient>
        <Text style={styles.sectionTitle}>Order Summary</Text>
      </View>

      <View style={styles.card}>
        {cart.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.thumb}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.thumbImg} resizeMode="cover" />
              ) : (
                <Ionicons name="cube-outline" size={20} color={premium.textMuted} />
              )}
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <SummaryRow label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} styles={styles} />
        <SummaryRow
          label="Shipping Fee"
          value={totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
          styles={styles}
        />
        <SummaryRow label="Tax" value={`$${totals.tax.toFixed(2)}`} styles={styles} />

        <View style={styles.divider} />

        <SummaryRow label="Total" value={`$${totals.total.toFixed(2)}`} highlight styles={styles} />
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  section: { marginBottom: 24 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: premium.text },
  card: {
    backgroundColor: premium.white,
    borderRadius: premium.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: premium.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbImg: { width: '100%', height: '100%' },
  itemBody: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: premium.text },
  itemQty: { fontSize: 12, color: premium.textMuted, marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: premium.text },
  divider: { height: 1, backgroundColor: premium.border, marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { fontSize: 14, color: premium.textSecondary },
  rowValue: { fontSize: 14, fontWeight: '600', color: premium.text },
  rowHighlight: { fontSize: 16, fontWeight: '800', color: premium.text },
  rowValueHighlight: { fontSize: 22, fontWeight: '800', color: premium.emerald },
});

