export default function CategoryPills({ categories = [], onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect?.(c)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-primary-50 hover:border-primary-200 text-sm text-gray-700"
          title={c.description || c.name}
        >
          <span className="w-8 h-8 rounded-full bg-primary-100 inline-flex items-center justify-center text-primary-700 text-xs font-bold">
            {c.name.substring(0,2).toUpperCase()}
          </span>
          <span className="font-medium">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
