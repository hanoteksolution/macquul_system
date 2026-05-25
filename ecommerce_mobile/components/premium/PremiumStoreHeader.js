import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

/** Home store toolbar — brand + wishlist + cart (no drawer / greetings) */
export default function PremiumStoreHeader({
  cartCount = 0,
  wishlistCount = 0,
  onWishlist,
  onCart,
  onSearchPress,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <View style={styles.logoMark}>
          <Ionicons name="storefront" size={20} color={premium.indigo} />
        </View>
        <Text style={styles.brand}>Macquul</Text>
      </View>

      <View style={styles.actions}>
        {onSearchPress ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress} activeOpacity={0.85}>
            <Ionicons name="search-outline" size={22} color={premium.text} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.iconBtn} onPress={onWishlist} activeOpacity={0.85}>
          <Ionicons name="heart-outline" size={22} color={premium.text} />
          {wishlistCount > 0 && (
            <View style={[styles.badge, styles.wishlistBadge]}>
              <Text style={styles.badgeText}>{wishlistCount > 9 ? '9+' : wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onCart} activeOpacity={0.85}>
          <Ionicons name="bag-outline" size={22} color={premium.text} />
          {cartCount > 0 && (
            <View style={[styles.badge, styles.cartBadge]}>
              <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  brand: {
    fontSize: 20,
    fontWeight: '900',
    color: premium.text,
    letterSpacing: -0.5,
  },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: premium.white,
  },
  wishlistBadge: { backgroundColor: '#f43f5e' },
  cartBadge: { backgroundColor: premium.emerald },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});

