import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CartAddItemsButton({ onPress }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.iconCircle}>
        <Ionicons name="add" size={22} color={premium.indigo} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>Add more items</Text>
        <Text style={styles.sub}>Browse the shop to add products</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={premium.textMuted} />
    </TouchableOpacity>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: premium.radiusLg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.28)',
    ...premium.shadowSoft,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textCol: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800', color: premium.text },
  sub: { fontSize: 12, color: premium.textSecondary, marginTop: 2 },
});

