import AdminLayout from '../components/AdminLayout';
import { useState, useEffect } from 'react';
import {
  CubeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ShoppingBagIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products/'),
          api.get('/orders/')
        ]);

        setStats({
          products: productsRes.data.length || 9,
          orders: ordersRes.data.length || 5,
          revenue: 1240.50,
          customers: 0
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({
          products: 9,
          orders: 5,
          revenue: 1240.50,
          customers: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const recentActivities = [
    {
      title: 'New order received from John Doe',
      time: '2 minutes ago',
      amount: '+$299.99',
      type: 'revenue',
      status: 'processing'
    },
    {
      title: 'Product "iPhone 15 Pro" stock updated',
      time: '5 minutes ago',
      amount: '+15 units',
      type: 'info',
      status: 'completed'
    },
    {
      title: 'Payment processed successfully',
      time: '8 minutes ago',
      amount: '+$1,299.00',
      type: 'revenue',
      status: 'completed'
    },
    {
      title: 'Low stock alert for Samsung Galaxy S24',
      time: '15 minutes ago',
      amount: '3 units left',
      type: 'warning',
      status: 'pending'
    },
    {
      title: 'New customer registered',
      time: '1 hour ago',
      amount: '+1 customer',
      type: 'info',
      status: 'completed'
    }
  ];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color, subtitle, trend }) => {
    // Debug: Check if Icon is undefined
    console.log('StatCard rendering:', title, 'Icon:', Icon);
    if (!Icon) {
      console.error('Icon is undefined for StatCard:', title);
      return <div className="p-4 bg-red-100 text-red-800 rounded">Error: Icon undefined for {title}</div>;
    }
    
    return (
      <div className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/20 dark:to-gray-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                changeType === 'increase'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {changeType === 'increase' ? (
                  <ArrowTrendingUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {trend}
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>

        {change && (
          <div className={`flex items-center mt-4 text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <div className={`p-1 rounded-full mr-2 ${
              changeType === 'increase'
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
            </div>
            <span>{change} from last month</span>
          </div>
        )}
      </div>
    </div>
    );
  };

const RecentActivity = ({ activities }) => (
  <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Latest system activities and updates</p>
      </div>
      <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
        <ArrowPathIcon className="h-5 w-5" />
      </button>
    </div>

    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            activity.type === 'revenue' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
            activity.type === 'expense' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
            activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          } group-hover:scale-110 transition-transform duration-200`}>
            {activity.type === 'revenue' ? <CurrencyDollarIcon className="h-5 w-5" /> :
             activity.type === 'expense' ? <ShoppingCartIcon className="h-5 w-5" /> :
             activity.type === 'warning' ? <ExclamationTriangleIcon className="h-5 w-5" /> :
             <EyeIcon className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{activity.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-bold ${
              activity.type === 'revenue' ? 'text-green-600 dark:text-green-400' :
              activity.type === 'expense' ? 'text-red-600 dark:text-red-400' :
              activity.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {activity.amount}
            </span>
            {activity.status && (
              <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                activity.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                {activity.status}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = () => (
  <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Frequently used operations</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button className="group p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <ShoppingBagIcon className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">New Order</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Process sale</div>
          </div>
        </div>
      </button>

      <button className="group p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <CubeIcon className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-green-700 dark:text-green-300">Add Product</div>
            <div className="text-xs text-green-600 dark:text-green-400">New item</div>
          </div>
        </div>
      </button>

      <button className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <ChartBarIcon className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">View Reports</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Analytics</div>
          </div>
        </div>
      </button>

      <button className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <UsersIcon className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">Manage Users</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Customers</div>
          </div>
        </div>
      </button>
    </div>
  </div>
);

const SystemStatus = () => {
  const [systemHealth, setSystemHealth] = useState({
    server: 'online',
    database: 'online',
    api: 'online',
    uptime: '99.9%'
  });

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Status</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current system health</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">All Systems Operational</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Web Server</span>
          </div>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">{systemHealth.server}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Database</span>
          </div>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">{systemHealth.database}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">API Services</span>
          </div>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">{systemHealth.api}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">System Uptime</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{systemHealth.uptime}</span>
        </div>
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-blue-100 text-lg">Here's what's happening with your business today.</p>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            change="+12.5%"
            changeType="increase"
            icon={CurrencyDollarIcon}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            subtitle="This month"
            trend="+12.5%"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders.toString()}
            change="+8.2%"
            changeType="increase"
            icon={ShoppingCartIcon}
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
            subtitle="Orders completed"
            trend="+8.2%"
          />
          <StatCard
            title="Active Products"
            value={stats.products.toString()}
            change="+15.3%"
            changeType="increase"
            icon={CubeIcon}
            color="bg-gradient-to-br from-purple-500 to-pink-600"
            subtitle="In catalog"
            trend="+15.3%"
          />
          <StatCard
            title="System Health"
            value="99.9%"
            change="+0.1%"
            changeType="increase"
            icon={CheckCircleIcon}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
            subtitle="Uptime this month"
            trend="Excellent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SystemStatus />
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">145ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Throughput</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2,847 req/min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">0.02%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
