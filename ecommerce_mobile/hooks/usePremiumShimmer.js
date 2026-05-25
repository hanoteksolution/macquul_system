import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { shimmer } from '../constants/shimmerTheme';

/** Shared premium shimmer: slow sweep + soft pulse */
export default function usePremiumShimmer({
  duration = shimmer.duration,
  pulseDuration = shimmer.pulseDuration,
} = {}) {
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: pulseDuration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: pulseDuration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    sweepLoop.start();
    pulseLoop.start();
    return () => {
      sweepLoop.stop();
      pulseLoop.stop();
    };
  }, [sweep, pulse, duration, pulseDuration]);

  const baseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.52, 0.78],
  });

  const floatY = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return { sweep, baseOpacity, floatY };
}
