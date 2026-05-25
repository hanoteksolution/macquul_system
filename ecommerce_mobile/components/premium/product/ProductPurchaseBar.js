import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

function formatPrice(product) {
  const price = parseFloat(product?.sale_price ?? product?.price ?? 0);
  return Number.isNaN(price) ? '0.00' : price.toFixed(2);
}

export default function ProductPurchaseBar({
  product,
  quantity,
  onDecrement,
  onIncrement,
  onAddToCart,
  loading,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const lineTotal = (parseFloat(formatPrice(product)) * quantity).toFixed(2);

  return (
    <View style={styles.wrap}>
      <View style={styles.qtyBox}>
        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement} activeOpacity={0.8}>
          <Ionicons name="remove" size={20} color={premium.text} />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrement} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={premium.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.btnWrap}
        onPress={onAddToCart}
        disabled={loading}
        activeOpacity={0.92}
      >
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
              <Ionicons name="cart-outline" size={22} color="#fff" />
              <Text style={styles.btnLabel}>Add to Cart</Text>
              <Text style={styles.btnPrice}>${lineTotal}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: premium.glassBorder,
    ...premium.shadowCard,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.background,
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: premium.border,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 17,
    fontWeight: '800',
    color: premium.text,
    minWidth: 28,
    textAlign: 'center',
  },
  btnWrap: {
    flex: 1,
    shadowColor: premium.indigo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: premium.radiusMd,
    gap: 10,
  },
  btnLabel: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff' },
  btnPrice: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

