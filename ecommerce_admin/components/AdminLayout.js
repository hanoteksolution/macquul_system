import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  HomeIcon,
  CubeIcon,
  ChartBarIcon,
  CreditCardIcon,
  PhotoIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { manualLogout } from '../services/api';

const NavItem = ({ href, children, icon: Icon, badge }) => {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Link
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
        active
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-md'
      }`}
      href={href}
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 group-hover:scale-110'}`} />
      <span className="font-semibold relative">
        {children}
        {active && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-white/50 to-white/50 rounded-full" />
        )}
      </span>
      {badge && (
        <span className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      manualLogout();
    }
  };

  const getPageTitle = () => {
    switch (router.pathname) {
      case '/': return 'Dashboard Overview';
      case '/products': return 'Products Management';
      case '/orders': return 'Orders Management';
      case '/inventory': return 'Inventory Control';
      case '/finance': return 'Financial Analytics';
      case '/stock': return 'Stock Management';
      case '/pos': return 'Point of Sale';
      case '/carousel': return 'Content Management';
      case '/settings': return 'System Settings';
      default: return 'Admin Panel';
    }
  };

  const getPageDescription = () => {
    switch (router.pathname) {
      case '/': return 'Monitor your business performance and key metrics';
      case '/products': return 'Manage your product catalog and inventory';
      case '/orders': return 'Track and manage customer orders';
      case '/inventory': return 'Monitor stock levels and warehouse operations';
      case '/finance': return 'Analyze revenue, expenses, and profitability';
      case '/stock': return 'Manage stock movements and inventory tracking';
      case '/pos': return 'Process sales and manage transactions';
      case '/carousel': return 'Manage promotional content and banners';
      case '/settings': return 'Configure system settings, users, and site appearance';
      default: return 'Manage your business operations';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex transition-all duration-500">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 ease-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">AdminPro</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">v2.1.0</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4 space-y-3">
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Main Menu</h3>
          </div>
          <NavItem href="/" icon={HomeIcon}>Dashboard</NavItem>
          <NavItem href="/products" icon={CubeIcon}>Products</NavItem>
          <NavItem href="/orders" icon={ShoppingBagIcon}>Orders</NavItem>
          <NavItem href="/inventory" icon={ArchiveBoxIcon}>Inventory</NavItem>
          <NavItem href="/finance" icon={CurrencyDollarIcon}>Finance</NavItem>
          <NavItem href="/stock" icon={ChartBarIcon}>Stock</NavItem>
          <NavItem href="/pos" icon={CreditCardIcon}>POS</NavItem>
          <NavItem href="/carousel" icon={PhotoIcon}>Content</NavItem>

          <div className="mt-8 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">System</h3>
            <NavItem href="/settings" icon={Cog6ToothIcon}>Settings</NavItem>
            <NavItem href="/permissions" icon={ShieldCheckIcon}>Permissions</NavItem>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">Admin User</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@company.com</div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 w-full text-left hover:scale-[1.02]"
            >
              {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
              <span className="font-medium text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left hover:scale-[1.02]"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{getPageDescription()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 shadow-sm"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
                <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse shadow-lg"></span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>

              {/* User Avatar */}
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <UserCircleIcon className="h-9 w-9 text-gray-400 dark:text-gray-500" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Admin</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Online</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gradient-to-br from-transparent via-transparent to-gray-50/30 dark:to-gray-800/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
