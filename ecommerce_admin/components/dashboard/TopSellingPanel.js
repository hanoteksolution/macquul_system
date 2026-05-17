import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import DataTable from '../ui/DataTable';

export default function TopSellingPanel({ products = [], loading }) {
  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
            {row.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-500">
                {row.name?.charAt(0)}
              </div>
            )}
          </div>
          <span className="truncate font-medium text-slate-900 dark:text-white">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'units',
      header: 'Units sold',
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
          <TrendingUp className="h-3.5 w-3.5" />
          {row.units_sold}
        </span>
      ),
    },
    {
      key: 'revenue',
      header: 'Revenue',
      render: (row) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          ${Number(row.revenue).toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <Card className="dashboard-panel flex flex-col p-5 sm:p-6" hover>
      <CardHeader className="mb-4 flex shrink-0 flex-row items-start justify-between gap-3">
        <span>
          <CardTitle>Top selling products</CardTitle>
          <CardDescription>Best performers by units sold</CardDescription>
        </span>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
        >
          Catalog
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No sales data yet."
        getRowKey={(row) => row.product_id}
        compact
        className="flex-1"
      />
    </Card>
  );
}
