import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreenHeader({
  onSearchPress,
  onRefresh,
  refreshing,
  searchActive,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <View style={styles.textCol}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>Track and manage all your orders</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconBtn, searchActive && styles.iconBtnActive]}
          onPress={onSearchPress}
          activeOpacity={0.85}
        >
          <Ionicons
            name={searchActive ? 'close' : 'search-outline'}
            size={22}
            color={searchActive ? premium.indigo : premium.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onRefresh}
          activeOpacity={0.85}
          disabled={refreshing}
        >
          <Ionicons name="refresh-outline" size={22} color={premium.indigo} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  textCol: { flex: 1, paddingRight: 12 },
  title: { fontSize: 28, fontWeight: '800', color: premium.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: premium.textSecondary, marginTop: 4, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  iconBtnActive: {
    borderColor: premium.indigo,
    backgroundColor: 'rgba(99,102,241,0.1)',
  },
});

