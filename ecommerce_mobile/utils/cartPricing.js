export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 3.99;
export const TAX_RATE = 0.08;

export function getShippingProgress(subtotal) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  return { remaining, progress, qualifies: subtotal >= FREE_SHIPPING_THRESHOLD };
}

export function getOrderTotals(subtotal) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { subtotal, shipping, tax, total };
}
