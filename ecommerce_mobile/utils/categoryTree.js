/**
 * Category hierarchy helpers (parent / child from API).
 */

export const ALL_SELECTION = { type: 'all' };

export function createParentSelection(parent) {
  return { type: 'parent', parent };
}

export function createChildSelection(parent, category) {
  return { type: 'child', parent, category };
}

/** Normalize API tree or flat list into root categories with children[]. */
export function normalizeCategoryRoots(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  if (!list.length) return [];

  const hasNestedChildren = list.some(
    (c) => c.parent_id == null && Array.isArray(c.children) && c.children.length > 0
  );
  if (hasNestedChildren) {
    return list.filter((c) => c.parent_id == null);
  }

  const roots = list.filter((c) => c.parent_id == null);
  const childrenByParent = {};
  list.forEach((c) => {
    if (c.parent_id != null) {
      if (!childrenByParent[c.parent_id]) childrenByParent[c.parent_id] = [];
      childrenByParent[c.parent_id].push(c);
    }
  });
  return roots.map((r) => ({
    ...r,
    children: childrenByParent[r.id] || [],
  }));
}

export function getFilterCategoryIds(selection) {
  if (!selection || selection.type === 'all') return null;
  if (selection.type === 'child') return [selection.category.id];
  if (selection.type === 'parent') {
    const ids = [selection.parent.id];
    (selection.parent.children || []).forEach((c) => ids.push(c.id));
    return ids;
  }
  return null;
}

export function productMatchesSelection(product, selection) {
  if (!selection || selection.type === 'all') return true;
  const cat = product?.category;
  if (!cat) return false;

  const ids = getFilterCategoryIds(selection);
  if (!ids) return true;
  if (ids.includes(cat.id)) return true;
  if (cat.parent_id && ids.includes(cat.parent_id)) return true;
  if (selection.type === 'parent' && cat.parent_id === selection.parent.id) return true;
  if (selection.type === 'parent' && cat.parent_name === selection.parent.name) return true;
  if (selection.type === 'child' && cat.name === selection.category.name) return true;
  return false;
}

export function getSelectionLabel(selection) {
  if (!selection || selection.type === 'all') return 'All categories';
  if (selection.type === 'child') {
    return `${selection.parent.name} › ${selection.category.name}`;
  }
  return selection.parent.name;
}
