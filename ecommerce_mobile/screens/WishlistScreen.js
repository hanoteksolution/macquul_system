import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import PremiumPageHeader from '../components/premium/PremiumPageHeader';
import PremiumProductCard from '../components/premium/PremiumProductCard';
import PremiumEmptyState from '../components/premium/PremiumEmptyState';
import premiumAlert from '../utils/premiumAlert';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import { goToShop } from '../utils/navigationHelpers';

export default function WishlistScreen({ navigation }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const { wishlist, addToCart, addToWishlist } = useCart();

  const handleToggleWishlist = async (product) => {
    await addToWishlist(product);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PremiumPageHeader
        title="Wishlist"
        subtitle={`${wishlist.length} saved item${wishlist.length === 1 ? '' : 's'}`}
        onBack={() => navigation.goBack()}
      />

      {wishlist.length === 0 ? (
        <PremiumEmptyState
          icon="heart-outline"
          title="Your wishlist is empty"
          subtitle="Tap the heart on products you love to save them here."
          buttonLabel="Browse products"
          onButtonPress={() => goToShop(navigation)}
        />
      ) : (
        <FlatList
          data={wishlist}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PremiumProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAddToCart={() => handleAddToCart(item)}
              onToggleWishlist={() => handleToggleWishlist(item)}
              isWishlisted
            />
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  row: { justifyContent: 'space-between', paddingHorizontal: 20 },
  grid: { paddingBottom: 24, paddingTop: 8 },
});

