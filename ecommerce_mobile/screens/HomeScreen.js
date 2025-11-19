import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
  Image,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions.get('window');

// Shimmer Loading Component
const ShimmerSlider = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startShimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.shimmerSlide}>
        <View style={styles.shimmerContent}>
          <Animated.View style={[styles.shimmerTitle, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.shimmerSubtitle, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.shimmerButton, { opacity: shimmerOpacity }]} />
        </View>
        <Animated.View style={[styles.shimmerEmoji, { opacity: shimmerOpacity }]} />
      </View>
      <View style={styles.slideIndicators}>
        <Animated.View style={[styles.shimmerIndicator, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.shimmerIndicator, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.shimmerIndicator, { opacity: shimmerOpacity }]} />
      </View>
    </View>
  );
};

// Shimmer Products Component
const ShimmerProducts = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startShimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const renderShimmerCard = (index) => (
    <View key={index} style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Animated.View style={[styles.shimmerProductImage, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.shimmerWishlistButton, { opacity: shimmerOpacity }]} />
      </View>
      <View style={styles.productInfo}>
        <Animated.View style={[styles.shimmerProductName, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.shimmerProductCategory, { opacity: shimmerOpacity }]} />
        <View style={styles.productFooter}>
          <Animated.View style={[styles.shimmerProductPrice, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.shimmerAddButton, { opacity: shimmerOpacity }]} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.productsSection}>
      <Text style={styles.sectionTitle}>Products</Text>
      <View style={styles.shimmerProductsGrid}>
        {[0, 1, 2, 3, 4, 5].map(renderShimmerCard)}
      </View>
    </View>
  );
};

