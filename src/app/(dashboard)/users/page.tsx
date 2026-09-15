'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
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
  LuSearch,
  LuPencil,
  LuTrash2,
  LuUserCheck,
  LuShield,
  LuPhone,
  LuMail,
  LuTriangleAlert,
  LuEllipsisVertical,
} from 'react-icons/lu';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form Fields
  const [formFullName, setFormFullName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRoleId, setFormRoleId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');

  // Delete modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await ApiClient.get('roles');
        setRoles(res || []);
      } catch (err) {
        console.warn('Could not load roles:', err);
      }
    }
    loadRoles();
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ApiClient.get('users', { search, pageSize: 50 });
      setUsers(res.data || []);
    } catch (err) {
      console.warn('Could not fetch users:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingUserId(null);
    setFormFullName('');
    setFormMobile('');
    setFormEmail('');
    setFormPassword('');
    setFormRoleId(roles[0]?.id || '');
    setFormStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: any) => {
    setModalMode('edit');
    setEditingUserId(u.id);
    setFormFullName(u.fullName);
    setFormMobile(u.mobile);
    setFormEmail(u.email || '');
    setFormPassword('');
    setFormRoleId(u.roleId || u.role?.id || '');
    setFormStatus(u.status);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formMobile.trim() || !formRoleId) {
      toast.error('Please fill all required fields');
      return;
    }

    if (modalMode === 'create' && !formPassword) {
      toast.error('Please specify a password for the new user');
      return;
    }

    const payload: any = {
      fullName: formFullName.trim(),
      mobile: formMobile.trim(),
      email: formEmail.trim() || undefined,
      roleId: formRoleId,
      status: formStatus,
    };

    if (formPassword) {
      payload.password = formPassword;
    }

    try {
      if (modalMode === 'create') {
        await ApiClient.post('users', payload);
        toast.success('User account created successfully');
      } else if (editingUserId) {
        await ApiClient.patch(`users/${editingUserId}`, payload);
        toast.success('User updated successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await ApiClient.delete(`users/${userToDelete.id}`);
      toast.success(`Deleted user "${userToDelete.fullName}"`);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Could not delete user');
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
        <span className="text-slate-500 font-normal">Portal User Accounts</span>
      </div>

      {/* Page Header Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fff5ee] border border-orange-200/80 flex items-center justify-center shrink-0">
            <LuUserCheck className="w-7 h-7 text-[#f97316]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portal User Accounts</h1>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-[#fff5ee] text-[#f97316] border border-orange-200/80 tracking-wider">
                {users.length} Users
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage administrative logins, assign roles, and control system access.
            </p>
          </div>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="default"
          className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs space-x-1.5 shrink-0"
        >
          <LuPlus className="w-4 h-4" />
          <span>Create User</span>
        </Button>
      </div>

      {/* Search Bar Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 max-w-md">
            <LuSearch className="absolute left-3.5 top-3 h-4 w-4 text-orange-500" />
            <Input
              placeholder="Search by name, mobile, or email..."
              className="pl-10 h-10 text-xs font-semibold rounded-md bg-white border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff8f3] border-b border-orange-100/70 text-[#f97316] font-extrabold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 w-16 text-center">Sl No.</th>
                <th className="px-5 py-4">User Name</th>
                <th className="px-5 py-4">Assigned Role</th>
                <th className="px-5 py-4">Mobile Number</th>
                <th className="px-5 py-4">Email Address</th>
                <th className="px-5 py-4">Account Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    Loading user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No user accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u, idx: number) => (
                  <tr key={u.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-4 text-center font-bold text-slate-400 text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9 border border-orange-200/80 shadow-2xs">
                          <AvatarImage src={u.avatarUrl || ''} />
                          <AvatarFallback className="bg-[#fff5ee] text-[#f97316] font-extrabold text-xs">
                            {u.fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-extrabold text-slate-900 text-sm">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-[#fff5ee] text-[#f97316] font-extrabold text-xs px-3 py-1 rounded-full border border-orange-200/80 inline-block">
                        {u.role?.name || 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-blue-600 font-bold">{u.mobile}</td>
                    <td className="px-5 py-4 text-slate-600 text-xs font-medium">{u.email || '—'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase',
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/80',
                        )}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                          >
                            <LuEllipsisVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 p-1 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(u)}
                            className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer rounded-lg"
                          >
                            <LuPencil className="w-3.5 h-3.5 text-[#f97316]" />
                            <span>Edit User</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                            disabled={u.id === currentUser?.id}
                            onClick={() => {
                              setUserToDelete(u);
                              setDeleteConfirmOpen(true);
                            }}
                            className="flex items-center space-x-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-50 rounded-lg"
                          >
                            <LuTrash2 className="w-3.5 h-3.5" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              {modalMode === 'create' ? 'Create User Account' : 'Edit User Account'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Set credentials and assign an administrative role.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Full Name *</Label>
              <Input
                placeholder="e.g. Ramesh Dash"
                value={formFullName}
                onChange={(e) => setFormFullName(e.target.value)}
                className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Mobile Number (Username) *</Label>
              <Input
                type="tel"
                placeholder="e.g. 9876543210"
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                className="h-10 text-xs font-mono font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Email (Optional)</Label>
              <Input
                type="email"
                placeholder="e.g. ramesh@mla.gov.in"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">{modalMode === 'create' ? 'Password *' : 'Change Password (optional)'}</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required={modalMode === 'create'}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Role *</Label>
                <Select value={formRoleId} onValueChange={setFormRoleId}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-xs font-semibold">
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Account Status</Label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    <SelectItem value="ACTIVE" className="text-xs text-emerald-700 font-bold">Active</SelectItem>
                    <SelectItem value="INACTIVE" className="text-xs text-rose-700 font-bold">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" size="default" onClick={() => setIsModalOpen(false)} className="h-10 text-xs font-bold rounded-xl border-slate-200">
                Cancel
              </Button>
              <Button type="submit" size="default" className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs">
                {modalMode === 'create' ? 'Create User' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <LuTriangleAlert className="w-5 h-5 text-rose-500" />
              <span>Delete User Account</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 pt-1 font-medium">
              Are you sure you want to delete <strong className="text-slate-800">{userToDelete?.fullName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" size="default" onClick={() => setDeleteConfirmOpen(false)} className="h-10 text-xs font-bold rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button variant="destructive" size="default" onClick={handleDeleteUser} className="h-10 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
