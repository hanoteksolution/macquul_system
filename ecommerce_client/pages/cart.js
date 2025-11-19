import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { getCart, removeItem, updateQuantity, clearCart } from '../services/cart';
import api from '../services/api';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setItems(getCart());
    const update = () => setItems(getCart());
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  }, [items]);

  const changeQty = (productId, q) => {
    const qty = Math.max(1, q);
    setItems(updateQuantity(productId, qty));
  };

  const remove = (productId) => setItems(removeItem(productId));

  const checkout = async () => {
    try {
      setSubmitting(true);
      const payload = { items: items.map(i => ({ product: i.product, quantity: i.quantity })) };
      await api.post('/orders/', payload);
      clearCart();
      setItems([]);
      alert('Order placed successfully');
    } catch (e) {
      alert(e.response?.data?.detail || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="container py-8 flex-1">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((i) => (
                <div key={i.product} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {i.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{i.name}</div>
                    <div className="text-sm text-gray-500">${i.price}</div>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <button onClick={() => changeQty(i.product, i.quantity - 1)} className="px-3 py-1 rounded-full border">-</button>
                      <input value={i.quantity} onChange={e => changeQty(i.product, Number(e.target.value))} className="w-16 text-center rounded-full border" type="number" min={1} />
                      <button onClick={() => changeQty(i.product, i.quantity + 1)} className="px-3 py-1 rounded-full border">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(Number(i.price || 0) * i.quantity).toFixed(2)}</div>
                    <button onClick={() => remove(i.product)} className="text-sm text-red-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Order Summary</div>
                  <div className="text-sm text-gray-500">{items.length} items</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-gray-600">Subtotal</div>
                  <div className="font-semibold">${total.toFixed(2)}</div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-gray-600">Shipping</div>
                  <div className="text-gray-600">Calculated at checkout</div>
                </div>
                <div className="mt-4 flex items-center justify-between text-lg">
                  <div className="font-bold">Total</div>
                  <div className="font-bold">${total.toFixed(2)}</div>
                </div>
                <button disabled={submitting || items.length === 0} onClick={checkout} className="mt-4 w-full rounded-full bg-primary-600 hover:bg-primary-700 text-white py-3 font-medium disabled:bg-gray-300">{submitting ? 'Placing order...' : 'Checkout'}</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
