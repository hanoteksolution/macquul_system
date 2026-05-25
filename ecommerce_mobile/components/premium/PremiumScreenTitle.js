import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

/** Large left-aligned title row with optional action icons (Orders, Profile) */
export default function PremiumScreenTitle({ title, subtitle, actions = [] }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  return (
    <View style={styles.wrap}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action, i) => (
            <TouchableOpacity
              key={`${action.icon}-${i}`}
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
      )}
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  textCol: { flex: 1, paddingRight: 12 },
  title: { fontSize: 28, fontWeight: '800', color: premium.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: premium.textSecondary, marginTop: 4, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
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

