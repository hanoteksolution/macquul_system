import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerProductGrid,
  ShimmerBottomDock,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

export default function ShopScreenShimmer({ bottomInset = 120 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ShimmerLine width={90} height={28} radius={10} />
            <ShimmerLine width={170} height={14} style={{ marginTop: 8 }} radius={7} />
          </View>
          <ShimmerCircle size={44} style={{ marginRight: 8 }} />
          <ShimmerCircle size={44} />
        </View>

        <ShimmerBox style={styles.search} glass radius={shimmer.radiusMd} />

        <ShimmerLine width={100} height={18} style={{ marginLeft: 20, marginBottom: 12 }} radius={9} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={styles.cat}>
              <ShimmerCircle size={56} />
              <ShimmerLine width={44} height={11} style={{ marginTop: 8 }} radius={5} />
            </View>
          ))}
        </ScrollView>

        <ShimmerProductGrid count={6} />
        <View style={{ height: bottomInset }} />
        <ShimmerBottomDock />
      </SafeAreaView>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  search: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  cats: { paddingHorizontal: 20, gap: 6, marginBottom: 18 },
  cat: { alignItems: 'center', width: 76, marginRight: 2 },
});

