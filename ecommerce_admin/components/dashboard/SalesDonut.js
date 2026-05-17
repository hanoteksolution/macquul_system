import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import ChartContainer from '../ui/ChartContainer';

const CHART_HEIGHT = 260;
const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899'];

export default function SalesDonut({ categoryBreakdown = [], topProducts = [] }) {
  const data = useMemo(() => {
    if (categoryBreakdown?.length) {
      return categoryBreakdown.map((c, i) => ({
        name: c.name,
        value: c.value,
        color: COLORS[i % COLORS.length],
      }));
    }
    if (topProducts?.length) {
      return topProducts.slice(0, 5).map((p, i) => ({
        name: p.name,
        value: p.units_sold,
        color: COLORS[i % COLORS.length],
      }));
    }
    return [{ name: 'No sales yet', value: 1, color: '#cbd5e1' }];
  }, [categoryBreakdown, topProducts]);

  return (
    <Card className="flex flex-col p-6" hover>
      <CardHeader className="shrink-0">
        <CardTitle>Sales breakdown</CardTitle>
        <CardDescription>
          {categoryBreakdown?.length ? 'By category (units sold)' : 'By top products'}
        </CardDescription>
      </CardHeader>
      <ChartContainer height={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT} debounce={50}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={96}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(255,255,255,0.95)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
}
