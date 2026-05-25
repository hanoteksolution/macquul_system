import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CartItemCard({
  item,
  selected,
  onToggleSelect,
  onRemove,
  onDecrement,
  onIncrement,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const price = parseFloat(item.sale_price ?? item.price ?? 0);
  const category = item.category?.name || item.category_name || 'Product';

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.checkWrap} onPress={onToggleSelect} activeOpacity={0.8}>
        <View style={[styles.checkbox, selected && styles.checkboxOn]}>
          {selected ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
        </View>
      </TouchableOpacity>

      <View style={styles.thumb}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.thumbImg} resizeMode="cover" />
        ) : (
          <Ionicons name="cube-outline" size={22} color={premium.textMuted} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.titleCol}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.category} numberOfLines={1}>{category}</Text>
          </View>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          <View style={styles.qtyBox}>
            <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement} activeOpacity={0.8}>
              <Ionicons name="remove" size={16} color={premium.text} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={onIncrement} activeOpacity={0.8}>
              <Ionicons name="add" size={16} color={premium.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  checkWrap: { marginRight: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: premium.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: premium.indigo, borderColor: premium.indigo },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: premium.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  thumbImg: { width: '100%', height: '100%' },
  body: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  titleCol: { flex: 1, marginRight: 4 },
  name: { fontSize: 14, fontWeight: '800', color: premium.text },
  category: { fontSize: 11, color: premium.textMuted, marginTop: 1 },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: { fontSize: 16, fontWeight: '800', color: premium.emerald },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.background,
    borderRadius: 999,
    padding: 2,
    borderWidth: 1,
    borderColor: premium.border,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: premium.text,
    minWidth: 24,
    textAlign: 'center',
  },
});

