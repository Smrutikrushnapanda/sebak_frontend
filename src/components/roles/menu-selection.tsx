'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem } from '@/lib/menu-cache';

export function MenuSelection({ menus, selectedIds, onToggle }: {
  menus: MenuItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1" aria-label="Dashboard menu access">
      {menus.length === 0 && <p className="text-sm text-slate-500">No menus available for this dashboard.</p>}
      {menus.map((menu) => (
        <div key={menu.id} className="space-y-2">
          <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-2.5 text-xs cursor-pointer">
            <Checkbox
              checked={selectedIds.includes(menu.id)}
              onCheckedChange={() => onToggle(menu.id)}
              aria-label={`Allow ${menu.label}`}
              className="mt-0.5 border-orange-400 data-[state=checked]:bg-orange-500"
            />
            <span>
              <span className="block font-extrabold text-slate-900">{menu.label}</span>
              <span className="block text-[10px] text-slate-500 font-mono">{menu.path || 'Menu Group Header'}</span>
            </span>
          </label>
          {!!menu.children?.length && (
            <div className="ml-5 border-l border-slate-200 pl-3">
              <MenuSelection menus={menu.children} selectedIds={selectedIds} onToggle={onToggle} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
