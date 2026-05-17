import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { count as wishlistCount } from '../services/wishlist';
import { useNotify } from '../contexts/NotifyContext';
import { computeStats, buildActivityFeed } from '../lib/dashboardUtils';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/dashboard/OrdersTable';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import ProfileSidebarCard from '../components/dashboard/ProfileSidebarCard';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useNotify();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const ordersRes = await api.get('/orders/');
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => computeStats(orders), [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        String(o.id).includes(q) ||
        o.items?.some((i) => i.product_name?.toLowerCase().includes(q)) ||
        o.status?.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  const downloadOrders = useMemo(
    () => orders.filter((o) => o.status === 'delivered'),
    [orders]
  );

  const activities = useMemo(
    () => buildActivityFeed(orders, wishlistCount()),
    [orders]
  );

  const handleViewOrder = (order) => {
    toast.info(`Order #${order.id} — ${order.items?.length || 0} item(s)`);
  };

  const handleDownloadInvoices = () => {
    if (downloadOrders.length === 0) {
      toast.info('No completed orders available for download yet');
      return;
    }
    toast.success(`Preparing ${downloadOrders.length} invoice(s)...`);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const statCards = (
    <motion.div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBagIcon} trend="+12%" accent="blue" delay={0.05} />
      <StatCard label="Pending" value={stats.pendingOrders} icon={ClockIcon} trend={stats.pendingOrders ? 'Active' : 'Clear'} trendUp={false} accent="amber" delay={0.1} />
      <StatCard label="Completed" value={stats.completedOrders} icon={CheckCircleIcon} trend="+8%" accent="emerald" delay={0.15} />
      <StatCard label="Total Spent" value={`$${stats.totalSpent.toFixed(2)}`} icon={CurrencyDollarIcon} trend="Lifetime" accent="violet" delay={0.2} />
      <StatCard label="Downloads" value={stats.downloads} icon={ArrowDownTrayIcon} trend="Ready" accent="navy" delay={0.25} />
      <StatCard label="Reward Points" value={stats.rewardPoints} icon={SparklesIcon} trend="+50 pts" accent="rose" delay={0.3} />
    </motion.div>
  );

  const overviewContent = (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <WelcomeHero user={user} stats={stats} />
      {statCards}
      <motion.div className="grid gap-6 xl:grid-cols-3">
        <motion.div className="xl:col-span-2 space-y-6">
          <OrdersTable
            orders={filteredOrders}
            title="Recent orders"
            compact
            onViewOrder={handleViewOrder}
          />
          <QuickActions onDownloadInvoices={handleDownloadInvoices} />
        </motion.div>
        <motion.div className="space-y-6">
          <ProfileSidebarCard user={user} stats={stats} onEditProfile={() => setActiveTab('profile')} />
          <ActivityTimeline activities={activities} />
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const ordersContent = (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.header>
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Orders</h2>
        <p className="text-gray-500 dark:text-gray-400">Full order history and status tracking</p>
      </motion.header>
      {statCards}
      <OrdersTable orders={filteredOrders} title="All orders" onViewOrder={handleViewOrder} />
    </motion.div>
  );

  const downloadsContent = (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.header>
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Downloads</h2>
        <p className="text-gray-500 dark:text-gray-400">Digital products from completed orders</p>
      </motion.header>
      <OrdersTable
        orders={downloadOrders}
        title="Available downloads"
        emptyMessage="No downloads available yet"
        onViewOrder={handleViewOrder}
      />
    </motion.div>
  );

  const billingContent = (
    <motion.section className="dashboard-card p-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
        <CurrencyDollarIcon className="h-8 w-8" />
      </motion.span>
      <h2 className="mt-4 text-xl font-bold text-navy-900 dark:text-white">Billing & invoices</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        Manage payment methods and download invoices. Total lifetime spend:{' '}
        <strong className="text-emerald-600">${stats.totalSpent.toFixed(2)}</strong>
      </p>
      <button
        type="button"
        onClick={handleDownloadInvoices}
        className="mt-6 rounded-xl bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        Download all invoices
      </button>
    </motion.section>
  );

  const profileContent = (
    <motion.div className="grid gap-6 lg:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="lg:col-span-1">
        <ProfileSidebarCard user={user} stats={stats} onEditProfile={() => {}} />
      </motion.div>
      <motion.section className="dashboard-card lg:col-span-2 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 dark:text-white">Profile settings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your account information</p>
        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success('Profile saved successfully');
          }}
        >
          <motion.div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</span>
              <input
                type="text"
                defaultValue={user?.username}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-navy-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
              <input
                type="email"
                defaultValue={user?.email}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-navy-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">First name</span>
              <input
                type="text"
                defaultValue={user?.first_name}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-navy-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last name</span>
              <input
                type="text"
                defaultValue={user?.last_name}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-navy-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
          </motion.div>
          <motion.div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition hover:from-emerald-500 hover:to-emerald-400"
            >
              Save changes
            </button>
          </motion.div>
        </form>
      </motion.section>
    </motion.div>
  );

  const securityContent = (
    <motion.section className="dashboard-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-navy-900 dark:text-white">Security</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Protect your account</p>
      <motion.ul className="mt-6 space-y-4">
        {[
          { title: 'Password', desc: 'Last changed — use a strong unique password', action: 'Change password' },
          { title: 'Two-factor authentication', desc: 'Add an extra layer of security', action: 'Enable 2FA' },
          { title: 'Active sessions', desc: 'Manage devices logged into your account', action: 'View sessions' },
        ].map((row) => (
          <li
            key={row.title}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <span>
              <span className="font-semibold text-navy-900 dark:text-white">{row.title}</span>
              <span className="mt-0.5 block text-sm text-gray-500">{row.desc}</span>
            </span>
            <button
              type="button"
              onClick={() => toast.info(`${row.action} — coming soon`)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              {row.action}
            </button>
          </li>
        ))}
      </motion.ul>
    </motion.section>
  );

  const tabContent = {
    overview: overviewContent,
    orders: ordersContent,
    downloads: downloadsContent,
    billing: billingContent,
    profile: profileContent,
    security: securityContent,
  };

  return (
    <DashboardLayout
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {tabContent[activeTab] || overviewContent}
    </DashboardLayout>
  );
}
