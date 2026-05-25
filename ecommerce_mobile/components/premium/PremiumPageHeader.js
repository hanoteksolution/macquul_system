import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

/** Stack / tab page header with optional back and right action(s) */
export default function PremiumPageHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  rightBadge,
  rightActions,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const actions =
    rightActions?.length > 0
      ? rightActions
      : rightIcon
        ? [{ icon: rightIcon, onPress: onRightPress, badge: rightBadge }]
        : [];

  return (
    <View style={styles.wrap}>
      {onBack ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={24} color={premium.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      <View style={styles.titles}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>

      {actions.length > 0 ? (
        <View style={styles.actionsRow}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={`${action.icon}-${index}`}
              style={styles.iconBtn}
              onPress={action.onPress}
              activeOpacity={0.85}
            >
              <Ionicons name={action.icon} size={22} color={premium.text} />
              {action.badge > 0 && (
                <View style={[styles.badge, action.badgeColor && { backgroundColor: action.badgeColor }]}>
                  <Text style={styles.badgeText}>{action.badge > 9 ? '9+' : action.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.iconSpacer} />
      )}
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
  iconSpacer: { width: 44 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  titles: { flex: 1, marginHorizontal: 12 },
  subtitle: { fontSize: 13, color: premium.textSecondary, fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '800', color: premium.text, letterSpacing: -0.4 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: premium.white,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});

