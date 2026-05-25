import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

/** Fade + scale when category/filter selection changes */
export default function AnimatedProductsWrap({ children, animationKey }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0);
    scale.setValue(0.97);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationKey, opacity, scale]);

  return (
    <Animated.View
      style={[styles.wrap, { opacity, transform: [{ scale }] }]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
});
