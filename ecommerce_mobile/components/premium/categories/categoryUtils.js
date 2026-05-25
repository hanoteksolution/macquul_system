import { Dimensions } from 'react-native';
import { lightPremium } from '../../../constants/premiumThemes';

export const CIRCLE_LG = 56;
export const CIRCLE_SM = 48;
export const CATEGORY_ITEM_WIDTH = 76;
export const SUB_CATEGORY_ITEM_WIDTH = 68;

export function getSubCategorySnapInterval() {
  return SUB_CATEGORY_ITEM_WIDTH;
}

const { width: SCREEN_W } = Dimensions.get('window');

export function getCategorySnapInterval() {
  return CATEGORY_ITEM_WIDTH;
}

export function getCategoryIcon(name) {
  const key = (name || '').toLowerCase().trim();
  if (key === 'all') return 'apps-outline';
  if (key.includes('cloth') || key.includes('apparel') || key.includes('fashion')) return 'shirt-outline';
  // Order matters: "headphones" contains "phone" — check headphones before phones
  if (
    key.includes('headphone') ||
    key.includes('headset') ||
    key.includes('earphone') ||
    key.includes('earbud') ||
    key === 'audio'
  ) {
    return 'headset-outline';
  }
  if (
    key.includes('laptop') ||
    key.includes('notebook') ||
    key.includes('macbook') ||
    key.includes('computer') ||
    key === 'pc'
  ) {
    return 'laptop-outline';
  }
  if (
    key.includes('phone') ||
    key.includes('mobile') ||
    key.includes('smartphone') ||
    key.includes('iphone') ||
    key.includes('android') ||
    key.includes('tablet') ||
    key.includes('cell')
  ) {
    return 'phone-portrait-outline';
  }
  if (key.includes('watch') || key.includes('wearable')) return 'watch-outline';
  if (key.includes('camera') || key.includes('photo')) return 'camera-outline';
  if (key.includes('tv') || key.includes('television') || key.includes('monitor')) return 'tv-outline';
  if (key.includes('electronic') || key.includes('tech') || key.includes('gadget')) {
    return 'hardware-chip-outline';
  }
  if (key.includes('stationery') || key.includes('pen') || key.includes('paper')) return 'color-palette-outline';
  if (key.includes('office') || key.includes('supply') || key.includes('staple')) return 'briefcase-outline';
  if (key.includes('furniture') || key.includes('home')) return 'home-outline';
  if (key.includes('charger') || key.includes('cable') || key.includes('power')) return 'flash-outline';
  if (key.includes('book')) return 'book-outline';
  return 'pricetags-outline';
}

export function getCategoryAccent(name, premium = lightPremium) {
  const key = (name || '').toLowerCase();
  if (key === 'all') {
    return {
      color: premium.indigo,
      gradient: premium.gradientPrimary,
      glow: 'rgba(99, 102, 241, 0.5)',
      glass: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(99, 102, 241, 0.25)',
      chipGradient: premium.gradientPrimary,
    };
  }
  if (key.includes('cloth') || key.includes('apparel')) return tone('#3b82f6', premium);
  if (
    key.includes('headphone') ||
    key.includes('headset') ||
    key.includes('earphone') ||
    key.includes('earbud')
  ) {
    return tone('#8b5cf6', premium);
  }
  if (key.includes('laptop') || key.includes('notebook') || key.includes('macbook')) {
    return tone('#0ea5e9', premium);
  }
  if (
    key.includes('phone') ||
    key.includes('mobile') ||
    key.includes('smartphone') ||
    key.includes('tablet')
  ) {
    return tone('#10b981', premium);
  }
  if (key.includes('electronic') || key.includes('tech') || key.includes('gadget')) {
    return tone('#06b6d4', premium);
  }
  if (key.includes('stationery') || key.includes('pen')) return tone('#f59e0b', premium);
  if (key.includes('office') || key.includes('supply')) return tone('#8b5cf6', premium);
  if (key.includes('furniture') || key.includes('home')) return tone('#14b8a6', premium);
  return tone(premium.indigo, premium);
}

function tone(color, p) {
  return {
    color,
    gradient: [color, p.cyan],
    glow: `${color}55`,
    glass: p.isDark ? 'rgba(30, 41, 59, 0.88)' : 'rgba(255, 255, 255, 0.88)',
    border: `${color}28`,
    chipGradient: [color, p.violet],
  };
}

export function getCategorySubtitle(name, isAll) {
  if (isAll) return 'Everything';
  const key = (name || '').toLowerCase();
  if (key.includes('headphone') || key.includes('headset') || key.includes('earbud')) return 'Audio gear';
  if (key.includes('laptop') || key.includes('notebook')) return 'Computers';
  if (key.includes('phone') || key.includes('mobile') || key.includes('smartphone')) return 'Mobile devices';
  if (key.includes('electronic') || key.includes('tech')) return 'Tech & gadgets';
  if (key.includes('cloth')) return 'Style & wear';
  if (key.includes('stationery')) return 'Office & art';
  if (key.includes('office')) return 'Work essentials';
  return 'Collection';
}

export { SCREEN_W };
