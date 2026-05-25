import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import { ShimmerBox, ShimmerProvider } from './Shimmer';

const { width } = Dimensions.get('window');
const CARD_W = width - 40;
const SLIDE_INTERVAL = 4500;

const DEFAULT = {
  id: 'default',
  title: 'Next Level',
  titleAccent: 'Technology',
  subtitle: 'Latest gadgets. Best prices.',
  badge: '40% OFF',
  buttonText: 'Shop Now',
  image_url: null,
};

function SlideCard({ slide, premium, styles }) {
  const mainTitle = slide.title || 'Next Level';
  const accent = slide.titleAccent || 'Technology';
  const ctaColors = premium.isDark ? ['#ffffff', '#e2e8f0'] : ['#ffffff', '#f1f5f9'];

  return (
    <View style={styles.slideOuter}>
      <LinearGradient colors={premium.gradientBanner} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.glassOverlay} />
        <View style={styles.glowOrb2} />

        <View style={styles.badge}>
          <LinearGradient colors={premium.gradientEmerald} style={styles.badgeGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.badgeText}>{slide.badge || '40% OFF'}</Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={styles.kicker}>PREMIUM DEALS</Text>
          <Text style={styles.headline}>
            {mainTitle}{' '}
            <Text style={styles.headlineAccent}>{accent}</Text>
          </Text>
          <Text style={styles.sub}>{slide.subtitle || 'Upgrade your world'}</Text>
          <View style={styles.ctaWrap}>
            <LinearGradient colors={ctaColors} style={styles.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.ctaText}>{slide.buttonText || 'Shop Now'}</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.visual}>
          {slide.image_url ? (
            <Image source={{ uri: slide.image_url }} style={styles.heroImg} resizeMode="contain" />
          ) : (
            <Text style={styles.emoji}>📱⌚🎧</Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const viewabilityConfig = { viewAreaCoveragePercentThreshold: 60 };

export default function PremiumHeroSlider({ banners = [], loading, onShopPress }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  });
  const list = banners?.length ? banners : [DEFAULT];

  useEffect(() => {
    if (loading || list.length <= 1) return undefined;
    const t = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % list.length;
        listRef.current?.scrollToIndex?.({ index: next, animated: true });
        return next;
      });
    }, SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [list.length, loading]);

  if (loading) {
    return (
      <ShimmerProvider>
        <View style={styles.wrap}>
          <ShimmerBox style={[styles.card, styles.shimmerCard]} glass float>
            <ShimmerBox style={styles.shimmerLine} noShine />
            <ShimmerBox style={[styles.shimmerLine, { width: '55%', marginTop: 10 }]} noShine />
          </ShimmerBox>
        </View>
      </ShimmerProvider>
    );
  }

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={list}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onShopPress?.(item)}
            disabled={!onShopPress}
          >
            <SlideCard slide={item} premium={premium} styles={styles} />
          </TouchableOpacity>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.sliderContent}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, i) => ({ length: CARD_W + 12, offset: (CARD_W + 12) * i, index: i })}
      />

      <View style={styles.dots}>
        {list.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              setIndex(i);
              listRef.current?.scrollToIndex?.({ index: i, animated: true });
            }}
          >
            <View style={[styles.dot, i === index && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (premium) => ({

  wrap: { marginBottom: 20 },
  sliderContent: { paddingHorizontal: 20, gap: 12 },
  slideOuter: { width: CARD_W },
  card: {
    width: CARD_W,
    minHeight: 168,
    borderRadius: premium.radiusXl,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    ...premium.shadowCard,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  glowOrb2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: premium.violet,
    opacity: 0.35,
    bottom: -24,
    right: 24,
  },
  badge: { position: 'absolute', top: 14, right: 14, zIndex: 2 },
  badgeGrad: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  content: { flex: 1, justifyContent: 'center', zIndex: 1, paddingRight: 6 },
  kicker: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  headline: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 4, lineHeight: 28 },
  headlineAccent: { color: premium.cyan },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6, marginBottom: 12 },
  ctaWrap: { alignSelf: 'flex-start' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 5,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 8,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '800',
    color: premium.isDark ? '#0f172a' : premium.navy,
  },
  ctaIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: premium.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visual: { width: 96, justifyContent: 'center', alignItems: 'center' },
  heroImg: { width: 88, height: 108 },
  emoji: { fontSize: 36 },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: premium.textMuted, opacity: 0.35 },
  dotActive: { width: 20, backgroundColor: premium.indigo, opacity: 1 },
  shimmerCard: { justifyContent: 'center', padding: 24, marginHorizontal: 20, minHeight: 168 },
  shimmerLine: { height: 18, borderRadius: 8, width: '75%' },
});

