import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import PremiumStoreHeader from '../components/premium/PremiumStoreHeader';
import PremiumSearchBar from '../components/premium/PremiumSearchBar';
import PremiumCategoryNav from '../components/premium/PremiumCategoryNav';
import PremiumHeroSlider from '../components/premium/PremiumHeroSlider';
import PremiumProductCard from '../components/premium/PremiumProductCard';
import {
  ALL_SELECTION,
  normalizeCategoryRoots,
  productMatchesSelection,
  getSelectionLabel,
} from '../utils/categoryTree';
import premiumAlert from '../utils/premiumAlert';
import HomeScreenShimmer from '../components/premium/skeletons/HomeScreenShimmer';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import AnimatedProductsWrap from '../components/premium/categories/AnimatedProductsWrap';
import useScrollToProducts from '../hooks/useScrollToProducts';
import { findCategorySelectionFromBanner } from '../utils/bannerCategory';
import { TAB_SHOP } from '../utils/navigationHelpers';

export default function HomeScreen({ navigation, setActiveTab, bottomInset = 120 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const { wishlist, addToCart, addToWishlist, getCartItemCount } = useCart();
  const searchRef = useRef(null);
  const { scrollRef, scrollContentRef, productsAnchorRef, scheduleScrollToProducts } =
    useScrollToProducts();
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoryRoots, setCategoryRoots] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categorySelection, setCategorySelection] = useState(ALL_SELECTION);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/tree/').catch(() => api.get('/categories/')),
      ]);

      const productsData = productsRes.data?.results || productsRes.data || [];
      const categoriesPayload = categoriesRes.data?.results || categoriesRes.data || [];

      setProducts(productsData);
      setCategoryRoots(normalizeCategoryRoots(categoriesPayload));
      setLoading(false);

      try {
        const publicApi = axios.create({
          baseURL: api.defaults.baseURL,
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        });
        const bannersRes = await publicApi.get('/carousel/slides/active/');
        const bannersData = bannersRes.data?.results || bannersRes.data || [];

        if (bannersData.length > 0) {
          setBanners(
            bannersData.map((banner) => ({
              id: banner.id,
              title: banner.title || 'Next Level',
              titleAccent: banner.title_accent || 'Technology',
              subtitle: banner.subtitle || 'Latest gadgets. Best prices.',
              buttonText: banner.cta_text || 'Shop Now',
              badge: banner.badge_text || '40% OFF',
              image_url: banner.image_url || null,
              cta_link: banner.cta_link || null,
            }))
          );
        } else {
          setBanners([]);
        }
      } catch {
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
      setBannersLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) premiumAlert('Added to cart', 'Item added to your bag.', [{ text: 'OK' }], { variant: 'success' });
    else premiumAlert('Could not add', 'Failed to add item to cart.', [{ text: 'OK' }], { variant: 'error' });
  };

  const handleToggleWishlist = async (product) => {
    const wasAdded = await addToWishlist(product);
    if (wasAdded) premiumAlert('Saved', 'Product added to your wishlist.', [{ text: 'OK' }], { variant: 'success' });
    else premiumAlert('Removed', 'Product removed from wishlist.', [{ text: 'OK' }]);
  };

  const goShopWithSelection = useCallback(
    (selection = ALL_SELECTION) => {
      const params = { tab: TAB_SHOP, shopSelection: selection };
      if (setActiveTab) {
        navigation.navigate('Main', params);
        setActiveTab(TAB_SHOP);
      } else {
        navigation.navigate('Main', params);
      }
    },
    [navigation, setActiveTab]
  );

  const handleBannerShopPress = useCallback(
    (slide) => {
      const selection = findCategorySelectionFromBanner(slide, categoryRoots);
      goShopWithSelection(selection);
    },
    [categoryRoots, goShopWithSelection]
  );

  const handleCategorySelectionChange = useCallback(
    (selection) => {
      setCategorySelection(selection);
      if (selection?.type !== 'child' && selection?.type !== 'parent') return;
      scheduleScrollToProducts();
    },
    [scheduleScrollToProducts]
  );

  const filteredProducts = products.filter((product) => {
    if (!product?.name) return false;
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = productMatchesSelection(product, categorySelection);
    return matchesSearch && matchesCategory;
  });

  const productSectionTitle =
    categorySelection?.type === 'all' && !searchTerm
      ? 'Featured Products'
      : searchTerm
        ? 'Search Results'
        : getSelectionLabel(categorySelection);

  const productsAnimKey = [
    categorySelection?.type,
    categorySelection?.parent?.id,
    categorySelection?.category?.id,
    searchTerm,
  ].join('-');

  if (loading) {
    return <HomeScreenShimmer bottomInset={bottomInset} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={scrollContentRef} collapsable={false}>
        <PremiumStoreHeader
          cartCount={getCartItemCount()}
          wishlistCount={wishlist.length}
          onWishlist={() => navigation.navigate('Wishlist')}
          onCart={() => navigation.navigate('Cart')}
          onSearchPress={() => searchRef.current?.focus?.()}
        />

        <PremiumSearchBar
          ref={searchRef}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search products, brands..."
        />

        <PremiumHeroSlider
          banners={banners}
          loading={bannersLoading}
          onShopPress={handleBannerShopPress}
        />

        <PremiumCategoryNav
          roots={categoryRoots}
          selection={categorySelection}
          onSelectionChange={handleCategorySelectionChange}
          onSubcategoriesLayout={scheduleScrollToProducts}
        />

        <View ref={productsAnchorRef} collapsable={false} style={styles.productsAnchor}>
        <AnimatedProductsWrap animationKey={productsAnimKey}>
          <View collapsable={false}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{productSectionTitle}</Text>
              <Text style={styles.sectionCount}>{filteredProducts.length} items</Text>
            </View>

            {filteredProducts.length === 0 ? (
              <Text style={styles.empty}>No products match your filters.</Text>
            ) : (
              <FlatList
                data={filteredProducts}
                numColumns={2}
                keyExtractor={(item) => String(item?.id ?? item?.name)}
                renderItem={({ item }) => (
                  <PremiumProductCard
                    product={item}
                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    onAddToCart={() => handleAddToCart(item)}
                    onToggleWishlist={() => handleToggleWishlist(item)}
                    isWishlisted={wishlist.some((w) => w.id === item.id)}
                  />
                )}
                columnWrapperStyle={styles.productRow}
                contentContainerStyle={styles.productGrid}
                scrollEnabled={false}
              />
            )}
          </View>
        </AnimatedProductsWrap>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  scroll: { flex: 1 },
  scrollContent: {},
  productsAnchor: { width: '100%' },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: premium.text, letterSpacing: -0.3, flex: 1 },
  sectionCount: { fontSize: 12, fontWeight: '600', color: premium.textMuted },
  productRow: { justifyContent: 'space-between', paddingHorizontal: 20 },
  productGrid: { paddingBottom: 8 },
  empty: {
    textAlign: 'center',
    color: premium.textMuted,
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
});

