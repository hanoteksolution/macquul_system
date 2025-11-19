import { HeartIcon, StarIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toggleWishlist as toggleWishlistService, isInWishlist } from '../services/wishlist';

export default function ProductCard({ product, onAdd }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inStock = product.stock > 0;

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product.id, mounted]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistService(product);
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd?.(product);
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer">
        <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-700">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600" />
          )}
          <button 
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow transition ${
              mounted && isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-rose-500'
            }`}
          >
            <HeartIcon className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 text-xs font-medium shadow border border-gray-100 dark:border-gray-600">
            <span className={`inline-block w-2 h-2 rounded-full ${inStock ? 'bg-primary' : 'bg-gray-400'}`} />
            <span className="text-gray-900 dark:text-gray-100">{inStock ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-primary font-semibold">{product.category?.name || 'Category'}</div>
          <h3 className="mt-1 font-semibold line-clamp-1 text-gray-900 dark:text-white">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className="h-4 w-4" />)}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</div>
          </div>

          <div className="mt-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full rounded-full px-4 py-2 bg-primary hover:opacity-90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-medium transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
