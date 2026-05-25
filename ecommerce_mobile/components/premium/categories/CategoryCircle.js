import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import {
  CIRCLE_LG,
  CIRCLE_SM,
  CATEGORY_ITEM_WIDTH,
  SUB_CATEGORY_ITEM_WIDTH,
} from './categoryUtils';

export default function CategoryCircle({
  label,
  subtitle,
  icon,
  active,
  onPress,
  accent,
  size = 'lg',
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const dim = size === 'lg' ? CIRCLE_LG : CIRCLE_SM;
  const iconSize = size === 'lg' ? 22 : 20;
  const itemWidth = size === 'lg' ? CATEGORY_ITEM_WIDTH : SUB_CATEGORY_ITEM_WIDTH;
  const showSubtitle = size === 'lg' && subtitle;

  const scale = useRef(new Animated.Value(active ? 1.06 : 1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const iconY = useRef(new Animated.Value(0)).current;
  const indicator = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1.06 : 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
    Animated.timing(indicator, {
      toValue: active ? 1 : 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [active, scale, indicator]);

  useEffect(() => {
    if (!active) {
      glow.stopAnimation();
      glow.setValue(0);
      return undefined;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [active, glow]);

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  const indicatorWidth = indicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  const rippleScale = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.4],
  });
  const rippleOpacity = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  const runRipple = () => {
    ripple.setValue(0);
    Animated.timing(ripple, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    runRipple();
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.9, friction: 5, useNativeDriver: true }),
      Animated.spring(iconY, { toValue: -3, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: active ? 1.06 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(iconY, { toValue: 0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const grad = accent?.gradient || premium.gradientPrimary;
  const tint = accent?.color || premium.indigo;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.wrap, { width: itemWidth }]}
    >
      <Animated.View style={[styles.col, { transform: [{ scale }] }]}>
        <Animated.View
          style={[
            styles.ripple,
            {
              width: dim + 20,
              height: dim + 20,
              borderRadius: (dim + 20) / 2,
              backgroundColor: accent?.glow || 'rgba(99,102,241,0.2)',
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
          pointerEvents="none"
        />

        {active ? (
          <>
            <Animated.View
              style={[
                styles.glowHalo,
                {
                  width: dim + 16,
                  height: dim + 16,
                  borderRadius: (dim + 16) / 2,
                  borderColor: accent?.glow,
                  opacity: glowOpacity,
                },
              ]}
            />
            <LinearGradient
              colors={grad}
              style={[styles.circle, { width: dim, height: dim, borderRadius: dim / 2 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View style={{ transform: [{ translateY: iconY }] }}>
                <Ionicons name={icon} size={iconSize} color="#fff" />
              </Animated.View>
            </LinearGradient>
          </>
        ) : Platform.OS === 'ios' ? (
          <BlurView
            intensity={62}
            tint={premium.blurTint}
            style={[
              styles.circle,
              styles.glass,
              {
                width: dim,
                height: dim,
                borderRadius: dim / 2,
                borderColor: accent?.border || premium.border,
              },
            ]}
          >
            <Animated.View style={{ transform: [{ translateY: iconY }] }}>
              <Ionicons name={icon} size={iconSize} color={tint} />
            </Animated.View>
          </BlurView>
        ) : (
          <View
            style={[
              styles.circle,
              styles.glass,
              styles.glassAndroid,
              {
                width: dim,
                height: dim,
                borderRadius: dim / 2,
                borderColor: accent?.border || premium.border,
              },
            ]}
          >
            <Animated.View style={{ transform: [{ translateY: iconY }] }}>
              <Ionicons name={icon} size={iconSize} color={tint} />
            </Animated.View>
          </View>
        )}

        <Text
          style={[
            styles.label,
            size === 'sm' && styles.labelSm,
            active && { color: tint },
          ]}
          numberOfLines={size === 'sm' ? 2 : 1}
        >
          {label}
        </Text>
        {showSubtitle ? (
          <Text style={[styles.subtitle, active && { color: tint, opacity: 0.75 }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}

        <Animated.View
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              backgroundColor: active ? tint : 'transparent',
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (premium) => ({

  wrap: {
    alignItems: 'center',
  },
  col: { alignItems: 'center', paddingTop: 2 },
  ripple: {
    position: 'absolute',
    top: -2,
    alignSelf: 'center',
  },
  glowHalo: {
    position: 'absolute',
    top: -4,
    alignSelf: 'center',
    borderWidth: 2,
    ...premium.shadowFloat,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  glass: {
    overflow: 'hidden',
    ...premium.shadowSoft,
  },
  glassAndroid: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: premium.text,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  labelSm: {
    fontSize: 10,
    marginTop: 6,
    lineHeight: 13,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '500',
    color: premium.textMuted,
    textAlign: 'center',
  },
  indicator: {
    height: 2,
    borderRadius: 2,
    marginTop: 4,
  },
});

