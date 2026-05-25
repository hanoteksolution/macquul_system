import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Legacy opacity pulse — prefer ShimmerProvider + premium Shimmer components */
export default function useShimmer(duration = 900) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, duration]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.82],
  });

  return { opacity, anim };
}
