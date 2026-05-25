import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function PremiumGradientButton({
  label,
  onPress,
  loading,
  disabled,
  colors,
  showArrow = true,
  variant = 'emerald',
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);

  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  const gradientColors =
    variant === 'primary' ? premium.gradientPrimary : (colors ?? premium.gradientSignIn);

  return (
    <Animated.View style={[styles.glowWrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={loading || disabled}
        style={disabled && styles.disabled}
      >
        <LinearGradient colors={gradientColors} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.label}>{label}</Text>
              {showArrow && (
                <View style={styles.arrowCircle}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={variant === 'primary' ? premium.indigo : premium.emerald}
                  />
                </View>
              )}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (premium) => ({

  glowWrap: {
    marginTop: 8,
    shadowColor: premium.emerald,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: premium.radiusMd,
    minHeight: 56,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.6 },
});

