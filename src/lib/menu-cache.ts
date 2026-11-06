import { ApiClient } from '@/lib/api-client';

export type DashboardContext = 'organization' | 'internal';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string | null;
  children?: MenuItem[];
  orderIndex?: number;
  dashboardType?: DashboardContext;
}

export const MENU_CACHE_EVENT = 'sebaka:menus-changed';
const cache = new Map<string, { menus: MenuItem[]; expires: number }>();
const pending = new Map<string, Promise<MenuItem[]>>();
let generation = 0;

function pathDashboard(path?: string | null): DashboardContext | undefined {
  if (!path) return undefined;
  if (path === '/internal' || path.startsWith('/internal/')) return 'internal';
  if (['/dashboard', '/users', '/roles', '/settings'].includes(path) ||
    path === '/organization' || path.startsWith('/organization/') ||
    path === '/demographics' || path.startsWith('/demographics/')) return 'organization';
  return undefined;
}

export function filterMenusForDashboard(menus: MenuItem[], type: DashboardContext): MenuItem[] {
  return menus.flatMap((menu) => {
    if (menu.dashboardType && menu.dashboardType !== type) return [];
    const owner = pathDashboard(menu.path);
    if (owner && owner !== type) return [];
    const children = filterMenusForDashboard(menu.children || [], type);
    if (menu.path ? !owner && menu.dashboardType !== type : children.length === 0) return [];
    return [{ ...menu, dashboardType: type, children }];
  });
}

export async function getMenus(type: DashboardContext, userKey: string): Promise<MenuItem[]> {
  const key = `${userKey}:${type}`;
  const saved = cache.get(key);
  if (saved && saved.expires > Date.now()) return saved.menus;
  const existing = pending.get(key);
  if (existing) return existing;
  const version = generation;
  const request = ApiClient.request<MenuItem[]>(`menus/my?type=${type}`, { method: 'GET', cache: 'no-store' }).then((data) => {
    if (!Array.isArray(data)) throw new Error('Invalid menu response');
    if (version !== generation) throw new Error('Menu request expired');
    const menus = filterMenusForDashboard(data, type);
    cache.set(key, { menus, expires: Date.now() + 30_000 });
    return menus;
  }).finally(() => {
    if (pending.get(key) === request) pending.delete(key);
  });
  pending.set(key, request);
  return request;
}

export function clearMenuCache() {
  generation++;
  cache.clear();
  pending.clear();
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MENU_CACHE_EVENT));
}

export async function getAllMenus(type: DashboardContext): Promise<MenuItem[]> {
  const data = await ApiClient.request<MenuItem[]>(`menus?type=${type}`, { method: 'GET', cache: 'no-store' });
  if (!Array.isArray(data)) throw new Error('Invalid menu response');
  return filterMenusForDashboard(data, type);
}
