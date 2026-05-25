import type { Category } from './types';

export function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<number, Category>();
  categories.forEach((c) =>
    map.set(c.id, { ...c, children: [...(c.children || [])] })
  );

  const roots: Category[] = [];
  categories.forEach((c) => {
    const node = map.get(c.id);
    if (!node) return;
    if (c.parent_id) {
      const parent = map.get(c.parent_id);
      if (parent) {
        if (!parent.children?.some((ch) => ch.id === node.id)) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    } else if (!roots.some((r) => r.id === node.id)) {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: Category[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((n) => {
      if (n.children?.length) sortNodes(n.children);
    });
  };
  sortNodes(roots);
  return roots;
}

export function getRootCategories(categories: Category[]): Category[] {
  return buildCategoryTree(categories);
}

/** All category ids to match when filtering (category + descendants) */
export function getCategoryMatchIds(
  categoryId: string | number | undefined,
  categories: Category[]
): Set<string> | null {
  if (!categoryId) return null;
  const id = String(categoryId);
  const flat = categories.length ? categories : [];
  const tree = buildCategoryTree(flat);
  const findNode = (nodes: Category[]): Category | null => {
    for (const n of nodes) {
      if (String(n.id) === id) return n;
      const inChild = findNode(n.children || []);
      if (inChild) return inChild;
    }
    return null;
  };
  const node = findNode(tree) || flat.find((c) => String(c.id) === id);
  if (!node) return new Set([id]);

  const collect = (n: Category): string[] => {
    const ids = [String(n.id)];
    (n.children || []).forEach((ch) => ids.push(...collect(ch)));
    return ids;
  };
  return new Set(collect(node));
}

export function flattenCategoriesForSelect(categories: Category[]): { id: number; label: string }[] {
  const tree = buildCategoryTree(categories);
  const rows: { id: number; label: string }[] = [];
  const walk = (nodes: Category[], prefix = '') => {
    nodes.forEach((n) => {
      const label = prefix ? `${prefix} › ${n.name}` : n.name;
      if (n.children?.length) {
        walk(n.children, label);
      } else {
        rows.push({ id: n.id, label });
      }
    });
  };
  walk(tree);
  return rows;
}
