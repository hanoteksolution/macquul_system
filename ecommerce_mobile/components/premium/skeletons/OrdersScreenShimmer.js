import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerRow,
  ShimmerGlassCard,
  ShimmerBottomDock,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

function OrderCardShimmer({ styles }) {
  return (
    <ShimmerGlassCard style={styles.orderCard} radius={shimmer.radiusXl}>
      <ShimmerRow style={styles.orderTop}>
        <ShimmerBox style={styles.orderIcon} radius={14} float />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ShimmerRow>
            <ShimmerLine width="48%" height={16} radius={8} />
            <ShimmerBox style={styles.badge} radius={999} />
          </ShimmerRow>
          <ShimmerLine width="42%" height={12} style={{ marginTop: 8 }} radius={6} />
          <ShimmerLine width="35%" height={12} style={{ marginTop: 6 }} radius={6} />
        </View>
        <View style={styles.priceCol}>
          <ShimmerLine width={36} height={10} radius={5} />
          <ShimmerLine width={56} height={18} style={{ marginTop: 4 }} radius={8} />
        </View>
      </ShimmerRow>
      <ShimmerBox style={styles.track} radius={4} />
      <ShimmerRow style={{ marginTop: 14 }}>
        <ShimmerLine width="45%" height={12} radius={6} />
        <ShimmerCircle size={36} />
      </ShimmerRow>
    </ShimmerGlassCard>
  );
}

export default function OrdersScreenShimmer({ bottomInset = 52 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ShimmerLine width={140} height={28} radius={12} />
            <ShimmerLine width={210} height={14} style={{ marginTop: 8 }} radius={7} />
          </View>
          <ShimmerCircle size={44} style={{ marginRight: 8 }} />
          <ShimmerCircle size={44} />
        </View>

        <View style={styles.filters}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.filterItem}>
              <ShimmerCircle size={42} />
              <ShimmerLine width={40} height={10} style={{ marginTop: 6 }} radius={5} />
            </View>
          ))}
        </View>

        <ShimmerLine width={100} height={14} style={styles.listTitle} radius={7} />

        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: bottomInset + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {[1, 2, 3].map((i) => (
            <OrderCardShimmer key={i} styles={styles} />
          ))}
        </ScrollView>
        <ShimmerBottomDock />
      </SafeAreaView>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  filterItem: { flex: 1, alignItems: 'center' },
  listTitle: { marginLeft: 20, marginBottom: 10 },
  list: { paddingHorizontal: 20 },
  orderCard: { padding: 16, marginBottom: 14 },
  orderTop: { alignItems: 'flex-start' },
  orderIcon: { width: 50, height: 50 },
  badge: { width: 64, height: 22, marginLeft: 8 },
  priceCol: { alignItems: 'flex-end' },
  track: { height: 6, width: '100%', marginTop: 16 },
});

