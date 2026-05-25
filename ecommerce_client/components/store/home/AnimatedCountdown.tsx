'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function useCountdown(endAt?: string) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0, total: 0, max: 1 });

  useEffect(() => {
    const tick = () => {
      const end = endAt ? new Date(endAt).getTime() : Date.now() + 6 * 3600 * 1000;
      const max = Math.max(end - (Date.now() - 6 * 3600 * 1000), 6 * 3600 * 1000);
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        total: diff,
        max: endAt ? end - new Date(endAt).getTime() + diff : 6 * 3600 * 1000,
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endAt]);

  return time;
}

function DigitBox({ value, label, compact }: { value: number; label: string; compact?: boolean }) {
  const display = String(value).padStart(2, '0');

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl',
        compact ? 'min-w-[3.25rem] px-2 py-2 sm:min-w-[3.75rem]' : 'min-w-[4.25rem] px-3 py-3 sm:min-w-[5.25rem] sm:px-4 sm:py-4 rounded-2xl'
      )}
      whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.35)' }}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
      <div className={cn('relative flex items-center justify-center overflow-hidden', compact ? 'h-7 sm:h-8' : 'h-10 sm:h-12')}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={cn(
              'font-display font-bold tabular-nums tracking-tight text-white',
              compact ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'
            )}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-rose-200/70 sm:text-[10px]">
        {label}
      </span>
      <motion.span
        className="absolute -inset-px rounded-2xl ring-1 ring-rose-400/20"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

interface AnimatedCountdownProps {
  endAt?: string;
  className?: string;
  showProgress?: boolean;
  compact?: boolean;
}

export default function AnimatedCountdown({
  endAt,
  className,
  showProgress = true,
  compact = false,
}: AnimatedCountdownProps) {
  const time = useCountdown(endAt);
  const progress = Math.min(100, Math.max(0, 100 - (time.total / (6 * 3600 * 1000)) * 100));

  return (
    <div className={cn('group', className)}>
      <div className={cn('flex items-center', compact ? 'gap-1.5' : 'gap-2 sm:gap-3')}>
        <DigitBox value={time.h} label="Hours" compact={compact} />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className={cn('font-light text-rose-300/80', compact ? 'pb-4 text-lg' : 'pb-6 text-2xl')}
        >
          :
        </motion.span>
        <DigitBox value={time.m} label="Min" compact={compact} />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          className={cn('font-light text-rose-300/80', compact ? 'pb-4 text-lg' : 'pb-6 text-2xl')}
        >
          :
        </motion.span>
        <DigitBox value={time.s} label="Sec" compact={compact} />
      </div>
      {showProgress && (
        <div className={compact ? 'mt-3' : 'mt-6'}>
          <motion.div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/45">
            <span>Sale ending</span>
            <span className="text-rose-300">{Math.round(progress)}% left</span>
          </motion.div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500"
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
