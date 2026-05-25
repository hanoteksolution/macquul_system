import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShimmerBox,
  ShimmerLine,
  ShimmerCircle,
  ShimmerButton,
  ShimmerRow,
} from '../Shimmer';
import SkeletonScreen from './shared/SkeletonScreen';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { shimmer } from '../../../constants/shimmerTheme';

/** mode: 'login' | 'register' */
export default function AuthScreenShimmer({ mode = 'login' }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const isRegister = mode === 'register';

  return (
    <SkeletonScreen>
      <View style={styles.root}>
        <LinearGradient colors={premium.gradientAuthDark} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <ShimmerCircle size={44} style={styles.back} />

            <ShimmerCircle size={88} style={styles.logo} />

            <ShimmerLine width={160} height={26} style={styles.title} radius={10} />
            <ShimmerLine width={220} height={14} style={styles.subtitle} radius={7} />

            <ShimmerBox style={styles.card} glass radius={shimmer.radiusXl}>
              <ShimmerLine width={100} height={14} style={{ marginBottom: 16 }} radius={7} />
              <ShimmerLine width="100%" height={52} style={styles.field} radius={shimmer.radiusMd} />
              <ShimmerLine width="100%" height={52} style={styles.field} radius={shimmer.radiusMd} />
              {isRegister && (
                <>
                  <ShimmerLine width="100%" height={52} style={styles.field} radius={shimmer.radiusMd} />
                  <ShimmerLine width="100%" height={52} style={styles.field} radius={shimmer.radiusMd} />
                </>
              )}
              <ShimmerRow style={styles.remember}>
                <ShimmerBox style={styles.check} radius={6} />
                <ShimmerLine width={120} height={12} style={{ marginLeft: 10 }} radius={6} />
              </ShimmerRow>
              <ShimmerButton height={54} style={{ marginTop: 8 }} />
            </ShimmerBox>

            <View style={styles.divider}>
              <ShimmerLine width="30%" height={1} />
              <ShimmerLine width={80} height={12} style={{ marginHorizontal: 12 }} radius={6} />
              <ShimmerLine width="30%" height={1} />
            </View>

            <View style={styles.social}>
              {[1, 2, 3].map((i) => (
                <ShimmerCircle key={i} size={52} style={{ marginHorizontal: 8 }} />
              ))}
            </View>

            <ShimmerLine width={200} height={14} style={styles.footerLink} radius={7} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </SkeletonScreen>
  );
}

const createStyles = (premium) => ({

  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  back: { alignSelf: 'flex-start', marginBottom: 12, opacity: 0.7 },
  logo: { marginTop: 8, marginBottom: 20, opacity: 0.85 },
  title: { marginBottom: 8, opacity: 0.9 },
  subtitle: { marginBottom: 28, opacity: 0.75 },
  card: {
    width: '100%',
    padding: 22,
    marginBottom: 24,
  },
  field: { marginBottom: 14 },
  remember: { marginTop: 4, marginBottom: 4 },
  check: { width: 22, height: 22 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 22,
    opacity: 0.6,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  footerLink: { opacity: 0.7 },
});

