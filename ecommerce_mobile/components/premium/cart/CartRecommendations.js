import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CartRecommendations({ products, onAdd, onPressProduct }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  if (!products?.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>You may also like</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {products.map((p) => {
          const price = parseFloat(p.sale_price ?? p.price ?? 0).toFixed(2);
          return (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              onPress={() => onPressProduct?.(p)}
              activeOpacity={0.9}
            >
              <View style={styles.imgWrap}>
                {p.image_url ? (
                  <Image source={{ uri: p.image_url }} style={styles.img} resizeMode="cover" />
                ) : (
                  <Ionicons name="cube-outline" size={24} color={premium.textMuted} />
                )}
              </View>
              <Text style={styles.name} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.price}>${price}</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => onAdd?.(p)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={premium.gradientPrimary} style={styles.addGrad}>
                  <Ionicons name="add" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: '800', color: premium.text, marginBottom: 12 },
  scroll: { gap: 12, paddingRight: 20 },
  card: {
    width: 120,
    backgroundColor: premium.white,
    borderRadius: premium.radiusMd,
    padding: 10,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  imgWrap: {
    width: '100%',
    height: 72,
    borderRadius: 12,
    backgroundColor: premium.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  img: { width: '100%', height: '100%' },
  name: { fontSize: 12, fontWeight: '700', color: premium.text, minHeight: 32 },
  price: { fontSize: 13, fontWeight: '800', color: premium.emerald, marginTop: 4 },
  addBtn: { position: 'absolute', top: 8, right: 8 },
  addGrad: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

