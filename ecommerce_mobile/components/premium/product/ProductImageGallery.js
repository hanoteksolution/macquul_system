import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ProductImageGallery({ product }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const mainUrl = product?.image_url || product?.image;
  const rating = product?.average_rating ?? product?.rating ?? 4.8;
  const reviews = product?.review_count ?? product?.reviews_count ?? product?.reviews ?? 128;

  const slides = useMemo(() => {
    const extra = product?.images?.length ? product.images : [];
    const list = mainUrl ? [mainUrl, ...extra.filter((u) => u !== mainUrl)] : [];
    while (list.length < 4 && mainUrl) list.push(mainUrl);
    return list.slice(0, 5);
  }, [mainUrl, product?.images]);

  const [active, setActive] = useState(0);
  const displaySlides = slides.length ? slides : [null];

  return (
    <View style={styles.wrap}>
      <View style={styles.thumbs}>
        {displaySlides.slice(0, 4).map((uri, i) => {
          const isActive = i === active;
          const showMore = i === 3 && displaySlides.length > 4;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => !showMore && setActive(i)}
              style={[styles.thumb, isActive && styles.thumbActive]}
              activeOpacity={0.9}
            >
              {showMore ? (
                <Text style={styles.moreText}>+{displaySlides.length - 3}</Text>
              ) : uri ? (
                <Image source={{ uri }} style={styles.thumbImg} resizeMode="cover" />
              ) : (
                <Ionicons name="cube-outline" size={20} color={premium.textMuted} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.mainCard}>
        {displaySlides[active] ? (
          <Image source={{ uri: displaySlides[active] }} style={styles.mainImg} resizeMode="contain" />
        ) : (
          <Ionicons name="cube-outline" size={80} color={premium.textMuted} />
        )}

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={styles.ratingText}>
            {Number(rating).toFixed(1)} ({reviews})
          </Text>
        </View>

        <View style={styles.dots}>
          {displaySlides.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setActive(i)}>
              <View style={[styles.dot, i === active && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  thumbs: { gap: 8 },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: premium.white,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
  thumbActive: { borderColor: premium.indigo },
  thumbImg: { width: '100%', height: '100%' },
  moreText: { fontSize: 12, fontWeight: '700', color: premium.indigo },
  mainCard: {
    flex: 1,
    height: 280,
    backgroundColor: premium.white,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowCard,
  },
  mainImg: { width: '85%', height: '75%' },
  ratingBadge: {
    position: 'absolute',
    bottom: 36,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: premium.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    ...premium.shadowSoft,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: premium.text },
  dots: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: premium.border,
  },
  dotActive: { width: 20, backgroundColor: premium.indigo },
});

