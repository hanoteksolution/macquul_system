import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerRow,
  ShimmerProductGrid,
  ShimmerBottomDock,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useShimmerTheme from '../../../hooks/useShimmerTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';

export default function HomeScreenShimmer({ bottomInset = 120 }) {
  const premium = usePremiumTheme();
  const shimmer = useShimmerTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomInset + 80 }}
        >
          <View style={styles.header}>
            <ShimmerRow>
              <ShimmerCircle size={42} />
              <View style={styles.headerText}>
                <ShimmerLine width={110} height={18} radius={9} />
                <ShimmerLine width={72} height={11} style={{ marginTop: 6 }} radius={6} />
              </View>
              <View style={{ flex: 1 }} />
              <ShimmerCircle size={44} style={{ marginRight: 8 }} />
              <ShimmerCircle size={44} />
            </ShimmerRow>
          </View>

          <ShimmerBox style={styles.search} glass radius={shimmer.radiusMd} />

          <ShimmerBox style={styles.hero} glass float radius={shimmer.radiusXl} />

          <View style={styles.section}>
            <ShimmerLine width={120} height={22} style={styles.sectionLabel} radius={10} />
            <ShimmerLine width={160} height={12} style={{ marginLeft: 20, marginBottom: 14 }} radius={6} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} style={styles.catItem}>
                  <ShimmerCircle size={56} />
                  <ShimmerLine width={44} height={11} style={{ marginTop: 8 }} radius={5} />
                  <ShimmerLine width={52} height={9} style={{ marginTop: 4 }} radius={4} />
                </View>
              ))}
            </ScrollView>
            <View style={styles.subCirclesRow}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.subCircleItem}>
                  <ShimmerCircle size={48} />
                  <ShimmerLine width={40} height={10} style={{ marginTop: 6 }} radius={5} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionHead}>
            <ShimmerLine width={150} height={20} radius={10} />
            <ShimmerLine width={56} height={12} radius={6} />
          </View>

          <ShimmerProductGrid count={6} />
        </ScrollView>
        <ShimmerBottomDock />
      </SafeAreaView>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerText: { marginLeft: 12, flex: 1 },
  search: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  hero: {
    height: 172,
    marginHorizontal: 20,
    marginBottom: 22,
  },
  section: { marginBottom: 20 },
  sectionLabel: { marginLeft: 20, marginBottom: 12 },
  catRow: { paddingHorizontal: 20, gap: 6, paddingBottom: 4 },
  catItem: { alignItems: 'center', width: 76, marginRight: 2 },
  subCirclesRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 8,
  },
  subCircleItem: { alignItems: 'center', width: 68 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
});

