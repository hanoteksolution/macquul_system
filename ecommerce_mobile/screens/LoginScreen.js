import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import PremiumAuthInput from '../components/premium/auth/PremiumAuthInput';
import PremiumGradientButton from '../components/premium/auth/PremiumGradientButton';
import SocialLoginRow from '../components/premium/auth/SocialLoginRow';
import { AuthDarkOrbs, AuthHeroLock } from '../components/premium/auth/AuthDecorations';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import premiumAlert from '../utils/premiumAlert';

export default function LoginScreen({ navigation }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      premiumAlert('Missing fields', 'Please enter your email and password.', [{ text: 'OK' }], { variant: 'warning' });
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/login/', { email, password });
      await AsyncStorage.setItem('access', res.data.tokens.access);
      await AsyncStorage.setItem('refresh', res.data.tokens.refresh);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      if (remember) {
        await AsyncStorage.setItem('remember_email', email);
      } else {
        await AsyncStorage.removeItem('remember_email');
      }
      premiumAlert('Welcome back!', 'You have signed in successfully.', [
        { text: 'Continue', onPress: () => navigation.goBack() },
      ], { variant: 'success' });
    } catch (e) {
      premiumAlert(
        'Login failed',
        e.response?.data?.detail || 'Please check your credentials and try again.',
        [{ text: 'OK' }],
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={premium.gradientAuthDark} style={StyleSheet.absoluteFill} />
      <AuthDarkOrbs />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <Ionicons name="chevron-back" size={24} color={premium.textOnDark} />
            </TouchableOpacity>

            <AuthHeroLock variant="dark" />

            <Text style={styles.title}>Welcome Back! 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue to your account</Text>

            <PremiumAuthInput
              label="Email"
              icon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              variant="dark"
            />
            <PremiumAuthInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              variant="dark"
            />

            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember(!remember)} activeOpacity={0.8}>
                <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                  {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  premiumAlert('Reset password', 'Contact support to reset your password.', [{ text: 'OK' }], {
                    variant: 'info',
                  })
                }
              >
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <PremiumGradientButton label="Sign In" onPress={submit} loading={loading} />

            <SocialLoginRow variant="dark" />
          </ScrollView>

          <TouchableOpacity
            style={styles.footerCard}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.9}
          >
            <View style={styles.footerLeft}>
              <Text style={styles.footerMuted}>Don't have an account?</Text>
              <Text style={styles.footerLink}>Create Account →</Text>
            </View>
            <View style={styles.footerLock}>
              <Ionicons name="shield-checkmark" size={28} color={premium.emerald} />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (premium) => ({

  root: { flex: 1, backgroundColor: premium.navy },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 16 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: premium.glassDark,
    borderWidth: 1,
    borderColor: premium.glassDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: premium.textOnDark,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: premium.textOnDarkMuted,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: -4,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: premium.glassDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: premium.emerald, borderColor: premium.emerald },
  rememberText: { fontSize: 14, color: premium.textOnDarkMuted, fontWeight: '500' },
  forgot: { fontSize: 14, fontWeight: '700', color: premium.emeraldLight },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    borderRadius: premium.radiusLg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: premium.glassDarkBorder,
  },
  footerLeft: { flex: 1 },
  footerMuted: { fontSize: 14, color: premium.textOnDarkMuted, marginBottom: 4 },
  footerLink: { fontSize: 16, fontWeight: '800', color: premium.emeraldLight },
  footerLock: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

