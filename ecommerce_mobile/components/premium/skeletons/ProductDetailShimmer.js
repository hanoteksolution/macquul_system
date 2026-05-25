import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerRow,
  ShimmerButton,
  ShimmerGlassCard,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

export default function ProductDetailShimmer() {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <ShimmerCircle size={44} />
          <View style={{ flex: 1 }} />
          <ShimmerCircle size={44} style={{ marginRight: 8 }} />
          <ShimmerCircle size={44} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <ShimmerBox style={styles.heroImage} glass float radius={shimmer.radiusXl} />

          <View style={styles.thumbs}>
            {[1, 2, 3, 4].map((i) => (
              <ShimmerBox key={i} style={styles.thumb} radius={14} />
            ))}
          </View>

          <View style={styles.info}>
            <ShimmerLine width="85%" height={22} radius={11} />
            <ShimmerRow style={{ marginTop: 12 }}>
              <ShimmerLine width={90} height={28} radius={10} />
              <View style={{ flex: 1 }} />
              <ShimmerCircle size={36} />
            </ShimmerRow>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <ShimmerBox key={i} style={styles.star} radius={4} />
              ))}
              <ShimmerLine width={80} height={12} style={{ marginLeft: 10 }} radius={6} />
            </View>
            <ShimmerLine width="100%" height={12} style={{ marginTop: 16 }} />
            <ShimmerLine width="92%" height={12} style={{ marginTop: 8 }} />
            <ShimmerLine width="70%" height={12} style={{ marginTop: 8 }} />
          </View>

          <View style={styles.features}>
            {[1, 2, 3].map((i) => (
              <ShimmerGlassCard key={i} style={styles.featureCard} radius={shimmer.radiusMd}>
                <ShimmerCircle size={36} />
                <ShimmerLine width="60%" height={12} style={{ marginTop: 10 }} />
              </ShimmerGlassCard>
            ))}
          </View>
        </ScrollView>

        <View style={styles.purchaseBar}>
          <ShimmerRow>
            <ShimmerBox style={styles.qtyBtn} radius={14} />
            <ShimmerLine width={40} height={20} style={{ marginHorizontal: 16 }} />
            <ShimmerBox style={styles.qtyBtn} radius={14} />
          </ShimmerRow>
          <ShimmerButton height={54} style={{ marginTop: 12, flex: 1 }} />
        </View>
      </SafeAreaView>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scroll: { paddingBottom: 120 },
  heroImage: {
    height: 320,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  thumbs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  thumb: { width: 64, height: 64 },
  info: { paddingHorizontal: 20, marginBottom: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  star: { width: 16, height: 16, marginRight: 4 },
  features: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 0,
  },
  purchaseBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: premium.glass,
    borderTopWidth: 1,
    borderTopColor: premium.glassBorder,
  },
  qtyBtn: { width: 44, height: 44 },
});

