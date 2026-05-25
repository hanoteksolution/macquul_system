import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { getStoredTokens } from '../../services/api';

export default function PremiumHomeHeader({ cartCount, wishlistCount = 0, onMenuPress, onWishlist, onCart }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    getStoredTokens().then(({ user }) => {
      if (user?.first_name) setUserName(user.first_name);
      else if (user?.username) setUserName(user.username);
    });
  }, []);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress} activeOpacity={0.8}>
        <Ionicons name="menu-outline" size={24} color={premium.text} />
      </TouchableOpacity>

      <View style={styles.greeting}>
        <Text style={styles.hello}>Hello! 👋</Text>
        <Text style={styles.title}>Welcome back, {userName}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={onWishlist} activeOpacity={0.85}>
          <Ionicons name="heart-outline" size={22} color={premium.text} />
          {wishlistCount > 0 && (
            <View style={styles.wishlistBadge}>
              <Text style={styles.countText}>{wishlistCount > 9 ? '9+' : wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onCart} activeOpacity={0.85}>
          <Ionicons name="bag-outline" size={22} color={premium.text} />
          {cartCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...premium.shadowSoft,
  },
  greeting: { flex: 1, marginHorizontal: 14 },
  hello: { fontSize: 13, color: premium.textSecondary, fontWeight: '500' },
  title: { fontSize: 17, fontWeight: '800', color: premium.text, marginTop: 2, letterSpacing: -0.3 },
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
  wishlistBadge: {
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
  countBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: premium.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: premium.white,
  },
  countText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});

