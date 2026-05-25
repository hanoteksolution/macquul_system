import {
  ALL_SELECTION,
  createParentSelection,
  createChildSelection,
} from './categoryTree';

/** Map banner copy / CTA link to a category selection */
export function findCategorySelectionFromBanner(slide, categoryRoots = []) {
  if (!slide || !categoryRoots.length) return ALL_SELECTION;

  const haystack = [
    slide.title,
    slide.titleAccent,
    slide.subtitle,
    slide.cta_link,
    slide.category_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (!haystack.trim()) return ALL_SELECTION;

  for (const root of categoryRoots) {
    const rootName = (root.name || '').toLowerCase();
    const rootSingular = rootName.replace(/ies$/, 'y').replace(/s$/, '');

    if (
      haystack.includes(rootName) ||
      (rootSingular.length > 3 && haystack.includes(rootSingular))
    ) {
      return createParentSelection(root);
    }

    for (const child of root.children || []) {
      const childName = (child.name || '').toLowerCase();
      const childSingular = childName.replace(/ies$/, 'y').replace(/s$/, '');
      if (
        haystack.includes(childName) ||
        (childSingular.length > 3 && haystack.includes(childSingular))
      ) {
        return createChildSelection(root, child);
      }
    }
  }

  return ALL_SELECTION;
}
