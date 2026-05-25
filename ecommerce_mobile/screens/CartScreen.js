import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../services/api';
import { isAuthenticated } from '../utils/auth';
import { useCart } from '../context/CartContext';
import PremiumEmptyState from '../components/premium/PremiumEmptyState';
import PremiumBottomDock from '../components/premium/PremiumBottomDock';
import premiumAlert from '../utils/premiumAlert';
import { goToShop } from '../utils/navigationHelpers';
import { navigateBackOrHome } from '../utils/androidBackNavigation';
import CartScreenHeader from '../components/premium/cart/CartScreenHeader';
import CartItemCard from '../components/premium/cart/CartItemCard';
import CartRecommendations from '../components/premium/cart/CartRecommendations';
import CartFooterSummary from '../components/premium/cart/CartFooterSummary';
import CartAddItemsButton from '../components/premium/cart/CartAddItemsButton';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import CartScreenShimmer from '../components/premium/skeletons/CartScreenShimmer';

const FOOTER_HEIGHT = 100;

export default function CartScreen({ navigation }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const insets = useSafeAreaInsets();
  const {
    cart,
    loading: cartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const [selected, setSelected] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const itemCount = getCartItemCount();
  const subtotal = getCartTotal();
  const scrollBottomPad = FOOTER_HEIGHT + 100 + Math.max(insets.bottom, 10);

  useEffect(() => {
    setSelected((prev) => {
      const next = {};
      cart.forEach((item) => {
        next[item.id] = prev[item.id] !== undefined ? prev[item.id] : true;
      });
      return next;
    });
  }, [cart]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/products/');
        const list = res.data?.results || res.data || [];
        const cartIds = new Set(cart.map((c) => c.id));
        if (!cancelled) {
          setRecommendations(list.filter((p) => p?.id && !cartIds.has(p.id)).slice(0, 6));
        }
      } catch {
        /* optional */
      }
    })();
    return () => { cancelled = true; };
  }, [cart]);

  const selectedCart = useMemo(
    () => cart.filter((item) => selected[item.id] !== false),
    [cart, selected]
  );

  const selectedTotal = useMemo(
    () => selectedCart.reduce((sum, item) => sum + parseFloat(item.price || 0) * item.quantity, 0),
    [selectedCart]
  );

  const handleClearCart = () => {
    premiumAlert('Clear cart', 'Remove all items from your bag?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearCart() },
    ]);
  };

  const proceedToCheckout = async () => {
    if (selectedCart.length === 0) {
      premiumAlert('No items selected', 'Select at least one item to checkout.', [{ text: 'OK' }], { variant: 'cart' });
      return;
    }
    if (!(await isAuthenticated())) {
      premiumAlert('Login required', 'Please sign in to complete your purchase.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ], { variant: 'login' });
      return;
    }
    navigation.navigate('Checkout', { cartItems: selectedCart });
  };

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddRecommendation = async (product) => {
    await addToCart(product, 1);
    premiumAlert('Added', `${product.name} was added to your cart.`, [{ text: 'OK' }], { variant: 'success' });
  };

  const handleBack = () => navigateBackOrHome(navigation);

  if (cartLoading && cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.body}>
          <CartScreenShimmer />
        </View>
        <PremiumBottomDock navigation={navigation} cartActive />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CartScreenHeader
        itemCount={itemCount}
        onBack={handleBack}
        onClearCart={handleClearCart}
        showClear={cart.length > 0}
      />

      {cart.length === 0 ? (
        <>
          <PremiumEmptyState
            icon="bag-outline"
            title="Your cart is empty"
            subtitle="Add products from the shop and they'll appear here."
            buttonLabel="Start shopping"
            onButtonPress={() => goToShop(navigation)}
          />
          <PremiumBottomDock navigation={navigation} cartActive />
        </>
      ) : (
        <View style={styles.body}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scroll, { paddingBottom: scrollBottomPad }]}
          >
            {cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                selected={selected[item.id] !== false}
                onToggleSelect={() => toggleSelect(item.id)}
                onRemove={() => removeFromCart(item.id)}
                onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
              />
            ))}

            <CartAddItemsButton onPress={() => goToShop(navigation)} />

            <CartRecommendations
              products={recommendations}
              onAdd={handleAddRecommendation}
              onPressProduct={(p) => navigation.navigate('ProductDetail', { product: p })}
            />
          </ScrollView>

          <View style={styles.footer}>
            <CartFooterSummary
              total={selectedTotal || subtotal}
              onCheckout={proceedToCheckout}
              loading={false}
            />
          </View>

          <PremiumBottomDock navigation={navigation} cartActive />
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  body: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 4 },
  footer: {
    backgroundColor: premium.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: premium.border,
  },
});

