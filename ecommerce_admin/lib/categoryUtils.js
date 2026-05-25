/**
 * Build a tree from a flat category list (API returns parent_id + optional children).
 */
export function buildCategoryTree(categories) {
  const list = Array.isArray(categories) ? categories : [];
  const map = new Map();
  list.forEach((c) => map.set(c.id, { ...c, children: [...(c.children || [])] }));

  const roots = [];
  list.forEach((c) => {
    const node = map.get(c.id);
    if (!node) return;
    if (c.parent_id) {
      const parent = map.get(c.parent_id);
      if (parent) {
        if (!parent.children.some((ch) => ch.id === node.id)) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    } else if (!roots.some((r) => r.id === node.id)) {
      roots.push(node);
    }
  });

  const sortNodes = (nodes) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((n) => {
      if (n.children?.length) sortNodes(n.children);
    });
  };
  sortNodes(roots);
  return roots;
}

export function flattenCategoryTree(tree, depth = 0) {
  const rows = [];
  (tree || []).forEach((node) => {
    rows.push({ ...node, depth });
    if (node.children?.length) {
      rows.push(...flattenCategoryTree(node.children, depth + 1));
    }
  });
  return rows;
}

/** Leaf categories for product assignment dropdowns */
export function getAssignableCategories(categories) {
  const list = Array.isArray(categories) ? categories : [];
  const hasChildren = new Set(
    list.filter((c) => list.some((x) => x.parent_id === c.id)).map((c) => c.id)
  );
  return list
    .filter((c) => !hasChildren.has(c.id))
    .map((c) => ({
      ...c,
      label: c.parent_name ? `${c.parent_name} › ${c.name}` : c.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function parentOptions(categories, excludeId = null) {
  return categories.filter(
    (c) => c.id !== excludeId && !c.parent_id
  );
}
