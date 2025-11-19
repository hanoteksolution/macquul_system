import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth';

export default function ProfileScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { cart, wishlist, getCartItemCount } = useCart();
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
      
      if (isAuth) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              setUser(null);
              setAuthenticated(false);
              Alert.alert('Success', 'Logged out successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!authenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Not Logged In</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Please login to access your profile
          </Text>
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {getInitials(user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username || 'User')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              {user?.email || 'No email'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {/* Theme Toggle */}
        <View style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={styles.menuIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
          <Text style={[styles.menuText, { color: theme.text }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDarkMode ? theme.surface : theme.background}
          />
        </View>

        {/* Account Settings */}
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={[styles.menuText, { color: theme.text }]}>Account Settings</Text>
          <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
        
        {/* Order History */}
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Main', { screen: 'Orders' })}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={[styles.menuText, { color: theme.text }]}>Order History</Text>
          <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
        
        {/* Wishlist */}
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Text style={styles.menuIcon}>❤️</Text>
          <Text style={[styles.menuText, { color: theme.text }]}>Wishlist</Text>
          <View style={styles.menuRight}>
            {wishlist.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>{wishlist.length}</Text>
              </View>
            )}
            <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.menuIcon}>🛒</Text>
          <Text style={[styles.menuText, { color: theme.text }]}>Shopping Cart</Text>
          <View style={styles.menuRight}>
            {getCartItemCount() > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>{getCartItemCount()}</Text>
              </View>
            )}
            <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
          </View>
        </TouchableOpacity>
        
        {/* Logout */}
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutButton, { backgroundColor: theme.error + '20', borderColor: theme.error }]} 
          onPress={handleLogout}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, { color: theme.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    paddingTop: 50, 
    paddingBottom: 20, 
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  avatarText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  userInfo: { 
    flex: 1 
  },
  userName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  userEmail: { 
    fontSize: 16 
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: { 
    fontSize: 20, 
    marginRight: 16, 
    width: 24 
  },
  menuText: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '500' 
  },
  menuArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: { 
    marginTop: 20 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
