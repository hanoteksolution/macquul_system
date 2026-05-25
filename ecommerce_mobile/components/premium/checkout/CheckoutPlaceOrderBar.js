import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutPlaceOrderBar({ total, onPlaceOrder, loading }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={onPlaceOrder} disabled={loading} activeOpacity={0.92}>
        <LinearGradient
          colors={[premium.indigo, premium.violet, premium.emerald]}
          style={styles.btn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={20} color="#fff" />
              <Text style={styles.btnLabel}>Place Order</Text>
              <Text style={styles.btnPrice}>${total.toFixed(2)}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.terms}>
        By placing this order, you agree to our{' '}
        <Text style={styles.termsLink}>Terms & Conditions</Text>
      </Text>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: premium.glassBorder,
    ...premium.shadowCard,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: premium.radiusMd,
    gap: 10,
    shadowColor: premium.indigo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  btnLabel: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', textAlign: 'center' },
  btnPrice: { fontSize: 16, fontWeight: '800', color: '#fff' },
  terms: {
    fontSize: 11,
    color: premium.textMuted,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  termsLink: { color: premium.indigo, fontWeight: '700' },
});

