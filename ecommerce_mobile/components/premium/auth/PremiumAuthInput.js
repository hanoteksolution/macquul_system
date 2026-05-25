import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

export default function PremiumAuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon = 'mail-outline',
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  variant = 'light',
  style,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const isDark = variant === 'dark';

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.field,
          isDark ? styles.fieldDark : styles.fieldLight,
          focused && (isDark ? styles.fieldDarkFocus : styles.fieldLightFocus),
        ]}
      >
        <View style={[styles.iconWrap, isDark && styles.iconWrapDark]}>
          <Ionicons name={icon} size={20} color={isDark ? premium.emeraldLight : premium.emerald} />
        </View>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? premium.textOnDarkMuted : premium.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={isDark ? premium.textOnDarkMuted : premium.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: premium.text, marginBottom: 8 },
  labelDark: { color: premium.textOnDark },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: premium.radiusMd,
    paddingHorizontal: 4,
    minHeight: 56,
    borderWidth: 1.5,
  },
  fieldLight: {
    backgroundColor: premium.authCard,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  fieldLightFocus: {
    borderColor: premium.emerald,
    shadowColor: premium.emerald,
    shadowOpacity: 0.15,
  },
  fieldDark: {
    backgroundColor: premium.glassDark,
    borderColor: premium.glassDarkBorder,
  },
  fieldDarkFocus: {
    borderColor: premium.emeraldLight,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDark: {},
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: premium.text,
    paddingVertical: 14,
  },
  inputDark: { color: premium.textOnDark },
});

