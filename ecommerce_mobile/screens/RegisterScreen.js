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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import PremiumAuthInput from '../components/premium/auth/PremiumAuthInput';
import PremiumGradientButton from '../components/premium/auth/PremiumGradientButton';
import PasswordStrengthBar from '../components/premium/auth/PasswordStrengthBar';
import { AuthLightOrbs, AuthRegisterHero } from '../components/premium/auth/AuthDecorations';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import premiumAlert from '../utils/premiumAlert';

export default function RegisterScreen({ navigation }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const [form, setForm] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!form.email || !form.username || !form.password || !form.password_confirm) {
      premiumAlert('Missing fields', 'Please fill in all required fields.', [{ text: 'OK' }], { variant: 'warning' });
      return;
    }
    if (form.password !== form.password_confirm) {
      premiumAlert('Password mismatch', 'Passwords do not match.', [{ text: 'OK' }], { variant: 'error' });
      return;
    }
    if (!acceptedTerms) {
      premiumAlert('Terms required', 'Please accept the terms and conditions.', [{ text: 'OK' }], { variant: 'info' });
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/register/', form);
      await AsyncStorage.setItem('access', res.data.tokens.access);
      await AsyncStorage.setItem('refresh', res.data.tokens.refresh);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      premiumAlert('Account created!', 'Welcome — your account is ready.', [
        { text: 'Get started', onPress: () => navigation.goBack() },
      ], { variant: 'success' });
    } catch (e) {
      const msg =
        e.response?.data?.detail ||
        (typeof e.response?.data === 'object'
          ? Object.values(e.response.data).flat().join('\n')
          : null) ||
        'Please check your fields and try again';
      premiumAlert('Registration failed', msg, [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <AuthLightOrbs />
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
              <Ionicons name="chevron-back" size={24} color={premium.text} />
            </TouchableOpacity>

            <AuthRegisterHero />
            <Text style={styles.title}>Create Account 🚀</Text>
            <Text style={styles.subtitle}>Fill in the details to get started</Text>

            <View style={styles.formCard}>
              <PremiumAuthInput
                label="Email"
                icon="mail-outline"
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(v) => set('email', v)}
                keyboardType="email-address"
              />
              <PremiumAuthInput
                label="Username"
                icon="person-outline"
                placeholder="Choose a username"
                value={form.username}
                onChangeText={(v) => set('username', v)}
                autoCapitalize="none"
              />
              <View style={styles.nameRow}>
                <PremiumAuthInput
                  label="First Name"
                  icon="person-outline"
                  placeholder="First name"
                  value={form.first_name}
                  onChangeText={(v) => set('first_name', v)}
                  style={styles.nameField}
                />
                <PremiumAuthInput
                  label="Last Name"
                  icon="person-outline"
                  placeholder="Last name"
                  value={form.last_name}
                  onChangeText={(v) => set('last_name', v)}
                  style={styles.nameField}
                />
              </View>
              <PremiumAuthInput
                label="Password"
                icon="lock-closed-outline"
                placeholder="Create a password"
                value={form.password}
                onChangeText={(v) => set('password', v)}
                secureTextEntry
              />
              <PasswordStrengthBar password={form.password} />
              <PremiumAuthInput
                label="Confirm Password"
                icon="lock-closed-outline"
                placeholder="Confirm your password"
                value={form.password_confirm}
                onChangeText={(v) => set('password_confirm', v)}
                secureTextEntry
              />
            </View>

            <View style={styles.secureBanner}>
              <Ionicons name="shield-checkmark" size={22} color={premium.emerald} />
              <Text style={styles.secureText}>
                <Text style={styles.secureBold}>Your data is 100% secure.</Text> We never share your
                details with anyone.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxOn]}>
                {acceptedTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <PremiumGradientButton
              label="Create Account"
              onPress={submit}
              loading={loading}
              disabled={!acceptedTerms}
              variant="primary"
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.footerCard}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.9}
          >
            <View style={styles.footerLeft}>
              <Text style={styles.footerMuted}>Already have an account?</Text>
              <Text style={styles.footerLink}>Sign In →</Text>
            </View>
            <View style={styles.footerLock}>
              <Ionicons name="lock-closed" size={26} color={premium.violet} />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (premium) => ({

  root: { flex: 1, backgroundColor: premium.authLight },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 16 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: premium.radiusSm,
    backgroundColor: premium.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...premium.shadowSoft,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: premium.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: premium.textSecondary,
    textAlign: 'center',
    marginBottom: 22,
  },
  formCard: {
    backgroundColor: premium.white,
    borderRadius: premium.radiusXl,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowCard,
  },
  nameRow: { flexDirection: 'row', gap: 12 },
  nameField: { flex: 1 },
  secureBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: premium.radiusMd,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  secureText: { flex: 1, fontSize: 13, color: premium.textSecondary, lineHeight: 20 },
  secureBold: { fontWeight: '700', color: premium.text },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: premium.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: premium.indigo, borderColor: premium.indigo },
  termsText: { flex: 1, fontSize: 13, color: premium.textSecondary, lineHeight: 20 },
  termsLink: { color: premium.indigo, fontWeight: '700' },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    borderRadius: premium.radiusLg,
    backgroundColor: premium.white,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  footerLeft: { flex: 1 },
  footerMuted: { fontSize: 14, color: premium.textSecondary, marginBottom: 4 },
  footerLink: { fontSize: 16, fontWeight: '800', color: premium.indigo },
  footerLock: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

