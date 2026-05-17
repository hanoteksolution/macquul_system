import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

/**
 * Staggered fade-in wrapper for dashboard blocks below metric cards.
 */
export default function DashboardSection({ children, className, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}
