import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, Bars3Icon, HeartIcon, SunIcon, MoonIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { count as cartCount } from '../services/cart';
import { count as wishlistCount } from '../services/wishlist';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { manualLogout } from '../services/api';
import api from '../services/api';
import { useNotify } from '../contexts/NotifyContext';

export default function Navbar() {
  const router = useRouter();
  const { confirm } = useNotify();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const [user, setUser] = useState(null);
  const [badge, setBadge] = useState(0);
  const [wishlistBadge, setWishlistBadge] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    
    const updateCounts = () => {
      setBadge(cartCount());
      setWishlistBadge(wishlistCount());
    };
    
    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, [mounted]);

  // Load categories
  useEffect(() => {
    if (mounted) {
      api.get('/categories/')
        .then(res => setCategories(res.data))
        .catch(err => console.error('Failed to load categories:', err));
    }
  }, [mounted]);

  const logout = async () => {
    if (
      await confirm('You will be signed out of your account on this device.', {
        title: 'Sign out?',
        variant: 'logout',
        destructive: true,
        confirmLabel: 'Sign out',
        cancelLabel: 'Cancel',
      })
    ) {
      manualLogout();
      setUser(null);
    }
  };

  const navigateToCategory = (category) => {
    setShowCategoriesDropdown(false);
    if (router.pathname === '/') {
      // If already on homepage, trigger category change via custom event
      window.dispatchEvent(new CustomEvent('categoryChange', { detail: category }));
    } else {
      // Navigate to homepage with category
      router.push(`/?category=${category}`);
    }
  };

  const navigateToAllCategories = () => {
    setShowCategoriesDropdown(false);
    if (router.pathname === '/') {
      // Clear category filter to show all products
      window.dispatchEvent(new CustomEvent('categoryChange', { detail: null }));
      // Scroll to products section
      document.getElementById('products')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      router.push('/#products');
    }
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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <div className="w-full bg-primary text-white text-xs">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4 opacity-90">
            <span>{settings.contactEmail}</span>
            <span>{settings.contactPhone}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="opacity-90 hover:opacity-100">Follow us</a>
          </div>
        </div>
      </div>

      <nav className="container flex items-center gap-4 py-3">
        <Link href="/" className="text-primary font-extrabold text-2xl tracking-tight">{settings.siteName}</Link>
        <div className="hidden md:flex flex-1">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input placeholder="Search for products..." className="w-full rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 focus:outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--primary-color)' }} />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400">Home</Link>
          <Link href="/dashboard" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400">Dashboard</Link>
          {user?.is_admin && <Link href="/admin" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400">Admin</Link>}
          {user ? (
            <button onClick={logout} className="text-sm font-medium text-white bg-primary hover:opacity-90 rounded-full px-4 py-2">Logout</button>
          ) : (
            <>
              <Link href="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Login"><UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" /></Link>
              <Link href="/register" className="text-sm font-medium text-white bg-primary hover:opacity-90 rounded-full px-4 py-2">Register</Link>
            </>
          )}
          <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Wishlist">
            <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {mounted && wishlistBadge > 0 && <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-rose-500 text-white">{wishlistBadge}</span>}
          </Link>
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Cart">
            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {mounted && badge > 0 && <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-primary text-white">{badge}</span>}
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden" title="Menu"><Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" /></button>
        </div>
      </nav>

      {/* Enhanced Categories Bar */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Categories Label */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-gray-900 dark:text-white text-sm">Categories</span>
              </div>
              
              {/* Dynamic Categories */}
              <div className="hidden lg:flex items-center gap-6">
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => navigateToCategory(category.name.toLowerCase())}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(category.name)}
                    </span>
                    {category.name}
                  </button>
                ))}
                
                {/* All Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-300">🔍</span>
                    All Categories
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showCategoriesDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-4 z-50">
                      <div className="px-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Browse All Categories</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Find exactly what you're looking for</p>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto py-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => navigateToCategory(category.name.toLowerCase())}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
                              {getCategoryIcon(category.name)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {category.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Explore {category.name.toLowerCase()} products
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              →
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="px-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={navigateToAllCategories}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="text-base">🛍️</span>
                          View All Products
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile Categories Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span>🔍</span>
                Categories
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
