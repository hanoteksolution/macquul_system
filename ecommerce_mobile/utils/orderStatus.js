export const ORDER_FILTERS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function normalizeStatus(status) {
  return (status || 'pending').toLowerCase();
}

export function getStatusMeta(status) {
  const s = normalizeStatus(status);
  if (s === 'delivered' || s === 'completed') {
    return {
      label: s === 'delivered' ? 'Delivered' : 'Completed',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      icon: 'checkmark-circle',
      gradient: ['#10b981', '#34d399'],
      step: 3,
    };
  }
  if (s === 'processing') {
    return {
      label: 'Processing',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      icon: 'sync',
      gradient: ['#6366f1', '#3b82f6'],
      step: 1,
    };
  }
  if (s === 'shipped') {
    return {
      label: 'Shipped',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.12)',
      icon: 'airplane',
      gradient: ['#8b5cf6', '#6366f1'],
      step: 2,
    };
  }
  if (s === 'cancelled') {
    return {
      label: 'Cancelled',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      icon: 'close-circle',
      gradient: ['#ef4444', '#f87171'],
      step: 0,
    };
  }
  return {
    label: 'Pending',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    icon: 'time',
    gradient: ['#f59e0b', '#fbbf24'],
    step: 0,
  };
}

export function orderMatchesFilter(order, filterId) {
  if (filterId === 'all') return true;
  const s = normalizeStatus(order?.status);
  if (filterId === 'completed') return s === 'completed' || s === 'delivered';
  if (filterId === 'pending') return s === 'pending';
  if (filterId === 'processing') return s === 'processing' || s === 'shipped';
  if (filterId === 'cancelled') return s === 'cancelled';
  return true;
}

export function formatOrderDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatOrderDateTime(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getOrderTotal(order) {
  const direct = parseFloat(order?.total_amount || order?.total || 0);
  if (direct > 0) return direct;
  if (!order?.items?.length) return 0;
  return order.items.reduce((sum, item) => {
    return sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10);
  }, 0);
}

export function getOrderItemCount(order) {
  if (order?.items?.length) return order.items.length;
  return order?.item_count || 0;
}

export function getOrderFilterCounts(orders = []) {
  return ORDER_FILTERS.map((f) => ({
    ...f,
    count: orders.filter((o) => orderMatchesFilter(o, f.id)).length,
  }));
}
