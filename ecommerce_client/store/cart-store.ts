import { create } from 'zustand';
import type { CartItem, Product } from '@/lib/types';

const KEY = 'cart_items';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('storage'));
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  hydrate: () => void;
  add: (product: Product, qty?: number) => void;
  updateQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  hydrated: false,
  hydrate: () => set({ items: readCart(), hydrated: true }),
  add: (product, qty = 1) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.product === product.id);
    const entry: CartItem = {
      product: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      description: product.description,
      category_name: product.category?.name,
      quantity: qty,
    };
    if (idx >= 0) {
      items[idx].quantity += qty;
      items[idx].description = entry.description ?? items[idx].description;
      items[idx].category_name = entry.category_name ?? items[idx].category_name;
    } else items.push(entry);
    persist(items);
    set({ items });
  },
  updateQty: (productId, qty) => {
    const items = get().items.map((i) => (i.product === productId ? { ...i, quantity: qty } : i));
    persist(items);
    set({ items });
  },
  remove: (productId) => {
    const items = get().items.filter((i) => i.product !== productId);
    persist(items);
    set({ items });
  },
  clear: () => {
    persist([]);
    set({ items: [] });
  },
  count: () => get().items.reduce((s, i) => s + i.quantity, 0),
  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}));
