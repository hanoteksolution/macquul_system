import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  error,
  success,
  hint,
  className,
  showToggle,
  required,
  autoComplete,
  placeholder,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password' || showToggle;
  const inputType = isPassword && visible ? 'text' : type;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] transition-colors',
              error ? 'text-red-500' : success ? 'text-primary-600' : 'text-gray-400 group-focus-within:text-primary-600'
            )}
            aria-hidden
          />
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            'w-full rounded-xl border bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm',
            'text-gray-900 dark:text-white placeholder:text-gray-400',
            'py-3 text-[15px] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
            Icon ? 'pl-11 pr-11' : 'px-4',
            !isPassword && 'pr-4',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            success && !error && 'border-primary-400',
            !error && !success && 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        )}
        {success && !error && !isPassword && (
          <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-primary-600" />
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
