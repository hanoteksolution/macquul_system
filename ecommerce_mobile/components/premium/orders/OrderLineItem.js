import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { resolveMediaUrl } from '../../../utils/mediaUrl';
import { Ionicons } from '@expo/vector-icons';

export default function OrderLineItem({ item }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);
  const [imageFailed, setImageFailed] = useState(false);

  const price = parseFloat(item.price || 0);
  const qty = parseInt(item.quantity || 1, 10);
  const lineTotal = price * qty;
  const imageUrl = resolveMediaUrl(
    item.image_url || item.product_image || item.product?.image_url
  );
  const showImage = imageUrl && !imageFailed;

  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        {showImage ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.img}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Ionicons name="cube-outline" size={28} color={premium.textMuted} />
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product_name || item.name || 'Product'}
        </Text>
        <Text style={styles.unit}>
          ${price.toFixed(2)} × {qty}
        </Text>
      </View>
      <Text style={styles.total}>${lineTotal.toFixed(2)}</Text>
    </View>
  );
}

const createStyles = (premium) => ({

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.surface,
    borderRadius: premium.radiusMd,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: premium.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  img: { width: '100%', height: '100%' },
  body: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: premium.text, marginBottom: 4 },
  unit: { fontSize: 13, color: premium.emerald, fontWeight: '600' },
  total: { fontSize: 16, fontWeight: '800', color: premium.text },
});

