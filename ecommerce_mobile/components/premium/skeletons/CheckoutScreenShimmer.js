import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerRow,
  ShimmerGlassCard,
  ShimmerButton,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

export default function CheckoutScreenShimmer() {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <SkeletonScreen>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <ShimmerCircle size={44} />
          <ShimmerLine width={140} height={20} style={{ marginLeft: 12 }} radius={10} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ShimmerGlassCard style={styles.section} radius={shimmer.radiusLg}>
            <ShimmerRow>
              <ShimmerCircle size={44} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ShimmerLine width="50%" height={14} />
                <ShimmerLine width="85%" height={12} style={{ marginTop: 8 }} />
                <ShimmerLine width="70%" height={12} style={{ marginTop: 6 }} />
              </View>
              <ShimmerBox style={styles.editBtn} radius={12} />
            </ShimmerRow>
          </ShimmerGlassCard>

          <ShimmerGlassCard style={styles.section} radius={shimmer.radiusLg}>
            <ShimmerLine width={120} height={16} />
            <ShimmerBox style={styles.paymentCard} radius={shimmer.radiusMd} />
            <ShimmerLine width="100%" height={48} style={{ marginTop: 12 }} radius={shimmer.radiusMd} />
          </ShimmerGlassCard>

          <ShimmerGlassCard style={styles.section} radius={shimmer.radiusLg}>
            <ShimmerLine width={130} height={16} style={{ marginBottom: 14 }} />
            {[1, 2].map((i) => (
              <ShimmerRow key={i} style={styles.invoiceRow}>
                <ShimmerBox style={styles.invoiceThumb} radius={12} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ShimmerLine width="70%" height={13} />
                  <ShimmerLine width="40%" height={11} style={{ marginTop: 6 }} />
                </View>
                <ShimmerLine width={48} height={14} />
              </ShimmerRow>
            ))}
            {[1, 2, 3].map((i) => (
              <ShimmerRow key={`t${i}`} style={styles.totalRow}>
                <ShimmerLine width={80} height={12} />
                <ShimmerLine width={56} height={12} />
              </ShimmerRow>
            ))}
          </ShimmerGlassCard>
        </ScrollView>

        <View style={styles.footer}>
          <ShimmerRow style={{ marginBottom: 12 }}>
            <ShimmerLine width={90} height={14} />
            <ShimmerLine width={80} height={24} />
          </ShimmerRow>
          <ShimmerButton height={56} />
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 140 },
  section: { marginBottom: 14, padding: 16 },
  editBtn: { width: 40, height: 40 },
  paymentCard: { height: 72, marginTop: 14, width: '100%' },
  invoiceRow: { marginBottom: 14 },
  invoiceThumb: { width: 52, height: 52 },
  totalRow: { justifyContent: 'space-between', marginBottom: 10 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: premium.glass,
    borderTopWidth: 1,
    borderTopColor: premium.glassBorder,
  },
});

