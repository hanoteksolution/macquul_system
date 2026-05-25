import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import usePremiumTheme from './usePremiumTheme';

/** Build StyleSheet from premium tokens — re-creates when light/dark changes */
export default function useThemedStyles(factory) {
  const premium = usePremiumTheme();
  return useMemo(() => StyleSheet.create(factory(premium)), [premium]);
}
