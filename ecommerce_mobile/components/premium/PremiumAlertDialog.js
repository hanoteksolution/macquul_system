import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

function getVariants(premium) {
  return {
    info: {
      icon: 'information-circle',
      colors: premium.gradientPrimary,
      glow: 'rgba(99, 102, 241, 0.35)',
    },
    success: {
      icon: 'checkmark-circle',
      colors: premium.gradientSignIn,
      glow: premium.gradientSignInGlow,
    },
    error: {
      icon: 'close-circle',
      colors: ['#ef4444', '#f87171'],
      glow: 'rgba(239, 68, 68, 0.35)',
    },
    warning: {
      icon: 'warning',
      colors: ['#f59e0b', '#fbbf24'],
      glow: 'rgba(245, 158, 11, 0.35)',
    },
    login: {
      icon: 'lock-closed',
      colors: premium.gradientPrimary,
      glow: 'rgba(99, 102, 241, 0.4)',
    },
    cart: {
      icon: 'cart-outline',
      colors: premium.gradientPrimary,
      glow: 'rgba(99, 102, 241, 0.3)',
    },
  };
}

export function inferAlertVariant(title = '', message = '') {
  const t = `${title} ${message}`.toLowerCase();
  if (/login|sign in|session|auth/.test(t)) return 'login';
  if (/success|welcome|placed|added|created/.test(t)) return 'success';
  if (/error|failed|expired|invalid/.test(t)) return 'error';
  if (/clear|remove|logout|delete|sure/.test(t)) return 'warning';
  if (/empty|cart/.test(t)) return 'cart';
  return 'info';
}

export default function PremiumAlertDialog({ visible, title, message, buttons = [], variant, onClose }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);
  const variants = useMemo(() => getVariants(premium), [premium]);

  if (!visible) return null;

  const v = variants[variant] || variants.info;
  const normalized = buttons.length ? buttons : [{ text: 'OK', style: 'default' }];

  const handlePress = (btn) => {
    onClose();
    btn.onPress?.();
  };

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.cardWrap} onPress={(e) => e.stopPropagation()}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={40} tint="dark" style={styles.blurBackdrop} />
          ) : null}
          <View style={styles.card}>
            <View style={[styles.iconGlow, { shadowColor: v.glow }]}>
              <LinearGradient colors={v.colors} style={styles.iconCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name={v.icon} size={36} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={[styles.actions, normalized.length > 2 && styles.actionsStack]}>
              {normalized.map((btn, i) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                const isPrimary = !isCancel && (i === normalized.length - 1 || btn.style === 'default');

                if (isPrimary && !isDestructive) {
                  return (
                    <TouchableOpacity
                      key={btn.text + i}
                      style={[styles.btnFlex, normalized.length > 2 && styles.btnFull]}
                      onPress={() => handlePress(btn)}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={variant === 'success' ? premium.gradientSignIn : premium.gradientPrimary}
                        style={styles.btnPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.btnPrimaryText}>{btn.text}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    key={btn.text + i}
                    style={[
                      styles.btnSecondary,
                      normalized.length > 2 && styles.btnFull,
                      isDestructive && styles.btnDestructive,
                    ]}
                    onPress={() => handlePress(btn)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.btnSecondaryText,
                        isCancel && styles.btnCancelText,
                        isDestructive && styles.btnDestructiveText,
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (premium) => ({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  cardWrap: {
    width: '100%',
    maxWidth: 340,
    borderRadius: premium.radiusXl,
    overflow: 'hidden',
    ...premium.shadowFloat,
  },
  blurBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: premium.white,
    borderRadius: premium.radiusXl,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: premium.glassBorder,
  },
  iconGlow: {
    marginBottom: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: premium.text,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: premium.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionsStack: {
    flexDirection: 'column',
  },
  btnFlex: { flex: 1 },
  btnFull: { flex: 0, width: '100%' },
  btnPrimary: {
    paddingVertical: 14,
    borderRadius: premium.radiusMd,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: premium.radiusMd,
    alignItems: 'center',
    backgroundColor: premium.background,
    borderWidth: 1.5,
    borderColor: premium.border,
  },
  btnCancelText: { color: premium.textSecondary },
  btnDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  btnDestructiveText: { color: '#ef4444', fontWeight: '700' },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: premium.indigo,
  },
});

