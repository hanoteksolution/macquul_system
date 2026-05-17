export default function AuthDivider({ label = 'or continue with' }) {
  return (
    <div className="relative flex items-center py-1">
      <div className="flex-grow border-t border-gray-200/80 dark:border-gray-700/80" />
      <span className="mx-4 shrink-0 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </span>
      <div className="flex-grow border-t border-gray-200/80 dark:border-gray-700/80" />
    </div>
  );
}
