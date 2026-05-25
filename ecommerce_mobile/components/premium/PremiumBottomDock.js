import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { TAB_HOME, TAB_SHOP, TAB_ORDERS, TAB_PROFILE } from '../../utils/navigationHelpers';

const TABS = [
  { name: 'Home', icon: 'home-outline', iconActive: 'home', tab: TAB_HOME },
  { name: 'Shop', icon: 'grid-outline', iconActive: 'grid', tab: TAB_SHOP },
  { name: 'Orders', icon: 'receipt-outline', iconActive: 'receipt', tab: TAB_ORDERS },
  { name: 'Profile', icon: 'person-outline', iconActive: 'person', tab: TAB_PROFILE },
];

export default function PremiumBottomDock({ navigation, activeTab, cartActive = false }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const insets = useSafeAreaInsets();

  const goTab = (tabIndex) => {
    if (activeTab === tabIndex && !cartActive) return;
    navigation?.navigate?.('Main', { tab: tabIndex });
  };

  const openCart = () => {
    if (cartActive) return;
    navigation?.navigate?.('Cart');
  };

  return (
    <View style={[styles.dockOuter, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.dockShadow}>
        <BlurView intensity={Platform.OS === 'ios' ? 88 : 64} tint={premium.blurTint} style={styles.dockBlur}>
          <View style={styles.dockInner}>
            {TABS.slice(0, 2).map((tab) => (
              <TabButton
                key={tab.name}
                tab={tab}
                active={!cartActive && activeTab === tab.tab}
                onPress={() => goTab(tab.tab)}
                premium={premium}
                styles={styles}
              />
            ))}

            <View style={styles.fabSlot}>
              <TouchableOpacity onPress={openCart} activeOpacity={0.92} style={styles.fabTouch}>
                <LinearGradient
                  colors={cartActive ? [premium.emerald, premium.cyan] : premium.gradientPrimary}
                  style={[styles.fab, cartActive && styles.fabActive]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="bag-handle" size={28} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {TABS.slice(2).map((tab) => (
              <TabButton
                key={tab.name}
                tab={tab}
                active={!cartActive && activeTab === tab.tab}
                onPress={() => goTab(tab.tab)}
                premium={premium}
                styles={styles}
              />
            ))}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

function TabButton({ tab, active, onPress, premium, styles }) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.85}>
      {active ? (
        <LinearGradient
          colors={['rgba(99,102,241,0.18)', 'rgba(34,211,238,0.12)']}
          style={styles.tabPillActive}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={tab.iconActive} size={23} color={premium.indigo} />
        </LinearGradient>
      ) : (
        <View style={styles.tabPill}>
          <Ionicons name={tab.icon} size={23} color={premium.textMuted} />
        </View>
      )}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>
        {tab.name}
      </Text>
      {active && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );
}

const createStyles = (premium) => ({

  dockOuter: {
    paddingHorizontal: 14,
    paddingTop: 6,
    backgroundColor: premium.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: premium.border,
  },
  dockShadow: { borderRadius: premium.radiusXl, ...premium.shadowFloat },
  dockBlur: {
    borderRadius: premium.radiusXl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  dockInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 10,
    minHeight: 64,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.72)',
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 56, paddingVertical: 2 },
  tabPill: { width: 46, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  tabPillActive: {
    width: 46,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  tabLabel: { fontSize: 11, fontWeight: '600', color: premium.textMuted, marginTop: 3 },
  tabLabelActive: { color: premium.indigo, fontWeight: '800' },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: premium.emerald, marginTop: 4 },
  fabSlot: { width: 72, alignItems: 'center', justifyContent: 'center', marginTop: -20 },
  fabTouch: { ...premium.shadowFloat },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: premium.white,
  },
  fabActive: { borderColor: premium.emerald },
});

