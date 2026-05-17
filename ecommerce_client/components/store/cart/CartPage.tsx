'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  LogIn,
} from 'lucide-react';
import StoreLayout from '../StoreLayout';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { useProducts } from '@/hooks/use-catalog';
import { useStorefrontData } from '@/contexts/StorefrontContext';
import { formatPrice, cn } from '@/lib/utils';
import type { CartItem, Product } from '@/lib/types';
import api from '../../../services/api';
import {
  isLoggedIn,
  setPendingCheckout,
  hasPendingCheckout,
  clearAuthRedirect,
  loginUrl,
  registerUrl,
} from '../../../services/authRedirect';
import { useNotify } from '../../../contexts/NotifyContext';

function enrichItems(items: CartItem[], products: Product[]): CartItem[] {
  const map = new Map(products.map((p) => [p.id, p]));
  return items.map((item) => {
    const p = map.get(item.product);
    if (!p) return item;
    return {
      ...item,
      description: item.description || p.description,
      category_name: item.category_name || p.category?.name,
      image_url: item.image_url || p.image_url,
      price: Number(p.price) || item.price,
    };
  });
}

export default function CartPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { toast } = useNotify() as any;
  const storefront = useStorefrontData();
  const { data: products = [] } = useProducts();
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const hydrate = useCartStore((s) => s.hydrate);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const autoCheckoutStarted = useRef(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => setLoggedIn(isLoggedIn()), []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const enriched = useMemo(() => enrichItems(items, products), [items, products]);
  const subtotal = useMemo(
    () => enriched.reduce((s, i) => s + i.price * i.quantity, 0),
    [enriched]
  );
  const itemCount = useMemo(() => enriched.reduce((s, i) => s + i.quantity, 0), [enriched]);
  const freeThreshold = storefront?.header?.free_shipping_threshold ?? 75;
  const shippingProgress = Math.min(100, (subtotal / freeThreshold) * 100);
  const qualifiesFreeShip = subtotal >= freeThreshold;

  const placeOrder = useCallback(async () => {
    const cartItems = useCartStore.getState().items;
    if (cartItems.length === 0) return false;
    await api.post('/orders/', {
      items: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
    });
    clear();
    clearAuthRedirect();
    return true;
  }, [clear]);

  const checkout = async () => {
    if (enriched.length === 0) return;
    if (!isLoggedIn()) {
      setPendingCheckout('/cart');
      router.push(loginUrl('/cart'));
      return;
    }
    try {
      setSubmitting(true);
      setAuthMessage(null);
      await placeOrder();
      toast.success('Order placed successfully! Thank you for shopping with us.');
      router.push('/dashboard');
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { detail?: string } } };
      if (err.response?.status === 401) {
        setPendingCheckout('/cart');
        router.push(loginUrl('/cart'));
        return;
      }
      toast.error(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || autoCheckoutStarted.current) return;
    if (!hasPendingCheckout() || !isLoggedIn() || enriched.length === 0) return;
    autoCheckoutStarted.current = true;
    (async () => {
      try {
        setSubmitting(true);
        setAuthMessage('Completing your order…');
        await placeOrder();
        toast.success('Order placed successfully!');
        router.push('/dashboard');
      } catch (e: unknown) {
        const err = e as { response?: { status?: number; data?: { detail?: string } } };
        if (err.response?.status === 401) {
          setPendingCheckout('/cart');
          router.push(loginUrl('/cart'));
          return;
        }
        setAuthMessage(null);
        toast.error(err.response?.data?.detail || 'Checkout failed.');
        autoCheckoutStarted.current = false;
      } finally {
        setSubmitting(false);
      }
    })();
  }, [router.isReady, enriched.length, placeOrder, router, toast]);

  return (
    <StoreLayout products={products} hideNav={false}>
      <div className="container-store py-8 lg:py-12">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-zinc-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your bag</h1>
            <p className="mt-1 text-slate-600 dark:text-zinc-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · Review before checkout
            </p>
          </div>
          {!loggedIn && enriched.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={loginUrl('/cart')}>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={registerUrl('/cart')}>Create account</Link>
              </Button>
            </div>
          )}
        </div>

        {authMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-200"
          >
            <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
            {authMessage}
          </motion.div>
        )}

        {!hydrated ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-800" />
              ))}
            </div>
            <div className="h-80 animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-800" />
          </div>
        ) : enriched.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/60 py-24 text-center dark:border-zinc-700 dark:bg-zinc-900/40"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand/10">
              <ShoppingBag className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="text-xl font-bold">Your bag is empty</h2>
            <p className="mt-2 max-w-sm text-slate-600 dark:text-zinc-400">
              Discover curated electronics and stationery crafted for a premium experience.
            </p>
            <Button className="mt-8" size="lg" asChild>
              <Link href="/shop">Explore products</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-4 lg:col-span-7 xl:col-span-8">
              <AnimatePresence mode="popLayout">
                {enriched.map((item, i) => (
                  <motion.article
                    key={item.product}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ delay: i * 0.04 }}
                    className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-premium transition hover:shadow-glass-lg dark:border-zinc-800 dark:bg-zinc-900/80"
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                      <Link
                        href={`/product/${item.product}`}
                        className="relative mx-auto h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:mx-0 sm:h-32 sm:w-32"
                      >
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-950 dark:to-violet-950">
                            <ShoppingBag className="h-10 w-10 text-brand-400/50" />
                          </div>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {item.category_name && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                                {item.category_name}
                              </span>
                            )}
                            <Link href={`/product/${item.product}`}>
                              <h3 className="mt-0.5 text-lg font-bold leading-tight hover:text-brand-600">{item.name}</h3>
                            </Link>
                            {item.description && (
                              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.product)}
                            className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-zinc-700 dark:bg-zinc-800/50">
                            <button
                              type="button"
                              className="rounded-l-2xl p-2.5 transition hover:bg-white dark:hover:bg-zinc-700"
                              onClick={() => updateQty(item.product, Math.max(1, item.quantity - 1))}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              className="rounded-r-2xl p-2.5 transition hover:bg-white dark:hover:bg-zinc-700"
                              onClick={() => updateQty(item.product, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">{formatPrice(item.price)} each</p>
                            <p className="text-xl font-bold text-brand-700 dark:text-brand-300">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 space-y-4">
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-glass-lg dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="text-lg font-bold">Order summary</h2>
                  <p className="text-sm text-slate-500">{itemCount} items</p>

                  {!qualifiesFreeShip && (
                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-xs text-slate-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5" />
                          Free shipping at {formatPrice(freeThreshold)}
                        </span>
                        <span>{Math.round(shippingProgress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                        <motion.div
                          className="h-full rounded-full bg-gradient-brand"
                          initial={{ width: 0 }}
                          animate={{ width: `${shippingProgress}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  )}
                  {qualifiesFreeShip && (
                    <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <Truck className="h-4 w-4" />
                      You qualify for free shipping
                    </p>
                  )}

                  <dl className="mt-6 space-y-3 border-t border-slate-100 pt-4 dark:border-zinc-800">
                    <div className="flex justify-between text-sm">
                      <dt className="text-slate-600 dark:text-zinc-400">Subtotal</dt>
                      <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-slate-600 dark:text-zinc-400">Shipping</dt>
                      <dd className={qualifiesFreeShip ? 'font-medium text-emerald-600' : 'text-slate-500'}>
                        {qualifiesFreeShip ? 'Free' : 'At checkout'}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-3 text-lg dark:border-zinc-800">
                      <dt className="font-bold">Total</dt>
                      <dd className="font-bold">{formatPrice(subtotal)}</dd>
                    </div>
                  </dl>

                  {!loggedIn ? (
                    <div className="mt-6 space-y-3">
                      <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-center text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                        <Lock className="mr-1 inline h-3.5 w-3.5" />
                        Sign in or create an account to complete your order
                      </p>
                      <Button className="w-full" size="lg" onClick={checkout} disabled={submitting}>
                        {submitting ? 'Processing…' : 'Sign in to checkout'}
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={registerUrl('/cart')}>Create account</Link>
                      </Button>
                    </div>
                  ) : (
                    <Button className="mt-6 w-full" size="lg" onClick={checkout} disabled={submitting}>
                      {submitting ? 'Placing order…' : 'Complete order'}
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                    Secure checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-brand-600" />
                    SSL encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
