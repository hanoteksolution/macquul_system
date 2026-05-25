import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreenHeader({ onBack }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.85}>
        <Ionicons name="chevron-back" size={24} color={premium.text} />
      </TouchableOpacity>
      <Text style={styles.title}>Checkout</Text>
      <View style={styles.spacer} />
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: premium.text,
    letterSpacing: -0.2,
  },
});

