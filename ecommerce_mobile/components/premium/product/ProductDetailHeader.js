import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailHeader({
  onBack,
  onWishlist,
  onShare,
  wishlisted,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.85}>
        <Ionicons name="chevron-back" size={24} color={premium.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Product Details</Text>

      <View style={styles.right}>
        <TouchableOpacity style={styles.iconBtn} onPress={onWishlist} activeOpacity={0.85}>
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={wishlisted ? '#f43f5e' : premium.indigo}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onShare} activeOpacity={0.85}>
          <Ionicons name="share-social-outline" size={22} color={premium.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: premium.background,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: premium.text,
    letterSpacing: -0.2,
  },
  right: { flexDirection: 'row', gap: 8 },
});

