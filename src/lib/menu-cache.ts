import { ApiClient } from '@/lib/api-client';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  orderIndex?: number;
}

const fallbackMenus: MenuItem[] = [
  { id: '1', label: 'Dashboard', icon: 'LuHouse', path: '/dashboard' },
  {
    id: '2',
    label: 'Organization',
    icon: 'LuNetwork',
    children: [
      { id: '2-1', label: 'Master Data', icon: 'LuLayers', path: '/organization/master-data' },
      { id: '2-2', label: 'Directory', icon: 'LuUsers', path: '/organization/directory' },
      { id: '2-3', label: 'Key Person', icon: 'LuStar', path: '/organization/key-person' },
    ],
  },
  { id: '3', label: 'Urban Demographics', icon: 'LuBuilding2', path: '/demographics/urban' },
  { id: '4', label: 'Rural Demographics', icon: 'LuLandmark', path: '/demographics/rural' },
  {
    id: '5',
    label: 'Administration',
    icon: 'LuShield',
    children: [
      { id: '5-1', label: 'Users', icon: 'LuUserCheck', path: '/users' },
      { id: '5-2', label: 'Roles & Permissions', icon: 'LuKey', path: '/roles' },
      { id: '5-3', label: 'Settings', icon: 'LuSettings', path: '/settings' },
    ],
  },
];

let cachedMenus: MenuItem[] | null = null;

export { fallbackMenus };

export async function getMenus(): Promise<MenuItem[]> {
  if (cachedMenus) return cachedMenus;

  try {
    const data = await ApiClient.get<MenuItem[]>('menus/my');
    if (Array.isArray(data) && data.length > 0) {
      cachedMenus = data;
      return data;
    }
    cachedMenus = fallbackMenus;
    return fallbackMenus;
  } catch (err) {
    console.warn('Could not load user menu tree:', err);
    cachedMenus = fallbackMenus;
    return fallbackMenus;
  }
}

export async function getAllMenus(): Promise<any[]> {
  try {
    return await ApiClient.get('menus');
  } catch {
    return [];
  }
}
