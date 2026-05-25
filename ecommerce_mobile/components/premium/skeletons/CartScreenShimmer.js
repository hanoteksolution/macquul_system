import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerRow,
  ShimmerGlassCard,
  ShimmerButton,
  ShimmerBottomDock,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

function CartItemShimmer({ styles }) {
  return (
    <ShimmerGlassCard style={styles.item} radius={shimmer.radiusLg}>
      <ShimmerRow>
        <ShimmerBox style={styles.checkbox} radius={8} />
        <ShimmerBox style={styles.thumb} radius={shimmer.radiusMd} />
        <View style={styles.itemBody}>
          <ShimmerLine width="78%" height={14} radius={7} />
          <ShimmerLine width="45%" height={11} style={{ marginTop: 6 }} radius={6} />
          <ShimmerRow style={{ marginTop: 10 }}>
            <ShimmerBox style={styles.qtyChip} radius={10} />
            <ShimmerLine width={48} height={16} style={{ marginLeft: 12 }} radius={8} />
          </ShimmerRow>
        </View>
      </ShimmerRow>
    </ShimmerGlassCard>
  );
}

export default function CartScreenShimmer() {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <ShimmerLine width={130} height={22} radius={10} />
          <ShimmerCircle size={44} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {[1, 2, 3].map((i) => (
            <CartItemShimmer key={i} styles={styles} />
          ))}
          <ShimmerLine width={140} height={14} style={{ marginTop: 8, marginBottom: 12 }} radius={7} />
          <ShimmerRow style={styles.recoRow}>
            {[1, 2].map((i) => (
              <ShimmerBox key={i} style={styles.recoCard} glass radius={shimmer.radiusMd} />
            ))}
          </ShimmerRow>
        </ScrollView>

        <ShimmerGlassCard style={styles.summary} radius={shimmer.radiusLg}>
          <ShimmerRow>
            <ShimmerLine width={80} height={14} />
            <ShimmerLine width={72} height={18} />
          </ShimmerRow>
          <ShimmerRow style={{ marginTop: 10 }}>
            <ShimmerLine width={100} height={12} />
            <ShimmerLine width={56} height={12} />
          </ShimmerRow>
          <ShimmerButton height={52} style={{ marginTop: 14 }} />
        </ShimmerGlassCard>
      </View>
      <ShimmerBottomDock />
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 160 },
  item: { marginBottom: 12 },
  checkbox: { width: 22, height: 22, marginRight: 10 },
  thumb: { width: 72, height: 72, marginRight: 12 },
  itemBody: { flex: 1 },
  qtyChip: { width: 96, height: 32 },
  recoRow: { gap: 12, marginBottom: 20 },
  recoCard: { flex: 1, height: 120 },
  summary: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 88,
    padding: 16,
  },
});

