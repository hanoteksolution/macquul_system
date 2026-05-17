import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useNotify } from '../../contexts/NotifyContext';
import { manualLogout } from '../../services/api';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: HomeIcon },
  { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
  { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, href: '/wishlist' },
  { id: 'downloads', label: 'Downloads', icon: ArrowDownTrayIcon },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'profile', label: 'Profile Settings', icon: Cog6ToothIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
];

function NavButton({ item, active, onSelect }) {
  const Icon = item.icon;
  const base =
    'group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300';

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={clsx(base, 'text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-white/5')}
      >
        <Icon className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
        {item.label}
      </Link>
    );
  }

  const isActive = active === item.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={clsx(
        base,
        isActive
          ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-700 shadow-glow-sm ring-1 ring-emerald-500/25 dark:text-emerald-300'
          : 'text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-white/5'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-glow"
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={clsx('relative h-5 w-5', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-500')} />
      <span className="relative">{item.label}</span>
    </button>
  );
}

export default function DashboardLayout({
  children,
  user,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const { confirm, toast } = useNotify();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    if (
      await confirm('You will be signed out of your account on this device.', {
        title: 'Sign out?',
        variant: 'logout',
        destructive: true,
        confirmLabel: 'Sign out',
        cancelLabel: 'Cancel',
      })
    ) {
      manualLogout();
      router.push('/login');
    }
  };

  const initials = (user?.username || 'U').slice(0, 2).toUpperCase();

  const sidebar = (
    <aside className="flex h-full flex-col">
      <motion.div className="mb-6 rounded-2xl border border-white/50 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
        <motion.span className="flex items-center gap-3">
          <motion.span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-glow-sm">
            {initials}
          </motion.span>
          <motion.span className="min-w-0">
            <motion.span className="block truncate font-semibold text-navy-900 dark:text-white">{user?.username}</motion.span>
            <motion.span className="block truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</motion.span>
          </motion.span>
        </motion.span>
      </motion.div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} active={activeTab} onSelect={(id) => { onTabChange(id); setSidebarOpen(false); }} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );

  return (
    <motion.div className="min-h-screen bg-slate-50/80 dark:bg-navy-950 bg-dashboard-mesh">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-navy-950/80">
        <motion.div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-white/10"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <motion.span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-navy-700 text-sm font-bold text-white">
              C
            </motion.span>
            <motion.span className="hidden font-bold text-navy-900 dark:text-white sm:inline">
              {settings?.siteName || 'CIGAN E-Store'}
            </motion.span>
          </Link>

          <motion.div className="mx-auto hidden max-w-md flex-1 md:block">
            <motion.label className="relative block">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search orders, products..."
                className="w-full rounded-2xl border border-gray-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-navy-900 placeholder:text-gray-400 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </motion.label>
          </motion.div>

          <motion.div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 sm:inline-flex dark:text-emerald-400 dark:hover:bg-emerald-500/10"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Store
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() => toast.info('No new notifications')}
              className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              <motion.span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-950" />
            </button>

            <motion.span ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/80 py-1.5 pl-1.5 pr-2 transition hover:border-emerald-500/30 dark:border-white/10 dark:bg-white/5"
              >
                <motion.span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs font-bold text-white">
                  {initials}
                </motion.span>
                <ChevronDownIcon className="hidden h-4 w-4 text-gray-500 sm:block" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-200/80 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-navy-900"
                  >
                    <li className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
                      <p className="truncate text-sm font-semibold text-navy-900 dark:text-white">{user?.username}</p>
                      <p className="truncate text-xs text-gray-500">{user?.email}</p>
                    </li>
                    <li>
                      <button type="button" onClick={() => { onTabChange('profile'); setUserMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                        Profile settings
                      </button>
                    </li>
                    <li>
                      <Link href="/" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                        Back to store
                      </Link>
                    </li>
                    <li>
                      <button type="button" onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                        Logout
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.span>
          </motion.div>
        </motion.div>
        {onSearchChange && (
          <motion.div className="border-t border-white/40 px-4 py-3 md:hidden dark:border-white/5">
            <label className="relative block">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search orders..."
                className="w-full rounded-2xl border border-gray-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
          </motion.div>
        )}
      </header>

      <motion.div className="flex">
        <motion.aside className="hidden w-72 shrink-0 border-r border-white/60 bg-white/40 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-navy-900/40 lg:block">
          {sidebar}
        </motion.aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-white p-6 shadow-2xl dark:bg-navy-900 lg:hidden"
              >
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="mb-4 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                {sidebar}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 p-4 pb-12 lg:p-8">{children}</main>
      </motion.div>
    </motion.div>
  );
}
