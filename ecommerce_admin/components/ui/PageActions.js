import { cn } from '../../lib/cn';

/** Top-of-page action buttons (replaces gradient hero banners). */
export default function PageActions({ children, className }) {
  if (!children) return null;
  return (
    <div className={cn('flex flex-wrap items-center justify-end gap-3', className)}>
      {children}
    </div>
  );
}
