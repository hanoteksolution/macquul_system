import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { ORDER_FILTERS } from '../../../utils/orderStatus';

function getFilterMeta(premium) {
  return {
    all: {
      icon: 'cube',
      label: 'All',
      activeGradient: [premium.indigo, premium.violet],
      inactiveGradient: ['rgba(99,102,241,0.12)', 'rgba(99,102,241,0.04)'],
      iconActive: '#fff',
      iconInactive: premium.indigo,
      badge: premium.indigo,
    },
    pending: {
      icon: 'time-outline',
      label: 'Pending',
      activeGradient: ['#f59e0b', '#fbbf24'],
      inactiveGradient: ['rgba(245,158,11,0.14)', 'rgba(245,158,11,0.04)'],
      iconActive: '#fff',
      iconInactive: '#f59e0b',
      badge: '#f59e0b',
    },
    processing: {
      icon: 'sync-outline',
      label: 'Processing',
      activeGradient: ['#3b82f6', '#60a5fa'],
      inactiveGradient: ['rgba(59,130,246,0.14)', 'rgba(59,130,246,0.04)'],
      iconActive: '#fff',
      iconInactive: '#3b82f6',
      badge: '#3b82f6',
    },
    completed: {
      icon: 'checkmark-circle-outline',
      label: 'Done',
      activeGradient: [premium.emerald, '#34d399'],
      inactiveGradient: ['rgba(16,185,129,0.14)', 'rgba(16,185,129,0.04)'],
      iconActive: '#fff',
      iconInactive: premium.emerald,
      badge: premium.emerald,
    },
    cancelled: {
      icon: 'close-circle-outline',
      label: 'Cancel',
      activeGradient: ['#ef4444', '#f87171'],
      inactiveGradient: ['rgba(239,68,68,0.12)', 'rgba(239,68,68,0.04)'],
      iconActive: '#fff',
      iconInactive: '#ef4444',
      badge: '#ef4444',
    },
  };
}

function FilterItem({ tabId, label, active, count, onPress, styles, filterMeta }) {
  const meta = filterMeta[tabId] || filterMeta.all;
  const displayLabel = meta.label || label;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={styles.item}
    >
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={active ? meta.activeGradient : meta.inactiveGradient}
          style={[styles.iconCircle, active && styles.iconCircleActive]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={meta.icon}
            size={active ? 20 : 19}
            color={active ? meta.iconActive : meta.iconInactive}
          />
        </LinearGradient>
        {count > 0 ? (
          <View style={[styles.badge, { backgroundColor: meta.badge }]}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
        {displayLabel}
      </Text>

      <View style={[styles.indicator, active && styles.indicatorActive]} />
    </TouchableOpacity>
  );
}

export default function OrderFilterTabs({ active, onChange, counts = {} }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);
  const filterMeta = useMemo(() => getFilterMeta(premium), [premium]);

  return (
    <View style={styles.row}>
      {ORDER_FILTERS.map((tab) => (
        <FilterItem
          key={tab.id}
          tabId={tab.id}
          label={tab.label}
          active={active === tab.id}
          count={counts[tab.id] ?? 0}
          onPress={() => onChange(tab.id)}
          styles={styles}
          filterMeta={filterMeta}
        />
      ))}
    </View>
  );
}

const ICON = 44;

const createStyles = (premium) => ({

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 1,
  },
  iconWrap: {
    width: ICON + 8,
    height: ICON + 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircle: {
    width: ICON,
    height: ICON,
    borderRadius: ICON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  iconCircleActive: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: premium.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: premium.white,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: premium.textMuted,
    textAlign: 'center',
  },
  labelActive: {
    color: premium.indigo,
    fontWeight: '800',
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 5,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: premium.indigo,
  },
});

