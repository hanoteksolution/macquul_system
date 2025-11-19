import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { addItem } from '../../services/cart';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    addItem({ product: product.id, name: product.name, price: product.price, image_url: product.image_url }, qty);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery */}
            <div>
              <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />)
                }
              </div>
              {/* Thumbnails (single image fallback) */}
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

            {/* Info */}
            <div>
              <div className="text-sm text-primary-700 font-semibold">{product.category?.name}</div>
              <h1 className="text-3xl font-extrabold mt-1">{product.name}</h1>
              <div className="mt-2 text-gray-600">{product.description}</div>
              <div className="mt-4 text-3xl font-bold">${product.price}</div>
              <div className="mt-2 text-sm">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>

              <div className="mt-6 flex items-center gap-3">
                <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} className="w-24 rounded-full border border-gray-300 px-4 py-2" />
                <button disabled={product.stock <= 0} onClick={addToCart} className="rounded-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 font-medium disabled:bg-gray-300">Add to Cart</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
