import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import ChartContainer from '../ui/ChartContainer';
import { cn } from '../../lib/cn';

const CHART_HEIGHT = 280;

const EMPTY_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name) => ({
  name,
  revenue: 0,
  orders: 0,
}));

export default function RevenueChart({ weekData, monthData }) {
  const [range, setRange] = useState('week');

  const data = useMemo(() => {
    if (range === 'week') {
      const w = weekData?.length ? weekData : EMPTY_WEEK;
      return w.map((d) => ({ name: d.name, revenue: d.revenue ?? 0, orders: d.orders ?? 0 }));
    }
    const m = monthData?.length
      ? monthData
      : [
          { name: 'W1', revenue: 0, orders: 0 },
          { name: 'W2', revenue: 0, orders: 0 },
          { name: 'W3', revenue: 0, orders: 0 },
          { name: 'W4', revenue: 0, orders: 0 },
        ];
    return m.map((d) => ({ name: d.name, revenue: d.revenue ?? 0, orders: d.orders ?? 0 }));
  }, [range, weekData, monthData]);

  const hasData = data.some((d) => d.revenue > 0);

  return (
    <Card className="flex flex-col p-6" hover>
      <CardHeader className="flex shrink-0 flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle>Revenue analytics</CardTitle>
          <CardDescription>
            {hasData ? 'Live sales from your orders' : 'Sales performance over time'}
          </CardDescription>
        </div>
        <div className="flex rounded-2xl border border-slate-200/80 p-1 dark:border-white/10">
          {['week', 'month'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition',
                range === r
                  ? 'bg-gradient-brand text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <ChartContainer height={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT} debounce={50}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 8px 32px rgba(15,23,42,0.1)',
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
}
