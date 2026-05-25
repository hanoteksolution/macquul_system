import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function PremiumMenuRow({
  icon,
  label,
  onPress,
  rightElement,
  badge,
  danger,
  showArrow = true,
  iconGradient,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const iconEl = iconGradient ? (
    <LinearGradient colors={iconGradient} style={styles.iconGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Ionicons name={icon} size={22} color="#fff" />
    </LinearGradient>
  ) : (
    <View style={[styles.iconWrap, danger && styles.iconDanger]}>
      <Ionicons name={icon} size={22} color={danger ? '#ef4444' : premium.indigo} />
    </View>
  );

  const content = (
    <View style={[styles.row, danger && styles.rowDanger]}>
      {iconEl}
      <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
      <View style={styles.right}>
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
        {rightElement}
        {showArrow && !rightElement && (
          <Ionicons name="chevron-forward" size={20} color={premium.textMuted} />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const createStyles = (premium) => ({

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.white,
    borderRadius: premium.radiusMd,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  rowDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconGrad: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconDanger: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  label: { flex: 1, fontSize: 16, fontWeight: '600', color: premium.text },
  labelDanger: { color: '#ef4444' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: premium.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});

