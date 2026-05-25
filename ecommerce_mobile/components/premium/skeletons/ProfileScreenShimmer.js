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

export default function ProfileScreenShimmer({ bottomInset = 52 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: bottomInset + 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <ShimmerLine width={100} height={28} radius={12} />
            <ShimmerLine width={200} height={14} style={{ marginTop: 8 }} radius={7} />
          </View>

          <ShimmerBox style={styles.gradientCard} glass float radius={shimmer.radiusXl}>
            <ShimmerRow>
              <ShimmerCircle size={72} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <ShimmerLine width="75%" height={20} radius={10} />
                <ShimmerLine width="55%" height={13} style={{ marginTop: 8 }} radius={7} />
                <ShimmerLine width="40%" height={11} style={{ marginTop: 6 }} radius={6} />
              </View>
            </ShimmerRow>
          </ShimmerBox>

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ShimmerGlassCard key={i} style={styles.menuRow} radius={shimmer.radiusMd}>
              <ShimmerRow>
                <ShimmerCircle size={42} />
                <ShimmerLine width="58%" height={14} style={{ marginLeft: 14, flex: 1 }} radius={7} />
                {i === 5 ? (
                  <ShimmerBox style={styles.toggle} radius={999} />
                ) : (
                  <ShimmerCircle size={18} />
                )}
              </ShimmerRow>
            </ShimmerGlassCard>
          ))}

          <ShimmerGlassCard style={styles.logout} radius={shimmer.radiusMd}>
            <ShimmerRow>
              <ShimmerCircle size={42} />
              <ShimmerLine width={80} height={14} style={{ marginLeft: 14 }} radius={7} />
            </ShimmerRow>
          </ShimmerGlassCard>
        </ScrollView>
        <ShimmerBottomDock />
      </SafeAreaView>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  titleBlock: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  gradientCard: {
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 22,
    minHeight: 120,
  },
  menuRow: {
    marginHorizontal: 20,
    padding: 14,
    marginBottom: 10,
  },
  toggle: { width: 48, height: 28 },
  logout: {
    marginHorizontal: 20,
    padding: 14,
    marginTop: 6,
    marginBottom: 24,
  },
});

