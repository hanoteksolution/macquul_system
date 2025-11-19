export default function CategoryPills({ categories = [], activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect?.(null)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${
          !activeCategory 
            ? 'bg-primary-600 text-white border-primary-600' 
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900 hover:border-primary-200 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300'
        }`}
      >
        All Categories
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect?.(c)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${
            activeCategory?.id === c.id
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900 hover:border-primary-200 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300'
          }`}
          title={c.description || c.name}
        >
          <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 inline-flex items-center justify-center text-primary-700 dark:text-primary-300 text-xs font-bold">
            {c.name.substring(0,2).toUpperCase()}
          </span>
          <span className="font-medium">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
