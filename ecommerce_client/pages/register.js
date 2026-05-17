import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, User } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import AuthAlert from '../components/auth/AuthAlert';
import AuthDivider from '../components/auth/AuthDivider';
import SocialAuthButtons from '../components/auth/SocialAuthButtons';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import api from '../services/api';
import {
  getReturnUrlFromQuery,
  getReturnUrl,
  hasPendingCheckout,
  redirectAfterAuth,
  loginUrl,
  RETURN_URL_KEY,
} from '../services/authRedirect';
import { useNotify } from '../contexts/NotifyContext';

export default function Register() {
  const router = useRouter();
  const { toast } = useNotify();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const returnUrl = useMemo(() => {
    if (!router.isReady) return '/cart';
    return getReturnUrlFromQuery(router.query) || getReturnUrl('/cart');
  }, [router.isReady, router.query]);

  const loginHref = useMemo(() => loginUrl(returnUrl), [returnUrl]);
  const checkoutFlow = hasPendingCheckout() || returnUrl === '/cart';

  useEffect(() => {
    if (!router.isReady) return;
    const fromQuery = getReturnUrlFromQuery(router.query);
    if (fromQuery) sessionStorage.setItem(RETURN_URL_KEY, fromQuery);
  }, [router.isReady, router.query]);

  const passwordsMatch = password && passwordConfirm && password === passwordConfirm;
  const passwordMismatch = touched.confirm && passwordConfirm && !passwordsMatch;

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!username.trim()) errs.username = 'Username is required';
    else if (username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Use at least 8 characters';
    if (password !== passwordConfirm) errs.confirm = 'Passwords do not match';
    if (!acceptedTerms) errs.terms = 'You must accept the terms to continue';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setTouched({ fullName: true, email: true, username: true, password: true, confirm: true, terms: true });
    if (!validate()) return;

    const parts = fullName.trim().split(/\s+/);
    const payload = {
      email,
      username,
      first_name: parts[0] || '',
      last_name: parts.slice(1).join(' ') || '',
      password,
      password_confirm: passwordConfirm,
    };

    setLoading(true);
    try {
      const res = await api.post('/auth/register/', payload);
      localStorage.setItem('access', res.data.tokens.access);
      localStorage.setItem('refresh', res.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      redirectAfterAuth(returnUrl);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.detail ||
          data?.email?.[0] ||
          data?.username?.[0] ||
          'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = () => {
    toast.info('Social sign-up will be available soon. Please register with email.');
  };

  return (
    <AuthLayout
      variant="register"
      title="Create your account"
      subtitle={
        checkoutFlow
          ? 'Join Macquul to complete your order in seconds'
          : 'Premium shopping starts with a free account'
      }
      footerLink={{
        prompt: 'Already have an account?',
        href: loginHref,
        label: 'Sign in',
      }}
    >
      <div className="space-y-5">
        {checkoutFlow && (
          <AuthAlert variant="info">
            Your cart is saved. After registering, you will return to checkout automatically.
          </AuthAlert>
        )}
        {error && <AuthAlert variant="error">{error}</AuthAlert>}

        <form onSubmit={submit} className="space-y-4" noValidate>
          <AuthInput
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setFieldErrors((p) => ({ ...p, fullName: '' }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
            icon={User}
            placeholder="Jane Doe"
            error={fieldErrors.fullName}
            success={touched.fullName && fullName.trim().length > 1}
            required
            autoComplete="name"
          />
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((p) => ({ ...p, email: '' }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            icon={Mail}
            placeholder="you@example.com"
            error={fieldErrors.email}
            success={touched.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            required
            autoComplete="email"
          />
          <AuthInput
            id="username"
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setFieldErrors((p) => ({ ...p, username: '' }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, username: true }))}
            icon={User}
            placeholder="janedoe"
            hint="Public display name on your profile"
            error={fieldErrors.username}
            success={touched.username && username.length >= 3}
            required
            autoComplete="username"
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
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            icon={Lock}
            placeholder="Min. 8 characters"
            error={fieldErrors.password}
            required
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={password} />
          <AuthInput
            id="password_confirm"
            label="Confirm password"
            type="password"
            showToggle
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
              setFieldErrors((p) => ({ ...p, confirm: '' }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
            icon={Lock}
            placeholder="Repeat password"
            error={fieldErrors.confirm || (passwordMismatch ? 'Passwords do not match' : '')}
            success={touched.confirm && passwordsMatch}
            required
            autoComplete="new-password"
          />

          <div className="space-y-1">
            <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  setFieldErrors((p) => ({ ...p, terms: '' }));
                }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>
                I agree to the{' '}
                <Link href="/" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="text-xs text-red-600 dark:text-red-400 pl-7">{fieldErrors.terms}</p>
            )}
          </div>

          <AuthButton type="submit" loading={loading}>
            {checkoutFlow ? 'Create account & checkout' : 'Create account'}
          </AuthButton>
        </form>

        <AuthDivider label="or sign up with" />
        <SocialAuthButtons onProviderClick={handleSocial} />

        <Link
          href={loginHref}
          className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </AuthLayout>
  );
}
