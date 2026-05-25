import React, { useMemo } from 'react';
import HierarchicalCategoryNav from './HierarchicalCategoryNav';
import {
  ALL_SELECTION,
  createParentSelection,
  normalizeCategoryRoots,
} from '../utils/categoryTree';

/** Legacy adapter: flat categories list → hierarchical nav (roots only). */
export default function CategoryTabs({
  categories = [],
  selectedCategory,
  onCategorySelect,
  theme = {
    surface: '#fff',
    background: '#f8fafc',
    border: '#e5e7eb',
    primary: '#4ade80',
    text: '#1f2937',
    textSecondary: '#6b7280',
  },
}) {
  const roots = useMemo(() => {
    const flat = categories.filter((c) => c.name !== 'All');
    return normalizeCategoryRoots(flat);
  }, [categories]);

  const selection = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') return ALL_SELECTION;
    const parent = roots.find((r) => r.name === selectedCategory);
    if (parent) return createParentSelection(parent);
    return ALL_SELECTION;
  }, [selectedCategory, roots]);

  const handleChange = (sel) => {
    if (sel.type === 'all') onCategorySelect('All');
    else if (sel.type === 'parent') onCategorySelect(sel.parent.name);
    else if (sel.type === 'child') onCategorySelect(sel.category.name);
  };

  return (
    <HierarchicalCategoryNav
      roots={roots}
      selection={selection}
      onSelectionChange={handleChange}
      theme={theme}
    />
  );
}
