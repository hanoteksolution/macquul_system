import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlayIcon,
  PauseIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SettingsDemo from '../components/SettingsDemo';
import { useSettings } from '../contexts/SettingsContext';
import api from '../services/api';
import { addItem, getCart, total as cartTotal } from '../services/cart';

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  const [cart, setCart] = useState([]);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel
        const [productsRes, categoriesRes, slidesRes, featuredRes] = await Promise.allSettled([
          api.get('/products/'),
          api.get('/categories/'),
          api.get('/carousel/slides/active/'),
          api.get('/products/featured/')
        ]);
        
        // Handle products
        if (productsRes.status === 'fulfilled') {
          setProducts(productsRes.value.data);
        }
        
        // Handle categories
        if (categoriesRes.status === 'fulfilled') {
          setCategories(categoriesRes.value.data);
        }
        
        // Handle featured products
        const featured = featuredRes.status === 'fulfilled' 
          ? featuredRes.value.data 
          : productsRes.status === 'fulfilled' 
            ? productsRes.value.data.slice(0, 8)
            : [];
        setFeaturedProducts(featured);
        
        // Handle URL category parameter
        if (categoriesRes.status === 'fulfilled') {
          const urlParams = new URLSearchParams(window.location.search);
          const categoryParam = urlParams.get('category');
          if (categoryParam) {
            const category = categoriesRes.value.data.find(cat => 
              cat.name.toLowerCase() === categoryParam.toLowerCase()
            );
            if (category) {
              setActiveCategory(category);
            }
          }
        }
        
      } catch (err) {
        setError('Failed to load data');
        console.error('Data loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Separate effect for carousel slides to prevent hydration issues
  useEffect(() => {
    if (mounted && products.length > 0) {
      const loadCarouselSlides = async () => {
        try {
          const slidesRes = await api.get('/carousel/slides/active/').catch(() => ({ data: [] }));
          
          if (slidesRes.data && slidesRes.data.length > 0) {
            setCarouselSlides(slidesRes.data);
          } else {
            // Create enhanced slides from products - only after mounted
            const topProducts = products.slice(0, 5);
            
            const enhancedSlides = [
              {
                id: 1,
                title: 'Welcome to CIGAN',
                subtitle: 'Discover Premium Electronics & Stationery',
                description: 'Unbeatable prices on laptops, smartphones, notebooks, and everything you need to work smarter.',
                background_color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                text_color: '#ffffff',
                cta_text: 'Explore Now',
                cta_link: '#products',
                image_url: '/api/placeholder/600/400',
                is_featured: true,
                discount: '30% OFF'
              },
              ...topProducts.map((product, index) => ({
                id: index + 2,
                title: product.name,
                subtitle: `Premium ${product.category?.name || 'Product'}`,
                description: product.description || 'High-quality product with excellent features and unmatched performance.',
                background_color: [
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                ][index % 4],
                text_color: '#ffffff',
                cta_text: 'Shop Now',
                cta_link: '#products',
                image_url: product.image_url,
                product: product,
                price: product.price,
                original_price: (product.price * 1.25).toFixed(2),
                discount: '20% OFF',
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(Math.random() * 200) + 50
              }))
            ];
            setCarouselSlides(enhancedSlides);
          }
        } catch (err) {
          console.error('Error loading carousel slides:', err);
        }
      };
      
      loadCarouselSlides();
    }
  }, [mounted, products]);

  useEffect(() => {
    // Only load cart after component is mounted to prevent hydration mismatch
    if (mounted) {
      setCart(getCart());
    }
    
    // Listen for category changes from navbar
    const handleCategoryChange = (event) => {
      const categoryName = event.detail;
      if (categoryName === null) {
        // Clear category filter to show all products
        setActiveCategory(null);
      } else {
        const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        setActiveCategory(category || null);
      }
    };
    
    window.addEventListener('categoryChange', handleCategoryChange);
    return () => window.removeEventListener('categoryChange', handleCategoryChange);
  }, [categories, mounted]);

  // Enhanced auto-slide functionality with play/pause
  useEffect(() => {
    if (carouselSlides.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }, 6000); // Slower transition for better UX
      return () => clearInterval(interval);
    }
  }, [carouselSlides.length, isPlaying]);

  const filtered = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter(p => p.category?.id === activeCategory.id);
  }, [products, activeCategory]);

  const addToCart = (p) => {
    console.log('Add to cart clicked, product:', p);
    if (p && p.id) {
      const items = addItem({ product: p.id, name: p.name, price: p.price, image_url: p.image_url }, 1);
      setCart(items);
      router.push('/cart');
    } else {
      console.error('Invalid product data:', p);
    }
  };

  const total = useMemo(() => {
    // Only calculate total after component is mounted to prevent hydration mismatch
    return mounted ? cartTotal() : 0;
  }, [cart, mounted]);

  const nextSlide = () => {
    console.log('Next slide clicked, current:', currentSlide, 'total:', carouselSlides.length);
    if (carouselSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      setIsPlaying(false); // Pause auto-play when user interacts
      setTimeout(() => setIsPlaying(true), 10000); // Resume after 10 seconds
    }
  };

  const prevSlide = () => {
    console.log('Previous slide clicked, current:', currentSlide, 'total:', carouselSlides.length);
    if (carouselSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 10000);
    }
  };

  const goToSlide = (index) => {
    console.log('Go to slide clicked, index:', index, 'current:', currentSlide);
    if (carouselSlides.length > 0 && index >= 0 && index < carouselSlides.length) {
      setCurrentSlide(index);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 10000);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // Smooth scroll to products section
    document.getElementById('products')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Category icon mapping function
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronic') || name.includes('laptop') || name.includes('computer')) return '💻';
    if (name.includes('phone') || name.includes('mobile')) return '📱';
    if (name.includes('stationery') || name.includes('office')) return '📝';
    if (name.includes('book') || name.includes('notebook')) return '📚';
    if (name.includes('art') || name.includes('craft')) return '🎨';
    if (name.includes('pen') || name.includes('pencil')) return '✏️';
    if (name.includes('bag') || name.includes('backpack')) return '🎒';
    if (name.includes('accessory') || name.includes('cable')) return '🔌';
    return '📦'; // Default icon
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {/* Enhanced Dynamic Carousel Section - Medium Size */}
        <section className="relative overflow-hidden min-h-[50vh] flex items-center" data-version="2025-09-23">
          {loading ? (
            <div className="container mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400">Loading amazing products...</p>
            </div>
          ) : carouselSlides.length > 0 ? (
            <div className="w-full px-4 py-6">
              <div 
                className="relative h-[280px] md:h-[320px] flex items-center transition-all duration-1000 ease-in-out rounded-3xl overflow-hidden mx-auto max-w-7xl"
                style={{ 
                  background: carouselSlides[currentSlide]?.background_color || 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
                  color: carouselSlides[currentSlide]?.text_color || '#ffffff'
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-6 left-6 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-6 right-6 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full blur-xl animate-pulse delay-500"></div>
                </div>

                <div className="container mx-auto px-6 py-8 relative z-10 h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                    {/* Content Side */}
                    <div className="space-y-4">
                      {carouselSlides[currentSlide]?.discount && (
                        <div className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full animate-bounce">
                          🔥 {carouselSlides[currentSlide].discount}
                        </div>
                      )}
                      
                      <h1 className="text-2xl lg:text-3xl font-black leading-tight">
                        {carouselSlides[currentSlide]?.title || 'Special Offers'}
                      </h1>
                      
                      <h2 className="text-base lg:text-lg font-medium opacity-90">
                        {carouselSlides[currentSlide]?.subtitle || 'Limited time deals you don\'t want to miss'}
                      </h2>
                      
                      <p className="text-sm opacity-80 max-w-md">
                        {carouselSlides[currentSlide]?.description || 'Discover amazing products at unbeatable prices'}
                      </p>

                      {/* Price Display for Product Slides - Only after mounted */}
                      {mounted && carouselSlides[currentSlide]?.price && (
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold text-yellow-300">
                            ${carouselSlides[currentSlide].price}
                          </span>
                          {carouselSlides[currentSlide]?.original_price && (
                            <span className="text-xl text-white/60 line-through">
                              ${carouselSlides[currentSlide].original_price}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rating for Product Slides - Only after mounted */}
                      {mounted && carouselSlides[currentSlide]?.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon 
                                key={i} 
                                className={`h-5 w-5 ${
                                  i < Math.floor(carouselSlides[currentSlide].rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-white/30'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm opacity-80">
                            {carouselSlides[currentSlide].rating?.toFixed(1)} ({carouselSlides[currentSlide].reviews} reviews)
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('View Deals clicked, slide:', carouselSlides[currentSlide]);
                            if (carouselSlides[currentSlide]?.product) {
                              addToCart(carouselSlides[currentSlide].product);
                            } else {
                              // If no product, scroll to products section
                              document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          type="button"
                        >
                          <ShoppingCartIcon className="h-4 w-4 group-hover:animate-bounce" />
                          {carouselSlides[currentSlide]?.cta_text || 'View Deals'}
                        </button>
                        
                        <a 
                          href="#categories" 
                          className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white/50 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Browse All
                        </a>
                      </div>
                    </div>

                    {/* Image Side */}
                    <div className="relative lg:flex justify-end">
                      <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500 max-w-sm">
                        {carouselSlides[currentSlide]?.image_url ? (
                          <img 
                            src={carouselSlides[currentSlide].image_url} 
                            alt={carouselSlides[currentSlide].title} 
                            className="w-full h-48 lg:h-56 object-cover" 
                          />
                        ) : (
                          <div className="w-full h-48 lg:h-56 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center text-white/80">
                              <div className="text-3xl mb-2">🎯</div>
                              <div className="text-base font-medium">Special Offers</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Floating Elements */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs animate-bounce">
                          🔥
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="group w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    type="button"
                  >
                    <ChevronLeftIcon className="h-5 w-5 group-hover:scale-125 transition-transform" />
                  </button>
                </div>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="group w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    type="button"
                  >
                    <ChevronRightIcon className="h-5 w-5 group-hover:scale-125 transition-transform" />
                  </button>
                </div>

                {/* Enhanced Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-2">
                    {carouselSlides.map((slide, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          goToSlide(i);
                        }}
                        className={`relative transition-all duration-300 ${
                          i === currentSlide 
                            ? 'w-8 h-2 bg-white rounded-full' 
                            : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
                        }`}
                        type="button"
                      >
                        {i === currentSlide && (
                          <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container mx-auto text-center py-20">
              <h1 className="text-5xl font-bold mb-6" style={{
                background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome to {settings.siteName}
              </h1>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {settings.siteDescription}
              </p>
              <a 
                href="#products" 
                className="inline-flex items-center gap-2 bg-gradient-primary hover:opacity-90 text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <EyeIcon className="h-5 w-5" />
                Shop Now
              </a>
            </div>
          )}
        </section>


        {/* Enhanced Products Section */}
        <section id="products" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeCategory ? (
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(activeCategory.name)}</span>
                      {activeCategory.name}
                    </span>
                  ) : (
                    'Featured Products'
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeCategory 
                    ? `Explore our ${activeCategory.name.toLowerCase()} collection`
                    : 'Discover our handpicked selection of premium products'
                  }
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 lg:mt-0">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  {filtered.length} items available
                </div>
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All Products
                  </button>
                )}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span>⚠️</span>
                  {error}
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 mb-4"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3 mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAdd={addToCart}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={() => toggleWishlist(product.id)}
                    />
                  ))}
                </div>
                
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">
                  {activeCategory ? '🔍' : '📦'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {activeCategory 
                    ? `No products found in ${activeCategory.name}`
                    : 'No products available'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {activeCategory 
                    ? 'Try browsing other categories or check back later for new arrivals.'
                    : 'We\'re working hard to stock our inventory. Please check back soon!'
                  }
                </p>
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-white font-medium rounded-full transition-all duration-300"
                  >
                    <EyeIcon className="h-5 w-5" />
                    Browse All Categories
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <SettingsDemo />
    </div>
  );
}
