import { useState } from "react";

export default function EnhancedCategories({
  categories = [],
  onSelect,
  selectedCategory,
}) {
  const handleCategorySelect = (category) => {
    onSelect?.(category);
  };

  const clearSelection = () => {
    onSelect?.(null);
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {/* All Categories Button */}
      <button
        onClick={clearSelection}
        className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          !selectedCategory
            ? "bg-primary-600 text-white shadow-md"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All Categories
      </button>

      {/* Individual Category Buttons */}
      <div className="flex items-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory?.id === category.id
                ? "bg-primary-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
          <span className="font-medium">
            Filtered by: {selectedCategory.name}
          </span>
          <button
            onClick={clearSelection}
            className="w-4 h-4 bg-primary-200 dark:bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-300 dark:hover:bg-primary-700 transition-colors"
          >
            <svg
              className="w-2.5 h-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
