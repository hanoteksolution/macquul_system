export default function BookGrid({ rows = 5, cols = 8, locations = [], onSelect }) {
  const set = new Map(locations.map(l => [`${l.row}-${l.column}`, l]));
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows }).map((_, r) => (
        Array.from({ length: cols }).map((_, c) => {
          const key = `${r+1}-${c+1}`;
          const item = set.get(key);
          return (
            <button
              key={key}
              onClick={() => onSelect?.(r+1, c+1, item)}
              className={`h-16 rounded border flex items-center justify-center ${item ? 'bg-primary-100 border-primary-400' : 'bg-gray-100 border-gray-300'}`}
              title={item ? `${item.product_name}` : 'Empty'}
            >
              {r+1}:{c+1}
            </button>
          );
        })
      ))}
    </div>
  );
}
