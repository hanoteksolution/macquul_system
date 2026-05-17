import { motion } from 'framer-motion';
import MetricCard from './MetricCard';
import { cn } from '../../lib/cn';

const GRID = {
  2: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
  3: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
};

/**
 * Unified dashboard metric cards with staggered entrance animations.
 */
export default function MetricCardsRow({ metrics = [], columns = 4, className, animate = true }) {
  if (!metrics.length) return null;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
      }}
      className={cn(GRID[columns] || GRID[4], className)}
    >
      {metrics.map((m, i) => (
        <MetricCard
          key={m.id || m.label}
          label={m.label}
          value={m.value}
          numericValue={m.numericValue}
          formatValue={m.formatValue}
          subtitle={m.subtitle}
          trend={m.trend}
          trendUp={m.trendUp}
          icon={m.icon}
          accent={m.accent || 'indigo'}
          delay={m.delay ?? i * 0.08}
          animate={animate}
        />
      ))}
    </motion.div>
  );
}
