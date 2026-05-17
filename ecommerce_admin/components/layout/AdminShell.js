import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Sparkles,
  Command,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotify } from '../../contexts/NotifyContext';
import { manualLogout } from '../../services/api';
import { MAIN_NAV, SECONDARY_NAV, getPageMeta } from '../../lib/navigation';
import { cn } from '../../lib/cn';

function NavLink({ item, collapsed, onNavigate }) {
  const router = useRouter();
  const active = router.pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
        active
          ? 'admin-nav-active'
          : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white',
        collapsed && 'justify-center px-2'
      )}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-pill"
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-500 -z-10"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-slate-400 group-hover:text-brand-500')} />
      {!collapsed && <span className={active ? 'text-white' : ''}>{item.label}</span>}
    </Link>
  );
}

export default function AdminShell({ children }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { confirm, toast } = useNotify();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const meta = getPageMeta(router.pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    if (
      await confirm('You will leave the admin dashboard and need to sign in again to continue.', {
        title: 'Sign out?',
        variant: 'logout',
        destructive: true,
        confirmLabel: 'Sign out',
        cancelLabel: 'Stay signed in',
      })
    ) {
      manualLogout();
    }
  };

  const closeMobile = () => setSidebarOpen(false);
  const initials = (user?.username || user?.first_name || 'A').slice(0, 2).toUpperCase();

  const sidebarContent = (
    <>
      <header className={cn('flex items-center gap-3 border-b border-slate-200/50 px-4 py-5 dark:border-white/5', collapsed && 'justify-center px-2')}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-lg font-bold text-white">
          M
        </span>
        {!collapsed && (
          <span className="min-w-0">
            <span className="block truncate text-base font-bold text-slate-900 dark:text-white">Macquul Admin</span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Sparkles className="h-3 w-3 text-brand-500" />
              Enterprise v3.0
            </span>
          </span>
        )}
      </header>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        <span>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main</p>
          )}
          <span className="space-y-1">
            {MAIN_NAV.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={closeMobile} />
            ))}
          </span>
        </span>
        <span>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">System</p>
          )}
          <span className="space-y-1">
            {SECONDARY_NAV.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={closeMobile} />
            ))}
          </span>
        </span>
      </nav>

      <footer className="border-t border-slate-200/50 p-3 dark:border-white/5">
        <span className={cn('admin-card flex items-center gap-3 rounded-2xl p-3', collapsed && 'flex-col')}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-bold text-white">
            {initials}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user?.username || 'Admin'}
              </span>
              <span className="block truncate text-xs text-slate-500">{user?.email || 'admin@macquul.com'}</span>
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'mt-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Sign out'}
        </button>
      </footer>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-label="Close menu"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          'admin-sidebar fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen',
          collapsed ? 'w-[72px]' : 'w-72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <button
          type="button"
          onClick={closeMobile}
          className="absolute right-3 top-5 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <span className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:inline-flex dark:hover:bg-white/10"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="hidden min-w-0 lg:block">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">{meta.title}</span>
              <span className="block truncate text-xs text-slate-500">{meta.description}</span>
            </span>

            <span className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info('Command palette — coming soon')}
                className="hidden items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-500 transition hover:border-brand-500/30 md:flex dark:border-white/10 dark:bg-white/5"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden items-center gap-0.5 rounded-lg bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium lg:inline-flex dark:bg-white/10">
                  <Command className="h-3 w-3" />K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => toast.info('No new notifications')}
                className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-950" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <span ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200/80 py-1 pl-1 pr-2 dark:border-white/10"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand text-xs font-bold text-white">
                    {initials}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <li className="border-b border-slate-100 px-4 py-3 dark:border-white/5">
                        <p className="text-sm font-semibold">{user?.username || 'Admin'}</p>
                        <p className="truncate text-xs text-slate-500">{user?.email}</p>
                      </li>
                      <li>
                        <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5" onClick={() => setUserMenuOpen(false)}>
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button type="button" onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                          Sign out
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </span>
            </span>
          </span>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
          <motion.span
            key={router.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto block max-w-[1600px]"
          >
            {children}
          </motion.span>
        </main>
      </div>
    </div>
  );
}
