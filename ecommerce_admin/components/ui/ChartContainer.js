/**
 * Fixed-height wrapper for Recharts — avoids ResponsiveContainer + % height resize loops.
 */
export default function ChartContainer({ height = 280, className = '', children }) {
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden ${className}`}
      style={{ height, minHeight: height, maxHeight: height }}
    >
      {children}
    </div>
  );
}
