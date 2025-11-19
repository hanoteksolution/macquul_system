import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  RefreshControl,
  Animated,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import ImageSlider from '../components/ImageSlider';
import CategoryTabs from '../components/CategoryTabs';

const { width } = Dimensions.get('window');

// Shimmer Loading Component
const ShimmerPlaceholder = ({ width, height, style }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
};

// Product Card Shimmer
const ProductCardShimmer = () => (
  <View style={[styles.productCard, { padding: 0 }]}>
    <ShimmerPlaceholder width="100%" height={120} style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
    <View style={{ padding: 12 }}>
      <ShimmerPlaceholder width="80%" height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
      <ShimmerPlaceholder width="100%" height={12} style={{ borderRadius: 4, marginBottom: 4 }} />
      <ShimmerPlaceholder width="60%" height={12} style={{ borderRadius: 4, marginBottom: 8 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ShimmerPlaceholder width={60} height={20} style={{ borderRadius: 4 }} />
        <ShimmerPlaceholder width={80} height={28} style={{ borderRadius: 6 }} />
      </View>
    </View>
  </View>
);

// Category Shimmer
const CategoryShimmer = () => (
  <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 }}>
    {[1, 2, 3, 4].map((item) => (
      <ShimmerPlaceholder 
        key={item}
        width={80} 
        height={32} 
        style={{ borderRadius: 16, marginRight: 8 }} 
      />
    ))}
  </View>
);

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading data from API...');
      
      // Add timeout to API calls
      const timeout = (ms) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), ms)
      );

      const [productsRes, categoriesRes, carouselRes] = await Promise.race([
        Promise.all([
          api.get('/products/'),
          api.get('/categories/'),
          api.get('/carousel/slides/active/').catch(() => ({ data: [] })) // Match client endpoint
        ]),
        timeout(15000) // 15 second timeout
      ]);
      
      console.log('Products response:', productsRes.data);
      console.log('Categories response:', categoriesRes.data);
      
      // Handle different response structures
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : 
                          productsRes.data?.results || productsRes.data?.data || [];
      const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : 
                            categoriesRes.data?.results || categoriesRes.data?.data || [];
      const carouselData = Array.isArray(carouselRes.data) ? carouselRes.data : 
                          carouselRes.data?.results || carouselRes.data?.data || [];
      
      console.log('Products loaded:', productsData.length);
      console.log('Categories loaded:', categoriesData.length);
      console.log('Carousel loaded:', carouselData.length);
      
      setProducts(productsData);
      setCategories([{ id: 0, name: 'All' }, ...categoriesData]);
      setSliders(carouselData);
      
      if (productsData.length === 0) {
        Alert.alert('No Products', 'No products found in the database.');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      
      // Load mock data as fallback
      const mockProducts = [
        {
          id: 1,
          name: 'BARBES GALISTAR',
          description: 'High-quality mobile accessory',
          price: 5.00,
          category: { name: 'Mobile' },
          stock: 7,
          image: null
        },
        {
          id: 2,
          name: 'CHARGER TECNO',
          description: 'Fast charging cable for mobile devices',
          price: 15.50,
          category: { name: 'Chargers' },
          stock: 3,
          image: null
        },
        {
          id: 3,
          name: 'AIRPODS IPHONE',
          description: 'Wireless earphones compatible with iPhone',
          price: 45.00,
          category: { name: 'Audio' },
          stock: 2,
          image: null
        },
        {
          id: 4,
          name: 'USB CABLE',
          description: 'Universal USB charging cable',
          price: 8.00,
          category: { name: 'Chargers' },
          stock: 12,
          image: null
        },
        {
          id: 5,
          name: 'PHONE CASE',
          description: 'Protective case for smartphones',
          price: 12.00,
          category: { name: 'Mobile' },
          stock: 8,
          image: null
        },
        {
          id: 6,
          name: 'SCREEN PROTECTOR',
          description: 'Tempered glass screen protector',
          price: 6.50,
          category: { name: 'Mobile' },
          stock: 15,
          image: null
        }
      ];

      const mockCategories = [
        { id: 1, name: 'Mobile' },
        { id: 2, name: 'Chargers' },
        { id: 3, name: 'Audio' }
      ];

      setProducts(mockProducts);
      setCategories([{ id: 0, name: 'All' }, ...mockCategories]);
      
      let errorMessage = 'Using demo data. ';
      if (error.message === 'Request timeout') {
        errorMessage += 'Server connection timed out.';
      } else if (error.code === 'NETWORK_ERROR' || (error.message && error.message.includes('Network Error'))) {
        errorMessage += 'Cannot connect to server.';
      } else {
        errorMessage += 'Server unavailable.';
      }
      
      Alert.alert('Demo Mode', errorMessage + '\n\nTo connect to your backend:\n1. Run: start-server-mobile.bat\n2. Restart the app', [
        { text: 'Retry Connection', onPress: () => loadData() },
        { text: 'Continue with Demo', style: 'cancel' }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product === product.id);
      if (existing) {
        return prev.map(i => 
          i.product === product.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { 
        product: product.id, 
        quantity: 1, 
        product_name: product.name, 
        price: product.price 
      }];
    });
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const goCheckout = async () => {
    const user = await AsyncStorage.getItem('access');
    if (!user) {
      Alert.alert('Login Required', 'Please login to continue shopping', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    navigation.navigate('Cart', { cart, products });
  };

  const filteredProducts = (products || []).filter(product => {
    if (!product || !product.name) return false;
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = selectedCategory === 'All' || 
                           (product.category && product.category.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryGridItems = () => {
    return [
      { name: 'Mobile', icon: '📱' },
      { name: 'Chargers', icon: '🔌' },
      { name: 'Audio', icon: '🎧' },
      { name: 'Electronics', icon: '💻' },
      { name: 'Accessories', icon: '🔧' },
      { name: 'Cables', icon: '🔗' },
      { name: 'Cases', icon: '📦' },
      { name: 'Gaming', icon: '🎮' },
      { name: 'Storage', icon: '💾' },
      { name: 'Camera', icon: '📷' },
    ];
  };

  const renderEnhancedProduct = (item) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.enhancedProductCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlistButton}>
          <Text style={styles.wishlistIcon}>❤️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productCategory}>
          {item.category?.name || 'Electronics'}
        </Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>${Number(item.price || 0).toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addToCartText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
        <Text style={styles.productCategory}>
          {item.category?.name || 'Uncategorized'}
        </Text>
        
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${Number(item.price || 0).toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>E-Commerce Store</Text>
          <Text style={styles.headerSubtitle}>Electronics & Stationery</Text>
        </View>

        {/* Slider Shimmer */}
        <View style={{ height: 200, marginBottom: 16 }}>
          <ShimmerPlaceholder width="100%" height={200} style={{ borderRadius: 0 }} />
        </View>

        {/* Search Bar Shimmer */}
        <View style={styles.searchContainer}>
          <ShimmerPlaceholder width="100%" height={48} style={{ borderRadius: 8 }} />
        </View>

        {/* Categories Shimmer */}
        <CategoryShimmer />

        {/* Products Shimmer */}
        <View style={styles.productsList}>
          <View style={styles.row}>
            <ProductCardShimmer />
            <ProductCardShimmer />
          </View>
          <View style={styles.row}>
            <ProductCardShimmer />
            <ProductCardShimmer />
          </View>
          <View style={styles.row}>
            <ProductCardShimmer />
            <ProductCardShimmer />
          </View>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.modernHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.subtitle}>What are you looking for?</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={goCheckout}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.modernSearchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.modernSearchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Modern Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Welcome to Our Store</Text>
              <Text style={styles.bannerSubtitle}>Discover amazing products at unbeatable prices</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerIcon}>
              <Text style={styles.bannerEmoji}>🎁</Text>
            </View>
          </View>
        </View>

        {/* Promotional Banners */}
        <View style={styles.promoBannersContainer}>
          <View style={styles.promoBannerRow}>
            <TouchableOpacity style={[styles.promoBanner, styles.promoBannerOrange]}>
              <Text style={styles.promoBannerIcon}>🚚</Text>
              <Text style={styles.promoBannerTitle}>Free Shipping</Text>
              <Text style={styles.promoBannerSubtitle}>Buy $129.00 more to get</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.promoBanner, styles.promoBannerPink]}>
              <Text style={styles.promoBannerIcon}>⚡</Text>
              <Text style={styles.promoBannerTitle}>Flash Sale</Text>
              <Text style={styles.promoBannerSubtitle}>View more</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Grid */}
        <View style={styles.categoryGridContainer}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoryGridWrapper}>
            <View style={styles.categoryGrid}>
              {getCategoryGridItems().slice(0, 5).map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.categoryGridItem}
                  onPress={() => setSelectedCategory(item.name)}
                >
                  <View style={styles.categoryIconContainer}>
                    <Text style={styles.categoryGridIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.categoryGridText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.categoryGrid}>
              {getCategoryGridItems().slice(5, 10).map((item, index) => (
                <TouchableOpacity 
                  key={index + 5} 
                  style={styles.categoryGridItem}
                  onPress={() => setSelectedCategory(item.name)}
                >
                  <View style={styles.categoryIconContainer}>
                    <Text style={styles.categoryGridIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.categoryGridText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGridWrapper}>
            <View style={styles.productsGrid}>
              {filteredProducts.slice(0, 2).map((item) => renderEnhancedProduct(item))}
            </View>
            <View style={styles.productsGrid}>
              {filteredProducts.slice(2, 4).map((item) => renderEnhancedProduct(item))}
            </View>
            <View style={styles.productsGrid}>
              {filteredProducts.slice(4, 6).map((item) => renderEnhancedProduct(item))}
            </View>
          </View>
          
          {filteredProducts.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>
                {products?.length === 0 ? 'No products in database' : 'Try adjusting your search or category filter'}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing for Navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Enhanced Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <View style={styles.navIconContainer}>
            <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
          </View>
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>📦</Text>
          </View>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={goCheckout}>
          <View style={styles.cartBadgeContainer}>
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>🛒</Text>
            </View>
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>❤️</Text>
          </View>
          <Text style={styles.navText}>Wishlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>👤</Text>
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modernHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 28,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modernSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#6B7280',
  },
  modernSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  headerIconButton: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  banner: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  bannerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerIcon: {
    marginLeft: 16,
  },
  bannerEmoji: {
    fontSize: 48,
  },
  promoBannersContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  promoBannerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  promoBanner: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  promoBannerOrange: {
    backgroundColor: '#FEF3C7',
  },
  promoBannerPink: {
    backgroundColor: '#FCE7F3',
  },
  promoBannerIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  promoBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  promoBannerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryGridContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryGridWrapper: {
    marginTop: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryGridItem: {
    width: '18%',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryGridIcon: {
    fontSize: 24,
  },
  categoryGridText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  productsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  productsGridWrapper: {
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  enhancedProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistIcon: {
    fontSize: 16,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
  navIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#DBEAFE',
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  productsList: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  cartFooter: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  checkoutButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 50,
    borderRadius: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  cartBadgeContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
