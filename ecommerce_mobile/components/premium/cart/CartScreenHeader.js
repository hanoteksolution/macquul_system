import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreenHeader({ itemCount, onBack, onClearCart, showClear }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const subtitle = itemCount === 1 ? '1 Item' : `${itemCount} Items`;

  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.85}>
        <Ionicons name="chevron-back" size={24} color={premium.text} />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {showClear ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onClearCart} activeOpacity={0.85}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  spacer: { width: 44 },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '800', color: premium.text, letterSpacing: -0.2 },
  subtitle: { fontSize: 13, color: premium.textSecondary, marginTop: 2, fontWeight: '500' },
});

