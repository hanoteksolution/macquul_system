import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';

const PremiumSearchBar = forwardRef(function PremiumSearchBar(
  { value, onChangeText, placeholder = 'Search products, brands...' },
  ref
) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? premium.indigo : premium.glassBorder;

  return (
    <View style={[styles.outer, focused && styles.outerFocused]}>
      <View style={[styles.inner, { borderColor }]}>
        <Ionicons name="search-outline" size={20} color={focused ? premium.indigo : premium.textMuted} />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={premium.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
        />
        {value?.length > 0 ? (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={20} color={premium.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} disabled>
            <Ionicons name="options-outline" size={20} color={premium.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default PremiumSearchBar;

const createStyles = (premium) => ({
  outer: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: premium.radiusMd,
    ...premium.shadowSoft,
  },
  outerFocused: {
    ...premium.shadowCard,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: premium.radiusMd,
    backgroundColor: premium.surface,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: premium.text,
    padding: 0,
  },
});
