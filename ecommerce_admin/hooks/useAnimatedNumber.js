import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 → target with ease-out cubic easing.
 */
export function useAnimatedNumber(target, { duration = 900, enabled = true } = {}) {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled || target == null || Number.isNaN(Number(target))) {
      setValue(Number(target) || 0);
      return;
    }

    const to = Number(target);
    const startAt = performance.now();
    let raf;

    const tick = (now) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(to);
    };

    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled]);

  return value;
}
