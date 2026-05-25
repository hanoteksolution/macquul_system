'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  Mic,
  Bell,
  ChevronDown,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/lib/types';
import { buildCategoryTree } from '@/lib/category-utils';
import { count as wishlistCount } from '../../../services/wishlist';
import AnnouncementBar from './AnnouncementBar';
import CategoryMegaMenu from './CategoryMegaMenu';
import { useStorefrontData } from '@/contexts/StorefrontContext';

interface StoreHeaderProps {
  categories?: Category[];
  products?: Product[];
}

export default function StoreHeader({ categories = [], products = [] }: StoreHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const { scrollY } = useScroll();
  const cartCount = useCartStore((s) => s.count);
  const hydrated = useCartStore((s) => s.hydrated);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const mobileOpen = useUIStore((s) => s.mobileMenuOpen);
  const setMobileOpen = useUIStore((s) => s.setMobileMenuOpen);
  const megaCat = useUIStore((s) => s.megaMenuCategory);
  const setMegaCat = useUIStore((s) => s.setMegaMenuCategory);
  const categoryTree = buildCategoryTree(categories);
  const storefront = useStorefrontData();
  const siteName = storefront?.header?.site_name || 'Safari Ecommerce';
  const logoUrl = storefront?.header?.logo_url;
  const searchPlaceholder = storefront?.header?.search_placeholder || 'Search products, brands...';
  const navLinks = storefront?.nav_links?.length
    ? storefront.nav_links
    : [
        { id: 0, label: 'Home', href: '/' },
        { id: 1, label: 'Shop', href: '/shop' },
      ];

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 20));

  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch {
      /* ignore */
    }
    const syncWishlist = () => setWishCount(wishlistCount());
    syncWishlist();
    window.addEventListener('wishlist-updated', syncWishlist);
    window.addEventListener('storage', syncWishlist);
    return () => {
      window.removeEventListener('wishlist-updated', syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, []);

  const suggestions = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  const badge = hydrated ? cartCount() : 0;
  const activeMegaCategory = categoryTree.find((c) => String(c.id) === megaCat);

  const closeMegaMenu = () => setMegaCat(null);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <motion.div
        className={cn(
          'glass-nav relative transition-shadow duration-300',
          scrolled && 'shadow-glass-lg',
          megaCat && 'bg-white shadow-lg dark:bg-zinc-950'
        )}
        onMouseLeave={closeMegaMenu}
      >
        <div className="container-store flex h-16 items-center gap-4 lg:h-[72px] lg:gap-8">
          <button
            type="button"
            className="rounded-xl p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={siteName} className="h-9 w-9 rounded-xl object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-sm font-bold text-white shadow-glow-sm">
                {siteName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden font-display text-xl font-bold tracking-tight sm:block">
              {siteName}<span className="gradient-text">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-800"
                target={'open_in_new_tab' in link && link.open_in_new_tab ? '_blank' : undefined}
                rel={'open_in_new_tab' in link && link.open_in_new_tab ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </Link>
            ))}
            {categoryTree.slice(0, 6).map((cat) => {
              const isActive = megaCat === String(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
                  )}
                  onMouseEnter={() => setMegaCat(String(cat.id))}
                  onFocus={() => setMegaCat(String(cat.id))}
                  aria-expanded={isActive}
                  aria-haspopup="true"
                >
                  {cat.name}
                  {(cat.children?.length ?? 0) > 0 && (
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        isActive ? 'rotate-180 text-brand-600' : 'opacity-50'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="relative mx-auto hidden max-w-xl flex-1 md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 rounded-2xl border-0 bg-slate-100/80 pl-11 pr-12 dark:bg-zinc-800/80"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-brand-600 dark:hover:bg-zinc-700"
              aria-label="Voice search"
            >
              <Mic className="h-4 w-4" />
            </button>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-glass-lg dark:border-zinc-700 dark:bg-zinc-900">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-zinc-800"
                    onClick={() => router.push(`/product/${p.id}`)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              href="/wishlist"
              className="relative hidden rounded-xl p-2.5 sm:flex hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>
            <button type="button" className="hidden rounded-xl p-2.5 sm:flex hover:bg-slate-100 dark:hover:bg-zinc-800">
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <ShoppingBag className="h-5 w-5" />
              {badge > 0 && (
                <motion.span
                  layout
                  className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white"
                >
                  {badge}
                </motion.span>
              )}
            </button>
            {user ? (
              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium sm:flex dark:border-zinc-700"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
            ) : (
              <Button size="sm" variant="secondary" className="hidden sm:flex" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>

        {activeMegaCategory && (
          <CategoryMegaMenu
            category={activeMegaCategory}
            categories={categories}
            products={products}
            onNavigate={closeMegaMenu}
          />
        )}
      </motion.div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-950"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="rounded-lg px-3 py-2.5 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {categoryTree.map((parent) => (
              <div key={parent.id}>
                <Link
                  href={`/shop?category=${parent.id}`}
                  className="block rounded-lg px-3 py-2.5 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {parent.name}
                </Link>
                {(parent.children || []).length > 0 && (
                  <div className="mb-2 ml-3 grid gap-1 border-l-2 border-brand-200 pl-3 dark:border-brand-800">
                    {(parent.children || []).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/shop?category=${sub.id}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 dark:text-zinc-300 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {sub.icon && <span className="text-base">{sub.icon}</span>}
                          {sub.name}
                        </span>
                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-40" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
