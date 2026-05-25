import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CartFooterSummary({ total, onCheckout, loading }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={onCheckout} disabled={loading} activeOpacity={0.92}>
        <LinearGradient
          colors={[premium.indigo, premium.violet, premium.cyan]}
          style={styles.btn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="card-outline" size={22} color="#fff" />
              <Text style={styles.btnText}>Proceed to Checkout</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: premium.surface,
    borderTopLeftRadius: premium.radiusXl,
    borderTopRightRadius: premium.radiusXl,
    borderTopWidth: 1,
    borderTopColor: premium.border,
    ...premium.shadowCard,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: premium.textSecondary },
  totalValue: { fontSize: 28, fontWeight: '800', color: premium.emerald },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: premium.radiusMd,
    shadowColor: premium.indigo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

