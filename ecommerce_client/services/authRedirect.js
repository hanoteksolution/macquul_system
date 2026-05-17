export const PENDING_CHECKOUT_KEY = 'pendingCheckout';
export const RETURN_URL_KEY = 'authReturnUrl';

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('access'));
}

export function setPendingCheckout(returnUrl = '/cart') {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(PENDING_CHECKOUT_KEY, '1');
  sessionStorage.setItem(RETURN_URL_KEY, returnUrl);
}

export function hasPendingCheckout() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(PENDING_CHECKOUT_KEY) === '1';
}

export function getReturnUrl(fallback = '/') {
  if (typeof window === 'undefined') return fallback;
  const stored = sessionStorage.getItem(RETURN_URL_KEY);
  if (stored && stored.startsWith('/')) return stored;
  return fallback;
}

export function clearAuthRedirect() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  sessionStorage.removeItem(RETURN_URL_KEY);
}

export function getReturnUrlFromQuery(query) {
  const value = query?.returnUrl;
  if (typeof value === 'string' && value.startsWith('/')) return value;
  return null;
}

export function loginUrl(returnUrl = '/cart') {
  return `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
}

export function registerUrl(returnUrl = '/cart') {
  return `/register?returnUrl=${encodeURIComponent(returnUrl)}`;
}

export function redirectAfterAuth(returnUrl) {
  const destination = returnUrl || getReturnUrl('/');
  if (typeof window !== 'undefined') {
    window.location.href = destination;
  }
}
