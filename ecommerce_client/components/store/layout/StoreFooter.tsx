import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const links = {
  Shop: [
    { label: 'All products', href: '/shop' },
    { label: 'Featured', href: '/#featured' },
    { label: 'Wishlist', href: '/wishlist' },
  ],
  Account: [
    { label: 'Sign in', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Support: [
    { label: 'Contact', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
  ],
};

export default function StoreFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-store py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand font-bold text-white">
                M
              </span>
              <span className="text-xl font-bold">Macquul</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600 dark:text-zinc-400">
              Premium ecommerce experience — curated products, fast delivery, and world-class design.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-brand-500 hover:text-brand-600 dark:border-zinc-700 dark:text-zinc-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold">{title}</h4>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-600 hover:text-brand-600 dark:text-zinc-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-sm text-slate-500 dark:border-zinc-800 sm:flex-row">
          <p>© {new Date().getFullYear()} Macquul. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
