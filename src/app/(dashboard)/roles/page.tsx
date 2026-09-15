'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  LuPlus,
  LuShield,
  LuKey,
  LuLayers,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuEllipsisVertical,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Role Edit / Manage Modal
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [roleTab, setRoleTab] = useState('permissions');

  // Create Role Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleSlug, setNewRoleSlug] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permRes, menuRes] = await Promise.all([
        ApiClient.get('roles'),
        ApiClient.get('permissions').catch(() => []),
        ApiClient.get('menus').catch(() => []),
      ]);
      setRoles(rolesRes || []);
      setPermissions(permRes || []);
      setMenus(menuRes || []);
    } catch (err) {
      console.warn('Could not load roles data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenManage = (role: any) => {
    setSelectedRole(role);
    setSelectedPermissionKeys(role.permissions?.map((p: any) => p.key) || []);
    setSelectedMenuIds(role.menus?.map((m: any) => m.id) || []);
    setRoleTab('permissions');
    setIsManageModalOpen(true);
  };

  const handleTogglePermission = (key: string) => {
    setSelectedPermissionKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleToggleMenu = (menuId: string) => {
    setSelectedMenuIds((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId],
    );
  };

  const handleSaveRoleMatrix = async () => {
    if (!selectedRole) return;
    try {
      await Promise.all([
        ApiClient.put(`roles/${selectedRole.id}/permissions`, {
          permissionKeys: selectedPermissionKeys,
        }),
        ApiClient.put(`roles/${selectedRole.id}/menus`, {
          menuIds: selectedMenuIds,
        }),
      ]);
      toast.success(`Role matrix for "${selectedRole.name}" updated`);
      setIsManageModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not update role configuration');
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || !newRoleSlug.trim()) {
      toast.error('Please enter Role Name and Slug');
      return;
    }

    try {
      await ApiClient.post('roles', {
        name: newRoleName.trim(),
        slug: newRoleSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: newRoleDesc.trim(),
      });
      toast.success('New role created');
      setIsCreateOpen(false);
      setNewRoleName('');
      setNewRoleSlug('');
      setNewRoleDesc('');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not create role');
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (role.isSystem) {
      toast.error('System roles cannot be deleted');
      return;
    }
    if (!confirm(`Are you sure you want to delete role "${role.name}"?`)) return;

    try {
      await ApiClient.delete(`roles/${role.id}`);
      toast.success('Role deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not delete role');
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold select-none">
        <Link href="/dashboard" className="hover:underline text-[#2563eb]">
          Home
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <span className="text-slate-500 font-normal">Roles & Access Control</span>
      </div>

      {/* Page Header Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fff5ee] border border-orange-200/80 flex items-center justify-center shrink-0">
            <LuShield className="w-7 h-7 text-[#f97316]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Roles & Access Control</h1>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-[#fff5ee] text-[#f97316] border border-orange-200/80 tracking-wider">
                RBAC
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Configure system roles, granular API permissions, and role-based sidebar visibility.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          size="default"
          className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs space-x-1.5 shrink-0"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Custom Role</span>
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading roles and permissions...
          </div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#fff5ee] border border-orange-200/80 text-[#f97316] flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
                      <LuShield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{role.name}</h3>
                      <p className="text-[11px] font-mono text-blue-600 font-bold">{role.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {role.isSystem && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        System
                      </span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                        >
                          <LuEllipsisVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl">
                        <DropdownMenuItem
                          onClick={() => handleOpenManage(role)}
                          className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer rounded-lg"
                        >
                          <LuKey className="w-3.5 h-3.5 text-[#f97316]" />
                          <span>Manage Access</span>
                        </DropdownMenuItem>
                        {!role.isSystem && (
                          <>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteRole(role)}
                              className="flex items-center space-x-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer rounded-lg"
                            >
                              <LuTrash2 className="w-3.5 h-3.5" />
                              <span>Delete Role</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium line-clamp-2">
                  {role.description || 'No description provided.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#fff8f3] border border-orange-100/80 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-extrabold">Permissions</span>
                    <span className="font-extrabold text-[#f97316] text-sm">{role.permissions?.length || 0}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-extrabold">Menus</span>
                    <span className="font-extrabold text-slate-800 text-sm">{role.menus?.length || 0}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="default"
                  className="w-full text-xs font-extrabold border-orange-200 text-orange-600 hover:bg-orange-50 h-10 rounded-xl space-x-1.5 shadow-2xs"
                  onClick={() => handleOpenManage(role)}
                >
                  <LuKey className="w-4 h-4 text-[#f97316]" />
                  <span>Configure Access Matrix</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manage Role Modal (Permissions & Menus Tabs) */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center space-x-2.5">
              <DialogTitle className="text-lg font-extrabold text-slate-900">
                Configure Role: {selectedRole?.name}
              </DialogTitle>
              {selectedRole?.isSystem && (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  System Role
                </span>
              )}
            </div>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Select allowed permissions and sidebar menu access for this role.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={roleTab} onValueChange={setRoleTab} className="mt-2">
            <TabsList className="w-full bg-slate-100 p-1 rounded-xl h-11">
              <TabsTrigger value="permissions" className="flex-1 text-xs font-bold space-x-1.5 rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white transition-all">
                <LuKey className="w-3.5 h-3.5" />
                <span>API Permissions ({selectedPermissionKeys.length})</span>
              </TabsTrigger>
              <TabsTrigger value="menus" className="flex-1 text-xs font-bold space-x-1.5 rounded-lg data-[state=active]:bg-[#f97316] data-[state=active]:text-white transition-all">
                <LuLayers className="w-3.5 h-3.5" />
                <span>Sidebar Menus ({selectedMenuIds.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="mt-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1">
                {permissions.map((perm) => {
                  const isChecked = selectedPermissionKeys.includes(perm.key);
                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleTogglePermission(perm.key)}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 select-none',
                        isChecked
                          ? 'border-orange-300 bg-[#fff5ee] shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50',
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleTogglePermission(perm.key)}
                        className="mt-0.5 border-orange-400 data-[state=checked]:bg-orange-500"
                      />
                      <div>
                        <p className="font-mono text-[11px] font-bold text-slate-900">{perm.key}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{perm.description || 'Permission'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Menus Tab */}
            <TabsContent value="menus" className="mt-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1">
                {menus.map((menu) => {
                  const isChecked = selectedMenuIds.includes(menu.id);
                  return (
                    <div
                      key={menu.id}
                      onClick={() => handleToggleMenu(menu.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 select-none',
                        isChecked
                          ? 'border-orange-300 bg-[#fff5ee] shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50',
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleMenu(menu.id)}
                        className="mt-0.5 border-orange-400 data-[state=checked]:bg-orange-500"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900">{menu.label}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {menu.path || 'Menu Group Header'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" size="default" onClick={() => setIsManageModalOpen(false)} className="h-10 text-xs font-bold rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button size="default" onClick={handleSaveRoleMatrix} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs">
              Save Role Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Custom Role Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">Create New Role</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Define a custom administrative role for your constituency team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRole} className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Role Name *</Label>
              <Input
                placeholder="e.g. Block Operator"
                value={newRoleName}
                onChange={(e) => {
                  setNewRoleName(e.target.value);
                  setNewRoleSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Role Slug *</Label>
              <Input
                placeholder="e.g. block-operator"
                value={newRoleSlug}
                onChange={(e) => setNewRoleSlug(e.target.value)}
                className="h-10 text-xs font-mono font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Description</Label>
              <Input
                placeholder="Brief description of duties..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" size="default" onClick={() => setIsCreateOpen(false)} className="h-10 text-xs font-bold rounded-xl border-slate-200">
                Cancel
              </Button>
              <Button type="submit" size="default" className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs">
                Create Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
