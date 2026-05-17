'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Grid3X3, Heart, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';

const items = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/shop', icon: Grid3X3, label: 'Shop' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { cart: true, icon: ShoppingBag, label: 'Bag' },
  { href: '/dashboard', icon: User, label: 'Account' },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const count = useCartStore((s) => s.count);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 px-2 py-2 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90 lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const active = item.href && router.pathname === item.href;
          const Icon = item.icon;
          if (item.cart) {
            return (
              <button
                key="cart"
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex flex-col items-center gap-0.5 p-2 text-slate-500"
              >
                <Icon className="h-5 w-5" />
                {count() > 0 && (
                  <span className="absolute -right-0.5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
                    {count()}
                  </span>
                )}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex flex-col items-center gap-0.5 p-2',
                active ? 'text-brand-600' : 'text-slate-500'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
