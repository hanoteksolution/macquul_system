import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethodSection({ evcPhone, onEvcPhoneChange }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <LinearGradient colors={['rgba(139,92,246,0.2)', 'rgba(99,102,241,0.1)']} style={styles.iconGrad}>
          <Ionicons name="phone-portrait-outline" size={18} color={premium.violet} />
        </LinearGradient>
        <Text style={styles.sectionTitle}>Payment Method</Text>
      </View>

      <View style={styles.option}>
        <View style={styles.radioActive}>
          <View style={styles.radioDot} />
        </View>
        <View style={styles.methodIcon}>
          <Text style={styles.evcLogo}>EVC</Text>
        </View>
        <View style={styles.methodBody}>
          <Text style={styles.methodLabel}>EVC Plus</Text>
          <Text style={styles.methodSub}>Pay with your EVC mobile wallet</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Default</Text>
        </View>
      </View>

      <View style={styles.phoneCard}>
        <Text style={styles.phoneLabel}>EVC payment number *</Text>
        <Text style={styles.phoneHint}>Enter the mobile number linked to your EVC wallet</Text>
        <View style={styles.phoneRow}>
          <Ionicons name="call-outline" size={20} color={premium.indigo} />
          <TextInput
            style={styles.phoneInput}
            value={evcPhone}
            onChangeText={onEvcPhoneChange}
            placeholder="e.g. 61XXXXXXX or 25261XXXXXXX"
            placeholderTextColor={premium.textMuted}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  section: { marginBottom: 20 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  iconGrad: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: premium.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: premium.radiusMd,
    padding: 14,
    borderWidth: 2,
    borderColor: premium.indigo,
    marginBottom: 12,
    ...premium.shadowSoft,
  },
  radioActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: premium.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: premium.indigo,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  evcLogo: { fontSize: 14, fontWeight: '900', color: premium.emerald, letterSpacing: 0.5 },
  methodBody: { flex: 1 },
  methodLabel: { fontSize: 15, fontWeight: '700', color: premium.text },
  methodSub: { fontSize: 12, color: premium.textMuted, marginTop: 2 },
  badge: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: premium.indigo },
  phoneCard: {
    backgroundColor: premium.white,
    borderRadius: premium.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  phoneLabel: { fontSize: 14, fontWeight: '700', color: premium.text },
  phoneHint: { fontSize: 12, color: premium.textMuted, marginTop: 4, marginBottom: 10 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: premium.border,
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: premium.text,
    paddingVertical: 12,
  },
});

