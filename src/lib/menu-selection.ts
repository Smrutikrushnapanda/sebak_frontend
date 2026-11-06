import { MenuItem } from './menu-cache';

export function flattenMenus(menus: MenuItem[]): MenuItem[] {
  return menus.flatMap((menu) => [menu, ...flattenMenus(menu.children || [])]);
}

export function toggleMenuSelection(menus: MenuItem[], selectedIds: string[], id: string): string[] {
  const selected = new Set(selectedIds);
  const entries = flattenMenus(menus);
  const target = entries.find((menu) => menu.id === id);
  if (!target) return selectedIds;
  const descendants = flattenMenus([target]);
  if (selected.has(id)) {
    descendants.forEach((menu) => selected.delete(menu.id));
  } else {
    descendants.forEach((menu) => selected.add(menu.id));
    const addAncestors = (nodes: MenuItem[]): boolean => nodes.some((menu) => {
      if (menu.id === id) return true;
      if (addAncestors(menu.children || [])) {
        selected.add(menu.id);
        return true;
      }
      return false;
    });
    addAncestors(menus);
  }
  return entries.filter((menu) => selected.has(menu.id)).map((menu) => menu.id);
}
