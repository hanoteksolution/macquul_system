import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  getCart,
  updateQty,
  removeItem,
  clearCart,
  total as cartTotal,
} from "../services/cart";

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
    const update = () => setItems(getCart());
    // Keep in sync if another tab modifies cart
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  const total = useMemo(() => cartTotal(), [items]);

  const changeQty = (productId, q) => {
    const qty = Math.max(1, q);
    setItems(updateQty(productId, qty));
  };

  const remove = (productId) => setItems(removeItem(productId));

  const checkout = () => {
    // Check if user is authenticated
    const token = localStorage.getItem("access");
    if (!token) {
      // Store the current page to redirect back after login
      localStorage.setItem("redirectAfterLogin", "/checkout");
      window.location.href = "/login";
      return;
    }

    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Your Cart
        </h1>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/#products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                <svg
                  className="mr-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Shop Now
              </a>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  className="mr-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Back to Home
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((i) => (
                <div
                  key={i.product}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                    {i.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={i.image_url}
                        alt={i.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-gray-900 dark:text-white">
                      {i.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${i.price}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <button
                        onClick={() => changeQty(i.product, i.quantity - 1)}
                        className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        -
                      </button>
                      <input
                        value={i.quantity}
                        onChange={(e) =>
                          changeQty(i.product, Number(e.target.value))
                        }
                        className="w-16 text-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        type="number"
                        min={1}
                      />
                      <button
                        onClick={() => changeQty(i.product, i.quantity + 1)}
                        className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      ${(Number(i.price || 0) * i.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => remove(i.product)}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {items.length} items
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ${total.toFixed(2)}
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Calculated at checkout
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-lg">
                  <div className="font-bold text-gray-900 dark:text-white">
                    Total
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    ${total.toFixed(2)}
                  </div>
                </div>
                <button
                  disabled={items.length === 0}
                  onClick={checkout}
                  className="mt-4 w-full rounded-full bg-primary-600 hover:bg-primary-700 text-white py-3 font-medium disabled:bg-gray-300"
                >
                  Checkout
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
