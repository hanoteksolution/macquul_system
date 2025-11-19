import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import DynamicSlider from "../components/DynamicSlider";
import api from "../services/api";
import { addItem, getCart, total as cartTotal } from "../services/cart";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/products/"), api.get("/categories/")])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const filtered = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category?.id === activeCategory.id);
  }, [products, activeCategory]);

  const addToCart = (p) => {
    const items = addItem(
      { product: p.id, name: p.name, price: p.price, image_url: p.image_url },
      1
    );
    setCart(items);
    router.push("/cart");
  };

  const total = useMemo(() => cartTotal(), [cart]);

  const checkout = async () => {
    try {
      const payload = {
        items: cart.map((i) => ({ product: i.product, quantity: i.quantity })),
      };
      await api.post("/orders/", payload);
      alert("Order placed successfully");
      setCart([]);
    } catch (e) {
      alert(e.response?.data?.detail || "Checkout failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar
        onCategorySelect={setActiveCategory}
        selectedCategory={activeCategory}
      />
      <main className="flex-1">
        {/* Dynamic Slider */}
        <DynamicSlider />

        {/* Category Filter Info */}
        {activeCategory && (
          <section className="container py-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">
                    Showing products in: {activeCategory.name}
                  </h3>
                  {activeCategory.description && (
                    <p className="text-sm text-primary-600 dark:text-primary-300 mt-1">
                      {activeCategory.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        <section id="products" className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeCategory
                ? `${activeCategory.name} Products`
                : "Featured Products"}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </div>
          </div>
          {error && <div className="text-red-600 mb-3">{error}</div>}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
