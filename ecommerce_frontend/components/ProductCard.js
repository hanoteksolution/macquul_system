import { HeartIcon, StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function ProductCard({ product, onAdd }) {
  const inStock = product.stock > 0;
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Clickable Card Content */}
      <Link href={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-700">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600" />
          )}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 text-xs font-medium shadow border border-gray-100 dark:border-gray-600">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                inStock ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-xs text-primary-700 dark:text-primary-400 font-semibold">
            {product.category?.name || "Category"}
          </div>
          <h3 className="mt-1 font-semibold line-clamp-1 text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd?.(product);
            }}
            disabled={!inStock}
            className="flex-1 rounded-full px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white text-sm font-medium"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/product/${product.id}`;
            }}
            className="rounded-full px-4 py-2 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
