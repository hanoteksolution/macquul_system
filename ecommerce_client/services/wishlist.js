const KEY = 'wishlist_items';

export function getWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function notifyWishlistChange() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('wishlist-updated'));
  } catch {
    /* ignore */
  }
}

export function setWishlist(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
  notifyWishlistChange();
}

export function addToWishlist(product) {
  const items = getWishlist();
  const exists = items.find(i => i.id === product.id);
  if (!exists) {
    items.push(product);
    setWishlist(items);
  }
  return items;
}

export function removeFromWishlist(productId) {
  const items = getWishlist().filter(i => i.id !== productId);
  setWishlist(items);
  return items;
}

export function isInWishlist(productId) {
  return getWishlist().some(i => i.id === productId);
}

export function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    return removeFromWishlist(product.id);
  } else {
    return addToWishlist(product);
  }
}

export function clearWishlist() {
  setWishlist([]);
}

export function count() {
  return getWishlist().length;
}
