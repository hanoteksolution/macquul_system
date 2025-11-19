import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import api from '../../services/api';
import { addItem } from '../../services/cart';
import { toggleWishlist, isInWishlist } from '../../services/wishlist';
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setIsWishlisted(isInWishlist(res.data.id));
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    addItem({ product: product.id, name: product.name, price: product.price, image_url: product.image_url }, qty);
    router.push('/cart');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product);
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="container py-8 flex-1">
        <div className="mb-6">
          <BackButton />
        </div>
        {loading && <div className="text-gray-500 dark:text-gray-400">Loading...</div>}
        {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />)
                }
              </div>
              <div className="mt-3 flex gap-3">
                <div className="w-20 h-20 rounded-lg border border-gray-100 overflow-hidden">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-primary-700 font-semibold">{product.category?.name}</div>
              <h1 className="text-3xl font-extrabold mt-1">{product.name}</h1>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="mt-4 text-3xl font-bold">${product.price}</div>
              <div className="mt-2 text-sm flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input 
                  type="number" 
                  min={1} 
                  value={qty} 
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))} 
                  className="w-24 rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                />
                <button 
                  disabled={product.stock <= 0} 
                  onClick={addToCart} 
                  className="flex-1 rounded-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 font-medium disabled:bg-gray-300 transition"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-full border transition ${
                    isWishlisted 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'bg-white text-rose-500 border-gray-300 hover:bg-rose-50'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
