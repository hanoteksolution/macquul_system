import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import premiumAlert from '../utils/premiumAlert';
import ProductDetailHeader from '../components/premium/product/ProductDetailHeader';
import ProductImageGallery from '../components/premium/product/ProductImageGallery';
import ProductInfoSection from '../components/premium/product/ProductInfoSection';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import ProductPurchaseBar from '../components/premium/product/ProductPurchaseBar';

export default function ProductDetailScreen({ route, navigation }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const insets = useSafeAreaInsets();
  const { product } = route.params;
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const wishlisted = isInWishlist(product?.id);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const success = await addToCart(product, quantity);
      if (success) {
        premiumAlert('Added to cart', `${product.name} was added to your bag.`, [
          { text: 'Continue', style: 'cancel' },
          { text: 'View cart', onPress: () => navigation.navigate('Cart') },
        ], { variant: 'success' });
      } else {
        premiumAlert('Error', 'Failed to add product to cart.', [{ text: 'OK' }], { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      premiumAlert('Error', 'Failed to add product to cart.', [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    const wasAdded = await addToWishlist(product);
    if (wasAdded) {
      premiumAlert('Saved', 'Product added to your wishlist.', [{ text: 'OK' }], { variant: 'success' });
    } else {
      premiumAlert('Removed', 'Product removed from wishlist.', [{ text: 'OK' }]);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${product?.name} — check it out in our store!`,
        title: product?.name,
      });
    } catch {
      /* cancelled */
    }
  };

  const updateQuantity = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProductDetailHeader
        onBack={() => navigation.goBack()}
        onWishlist={handleToggleWishlist}
        onShare={handleShare}
        wishlisted={wishlisted}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <ProductImageGallery product={product} />
        <ProductInfoSection
          product={product}
          wishlisted={wishlisted}
          onWishlist={handleToggleWishlist}
        />
        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
        <ProductPurchaseBar
          product={product}
          quantity={quantity}
          onDecrement={() => updateQuantity(-1)}
          onIncrement={() => updateQuantity(1)}
          onAddToCart={handleAddToCart}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  scroll: { paddingBottom: 8 },
  bottomPad: { height: 100 },
});

