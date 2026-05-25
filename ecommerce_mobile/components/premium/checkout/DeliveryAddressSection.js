import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { isAddressComplete } from '../../../utils/deliveryAddress';

export default function DeliveryAddressSection({
  customerName,
  address,
  onEdit,
  onAddNew,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const hasAddress = isAddressComplete(address);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <LinearGradient colors={['rgba(59,130,246,0.2)', 'rgba(99,102,241,0.1)']} style={styles.iconGrad}>
          <Ionicons name="location" size={18} color="#3b82f6" />
        </LinearGradient>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
      </View>

      <View style={styles.nameCard}>
        <Ionicons name="person-circle-outline" size={22} color={premium.indigo} />
        <View style={styles.nameBody}>
          <Text style={styles.nameLabel}>Customer</Text>
          <Text style={styles.nameValue}>{customerName || '—'}</Text>
        </View>
      </View>

      {hasAddress ? (
        <TouchableOpacity style={styles.card} onPress={onEdit} activeOpacity={0.9}>
          <View style={styles.cardBody}>
            <Text style={styles.line}>{address.line1}</Text>
            {address.line2 ? <Text style={styles.line}>{address.line2}</Text> : null}
          </View>
          <Ionicons name="create-outline" size={22} color={premium.indigo} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.emptyCard} onPress={onAddNew} activeOpacity={0.9}>
          <Ionicons name="add-circle-outline" size={28} color={premium.indigo} />
          <Text style={styles.emptyTitle}>Add delivery address</Text>
          <Text style={styles.emptySub}>Street and area only — name from your account</Text>
        </TouchableOpacity>
      )}

      {hasAddress ? (
        <TouchableOpacity onPress={onAddNew} activeOpacity={0.8}>
          <Text style={styles.addLink}>+ Change address</Text>
        </TouchableOpacity>
      ) : null}
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
  nameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: premium.radiusMd,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: premium.border,
    gap: 10,
  },
  nameBody: { flex: 1 },
  nameLabel: { fontSize: 11, fontWeight: '600', color: premium.textMuted, textTransform: 'uppercase' },
  nameValue: { fontSize: 16, fontWeight: '800', color: premium.text, marginTop: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: premium.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: premium.glassBorder,
    ...premium.shadowSoft,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: premium.radiusLg,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(99,102,241,0.25)',
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: premium.text, marginTop: 10 },
  emptySub: { fontSize: 13, color: premium.textMuted, marginTop: 4, textAlign: 'center' },
  cardBody: { flex: 1 },
  line: { fontSize: 14, color: premium.textSecondary, lineHeight: 20 },
  addLink: {
    fontSize: 14,
    fontWeight: '700',
    color: premium.indigo,
    marginTop: 12,
    marginLeft: 4,
  },
});

