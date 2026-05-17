import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import DataTable, { DataTableLink } from '../ui/DataTable';
import { Badge } from '../ui/Badge';

const STATUS_VARIANT = {
  pending: 'warning',
  confirmed: 'processing',
  processing: 'processing',
  packed: 'processing',
  shipped: 'processing',
  out_for_delivery: 'processing',
  delivered: 'success',
  canceled: 'default',
  returned: 'default',
  refunded: 'default',
};

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LatestOrdersPanel({ orders = [], loading }) {
  const columns = [
    {
      key: 'id',
      header: 'Order',
      render: (row) => <DataTableLink href={`/orders`}>#{row.id}</DataTableLink>,
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900 dark:text-white">{row.customer_name || '—'}</p>
          <p className="truncate text-xs text-slate-500">{row.customer_email}</p>
        </div>
      ),
    },
    {
      key: 'preview',
      header: 'Items',
      className: 'hidden sm:table-cell',
      render: (row) => (
        <span className="text-slate-600 dark:text-slate-400">
          {row.item_count} · {row.preview}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (row) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          ${Number(row.total_price).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || 'default'}>
          {row.status?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'created',
      header: 'Date',
      className: 'hidden md:table-cell',
      render: (row) => <span className="text-slate-500">{formatDate(row.created_at)}</span>,
    },
  ];

  return (
    <Card className="dashboard-panel flex flex-col p-5 sm:p-6" hover>
      <CardHeader className="mb-4 flex shrink-0 flex-row items-start justify-between gap-3">
        <span>
          <CardTitle>Latest orders</CardTitle>
          <CardDescription>Most recent customer purchases</CardDescription>
        </span>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage="No orders yet. Sales will appear here."
        compact
        className="flex-1"
      />
    </Card>
  );
}
