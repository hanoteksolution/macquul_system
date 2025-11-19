import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import { addItem } from '../services/cart';
import { getWishlist } from '../services/wishlist';
import { useRouter } from 'next/router';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setWishlistItems(getWishlist());
    
    const updateWishlist = () => setWishlistItems(getWishlist());
    window.addEventListener('storage', updateWishlist);
    return () => window.removeEventListener('storage', updateWishlist);
  }, []);

  const addToCart = (product) => {
    addItem({ product: product.id, name: product.name, price: product.price, image_url: product.image_url }, 1);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="container py-8 flex-1">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-gray-400 mb-4">Your wishlist is empty</div>
            <a href="/" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wishlistItems.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
