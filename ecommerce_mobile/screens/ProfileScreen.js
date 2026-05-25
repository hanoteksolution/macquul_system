import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth';
import PremiumScreenTitle from '../components/premium/PremiumScreenTitle';
import PremiumMenuRow from '../components/premium/PremiumMenuRow';
import PremiumEmptyState from '../components/premium/PremiumEmptyState';
import premiumAlert from '../utils/premiumAlert';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import ProfileScreenShimmer from '../components/premium/skeletons/ProfileScreenShimmer';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Account settings', gradient: ['#8b5cf6', '#6366f1'] },
  { icon: 'receipt-outline', label: 'Order history', gradient: ['#3b82f6', '#6366f1'], tab: 2 },
  { icon: 'heart-outline', label: 'Wishlist', gradient: ['#ec4899', '#f43f5e'], route: 'Wishlist', badgeKey: 'wishlist' },
  { icon: 'bag-outline', label: 'Shopping cart', gradient: ['#8b5cf6', '#a855f7'], route: 'Cart', badgeKey: 'cart' },
  { icon: 'location-outline', label: 'Addresses', gradient: ['#06b6d4', '#3b82f6'] },
  { icon: 'card-outline', label: 'Payment methods', gradient: ['#14b8a6', '#10b981'] },
];

export default function ProfileScreen({ navigation, setActiveTab, bottomInset = 52 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const { isDarkMode, toggleTheme } = useTheme();
  const { wishlist, getCartItemCount } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadUser();
  }, []);

  const checkAuthAndLoadUser = async () => {
    try {
      const isAuth = await isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) setUser(await getCurrentUser());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    premiumAlert('Sign out?', 'You will need to sign in again to access your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          setUser(null);
          setAuthenticated(false);
        },
      },
    ], { variant: 'warning' });
  };

  const initials = () => {
    const name =
      user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.username || 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBadge = (key) => {
    if (key === 'wishlist') return wishlist.length;
    if (key === 'cart') return getCartItemCount();
    return 0;
  };

  const onMenuPress = (item) => {
    if (item.tab != null && setActiveTab) setActiveTab(item.tab);
    else if (item.route) navigation.navigate(item.route);
    else premiumAlert(item.label, 'This section is coming soon.', [{ text: 'OK' }], { variant: 'info' });
  };

  if (loading) {
    return <ProfileScreenShimmer bottomInset={bottomInset} />;
  }

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <PremiumScreenTitle title="Profile" subtitle="Your account & preferences" />
        <PremiumEmptyState
          icon="person-outline"
          title="Not logged in"
          subtitle="Sign in to manage orders, wishlist, and settings."
          buttonLabel="Sign In"
          onButtonPress={() => navigation.navigate('Login')}
        />
      </SafeAreaView>
    );
  }

  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username || 'User';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset }]}
      >
        <PremiumScreenTitle
          title="Profile"
          subtitle="Your account & preferences"
          actions={[
            { icon: 'notifications-outline', onPress: () => {}, badge: 2, badgeColor: '#f43f5e' },
            {
              icon: 'settings-outline',
              onPress: () => premiumAlert('Settings', 'App settings coming soon.', [{ text: 'OK' }]),
            },
          ]}
        />

        <TouchableOpacity activeOpacity={0.95} onPress={() => {}}>
          <LinearGradient colors={premium.gradientPrimary} style={styles.profileCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials()}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={premium.emeraldLight} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Preferences</Text>
        <PremiumMenuRow
          icon={isDarkMode ? 'moon' : 'sunny'}
          label={isDarkMode ? 'Dark mode' : 'Light mode'}
          iconGradient={isDarkMode ? ['#312e81', '#6366f1'] : ['#fbbf24', '#f59e0b']}
          showArrow={false}
          rightElement={
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: premium.border, true: premium.indigo }}
              thumbColor={premium.white}
            />
          }
        />

        <Text style={styles.sectionLabel}>Account</Text>
        {MENU_ITEMS.map((item) => (
          <PremiumMenuRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            iconGradient={item.gradient}
            badge={getBadge(item.badgeKey)}
            onPress={() => onMenuPress(item)}
          />
        ))}

        <TouchableOpacity onPress={handleLogout} activeOpacity={0.9} style={styles.logoutWrap}>
          <LinearGradient colors={['#fef2f2', '#fff']} style={styles.logoutCard}>
            <View style={styles.logoutIconWrap}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </View>
            <View style={styles.logoutText}>
              <Text style={styles.logoutTitle}>Logout</Text>
              <Text style={styles.logoutSub}>Sign out from your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#f87171" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  scroll: { paddingHorizontal: 20 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: premium.radiusXl,
    padding: 22,
    marginBottom: 24,
    ...premium.shadowCard,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    marginRight: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: premium.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  logoutWrap: { marginTop: 8, marginBottom: 16 },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: premium.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    ...premium.shadowSoft,
  },
  logoutIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoutText: { flex: 1 },
  logoutTitle: { fontSize: 16, fontWeight: '700', color: '#ef4444' },
  logoutSub: { fontSize: 13, color: '#f87171', marginTop: 2 },
});

