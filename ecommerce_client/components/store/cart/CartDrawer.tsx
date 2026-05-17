'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X, ArrowRight, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { isLoggedIn, setPendingCheckout, loginUrl } from '../../../services/authRedirect';

export default function CartDrawer() {
  const router = useRouter();
  const open = useUIStore((s) => s.cartOpen);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const total = useCartStore((s) => s.total);
  const count = useCartStore((s) => s.count);

  const goCheckout = () => {
    setCartOpen(false);
    if (!isLoggedIn()) {
      setPendingCheckout('/cart');
      router.push(loginUrl('/cart'));
      return;
    }
    router.push('/cart');
  };

  return (
    <Dialog.Root open={open} onOpenChange={setCartOpen}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200/80 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-600" />
                <Dialog.Title className="text-lg font-bold">Your bag</Dialog.Title>
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {count()}
                </span>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-zinc-800" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <ShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
                    <p className="font-medium text-slate-600 dark:text-zinc-400">Your bag is empty</p>
                    <Button className="mt-6" onClick={() => setCartOpen(false)} asChild>
                      <Link href="/shop">Continue shopping</Link>
                    </Button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.product}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="mb-4 flex gap-4 rounded-2xl border border-slate-100 p-3 dark:border-zinc-800"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {item.image_url && (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" unoptimized />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        {item.category_name && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{item.category_name}</span>
                        )}
                        <p className="line-clamp-1 font-semibold">{item.name}</p>
                        {item.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-zinc-400">{item.description}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-brand-600">{formatPrice(item.price)}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-zinc-700">
                            <button
                              type="button"
                              className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800"
                              onClick={() => updateQty(item.product, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800"
                              onClick={() => updateQty(item.product, item.quantity + 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-xs text-slate-500 hover:text-rose-500"
                            onClick={() => remove(item.product)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-100 p-6 dark:border-zinc-800">
                {!isLoggedIn() && (
                  <p className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    Sign in to complete your order
                  </p>
                )}
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-lg font-bold">{formatPrice(total())}</span>
                </div>
                <Button className="w-full" size="lg" onClick={goCheckout}>
                  {isLoggedIn() ? 'Review & checkout' : 'Sign in to checkout'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
