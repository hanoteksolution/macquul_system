import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ShimmerProvider, useShimmerContext } from './ShimmerContext';

export { ShimmerProvider };

function useShimmerStyles() {
  const { shimmer, premium } = useShimmerContext();
  return useMemo(
    () =>
      StyleSheet.create({
        surface: {
          overflow: 'hidden',
          backgroundColor: shimmer.base,
          borderWidth: 1,
          borderColor: shimmer.glassBorder,
        },
        glass: {
          backgroundColor: shimmer.glass,
          borderColor: shimmer.glassBorder,
          ...shimmer.cardShadow,
        },
        float: { ...shimmer.floatShadow },
        baseFill: { backgroundColor: shimmer.baseAlt },
        shineWrap: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          marginLeft: -60,
        },
        shineBand: { height: '100%', opacity: 0.95 },
        glassCard: { padding: 14, marginBottom: 14 },
        row: { flexDirection: 'row', alignItems: 'center' },
        productCard: { padding: 14 },
        productImage: { height: 118, width: '100%', marginBottom: 12 },
        productBody: { gap: 0 },
        productFooter: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        },
        productGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        },
        gridHalf: { width: '48%', marginBottom: 14 },
        gridFull: { width: '100%', marginBottom: 14 },
        dockOuter: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 0,
          alignItems: 'center',
        },
        dockShadow: { width: '100%', borderRadius: 28, ...premium.shadowFloat },
        dockBlur: {
          borderRadius: 28,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: premium.glassBorder,
        },
        dockAndroid: { backgroundColor: shimmer.glass },
        dockInner: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 14,
          paddingHorizontal: 12,
        },
        dockFab: { width: 56, height: 56, marginTop: -28 },
      }),
    [shimmer, premium]
  );
}

function ShimmerSurface({
  style,
  children,
  radius,
  glass = false,
  float = false,
  noShine = false,
}) {
  const { sweep, baseOpacity, floatY, shimmer } = useShimmerContext();
  const styles = useShimmerStyles();
  const [layoutW, setLayoutW] = useState(0);
  const flat = StyleSheet.flatten(style) || {};
  const r = radius ?? flat.borderRadius ?? shimmer.radiusMd;

  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-layoutW * 1.2, layoutW * 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.surface,
        glass && styles.glass,
        float && styles.float,
        { borderRadius: r, transform: float ? [{ translateY: floatY }] : undefined },
        style,
      ]}
      onLayout={(e) => setLayoutW(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.baseFill,
          { opacity: baseOpacity, borderRadius: r },
        ]}
      />
      {!noShine && layoutW > 0 ? (
        <Animated.View
          style={[styles.shineWrap, { transform: [{ translateX }] }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={shimmer.sweep}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.shineBand, { width: Math.max(layoutW * 0.65, 80) }]}
          />
        </Animated.View>
      ) : null}
      {children}
    </Animated.View>
  );
}

export function ShimmerBox({ style, children, glass, float, radius, noShine }) {
  return (
    <ShimmerSurface style={style} glass={glass} float={float} noShine={noShine} radius={radius}>
      {children}
    </ShimmerSurface>
  );
}

export function ShimmerLine({ width = '100%', height = 12, style, radius = 8 }) {
  return <ShimmerBox style={[{ width, height, borderRadius: radius }, style]} />;
}

export function ShimmerCircle({ size = 48, style }) {
  return (
    <ShimmerBox
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      radius={size / 2}
    />
  );
}

export function ShimmerButton({ width = '100%', height = 52, style }) {
  const { shimmer } = useShimmerContext();
  return (
    <ShimmerBox
      style={[{ width, height, borderRadius: shimmer.radiusMd }, style]}
      float
      radius={shimmer.radiusMd}
    />
  );
}

export function ShimmerGlassCard({ style, children, radius }) {
  const { shimmer } = useShimmerContext();
  return (
    <ShimmerBox style={style} glass radius={radius ?? shimmer.radiusLg}>
      {children}
    </ShimmerBox>
  );
}

export function ShimmerRow({ style, children }) {
  const styles = useShimmerStyles();
  return <View style={[styles.row, style]}>{children}</View>;
}

export function ShimmerProductCard({ style }) {
  const { shimmer } = useShimmerContext();
  const styles = useShimmerStyles();
  return (
    <ShimmerGlassCard style={[styles.productCard, style]} radius={shimmer.radiusLg}>
      <ShimmerBox style={styles.productImage} radius={shimmer.radiusMd} noShine />
      <View style={styles.productBody}>
        <ShimmerLine width="88%" height={14} radius={7} />
        <ShimmerLine width="55%" height={11} style={{ marginTop: 8 }} radius={6} />
        <View style={styles.productFooter}>
          <ShimmerLine width={64} height={18} radius={8} />
          <ShimmerCircle size={40} />
        </View>
      </View>
    </ShimmerGlassCard>
  );
}

export function ShimmerProductGrid({ count = 6, columns = 2, style }) {
  const styles = useShimmerStyles();
  return (
    <View style={[styles.productGrid, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={columns === 2 ? styles.gridHalf : styles.gridFull}>
          <ShimmerProductCard />
        </View>
      ))}
    </View>
  );
}

export function ShimmerBottomDock({ style }) {
  const { premium } = useShimmerContext();
  const styles = useShimmerStyles();
  return (
    <View style={[styles.dockOuter, style]}>
      <View style={styles.dockShadow}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={72} tint={premium.blurTint} style={styles.dockBlur}>
            <DockIcons />
          </BlurView>
        ) : (
          <View style={[styles.dockBlur, styles.dockAndroid]}>
            <DockIcons />
          </View>
        )}
      </View>
    </View>
  );
}

function DockIcons() {
  const styles = useShimmerStyles();
  return (
    <View style={styles.dockInner}>
      <ShimmerCircle size={26} />
      <ShimmerCircle size={26} />
      <ShimmerBox style={styles.dockFab} radius={28} float />
      <ShimmerCircle size={26} />
      <ShimmerCircle size={26} />
    </View>
  );
}

export function useShimmerCompat() {
  return useShimmerContext();
}
