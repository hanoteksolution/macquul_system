'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ChevronRight, Gift, Truck } from 'lucide-react';
import StoreLayout from '../StoreLayout';
import ShopHero from './ShopHero';
import CategoryNav from './CategoryNav';
import ShopFilters from './ShopFilters';
import ShopToolbar from './ShopToolbar';
import ShopProductCard from './ShopProductCard';
import ProductQuickView from './ProductQuickView';
import ProductStrip from './ProductStrip';
import { useProducts, useCategories } from '@/hooks/use-catalog';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import type { ShopFilterState, ShopSort, ShopView } from './types';

const DEFAULT_FILTERS = (maxPrice: number): ShopFilterState => ({
  search: '',
  sort: 'featured',
  view: 'grid',
  priceMin: 0,
  priceMax: maxPrice,
  inStockOnly: false,
  minRating: 0,
});

function filterProducts(
  products: Product[],
  categoryId: string | undefined,
  filters: ShopFilterState
) {
  let list = [...products];
  if (categoryId) {
    list = list.filter((p) => String(p.category?.id) === String(categoryId));
  }
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category?.name || '').toLowerCase().includes(q)
    );
  }
  if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);
  list = list.filter((p) => Number(p.price) <= filters.priceMax);
  if (filters.sort === 'price-asc') list.sort((a, b) => Number(a.price) - Number(b.price));
  if (filters.sort === 'price-desc') list.sort((a, b) => Number(b.price) - Number(a.price));
  if (filters.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === 'newest') {
    list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  }
  return list;
}

export default function ShopPage() {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { items: recentItems, track: trackView } = useRecentlyViewed();

  const categoryId = router.query.category as string | undefined;

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 500 };
    const prices = products.map((p) => Number(p.price));
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const [filters, setFilters] = useState<ShopFilterState>(() => DEFAULT_FILTERS(priceBounds.max));
  const [mobileFilters, setMobileFilters] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    setFilters((f) => ({ ...f, priceMax: priceBounds.max }));
  }, [priceBounds.max]);

  const filtered = useMemo(
    () => filterProducts(products, categoryId, filters),
    [products, categoryId, filters]
  );

  const suggestions = useMemo(() => {
    if (!filters.search.trim()) return [];
    const q = filters.search.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 6)
      .map((p) => p.name);
  }, [filters.search, products]);

  const trending = useMemo(() => [...products].sort((a, b) => b.stock - a.stock).slice(0, 4), [products]);

  const activeTags = useMemo(() => {
    const tags: { key: string; label: string }[] = [];
    if (categoryId) {
      const cat = categories.find((c) => String(c.id) === String(categoryId));
      if (cat) tags.push({ key: 'cat', label: cat.name });
    }
    if (filters.inStockOnly) tags.push({ key: 'stock', label: 'In stock' });
    if (filters.priceMax < priceBounds.max) {
      tags.push({ key: 'price', label: `Under $${filters.priceMax}` });
    }
    if (filters.search) tags.push({ key: 'q', label: `"${filters.search}"` });
    return tags;
  }, [categoryId, categories, filters, priceBounds.max]);

  const patchFilters = (patch: Partial<ShopFilterState>) => setFilters((f) => ({ ...f, ...patch }));

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS(priceBounds.max));
    router.push('/shop', undefined, { shallow: true });
  };

  const setCategory = (id: string | null) => {
    if (id) router.push(`/shop?category=${id}`, undefined, { shallow: true });
    else router.push('/shop', undefined, { shallow: true });
  };

  return (
    <StoreLayout categories={categories} products={products}>
      <ShopHero categories={categories} products={products} activeCategory={categoryId} />
      <CategoryNav categories={categories} activeId={categoryId} />

      <div className="container-store py-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-900 dark:text-white">Shop</span>
        </nav>
      </div>

      <div className="container-store mb-6 grid gap-4 sm:grid-cols-2">
        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center gap-4 rounded-2xl border border-brand-200/50 bg-gradient-to-r from-brand-50 to-violet-50 p-5 dark:border-brand-800/30 dark:from-brand-950/40 dark:to-violet-950/30"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Truck className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Free shipping over $50</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">On all domestic orders this week</p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center gap-4 rounded-2xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/20"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Gift className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Member rewards</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">Earn points on every purchase</p>
          </div>
        </motion.div>
      </div>

      <div className="container-store pb-20">
        <div className="flex gap-8 lg:gap-10">
          <ShopFilters
            categories={categories}
            categoryId={categoryId}
            filters={filters}
            priceBounds={priceBounds}
            activeTags={activeTags}
            onCategory={setCategory}
            onChange={patchFilters}
            onReset={resetFilters}
            mobileOpen={mobileFilters}
            onMobileClose={() => setMobileFilters(false)}
          />

          <div id="shop-grid" className="min-w-0 flex-1">
            <ShopToolbar
              search={filters.search}
              onSearchChange={(search) => patchFilters({ search })}
              sort={filters.sort}
              onSortChange={(sort) => patchFilters({ sort: sort as ShopSort })}
              view={filters.view}
              onViewChange={(view) => patchFilters({ view: view as ShopView })}
              resultCount={filtered.length}
              suggestions={suggestions}
              onOpenFilters={() => setMobileFilters(true)}
            />

            <motion.div
              layout
              className={cn(
                'grid gap-4 sm:gap-6',
                filters.view === 'grid'
                  ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              )}
            >
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : filtered.map((p, i) => (
                    <ShopProductCard
                      key={p.id}
                      product={p}
                      index={i}
                      view={filters.view}
                      onQuickView={setQuickView}
                      onTrackView={trackView}
                    />
                  ))}
            </motion.div>

            {!isLoading && filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-slate-300 bg-white/50 py-24 text-center dark:border-zinc-700 dark:bg-zinc-900/50"
              >
                <p className="text-lg font-medium text-slate-600 dark:text-zinc-400">
                  No products match your filters.
                </p>
                <Button className="mt-6 rounded-full" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ProductStrip
        title="Trending now"
        subtitle="Popular picks this week"
        products={trending}
        onQuickView={setQuickView}
        onTrackView={trackView}
      />

      {recentItems.length > 0 && (
        <ProductStrip
          title="Recently viewed"
          subtitle="Continue where you left off"
          products={recentItems}
          onQuickView={setQuickView}
          onTrackView={trackView}
        />
      )}

      <ProductQuickView product={quickView} open={!!quickView} onOpenChange={(o) => !o && setQuickView(null)} />
    </StoreLayout>
  );
}
