import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

const KEY = 'macquul_recently_viewed';
const MAX = 8;

export function useRecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);

  const load = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const track = useCallback((product: Product) => {
    if (typeof window === 'undefined') return;
    setItems((prev) => {
      const next = [product, ...prev.filter((p) => p.id !== product.id)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { items, track, refresh: load };
}
