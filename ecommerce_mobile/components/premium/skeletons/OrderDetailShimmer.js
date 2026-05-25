import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerRow,
  ShimmerGlassCard,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

export default function OrderDetailShimmer() {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <ShimmerCircle size={44} />
          <ShimmerLine width={130} height={18} style={{ flex: 1, marginHorizontal: 12 }} radius={9} />
          <ShimmerCircle size={44} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ShimmerBox style={styles.summaryHero} glass float radius={shimmer.radiusXl} />

          <ShimmerGlassCard style={styles.tracking} radius={shimmer.radiusLg}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.step}>
                <ShimmerCircle size={28} />
                <ShimmerLine width={52} height={10} style={{ marginTop: 6 }} radius={5} />
              </View>
            ))}
          </ShimmerGlassCard>

          <ShimmerGlassCard style={styles.address} radius={shimmer.radiusLg}>
            <ShimmerRow>
              <ShimmerBox style={styles.addrIcon} radius={14} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ShimmerLine width={100} height={11} />
                <ShimmerLine width="75%" height={14} style={{ marginTop: 8 }} />
                <ShimmerLine width="90%" height={12} style={{ marginTop: 6 }} />
              </View>
            </ShimmerRow>
          </ShimmerGlassCard>

          <ShimmerLine width={110} height={18} style={styles.sectionTitle} radius={9} />

          {[1, 2].map((i) => (
            <ShimmerGlassCard key={i} style={styles.lineItem} radius={shimmer.radiusMd}>
              <ShimmerRow>
                <ShimmerBox style={styles.itemThumb} radius={12} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ShimmerLine width="80%" height={14} />
                  <ShimmerLine width="35%" height={11} style={{ marginTop: 6 }} />
                </View>
                <ShimmerLine width={48} height={14} />
              </ShimmerRow>
            </ShimmerGlassCard>
          ))}

          <ShimmerGlassCard style={styles.invoice} radius={shimmer.radiusLg}>
            <ShimmerLine width={140} height={16} style={{ marginBottom: 14 }} radius={8} />
            {[1, 2, 3, 4].map((i) => (
              <ShimmerRow key={i} style={styles.invoiceRow}>
                <ShimmerLine width={80} height={12} />
                <ShimmerLine width={56} height={12} />
              </ShimmerRow>
            ))}
          </ShimmerGlassCard>

          <ShimmerGlassCard style={styles.support} radius={shimmer.radiusLg}>
            <ShimmerRow>
              <ShimmerCircle size={48} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <ShimmerLine width={100} height={15} />
                <ShimmerLine width={160} height={12} style={{ marginTop: 6 }} />
              </View>
              <ShimmerCircle size={22} />
            </ShimmerRow>
          </ShimmerGlassCard>
        </ScrollView>
      </SafeAreaView>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  summaryHero: { height: 128, marginBottom: 16 },
  tracking: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    marginBottom: 14,
  },
  step: { alignItems: 'center', flex: 1 },
  address: { padding: 16, marginBottom: 18 },
  addrIcon: { width: 48, height: 48 },
  sectionTitle: { marginBottom: 12 },
  lineItem: { padding: 14, marginBottom: 10 },
  itemThumb: { width: 56, height: 56 },
  invoice: { padding: 18, marginTop: 8, marginBottom: 14 },
  invoiceRow: { justifyContent: 'space-between', marginBottom: 10 },
  support: { padding: 16 },
});

