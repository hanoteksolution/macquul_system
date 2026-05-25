import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_SPECS = [
  { icon: 'resize-outline', label: 'Standard Size' },
  { icon: 'shield-checkmark-outline', label: 'Durable Build' },
  { icon: 'layers-outline', label: 'Premium Quality' },
];

function formatPrice(product) {
  const price = parseFloat(product?.sale_price ?? product?.price ?? 0);
  return Number.isNaN(price) ? '0.00' : price.toFixed(2);
}

export default function ProductInfoSection({ product, wishlisted, onWishlist }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const category =
    product?.category?.parent_name
      ? `${product.category.parent_name}`
      : product?.category?.name || product?.category_name || 'Featured';
  const inStock = product?.in_stock !== false && product?.stock !== 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.name}>{product?.name || 'Product'}</Text>
        <TouchableOpacity style={styles.heartBtn} onPress={onWishlist} activeOpacity={0.85}>
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={wishlisted ? '#f43f5e' : premium.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.specsRow}>
        {DEFAULT_SPECS.map((s) => (
          <View key={s.label} style={styles.spec}>
            <Ionicons name={s.icon} size={16} color={premium.indigo} />
            <Text style={styles.specLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.price}>${formatPrice(product)}</Text>

      <View style={styles.stockRow}>
        <Ionicons name="checkmark-circle" size={18} color={premium.emerald} />
        <Text style={styles.stockText}>
          {inStock ? 'In stock • Ready to ship' : 'Out of stock'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {product?.description ||
          'Premium quality product designed for everyday use. Built with durable materials and a modern finish for long-lasting performance.'}
      </Text>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { paddingHorizontal: 20, marginBottom: 16 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryText: { fontSize: 12, fontWeight: '700', color: premium.emerald },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  name: { flex: 1, fontSize: 26, fontWeight: '800', color: premium.text, letterSpacing: -0.5 },
  heartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  specsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 16 },
  spec: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  specLabel: { fontSize: 12, fontWeight: '600', color: premium.textSecondary },
  price: { fontSize: 32, fontWeight: '800', color: premium.emerald, marginBottom: 8 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  stockText: { fontSize: 14, fontWeight: '600', color: premium.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: premium.text, marginBottom: 8 },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: premium.textSecondary,
    marginBottom: 8,
  },
});

