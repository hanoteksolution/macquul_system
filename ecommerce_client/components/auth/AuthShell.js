import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Truck,
  Star,
  Moon,
  Sun,
  ArrowLeft,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

const heroContent = {
  login: {
    badge: 'Welcome back',
    title: 'Shop smarter with Safari Ecommerce',
    description:
      'Access your orders, wishlist, and personalized deals in a secure, premium shopping experience.',
    features: [
      { icon: Truck, text: 'Fast, tracked delivery' },
      { icon: ShieldCheck, text: 'Bank-grade secure checkout' },
      { icon: Star, text: 'Exclusive member offers' },
    ],
  },
  register: {
    badge: 'Join Safari Ecommerce',
    title: 'Start your premium shopping journey',
    description:
      'Create an account in seconds and unlock seamless checkout, order history, and curated collections.',
    features: [
      { icon: ShoppingBag, text: 'One-click reordering' },
      { icon: Sparkles, text: 'Personalized recommendations' },
      { icon: ShieldCheck, text: 'Protected payments' },
    ],
  },
};

export default function AuthShell({
  variant = 'login',
  title,
  subtitle,
  footerLink,
  children,
}) {
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const siteName = settings?.siteName || 'Safari Ecommerce';
  const hero = heroContent[variant] || heroContent.login;

  return (
    <div className="min-h-screen auth-mesh relative overflow-hidden flex flex-col">
      <motion.div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-5">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow-sm transition-transform group-hover:scale-105">
            <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{siteName}</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-900/50 backdrop-blur p-2.5 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-2 lg:px-8 lg:pb-16">
        <div className="grid flex-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col justify-between rounded-3xl border border-white/40 dark:border-gray-800/60 bg-white/40 dark:bg-gray-900/30 backdrop-blur-xl p-10 shadow-2xl shadow-primary-900/5"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 dark:border-primary-800/50 bg-primary-50/80 dark:bg-primary-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
                <Sparkles className="h-3.5 w-3.5" />
                {hero.badge}
              </span>
              <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {hero.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-md">
                {hero.description}
              </p>
              <ul className="mt-10 space-y-4">
                {hero.features.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100/80 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-gray-50/80 to-white/50 dark:from-gray-800/50 dark:to-gray-900/30 p-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['EL', 'ST', 'PR'].map((initials) => (
                    <span
                      key={initials}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-primary-400 to-emerald-500 text-xs font-bold text-white"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Trusted by shoppers</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Electronics · Stationery · More</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 lg:hidden">
                {hero.badge}
              </p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>

            <div
              className={cn(
                'rounded-3xl border border-white/60 dark:border-gray-800/80',
                'bg-white/75 dark:bg-gray-900/60 backdrop-blur-xl',
                'shadow-xl shadow-gray-200/50 dark:shadow-none',
                'p-6 sm:p-8'
              )}
            >
              {children}
            </div>

            {footerLink && (
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {footerLink.prompt}{' '}
                <Link
                  href={footerLink.href}
                  className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 underline-offset-4 hover:underline transition-colors"
                >
                  {footerLink.label}
                </Link>
              </p>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-600" aria-hidden />
              <span>256-bit SSL encrypted · Your data is protected</span>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-gray-500 dark:text-gray-600">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </footer>
    </div>
  );
}
