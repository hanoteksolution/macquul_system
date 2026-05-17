import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, Shield } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import AuthAlert from '../components/auth/AuthAlert';
import AuthDivider from '../components/auth/AuthDivider';
import SocialAuthButtons from '../components/auth/SocialAuthButtons';
import api from '../services/api';
import {
  getReturnUrlFromQuery,
  getReturnUrl,
  hasPendingCheckout,
  redirectAfterAuth,
  registerUrl,
  RETURN_URL_KEY,
} from '../services/authRedirect';
import { useNotify } from '../contexts/NotifyContext';

export default function Login() {
  const router = useRouter();
  const { toast } = useNotify();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const returnUrl = useMemo(() => {
    if (!router.isReady) return '/cart';
    return getReturnUrlFromQuery(router.query) || getReturnUrl('/cart');
  }, [router.isReady, router.query]);

  const registerHref = useMemo(() => registerUrl(returnUrl), [returnUrl]);
  const checkoutFlow = hasPendingCheckout() || returnUrl === '/cart';

  useEffect(() => {
    if (!router.isReady) return;
    const fromQuery = getReturnUrlFromQuery(router.query);
    if (fromQuery) sessionStorage.setItem(RETURN_URL_KEY, fromQuery);
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, [router.isReady, router.query]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/login/', { email, password });
      localStorage.setItem('access', res.data.tokens.access);
      localStorage.setItem('refresh', res.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (remember) localStorage.setItem('rememberedEmail', email);
      else localStorage.removeItem('rememberedEmail');
      redirectAfterAuth(returnUrl);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = () => {
    toast.info('Social sign-in will be available soon. Please use email and password.');
  };

  return (
    <AuthLayout
      variant="login"
      title="Welcome back"
      subtitle={
        checkoutFlow
          ? 'Sign in to complete your secure checkout'
          : 'Enter your credentials to access your account'
      }
      footerLink={{
        prompt: "Don't have an account?",
        href: registerHref,
        label: 'Create one',
      }}
    >
      <div className="space-y-5">
        {checkoutFlow && (
          <AuthAlert variant="info">
            Your cart is saved. Sign in or create an account to place your order.
          </AuthAlert>
        )}
        {error && <AuthAlert variant="error">{error}</AuthAlert>}

        <form onSubmit={submit} className="space-y-4" noValidate>
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((p) => ({ ...p, email: '' }));
            }}
            icon={Mail}
            placeholder="you@example.com"
            error={fieldErrors.email}
            required
            autoComplete="email"
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            showToggle
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((p) => ({ ...p, password: '' }));
            }}
            icon={Lock}
            placeholder="••••••••"
            error={fieldErrors.password}
            required
            autoComplete="current-password"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Remember me
            </label>
            <Link
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                toast.info('Password reset will be available soon. Contact support if you need help.');
              }}
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Forgot password?
            </Link>
          </div>

          <AuthButton type="submit" loading={loading}>
            {checkoutFlow ? 'Sign in & continue checkout' : 'Sign in'}
          </AuthButton>
        </form>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
          <Shield className="h-3.5 w-3.5 text-primary-600 shrink-0" />
          <span>Secure login · Credentials encrypted in transit</span>
        </div>

        <AuthDivider />
        <SocialAuthButtons onProviderClick={handleSocial} />

        <Link
          href={registerHref}
          className="flex w-full items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/40 backdrop-blur px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.01]"
        >
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}
