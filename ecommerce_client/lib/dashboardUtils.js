import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

export const STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/30',
  confirmed: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-blue-500/30',
  processing: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-indigo-500/30',
  packed: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-cyan-500/30',
  shipped: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-purple-500/30',
  out_for_delivery: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 ring-orange-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30',
  canceled: 'bg-red-500/15 text-red-700 dark:text-red-300 ring-red-500/30',
  returned: 'bg-gray-500/15 text-gray-700 dark:text-gray-300 ring-gray-500/30',
  refunded: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 ring-pink-500/30',
};

export function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.pending;
}

export function getStatusIcon(status) {
  const icons = {
    pending: ClockIcon,
    confirmed: CheckCircleIcon,
    processing: ClockIcon,
    packed: ShoppingBagIcon,
    shipped: TruckIcon,
    out_for_delivery: TruckIcon,
    delivered: CheckCircleIcon,
    canceled: XCircleIcon,
    returned: XCircleIcon,
    refunded: XCircleIcon,
  };
  return icons[status] || ClockIcon;
}

export function formatStatus(status) {
  return (status || 'pending').replace(/_/g, ' ');
}

export function computeStats(orders = []) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
  const downloads = completedOrders;
  const rewardPoints = Math.floor(totalSpent * 10);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSpent,
    downloads,
    rewardPoints,
  };
}

export function buildActivityFeed(orders = [], wishlistCount = 0) {
  const activities = [];

  orders.slice(0, 8).forEach((order) => {
    const firstItem = order.items?.[0];
    activities.push({
      id: `order-${order.id}`,
      type: order.status === 'delivered' ? 'download' : 'purchase',
      title:
        order.status === 'delivered'
          ? `Order #${order.id} ready for download`
          : `Order #${order.id} placed`,
      description: firstItem?.product_name || 'Digital purchase',
      time: order.created_at,
      amount: order.total_price,
    });
  });

  if (wishlistCount > 0) {
    activities.push({
      id: 'wishlist',
      type: 'wishlist',
      title: 'Wishlist updated',
      description: `${wishlistCount} item${wishlistCount !== 1 ? 's' : ''} saved for later`,
      time: new Date().toISOString(),
    });
  }

  return activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 6);
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
