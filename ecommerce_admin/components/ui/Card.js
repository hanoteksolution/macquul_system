import { cn } from '../../lib/cn';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <section
      className={cn(
        'admin-card rounded-3xl',
        hover && 'admin-card-hover hover:-translate-y-0.5 transition-transform duration-300',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeader({ className, children }) {
  return <header className={cn('mb-5', className)}>{children}</header>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-white', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-slate-500 dark:text-slate-400 mt-0.5', className)}>{children}</p>;
}
