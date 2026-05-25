import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - 52) / 2;

function formatPrice(value) {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return '$0.00';
  return `$${n.toFixed(2)}`;
}

export default function PremiumProductCard({ product, onPress, onAddToCart, onToggleWishlist, isWishlisted }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const scale = useRef(new Animated.Value(1)).current;
  const imageUrl = product?.image_url || product?.image;
  const price = product?.sale_price ?? product?.price;
  const original = product?.price && product?.sale_price && product.price > product.sale_price ? product.price : null;
  const discount =
    original && price
      ? Math.round(((parseFloat(original) - parseFloat(price)) / parseFloat(original)) * 100)
      : null;
  const rating = product?.average_rating ?? product?.rating ?? 4.5;
  const reviews = product?.review_count ?? product?.reviews_count ?? 0;

  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.card}
      >
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}

        <TouchableOpacity style={styles.heartBtn} onPress={onToggleWishlist} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={18} color={isWishlisted ? '#f43f5e' : premium.textMuted} />
        </TouchableOpacity>

        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={48} color={premium.textMuted} />
          )}
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {product?.name || 'Product'}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {product?.category_name || product?.category?.name || 'Featured'}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text style={styles.rating}>
            {Number(rating).toFixed(1)} ({reviews})
          </Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{formatPrice(price)}</Text>
            {original && <Text style={styles.original}>{formatPrice(original)}</Text>}
          </View>
          <TouchableOpacity onPress={onAddToCart} activeOpacity={0.9}>
            <LinearGradient colors={premium.gradientEmerald} style={styles.cartBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="cart-outline" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (premium) => ({

  wrap: { width: CARD_WIDTH, marginBottom: 16 },
  card: {
    backgroundColor: premium.white,
    borderRadius: premium.radiusLg,
    padding: 14,
    ...premium.shadowCard,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    backgroundColor: premium.emerald,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.glassBorder,
  },
  imageBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  image: { width: '100%', height: '100%' },
  name: { fontSize: 14, fontWeight: '800', color: premium.text, lineHeight: 18 },
  category: { fontSize: 12, color: premium.textMuted, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  rating: { fontSize: 11, color: premium.textSecondary, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 },
  price: { fontSize: 16, fontWeight: '800', color: premium.emerald },
  original: { fontSize: 12, color: premium.textMuted, textDecorationLine: 'line-through', marginTop: 2 },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
});