// Product Card Component
const ProductCard = ({ product, onPress, onAddToCart, onToggleWishlist, isInWishlist, theme }) => {
  if (!product) return null;
  
  return (
    <TouchableOpacity style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => onPress(product)}>
      <View style={styles.productImageContainer}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.productImage} />
        ) : (
          <View style={[styles.productPlaceholder, { backgroundColor: theme.border }]}>
            <Text style={[styles.productPlaceholderText, { color: theme.textSecondary }]}>📦</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.productWishlistButton, { backgroundColor: theme.background }]} 
          onPress={() => onToggleWishlist(product)}
        >
          <Text style={styles.productWishlistIcon}>
            {isInWishlist ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>{product.name || 'Unnamed Product'}</Text>
        <Text style={[styles.productCategory, { color: theme.textSecondary }]}>{product.category?.name || 'General'}</Text>
        <View style={styles.productFooter}>
          <Text style={[styles.productPrice, { color: theme.primary }]}>${product.price || '0.00'}</Text>
          <TouchableOpacity style={[styles.addToCartButton, { backgroundColor: theme.primary }]} onPress={() => onAddToCart(product)}>
            <Text style={styles.addToCartText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Dynamic Slider Component
const DynamicSlider = ({ banners, loading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners && banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Show shimmer while loading
  if (loading) {
    return <ShimmerSlider />;
  }

  // Show message if no banners available
  if (!banners || banners.length === 0) {
    return (
      <View style={styles.sliderContainer}>
        <View style={styles.emptySlide}>
          <Text style={styles.emptySlideText}>No banners available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      <View style={[styles.slide, { backgroundColor: banners[currentSlide].backgroundColor }]}>
        
        {/* Left Side - Text Content */}
        <View style={styles.slideContent}>
          <Text style={[styles.slideTitle, { color: banners[currentSlide].textColor || '#FFFFFF' }]}>
            {banners[currentSlide].title}
          </Text>
          <Text style={[styles.slideSubtitle, { color: banners[currentSlide].textColor || 'rgba(255,255,255,0.9)' }]}>
            {banners[currentSlide].subtitle}
          </Text>
        </View>
        
        {/* Right Side - Graphics/Image */}
        <View style={styles.slideRightSide}>
          {banners[currentSlide].image_url ? (
            <Image 
              source={{ uri: banners[currentSlide].image_url }} 
              style={styles.slideImage}
            />
          ) : (
            <View style={styles.slideGraphicsContainer}>
              <Text style={styles.slideEmoji}>{banners[currentSlide].emoji}</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Slide Indicators */}
      <View style={styles.slideIndicators}>
        {banners.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.slideIndicator,
              currentSlide === index && styles.activeSlideIndicator
            ]}
            onPress={() => setCurrentSlide(index)}
          />
        ))}
      </View>
    </View>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const icons = {
    'All': '🏪',
    'Mobile': '📱',
    'Chargers': '🔌',
    'Audio': '🎧',
    'Electronics': '💻',
    'Accessories': '🔧',
    'Cables': '🔗',
    'Cases': '📦',
    'Headphones': '🎵',
    'Speakers': '🔊',
    'Tablets': '📱',
    'Laptops': '💻',
    'Gaming': '🎮',
    'Smart Watch': '⌚',
    'Camera': '📷',
    'Storage': '💾',
    'Books': '📚',
    'Art Supplies': '🎨',
  };
  return icons[categoryName] || '📦';
};

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { cart, wishlist, addToCart, addToWishlist, getCartItemCount } = useCart();
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load products and categories first
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/'),
      ]);
      
      const productsData = productsRes.data?.results || productsRes.data || [];
      const categoriesData = categoriesRes.data?.results || categoriesRes.data || [];
      
      setProducts(productsData);
      setCategories([{ id: 0, name: 'All' }, ...categoriesData]);
      setLoading(false);
      
      // Load banners separately (without authentication)
      try {
        console.log('Fetching carousel slides from API...');
        
        // Add a small delay to show shimmer effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a separate axios instance without auth headers for public endpoints
        const publicApi = axios.create({ 
          baseURL: api.defaults.baseURL,
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });
        const bannersRes = await publicApi.get('/carousel/slides/active/');
        const bannersData = bannersRes.data?.results || bannersRes.data || [];
        
        console.log('Banners data received:', bannersData);
        console.log('Number of banners:', bannersData.length);
        
        if (bannersData.length > 0) {
          const finalBanners = bannersData.map(banner => {
            console.log('Processing banner:', banner);
            return {
              id: banner.id,
              title: banner.title || "Special Offer",
              subtitle: banner.subtitle || "Check out our latest deals",
              buttonText: banner.cta_text || "Shop Now",
              emoji: "🎁", // Default emoji since it's not in the model
              backgroundColor: banner.background_color || "#007AFF",
              textColor: banner.text_color || "#FFFFFF",
              image_url: banner.image_url || null,
            };
          });
          setBanners(finalBanners);
          console.log('Final banners set:', finalBanners);
        } else {
          console.log('No active banners found in database');
          setBanners([]);
        }
      } catch (bannersError) {
        console.error('Error loading banners:', bannersError);
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
    if (success) {
      Alert.alert('Success', 'Added to cart!');
    } else {
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (product) => {
    const wasAdded = await addToWishlist(product);
    if (wasAdded) {
      Alert.alert('Added', 'Product added to wishlist!');
    } else {
      Alert.alert('Removed', 'Product removed from wishlist');
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false;
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.scrollView, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        
        {/* Header Section - Clean Design */}
        <View style={[styles.headerSection, { backgroundColor: theme.surface }]}>
          <View style={[styles.searchContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search products..."
              placeholderTextColor={theme.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <TouchableOpacity 
            style={[styles.cartButton, { backgroundColor: theme.background }]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {getCartItemCount() > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>{getCartItemCount()}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.wishlistButton, { backgroundColor: theme.background }]}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Text style={styles.wishlistIcon}>🤍</Text>
            {wishlist.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>{wishlist.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Categories - Horizontal Line Style */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === item.name ? theme.primary : theme.textSecondary }
                ]}>
                  {item.name}
                </Text>
                {selectedCategory === item.name && (
                  <View style={[styles.categoryUnderline, { backgroundColor: theme.primary }]} />
                )}
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          />
        </View>

        {/* Dynamic Slider/Carousel Section */}
        <DynamicSlider banners={banners} loading={bannersLoading} />

        {/* Products Section */}
        {loading ? (
          <ShimmerProducts />
        ) : (
          <View style={styles.productsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Products</Text>
            <FlatList
              data={filteredProducts}
              numColumns={2}
              keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isInWishlist={wishlist.some(wishItem => wishItem.id === item.id)}
                  theme={theme}
                />
              )}
              contentContainerStyle={styles.productsGrid}
              scrollEnabled={false}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  
  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  cartButton: {
    marginRight: 12,
    position: 'relative',
    borderRadius: 20,
    padding: 8,
  },
  cartIcon: {
    fontSize: 20,
  },
  wishlistButton: {
    position: 'relative',
    borderRadius: 20,
    padding: 8,
  },
  wishlistIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Categories Section
  categoriesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    marginRight: 24,
    paddingVertical: 8,
    position: 'relative',
  },
  categoryText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#333333',
    fontWeight: '600',
  },
  categoryUnderline: {
    position: 'absolute',
    bottom: -16,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#007AFF',
  },
  
  // Slider Section
  sliderContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  slide: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  slideContent: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  slideRightSide: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'contain',
  },
  slideGraphicsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  specialOfferBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    textAlign: 'center',
    transform: [{ rotate: '15deg' }],
    marginBottom: 8,
  },
  slideEmoji: {
    fontSize: 36,
    textAlign: 'center',
  },
  slideBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.3,
  },
  slideIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  slideIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  activeSlideIndicator: {
    opacity: 1,
  },
  
  // Empty Slide Styles
  emptySlide: {
    borderRadius: 16,
    padding: 20,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlideText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Shimmer Styles
  shimmerSlide: {
    borderRadius: 16,
    padding: 20,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shimmerContent: {
    flex: 1,
  },
  shimmerTitle: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  shimmerSubtitle: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 16,
    width: '90%',
  },
  shimmerButton: {
    height: 36,
    backgroundColor: '#E0E0E0',
    borderRadius: 18,
    width: 100,
  },
  shimmerEmoji: {
    width: 48,
    height: 48,
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    marginLeft: 16,
  },
  shimmerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  
  // Product Shimmer Styles
  shimmerProductImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  shimmerWishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
  },
  shimmerProductName: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 6,
    width: '80%',
  },
  shimmerProductCategory: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  shimmerProductPrice: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '50%',
  },
  shimmerAddButton: {
    width: 32,
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
  },
  
  // Products Section
  productsSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  productsGrid: {
    paddingBottom: 16,
  },
  shimmerProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  
  // Product Card Styles
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 6,
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
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  productPlaceholder: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productPlaceholderText: {
    fontSize: 32,
  },
  productWishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productWishlistIcon: {
    fontSize: 16,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addToCartButton: {
    width: 32,
    height: 32,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
