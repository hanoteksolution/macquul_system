import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import PremiumPageHeader from '../components/premium/PremiumPageHeader';
import PremiumSearchBar from '../components/premium/PremiumSearchBar';
import PremiumCategoryNav from '../components/premium/PremiumCategoryNav';
import PremiumProductCard from '../components/premium/PremiumProductCard';
import {
  ALL_SELECTION,
  normalizeCategoryRoots,
  productMatchesSelection,
  getSelectionLabel,
} from '../utils/categoryTree';
import premiumAlert from '../utils/premiumAlert';
import ShopScreenShimmer from '../components/premium/skeletons/ShopScreenShimmer';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import useScrollToProducts from '../hooks/useScrollToProducts';
import AnimatedProductsWrap from '../components/premium/categories/AnimatedProductsWrap';

export default function ProductsScreen({ navigation, route, bottomInset = 52 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);
  const { scrollRef, scrollContentRef, productsAnchorRef, scheduleScrollToProducts } =
    useScrollToProducts();

  const { wishlist, addToCart, addToWishlist, getCartItemCount } = useCart();
  const [products, setProducts] = useState([]);
  const [categoryRoots, setCategoryRoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorySelection, setCategorySelection] = useState(ALL_SELECTION);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const incoming = route?.params?.shopSelection;
    if (!incoming || loading) return;

    setCategorySelection(incoming);
    scheduleScrollToProducts();
    navigation.setParams({ shopSelection: undefined });
  }, [route?.params?.shopSelection, loading, navigation, scheduleScrollToProducts]);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/tree/').catch(() => api.get('/categories/')),
      ]);
      const productsData = productsRes.data?.results || productsRes.data || [];
      const categoriesPayload = categoriesRes.data?.results || categoriesRes.data || [];
      setProducts(productsData.filter((p) => p?.name));
      setCategoryRoots(normalizeCategoryRoots(categoriesPayload));
    } catch {
      premiumAlert('Error', 'Failed to load products.', [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const ok = await addToCart(product, 1);
    premiumAlert(
      ok ? 'Added to cart' : 'Error',
      ok ? 'Item added to your bag.' : 'Failed to add to cart.',
      [{ text: 'OK' }],
      { variant: ok ? 'success' : 'error' }
    );
  };

  const handleToggleWishlist = async (product) => {
    const added = await addToWishlist(product);
    premiumAlert(
      added ? 'Saved' : 'Removed',
      added ? 'Added to your wishlist.' : 'Removed from wishlist.',
      [{ text: 'OK' }],
      { variant: added ? 'success' : 'info' }
    );
  };

  const handleCategorySelectionChange = useCallback(
    (selection) => {
      setCategorySelection(selection);
      if (selection?.type !== 'child' && selection?.type !== 'parent') return;
      scheduleScrollToProducts();
    },
    [scheduleScrollToProducts]
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSearch && productMatchesSelection(product, categorySelection);
  });

  const productsAnimKey = [
    categorySelection?.type,
    categorySelection?.parent?.id,
    categorySelection?.category?.id,
    searchTerm,
  ].join('-');

  const productSectionTitle =
    categorySelection?.type === 'all' && !searchTerm
      ? 'All Products'
      : searchTerm
        ? 'Search Results'
        : getSelectionLabel(categorySelection);

  if (loading) {
    return <ShopScreenShimmer bottomInset={bottomInset} />;
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
          <PremiumPageHeader
            title="Shop"
            subtitle="Discover premium products"
            rightActions={[
              {
                icon: 'heart-outline',
                onPress: () => navigation.navigate('Wishlist'),
                badge: wishlist.length,
                badgeColor: '#f43f5e',
              },
              {
                icon: 'bag-outline',
                onPress: () => navigation.navigate('Cart'),
                badge: getCartItemCount(),
                badgeColor: premium.emerald,
              },
            ]}
          />
          <PremiumSearchBar
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search products, brands..."
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
