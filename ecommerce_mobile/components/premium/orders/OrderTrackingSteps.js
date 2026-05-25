import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { getStatusMeta } from '../../../utils/orderStatus';

const STEPS = [
  { key: 'placed', label: 'Placed', icon: 'checkmark-circle' },
  { key: 'processing', label: 'Processing', icon: 'sync' },
  { key: 'shipped', label: 'Shipped', icon: 'airplane' },
  { key: 'delivered', label: 'Delivered', icon: 'cube' },
];

export default function OrderTrackingSteps({ status }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const meta = getStatusMeta(status);
  const activeIndex = meta.step >= 3 ? 3 : meta.step;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Order tracking</Text>
      <View style={styles.track}>
        {STEPS.map((step, index) => {
          const active = index <= activeIndex;
          const current = index === activeIndex;
          return (
            <View key={step.key} style={styles.stepWrap}>
              {index > 0 && (
                <View style={[styles.line, active && styles.lineActive]} />
              )}
              {current ? (
                <LinearGradient colors={premium.gradientPrimary} style={styles.iconActive}>
                  <Ionicons name={step.icon} size={18} color="#fff" />
                </LinearGradient>
              ) : (
                <View style={[styles.icon, active && styles.iconDone]}>
                  <Ionicons
                    name={active ? 'checkmark' : step.icon}
                    size={16}
                    color={active ? premium.emerald : premium.textMuted}
                  />
                </View>
              )}
              <Text style={[styles.label, current && styles.labelActive]}>{step.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    backgroundColor: premium.surface,
    borderRadius: premium.radiusLg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  title: { fontSize: 16, fontWeight: '800', color: premium.text, marginBottom: 20 },
  track: { flexDirection: 'row', justifyContent: 'space-between' },
  stepWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  line: {
    position: 'absolute',
    top: 18,
    left: '-50%',
    right: '50%',
    height: 3,
    backgroundColor: premium.border,
    zIndex: 0,
  },
  lineActive: { backgroundColor: premium.emerald },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: premium.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: premium.border,
  },
  iconDone: { borderColor: premium.emerald, backgroundColor: 'rgba(16,185,129,0.1)' },
  iconActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    ...premium.shadowSoft,
  },
  label: { fontSize: 10, fontWeight: '600', color: premium.textMuted, marginTop: 8, textAlign: 'center' },
  labelActive: { color: premium.indigo, fontWeight: '800' },
});

