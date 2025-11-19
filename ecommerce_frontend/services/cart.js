// Simple cart service using localStorage
// Stored shape: [{ product, name, price, image_url, quantity }]

const KEY = 'cart_items';

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
  // notify listeners (Navbar badge, etc.)
  try { window.dispatchEvent(new Event('storage')); } catch {}
}

export function addItem(item, qty = 1) {
  const items = getCart();
  const idx = items.findIndex(i => i.product === item.product);
  if (idx >= 0) items[idx].quantity += qty;
  else items.push({ ...item, quantity: qty });
  setCart(items);
  return items;
}

export function updateQty(productId, qty) {
  const items = getCart().map(i => i.product === productId ? { ...i, quantity: qty } : i);
  setCart(items);
  return items;
}

export function removeItem(productId) {
  const items = getCart().filter(i => i.product !== productId);
  setCart(items);
  return items;
}

export function clearCart() {
  setCart([]);
}

export function count() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function total() {
  return getCart().reduce((sum, i) => sum + Number(i.price || 0) * i.quantity, 0);
}
