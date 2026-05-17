import { useEffect, useState, useMemo } from 'react';

import dynamic from 'next/dynamic';

import AdminLayout from '../components/AdminLayout';

import MetricCardsRow from '../components/ui/MetricCardsRow';
import DashboardSection from '../components/ui/DashboardSection';

import ActivityFeed from '../components/dashboard/ActivityFeed';

import QuickActions from '../components/dashboard/QuickActions';

import LatestOrdersPanel from '../components/dashboard/LatestOrdersPanel';

import TopSellingPanel from '../components/dashboard/TopSellingPanel';

import { DashboardPageSkeleton } from '../components/ui/Skeleton';

import api from '../services/api';

import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';



const chartLoading = (h) => () => (

  <div className="admin-card animate-pulse rounded-3xl" style={{ height: h }} />

);



const RevenueChart = dynamic(() => import('../components/dashboard/RevenueChart'), {

  ssr: false,

  loading: chartLoading(380),

});



const SalesDonut = dynamic(() => import('../components/dashboard/SalesDonut'), {

  ssr: false,

  loading: chartLoading(360),

});



function timeAgo(iso) {

  if (!iso) return '';

  const diff = Date.now() - new Date(iso).getTime();

  const mins = Math.floor(diff / 60000);

  if (mins < 1) return 'Just now';

  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;

}



function ordersToActivities(orders) {

  return orders.slice(0, 5).map((o) => ({

    title: `Order #${o.id} — ${o.customer_name || 'Customer'}`,

    time: timeAgo(o.created_at),

    amount: `+$${Number(o.total_price).toFixed(2)}`,

    type: 'revenue',

    status: o.status === 'delivered' ? 'completed' : o.status === 'pending' ? 'pending' : 'processing',

  }));

}



export default function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    let cancelled = false;



    const load = async () => {

      try {

        const res = await api.get('/orders/dashboard/');

        if (!cancelled) setDashboard(res.data);

      } catch (e) {

        console.error('Dashboard load failed', e);

        if (!cancelled) {

          try {

            const [productsRes, ordersRes] = await Promise.all([

              api.get('/products/'),

              api.get('/orders/'),

            ]);

            const orders = ordersRes.data || [];

            const revenue = orders.reduce((s, o) => s + Number(o.total_price || 0), 0);

            setDashboard({

              stats: {

                products: productsRes.data?.length ?? 0,

                orders: orders.length,

                revenue,

              },

              recent_orders: orders.slice(0, 10).map((o) => ({

                id: o.id,

                customer_name: o.customer_name,

                customer_email: o.customer_email,

                total_price: o.total_price,

                status: o.status,

                created_at: o.created_at,

                item_count: o.items?.length ?? 0,

                preview: o.items?.[0]?.product_name ?? '—',

              })),

              top_products: [],

              revenue_week: [],

              revenue_month: [],

            });

          } catch {

            setDashboard({

              stats: { products: 0, orders: 0, revenue: 0 },

              recent_orders: [],

              top_products: [],

              revenue_week: [],

              revenue_month: [],

            });

          }

        }

      } finally {

        if (!cancelled) setLoading(false);

      }

    };



    load();

    return () => {

      cancelled = true;

    };

  }, []);



  const stats = dashboard?.stats ?? { products: 0, orders: 0, revenue: 0 };

  const activities = useMemo(

    () => ordersToActivities(dashboard?.recent_orders ?? []),

    [dashboard?.recent_orders]

  );



  if (loading) {

    return (

      <AdminLayout>

        <DashboardPageSkeleton />

      </AdminLayout>

    );

  }



  return (

    <AdminLayout>

      <div className="space-y-6">

        <MetricCardsRow
          metrics={[
            {
              label: 'Total revenue',
              numericValue: Number(stats.revenue),
              formatValue: (n) => `$${n.toFixed(2)}`,
              value: `$${Number(stats.revenue).toFixed(2)}`,
              subtitle: 'All time from orders',
              icon: DollarSign,
              accent: 'emerald',
            },
            {
              label: 'Total orders',
              numericValue: stats.orders,
              value: String(stats.orders),
              subtitle: 'Orders in system',
              icon: ShoppingCart,
              accent: 'indigo',
            },
            {
              label: 'Active products',
              numericValue: stats.products,
              value: String(stats.products),
              subtitle: 'In catalog',
              icon: Package,
              accent: 'violet',
            },
            {
              label: 'Top seller units',
              numericValue: dashboard?.top_products?.[0]?.units_sold ?? 0,
              value: String(dashboard?.top_products?.[0]?.units_sold ?? 0),
              subtitle: dashboard?.top_products?.[0]?.name ?? 'No sales yet',
              icon: TrendingUp,
              accent: 'cyan',
            },
          ]}
        />

        <DashboardSection delay={0.2} className="grid items-start gap-6 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">

            <RevenueChart

              weekData={dashboard?.revenue_week}

              monthData={dashboard?.revenue_month}

            />

          </div>

          <div className="min-w-0">

            <SalesDonut
              categoryBreakdown={dashboard?.category_breakdown}
              topProducts={dashboard?.top_products}
            />

          </div>

        </DashboardSection>

        <DashboardSection delay={0.35} className="grid items-stretch gap-6 lg:grid-cols-2">

          <LatestOrdersPanel orders={dashboard?.recent_orders ?? []} loading={false} />

          <TopSellingPanel products={dashboard?.top_products ?? []} loading={false} />

        </DashboardSection>

        <DashboardSection delay={0.45} className="grid items-start gap-6 lg:grid-cols-3">

          <QuickActions />

          <div className="min-w-0 lg:col-span-2">

            <ActivityFeed activities={activities} />

          </div>

        </DashboardSection>

      </div>

    </AdminLayout>

  );

}


