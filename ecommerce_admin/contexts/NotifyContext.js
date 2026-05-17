import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import PremiumConfirmDialog from '../components/ui/PremiumConfirmDialog';
const globalForNotify = typeof globalThis !== 'undefined' ? globalThis : global;
const NotifyContext =
  globalForNotify.__macquulAdminNotifyContext ??
  (globalForNotify.__macquulAdminNotifyContext = createContext(null));

const TOAST_STYLES = {
  success: {
    wrap: 'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/90 dark:text-emerald-100',
    icon: CheckCircleIcon,
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    wrap: 'border-red-200/80 bg-red-50 text-red-900 dark:border-red-800/50 dark:bg-red-950/90 dark:text-red-100',
    icon: ExclamationCircleIcon,
    iconClass: 'text-red-600 dark:text-red-400',
  },
  info: {
    wrap: 'border-primary-200/80 bg-primary-50 text-primary-900 dark:border-primary-800/50 dark:bg-primary-950/90 dark:text-primary-100',
    icon: InformationCircleIcon,
    iconClass: 'text-primary-600 dark:text-primary-400',
  },
};

function ToastStack({ toasts, onDismiss }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
    >
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.variant] || TOAST_STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            role="status"
            className={clsx(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm',
              style.wrap
            )}
          >
            <Icon className={clsx('h-5 w-5 shrink-0 mt-0.5', style.iconClass)} aria-hidden />
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded-lg p-1 opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}

export function NotifyProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const confirmResolver = useRef(null);
  const toastTimers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const variant = options.variant || 'info';
      const duration = options.duration ?? 4500;

      setToasts((prev) => [...prev, { id, message, variant }]);

      const timer = setTimeout(() => dismissToast(id), duration);
      toastTimers.current.set(id, timer);
      return id;
    },
    [dismissToast]
  );

  toast.success = (message, options) => toast(message, { ...options, variant: 'success' });
  toast.error = (message, options) => toast(message, { ...options, variant: 'error' });
  toast.info = (message, options) => toast(message, { ...options, variant: 'info' });

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      confirmResolver.current = resolve;
      setConfirmState({
        message,
        title: options.title || 'Confirm',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        destructive: options.destructive ?? false,
        variant: options.variant,
        subtitle: options.subtitle,
      });
    });
  }, []);

  const resolveConfirm = useCallback((value) => {
    confirmResolver.current?.(value);
    confirmResolver.current = null;
    setConfirmState(null);
  }, []);

  const value = { toast, confirm };

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <PremiumConfirmDialog
        state={confirmState}
        onConfirm={() => resolveConfirm(true)}
        onCancel={() => resolveConfirm(false)}
      />
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) {
    throw new Error('useNotify must be used within NotifyProvider');
  }
  return ctx;
}
