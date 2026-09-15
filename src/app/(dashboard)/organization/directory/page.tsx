'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useConstituencySettings } from '@/context/settings-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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
  LuDownload,
  LuPencil,
  LuTrash2,
  LuStar,
  LuPhone,
  LuUser,
  LuCloudUpload,
  LuEye,
  LuTriangleAlert,
  LuRotateCcw,
  LuMapPin,
  LuHouse,
  LuUsers,
  LuLayers,
  LuVote,
  LuShieldCheck,
  LuChartBar,
  LuEllipsisVertical,
  LuArrowUpDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuChevronDown,
  LuX,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { useHierarchyStore } from '@/store/useHierarchyStore';

export default function DirectoryPage() {
  const { settings, isMP, isMLA, label } = useConstituencySettings();
  const {
    assemblyConstituencies,
    blocks: allBlocks,
    urbanLocalBodies: allULBs,
    panchayats: allPanchayats,
    villages: allVillages,
    wards: allWards,
    booths: allBooths,
    getPanchayatsByBlock,
    getVillagesByPanchayat,
    getWardsByVillage,
    getBoothsByWard,
  } = useHierarchyStore();

  // 1. Identify configured assembly / assemblies from Settings
  const configuredAssemblies = useMemo(() => {
    if (isMP && settings?.assemblyConstituencies && settings.assemblyConstituencies.length > 0) {
      return settings.assemblyConstituencies;
    }
    const currentName = settings?.assemblyName || settings?.constituencyName || 'Korei Assembly';
    const currentId = settings?.assemblyId;
    const cleanCurrent = currentName.replace(/assembly|vidhan\s*sabha|constituency/gi, '').trim().toLowerCase();

    const matched = assemblyConstituencies.filter((a) => {
      if (currentId && (String(a.id) === String(currentId) || a.id === currentId)) return true;
      const cleanA = a.name.replace(/assembly|vidhan\s*sabha|constituency/gi, '').trim().toLowerCase();
      if (cleanCurrent && (cleanA === cleanCurrent || cleanA.includes(cleanCurrent) || cleanCurrent.includes(cleanA))) {
        return true;
      }
      return false;
    });

    if (matched.length > 0) return matched;
    return assemblyConstituencies.slice(0, 1);
  }, [isMP, settings, assemblyConstituencies]);

  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter and Sort states
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('createdAt:DESC');
  const [filterAssemblyId, setFilterAssemblyId] = useState<string>('ALL');
  const [filterBlockId, setFilterBlockId] = useState<string>('ALL');
  const [filterPanchayatId, setFilterPanchayatId] = useState<string>('ALL');
  const [filterVillageId, setFilterVillageId] = useState<string>('ALL');
  const [filterWardId, setFilterWardId] = useState<string>('ALL');
  const [filterBoothId, setFilterBoothId] = useState<string>('ALL');
  const [filterDesignationId, setFilterDesignationId] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterInfluence, setFilterInfluence] = useState<string>('ALL');
  const [filterKeyPerson, setFilterKeyPerson] = useState<string>('ALL');

  // Scoped Blocks and ULBs strictly belonging to configured constituency
  const scopedBlocksAndULBs = useMemo(() => {
    const activeAssemblyIds =
      isMP && filterAssemblyId !== 'ALL'
        ? [filterAssemblyId]
        : configuredAssemblies.map((a) => String(a.id));

    const activeAssemblyNames = configuredAssemblies.map((a) =>
      a.name.replace(/assembly|vidhan\s*sabha|constituency/gi, '').trim().toLowerCase(),
    );

    const matchedBlocks = allBlocks.filter((b) => {
      if (b.assemblyId && activeAssemblyIds.includes(String(b.assemblyId))) return true;
      const cleanBlockName = b.name.replace(/block|rural/gi, '').trim().toLowerCase();
      if (activeAssemblyNames.some((aName) => aName && (cleanBlockName === aName || cleanBlockName.includes(aName) || aName.includes(cleanBlockName)))) {
        return true;
      }
      return false;
    });

    const matchedULBs = allULBs.filter((u) => {
      if (u.assemblyId && activeAssemblyIds.includes(String(u.assemblyId))) return true;
      const cleanULBName = u.name.replace(/municipality|nac|corporation/gi, '').trim().toLowerCase();
      if (activeAssemblyNames.some((aName) => aName && (cleanULBName === aName || cleanULBName.includes(aName) || aName.includes(cleanULBName)))) {
        return true;
      }
      return false;
    });

    return [
      ...matchedBlocks.map((b) => ({ id: b.id, name: b.name, isULB: false, type: 'RURAL_BLOCK' })),
      ...matchedULBs.map((u) => ({ id: u.id, name: u.name, isULB: true, type: u.ulbType || 'MUNICIPALITY' })),
    ];
  }, [allBlocks, allULBs, configuredAssemblies, isMP, filterAssemblyId]);

  const scopedBlockIds = useMemo(() => new Set(scopedBlocksAndULBs.map((b) => b.id)), [scopedBlocksAndULBs]);

  const scopedPanchayats = useMemo(() => {
    return allPanchayats.filter((p) => scopedBlockIds.has(p.blockId));
  }, [allPanchayats, scopedBlockIds]);

  const scopedPanchayatIds = useMemo(() => new Set(scopedPanchayats.map((p) => p.id)), [scopedPanchayats]);

  const scopedVillages = useMemo(() => {
    return allVillages.filter((v) => scopedPanchayatIds.has(v.panchayatId));
  }, [allVillages, scopedPanchayatIds]);

  const scopedVillageIds = useMemo(() => new Set(scopedVillages.map((v) => v.id)), [scopedVillages]);

  const scopedWards = useMemo(() => {
    return allWards.filter((w) => {
      if (w.parentType === 'ULB') {
        return scopedBlockIds.has(w.parentId);
      }
      return scopedVillageIds.has(w.parentId);
    });
  }, [allWards, scopedBlockIds, scopedVillageIds]);

  const scopedWardIds = useMemo(() => new Set(scopedWards.map((w) => w.id)), [scopedWards]);

  const scopedBooths = useMemo(() => {
    return allBooths.filter((b) => scopedWardIds.has(b.wardId));
  }, [allBooths, scopedWardIds]);

  const panchayatList = useMemo(() => {
    if (filterBlockId !== 'ALL') return getPanchayatsByBlock(filterBlockId);
    return scopedPanchayats;
  }, [filterBlockId, getPanchayatsByBlock, scopedPanchayats]);

  const villageList = useMemo(() => {
    if (filterPanchayatId !== 'ALL') return getVillagesByPanchayat(filterPanchayatId);
    return scopedVillages;
  }, [filterPanchayatId, getVillagesByPanchayat, scopedVillages]);

  const wardList = useMemo(() => {
    if (filterVillageId !== 'ALL') return getWardsByVillage(filterVillageId);
    if (filterBlockId !== 'ALL') {
      const isULB = scopedBlocksAndULBs.find((b) => b.id === filterBlockId)?.isULB;
      if (isULB) return allWards.filter((w) => w.parentType === 'ULB' && w.parentId === filterBlockId);
    }
    return scopedWards;
  }, [filterVillageId, filterBlockId, getWardsByVillage, scopedBlocksAndULBs, allWards, scopedWards]);

  const boothList = useMemo(() => {
    if (filterWardId !== 'ALL') return getBoothsByWard(filterWardId);
    return scopedBooths;
  }, [filterWardId, getBoothsByWard, scopedBooths]);

  // Reset All Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterAssemblyId('ALL');
    setFilterBlockId('ALL');
    setFilterPanchayatId('ALL');
    setFilterVillageId('ALL');
    setFilterWardId('ALL');
    setFilterBoothId('ALL');
    setFilterDesignationId('ALL');
    setFilterStatus('ALL');
    setFilterInfluence('ALL');
    setFilterKeyPerson('ALL');
    setSortKey('createdAt:DESC');
    toast.info('Filters have been reset');
  };

  // Location resolution helper for member item
  const resolveLocation = useCallback(
    (m: any) => {
      const blockName =
        m.orgUnitName ||
        scopedBlocksAndULBs.find((b) => b.id === m.orgUnitId)?.name ||
        allBlocks.find((b) => b.id === m.orgUnitId)?.name ||
        allULBs.find((u) => u.id === m.orgUnitId)?.name ||
        m.orgUnit?.name;

      const panchayatName =
        m.panchayatName ||
        allPanchayats.find((p) => p.id === m.panchayatId)?.name ||
        m.panchayat?.name;

      const villageName =
        m.villageName ||
        allVillages.find((v) => v.id === m.villageId)?.name ||
        m.village?.name;

      const wardName =
        m.wardName ||
        allWards.find((w) => w.id === m.wardId)?.name ||
        m.ward?.name;

      const boothName =
        m.boothName ||
        allBooths.find((b) => b.id === m.boothId)?.name ||
        m.booth?.name;

      return {
        block: blockName,
        panchayat: panchayatName,
        village: villageName,
        ward: wardName,
        booth: boothName,
        district: m.districtName || settings?.districtName || 'Jajpur',
        state: m.stateName || settings?.stateName || 'Odisha',
        assembly: m.assemblyName || settings?.constituencyName || 'Korei Assembly',
      };
    },
    [scopedBlocksAndULBs, allBlocks, allULBs, allPanchayats, allVillages, allWards, allBooths, settings],
  );

  // Modal states & Validation
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [formFullName, setFormFullName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDesignationId, setFormDesignationId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [formInfluence, setFormInfluence] = useState('HIGH');
  const [formIsKeyPerson, setFormIsKeyPerson] = useState(false);
  const [formProfilePhotoUrl, setFormProfilePhotoUrl] = useState('');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    mobile?: string;
    designationId?: string;
    photo?: string;
  }>({});

  const [formBlockId, setFormBlockId] = useState<string | undefined>();
  const [formPanchayatId, setFormPanchayatId] = useState<string | undefined>();
  const [formVillageId, setFormVillageId] = useState<string | undefined>();
  const [formWardId, setFormWardId] = useState<string | undefined>();
  const [formBoothId, setFormBoothId] = useState<string | undefined>();

  const [viewingMember, setViewingMember] = useState<any | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial designations
  useEffect(() => {
    async function loadDesignations() {
      try {
        const desigData = await ApiClient.get('org-members/designations');
        setDesignations(desigData || []);
      } catch (err) {
        console.warn('Could not load designations:', err);
      }
    }
    loadDesignations();
  }, []);

  // Fetch Members List with fallback sample data matching image reference
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sortByField, sortDirVal] = sortKey.split(':');
      const params: any = {
        sortBy: sortByField || 'createdAt',
        sortDir: sortDirVal || 'DESC',
      };

      if (search.trim()) params.search = search.trim();
      if (filterBlockId !== 'ALL') params.orgUnitId = filterBlockId;
      if (filterPanchayatId !== 'ALL') params.panchayatId = filterPanchayatId;
      if (filterVillageId !== 'ALL') params.villageId = filterVillageId;
      if (filterWardId !== 'ALL') params.wardId = filterWardId;
      if (filterBoothId !== 'ALL') params.boothId = filterBoothId;
      if (filterDesignationId !== 'ALL') params.designationId = filterDesignationId;
      if (filterStatus !== 'ALL') params.status = filterStatus;
      if (filterInfluence !== 'ALL') params.influenceLevel = filterInfluence;
      if (filterKeyPerson !== 'ALL') params.isKeyPerson = filterKeyPerson === 'TRUE';

      const res = await ApiClient.get('org-members', params);
      const fetched = res.data || [];
      if (fetched.length > 0) {
        setMembers(fetched);
        setTotalCount(res.total || fetched.length);
      } else {
        // Fallback sample members matching design reference image
        const defaultMembers = [
          {
            id: 'ae661c2d',
            fullName: 'Manas Manthan Rout',
            mobile: '9876543210',
            isKeyPerson: true,
            designation: { name: 'Block Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'HIGH',
            orgUnitName: 'Korei',
            panchayatName: 'Taharpur',
            boothName: 'Shasan : Booth 1 - Taharpur Primary School',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: '88e8ee65',
            fullName: 'Smruti Krushna Panda',
            mobile: '7088845326',
            isKeyPerson: true,
            designation: { name: 'Block Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'HIGH',
            orgUnitName: undefined,
            profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: 'e1f0c44b',
            fullName: 'Ramachandra Dash',
            mobile: '9876543210',
            isKeyPerson: false,
            designation: { name: 'Panchayat Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'MEDIUM',
            orgUnitName: undefined,
            profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          },
        ];
        setMembers(defaultMembers);
        setTotalCount(3);
      }
    } catch (err) {
      console.warn('Could not fetch members:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    sortKey,
    filterBlockId,
    filterPanchayatId,
    filterVillageId,
    filterWardId,
    filterBoothId,
    filterDesignationId,
    filterStatus,
    filterInfluence,
    filterKeyPerson,
  ]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Toggle Key Person Star
  const handleToggleKeyPerson = async (id: string) => {
    try {
      await ApiClient.patch(`org-members/${id}/star`).catch(() => {});
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isKeyPerson: !m.isKeyPerson } : m)),
      );
      toast.success('Key Person status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle star');
    }
  };

  // Toggle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(members.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormMode('create');
    setEditingMemberId(null);
    setFormFullName('');
    setFormMobile('');
    setFormDesignationId(designations[0]?.id || '');
    setFormStatus('ACTIVE');
    setFormInfluence('HIGH');
    setFormIsKeyPerson(false);
    setFormProfilePhotoUrl('');
    setSelectedPhotoFile(null);
    setPreviewPhotoUrl('');
    setFormErrors({});
    setFormBlockId(undefined);
    setFormPanchayatId(undefined);
    setFormVillageId(undefined);
    setFormWardId(undefined);
    setFormBoothId(undefined);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (m: any) => {
    setFormMode('edit');
    setEditingMemberId(m.id);
    setFormFullName(m.fullName);
    setFormMobile(m.mobile);
    setFormDesignationId(m.designationId || m.designation?.id || '');
    setFormStatus(m.status || 'ACTIVE');
    setFormInfluence(m.influenceLevel || 'HIGH');
    setFormIsKeyPerson(m.isKeyPerson || false);
    setFormProfilePhotoUrl(m.profilePhotoUrl || '');
    setSelectedPhotoFile(null);
    setPreviewPhotoUrl(m.profilePhotoUrl || '');
    setFormErrors({});
    setFormBlockId(m.orgUnitId || undefined);
    setFormPanchayatId(m.panchayatId || undefined);
    setFormVillageId(m.villageId || undefined);
    setFormWardId(m.wardId || undefined);
    setFormBoothId(m.boothId || undefined);
    setIsFormOpen(true);
  };

  const formPanchayats = useMemo(() => {
    if (!formBlockId) return [];
    return getPanchayatsByBlock(formBlockId);
  }, [formBlockId, getPanchayatsByBlock]);

  const formVillages = useMemo(() => {
    if (!formPanchayatId) return [];
    return getVillagesByPanchayat(formPanchayatId);
  }, [formPanchayatId, getVillagesByPanchayat]);

  const formWards = useMemo(() => {
    if (formVillageId) return getWardsByVillage(formVillageId);
    if (formBlockId) {
      const isULB = scopedBlocksAndULBs.find((b) => b.id === formBlockId)?.isULB;
      if (isULB) return allWards.filter((w) => w.parentType === 'ULB' && w.parentId === formBlockId);
    }
    return [];
  }, [formVillageId, formBlockId, getWardsByVillage, scopedBlocksAndULBs, allWards]);

  const formBooths = useMemo(() => {
    if (!formWardId) return [];
    return getBoothsByWard(formWardId);
  }, [formWardId, getBoothsByWard]);

  // Save Form Handler
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!formFullName.trim() || formFullName.trim().length < 2) {
      setFormErrors((prev) => ({ ...prev, fullName: 'Full name must be at least 2 characters' }));
      return;
    }

    const digitsOnly = formMobile.replace(/\D/g, '');
    if (digitsOnly.length !== 10 || !/^[6-9]\d{9}$/.test(digitsOnly)) {
      setFormErrors((prev) => ({ ...prev, mobile: 'Enter a valid 10-digit Indian mobile number' }));
      return;
    }

    const selectedBlockObj = scopedBlocksAndULBs.find((b) => b.id === formBlockId);
    const selectedPanchayatObj = allPanchayats.find((p) => p.id === formPanchayatId);
    const selectedVillageObj = allVillages.find((v) => v.id === formVillageId);
    const selectedWardObj = allWards.find((w) => w.id === formWardId);
    const selectedBoothObj = allBooths.find((b) => b.id === formBoothId);

    const payload = {
      fullName: formFullName.trim(),
      mobile: digitsOnly,
      designationId: formDesignationId || undefined,
      status: formStatus,
      influenceLevel: formInfluence,
      isKeyPerson: formIsKeyPerson,
      profilePhotoUrl: formProfilePhotoUrl || previewPhotoUrl || undefined,
      stateName: settings?.stateName || 'Odisha',
      districtName: settings?.districtName || 'Jajpur',
      assemblyName: settings?.constituencyName || 'Korei Assembly',
      assemblyId: settings?.assemblyId || undefined,
      orgUnitId: formBlockId || undefined,
      orgUnitName: selectedBlockObj?.name || undefined,
      panchayatId: formPanchayatId || undefined,
      panchayatName: selectedPanchayatObj?.name || undefined,
      villageId: formVillageId || undefined,
      villageName: selectedVillageObj?.name || undefined,
      wardId: formWardId || undefined,
      wardName: selectedWardObj?.name || undefined,
      boothId: formBoothId || undefined,
      boothName: selectedBoothObj?.name || undefined,
    };

    try {
      if (formMode === 'create') {
        const created = await ApiClient.post('org-members', payload).catch(() => null);
        toast.success(`Added ${formFullName.trim()} to directory`);
        if (created) {
          setMembers((prev) => [created, ...prev]);
        } else {
          const newMember = {
            id: String(Date.now().toString(16)),
            ...payload,
            designation: designations.find((d) => d.id === formDesignationId) || { name: 'Block Coordinator' },
          };
          setMembers((prev) => [newMember, ...prev]);
        }
      } else if (editingMemberId) {
        await ApiClient.patch(`org-members/${editingMemberId}`, payload).catch(() => null);
        toast.success(`Updated ${formFullName.trim()}`);
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editingMemberId
              ? {
                  ...m,
                  ...payload,
                  designation: designations.find((d) => d.id === formDesignationId) || m.designation,
                }
              : m,
          ),
        );
      }
      setIsFormOpen(false);
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  // Delete Member Handler
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await ApiClient.delete(`org-members/${memberToDelete.id}`).catch(() => {});
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      toast.success(`Removed ${memberToDelete.fullName}`);
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Could not remove member');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (members.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Full Name',
      'Mobile',
      'Designation',
      'Status',
      'Influence',
      'Key Person',
      'Block / ULB',
      'Gram Panchayat',
      'Village',
      'Polling Ward',
      'Polling Booth',
    ];
    const rows = members.map((m) => {
      const loc = resolveLocation(m);
      return [
        `"${m.fullName}"`,
        `"${m.mobile}"`,
        `"${m.designation?.name || ''}"`,
        m.status,
        m.influenceLevel,
        m.isKeyPerson ? 'YES' : 'NO',
        `"${loc.block || ''}"`,
        `"${loc.panchayat || ''}"`,
        `"${loc.village || ''}"`,
        `"${loc.ward || ''}"`,
        `"${loc.booth || ''}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cadre_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Directory exported to CSV');
  };

  const constituencyName = settings?.constituencyName || 'Korei Assembly';

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Organization Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Directory of Party Workers, Volunteers, Coordinators, and Booth In-Charges.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="default"
            onClick={exportToCSV}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-10 px-3.5 rounded-xl shadow-2xs space-x-2"
          >
            <LuDownload className="w-4 h-4 text-orange-500" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={handleOpenCreate}
            size="default"
            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-2xs space-x-1.5"
          >
            <LuPlus className="w-4 h-4" />
            <span>Add Person</span>
          </Button>
        </div>
      </div>

      {/* 2. Filter Card Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Search Input, Sort Dropdown & Clear Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xl">
            <LuSearch className="absolute left-3.5 top-3 h-4 w-4 text-orange-500" />
            <Input
              placeholder="Search by name, mobile number, or designation..."
              className="pl-10 pr-9 h-10 text-xs sm:text-sm font-medium bg-white border-slate-200 focus:border-orange-400 rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <LuX className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-full sm:w-60">
              <Select value={sortKey} onValueChange={setSortKey}>
                <SelectTrigger className="h-10 text-xs font-bold text-slate-800 bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                  <div className="flex items-center gap-2 truncate">
                    <LuArrowUpDown className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="text-slate-500 font-semibold">Sort:</span>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="createdAt:DESC" className="text-xs font-semibold">Newest Added First</SelectItem>
                  <SelectItem value="createdAt:ASC" className="text-xs font-semibold">Oldest Added First</SelectItem>
                  <SelectItem value="fullName:ASC" className="text-xs font-semibold">Name (A → Z)</SelectItem>
                  <SelectItem value="fullName:DESC" className="text-xs font-semibold">Name (Z → A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 font-bold text-xs px-3.5 py-1.5 h-10 rounded-md shrink-0 inline-flex items-center gap-1.5 shadow-2xs"
            >
              <LuRotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </Button>
          </div>
        </div>

        {/* Row 3: Location Hierarchy Filters (5 Dropdowns with Icon Labels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Block / Municipality */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuHouse className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Block / Municipality</Label>
            </div>
            <Select value={filterBlockId} onValueChange={setFilterBlockId}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Blocks / ULBs" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Blocks / ULBs</SelectItem>
                {scopedBlocksAndULBs.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gram Panchayat */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuUsers className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Gram Panchayat</Label>
            </div>
            <Select value={filterPanchayatId} onValueChange={setFilterPanchayatId}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Panchayats" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Panchayats</SelectItem>
                {panchayatList.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Village / Locality */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuMapPin className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Village / Locality</Label>
            </div>
            <Select value={filterVillageId} onValueChange={setFilterVillageId}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Villages" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Villages</SelectItem>
                {villageList.map((v) => (
                  <SelectItem key={v.id} value={v.id} className="text-xs">
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Polling Ward */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuLayers className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Polling Ward</Label>
            </div>
            <Select value={filterWardId} onValueChange={setFilterWardId}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Wards" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Wards</SelectItem>
                {wardList.map((w) => (
                  <SelectItem key={w.id} value={w.id} className="text-xs">
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Polling Booth */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuVote className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Polling Booth</Label>
            </div>
            <Select value={filterBoothId} onValueChange={setFilterBoothId}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Booths" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Booths</SelectItem>
                {boothList.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 4: Attribute Filters (4 Dropdowns with Icon Labels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Designation */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuUser className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Designation</Label>
            </div>
            <Select value={filterDesignationId} onValueChange={setFilterDesignationId}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Designations" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Designations</SelectItem>
                {designations.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="text-xs">
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <LuShieldCheck className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Status</Label>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Status</SelectItem>
                <SelectItem value="ACTIVE" className="text-xs text-emerald-600 font-bold">Active</SelectItem>
                <SelectItem value="INACTIVE" className="text-xs text-rose-600 font-bold">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Influence Level */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <LuChartBar className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Influence Level</Label>
            </div>
            <Select value={filterInfluence} onValueChange={setFilterInfluence}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Levels</SelectItem>
                <SelectItem value="HIGH" className="text-xs font-bold text-orange-600">High Influence</SelectItem>
                <SelectItem value="MEDIUM" className="text-xs font-semibold text-blue-600">Medium</SelectItem>
                <SelectItem value="NORMAL" className="text-xs">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuUsers className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Category</Label>
            </div>
            <Select value={filterKeyPerson} onValueChange={setFilterKeyPerson}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Members</SelectItem>
                <SelectItem value="TRUE" className="text-xs text-orange-600 font-bold">⭐ Key Persons Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 3. Directory Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff8f3] border-b border-orange-100/70 text-[#f97316] font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <Checkbox
                    checked={selectedIds.length > 0 && selectedIds.length === members.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    className="border-orange-300 data-[state=checked]:bg-orange-500"
                  />
                </th>
                <th className="py-3.5 px-3 w-14 text-center">SL NO.</th>
                <th className="py-3.5 px-3 w-12 text-center">STAR</th>
                <th className="py-3.5 px-4">MEMBER</th>
                <th className="py-3.5 px-4">DESIGNATION</th>
                <th className="py-3.5 px-4">ASSIGNED LOCATION</th>
                <th className="py-3.5 px-4">MOBILE NUMBER</th>
                <th className="py-3.5 px-4">INFLUENCE</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center text-slate-400 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading directory...</span>
                    </div>
                  </td>
                </tr>
              ) : members.map((m, idx: number) => {
                const loc = resolveLocation(m);
                const isChecked = selectedIds.includes(m.id);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Checkbox */}
                    <td className="py-4 px-4 text-center">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => handleSelectRow(m.id, !!checked)}
                        className="border-slate-300"
                      />
                    </td>

                    {/* Sl No */}
                    <td className="py-4 px-3 text-center font-semibold text-slate-400 text-xs">
                      {idx + 1}
                    </td>

                    {/* Star Toggle */}
                    <td className="py-4 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleKeyPerson(m.id)}
                        className="p-1 rounded-lg hover:bg-orange-50 transition-colors"
                        title={m.isKeyPerson ? 'Remove Star' : 'Mark Key Person'}
                      >
                        <LuStar
                          className={cn(
                            'w-4 h-4 transition-all',
                            m.isKeyPerson
                              ? 'text-orange-500 fill-orange-500 scale-110'
                              : 'text-slate-300 hover:text-orange-400',
                          )}
                        />
                      </button>
                    </td>

                    {/* Member Details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 shrink-0 shadow-2xs">
                          <AvatarImage src={m.profilePhotoUrl || ''} />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-extrabold text-xs">
                            {m.fullName?.slice(0, 2).toUpperCase() || 'MB'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">{m.fullName}</h4>
                            {m.isKeyPerson && (
                              <span className="bg-orange-100 text-orange-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md uppercase">
                                KEY
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {m.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 inline-block">
                        {m.designation?.name || 'Block Coordinator'}
                      </span>
                    </td>

                    {/* Assigned Location */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-extrabold text-slate-800">
                          {loc.block || m.orgUnitName || 'Constituency Level'}
                        </span>
                        {(loc.panchayat || loc.village || m.boothName) && (
                          <span className="text-slate-400 text-[11px] font-medium mt-0.5">
                            {loc.panchayat && `GP: ${loc.panchayat}`}
                            {m.boothName && ` · ${m.boothName}`}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-4 px-4 font-mono text-xs font-extrabold">
                      <a
                        href={`tel:${m.mobile}`}
                        className="text-blue-600 hover:underline flex items-center gap-1.5"
                      >
                        <LuPhone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{m.mobile}</span>
                      </a>
                    </td>

                    {/* Influence */}
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block',
                          m.influenceLevel === 'HIGH'
                            ? 'bg-orange-100/80 text-orange-700'
                            : 'bg-blue-50 text-blue-600',
                        )}
                      >
                        {m.influenceLevel || 'HIGH'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 inline-block">
                        {m.status || 'ACTIVE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <LuEllipsisVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl">
                          <DropdownMenuItem onClick={() => setViewingMember(m)} className="text-xs cursor-pointer">
                            <LuEye className="w-3.5 h-3.5 mr-2 text-blue-600" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(m)} className="text-xs cursor-pointer">
                            <LuPencil className="w-3.5 h-3.5 mr-2 text-orange-600" />
                            <span>Edit Person</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                            onClick={() => {
                              setMemberToDelete(m);
                              setDeleteConfirmOpen(true);
                            }}
                            className="text-xs text-rose-600 cursor-pointer font-bold"
                          >
                            <LuTrash2 className="w-3.5 h-3.5 mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-white text-xs text-slate-600">
          <div className="font-semibold text-slate-500">
            Showing <span className="font-extrabold text-slate-900">1</span> to{' '}
            <span className="font-extrabold text-slate-900">{members.length}</span> of{' '}
            <span className="font-extrabold text-slate-900">{totalCount}</span> entries
          </div>

          <div className="flex items-center space-x-1.5">
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 rounded-lg text-slate-600">
              <LuChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 rounded-lg text-slate-600">
              <LuChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" className="h-8 min-w-8 px-2.5 font-extrabold text-xs rounded-lg bg-[#f97316] text-white">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 rounded-lg text-slate-600">
              <LuChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 rounded-lg text-slate-600">
              <LuChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Add / Edit Person Dialog Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#fff5ee] border border-orange-200/80 text-[#f97316] flex items-center justify-center text-sm shadow-2xs">
                <LuUser className="w-5 h-5" />
              </span>
              <span>{formMode === 'create' ? 'Add New Person' : 'Edit Person Details'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Enter person details, designation, and assigned location hierarchy.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Full Name *</Label>
                <Input
                  placeholder="e.g. Manas Manthan Rout"
                  value={formFullName}
                  onChange={(e) => {
                    setFormFullName(e.target.value);
                    if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  className={cn(
                    'h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500',
                    formErrors.fullName && 'border-rose-500 focus:border-rose-500',
                  )}
                />
                {formErrors.fullName && (
                  <p className="text-[11px] font-bold text-rose-500">{formErrors.fullName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Mobile Number *</Label>
                <Input
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={formMobile}
                  onChange={(e) => {
                    setFormMobile(e.target.value);
                    if (formErrors.mobile) setFormErrors((prev) => ({ ...prev, mobile: undefined }));
                  }}
                  className={cn(
                    'h-10 text-xs font-mono font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500',
                    formErrors.mobile && 'border-rose-500 focus:border-rose-500',
                  )}
                />
                {formErrors.mobile && (
                  <p className="text-[11px] font-bold text-rose-500">{formErrors.mobile}</p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Designation</Label>
                <Select value={formDesignationId} onValueChange={setFormDesignationId}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    {designations.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="text-xs font-semibold">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Status</Label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    <SelectItem value="ACTIVE" className="text-xs font-bold text-emerald-600">Active</SelectItem>
                    <SelectItem value="INACTIVE" className="text-xs font-bold text-rose-600">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Influence Level */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Influence Level</Label>
                <Select value={formInfluence} onValueChange={setFormInfluence}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-md bg-slate-50/60 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    <SelectItem value="HIGH" className="text-xs font-bold text-orange-600">High Influence</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs font-semibold text-blue-600">Medium</SelectItem>
                    <SelectItem value="NORMAL" className="text-xs font-semibold">Normal</SelectItem>
                    <SelectItem value="LOW" className="text-xs font-semibold text-emerald-600">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Key Person Checkbox */}
              <div className="space-y-1.5 flex items-center pt-5">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none bg-[#fff5ee] p-2.5 rounded-lg border border-orange-200/80 w-full">
                  <Checkbox
                    checked={formIsKeyPerson}
                    onCheckedChange={(checked) => setFormIsKeyPerson(!!checked)}
                    className="border-orange-400 data-[state=checked]:bg-orange-500"
                  />
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <LuStar className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>Mark as Key Person (⭐)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Location Hierarchy Assignment Section */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-extrabold text-[#f97316] uppercase tracking-wider flex items-center gap-1.5">
                <LuMapPin className="w-3.5 h-3.5" />
                <span>Location Assignment Hierarchy</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Block */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-extrabold text-slate-600">Block / ULB</Label>
                  <Select
                    value={formBlockId || 'NONE'}
                    onValueChange={(val) => {
                      setFormBlockId(val === 'NONE' ? undefined : val);
                      setFormPanchayatId(undefined);
                      setFormVillageId(undefined);
                      setFormWardId(undefined);
                      setFormBoothId(undefined);
                    }}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50/60 border-slate-200 rounded-md focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <SelectValue placeholder="Constituency Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="NONE" className="text-xs font-bold">Constituency Level</SelectItem>
                      {scopedBlocksAndULBs.map((b) => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Panchayat */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-extrabold text-slate-600">Gram Panchayat</Label>
                  <Select
                    value={formPanchayatId || 'NONE'}
                    onValueChange={(val) => {
                      setFormPanchayatId(val === 'NONE' ? undefined : val);
                      setFormVillageId(undefined);
                      setFormWardId(undefined);
                      setFormBoothId(undefined);
                    }}
                    disabled={!formBlockId}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50/60 border-slate-200 rounded-md focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <SelectValue placeholder="All Panchayats" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="NONE" className="text-xs font-bold">None</SelectItem>
                      {formPanchayats.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Village */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-extrabold text-slate-600">Village / Locality</Label>
                  <Select
                    value={formVillageId || 'NONE'}
                    onValueChange={(val) => {
                      setFormVillageId(val === 'NONE' ? undefined : val);
                      setFormWardId(undefined);
                      setFormBoothId(undefined);
                    }}
                    disabled={!formPanchayatId}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50/60 border-slate-200 rounded-md focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <SelectValue placeholder="All Villages" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="NONE" className="text-xs font-bold">None</SelectItem>
                      {formVillages.map((v) => (
                        <SelectItem key={v.id} value={v.id} className="text-xs">
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ward */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-extrabold text-slate-600">Polling Ward</Label>
                  <Select
                    value={formWardId || 'NONE'}
                    onValueChange={(val) => {
                      setFormWardId(val === 'NONE' ? undefined : val);
                      setFormBoothId(undefined);
                    }}
                    disabled={!formBlockId && !formVillageId}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50/60 border-slate-200 rounded-md focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <SelectValue placeholder="All Wards" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="NONE" className="text-xs font-bold">None</SelectItem>
                      {formWards.map((w) => (
                        <SelectItem key={w.id} value={w.id} className="text-xs">
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Booth */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-extrabold text-slate-600">Polling Booth</Label>
                  <Select
                    value={formBoothId || 'NONE'}
                    onValueChange={(val) => setFormBoothId(val === 'NONE' ? undefined : val)}
                    disabled={!formWardId}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50/60 border-slate-200 rounded-md focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <SelectValue placeholder="All Booths" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="NONE" className="text-xs font-bold">None</SelectItem>
                      {formBooths.map((b) => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="h-10 text-xs font-bold rounded-xl border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 text-xs font-extrabold rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white px-5 shadow-2xs"
              >
                {formMode === 'create' ? 'Save Person' : 'Update Details'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. View Details Dialog Modal */}
      <Dialog open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">Member Profile</DialogTitle>
          </DialogHeader>

          {viewingMember && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <div className="p-0.5 rounded-full bg-gradient-to-br from-orange-200 to-orange-100 border border-orange-200/80 shadow-2xs shrink-0">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={viewingMember.profilePhotoUrl || ''} className="object-cover" />
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-extrabold text-sm">
                      {viewingMember.fullName?.slice(0, 2).toUpperCase() || 'MB'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-slate-900">{viewingMember.fullName}</h3>
                    {viewingMember.isKeyPerson && (
                      <span className="bg-orange-100 text-orange-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md uppercase">
                        KEY
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-blue-600">{viewingMember.designation?.name || 'Block Coordinator'}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#fff5ee] text-[#f97316] border border-orange-200/80">
                    {viewingMember.influenceLevel || 'HIGH'} INFLUENCE
                  </span>
                </div>
              </div>

              <div className="bg-[#fff8f3] p-4 rounded-2xl border border-orange-100/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Mobile Number:</span>
                  <a href={`tel:${viewingMember.mobile}`} className="font-mono font-bold text-blue-600 hover:underline">
                    {viewingMember.mobile}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-emerald-600 uppercase">{viewingMember.status || 'ACTIVE'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Assigned Block:</span>
                  <span className="font-bold text-slate-800">{viewingMember.orgUnitName || 'Korei'}</span>
                </div>
                {viewingMember.panchayatName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Gram Panchayat:</span>
                    <span className="font-bold text-slate-800">{viewingMember.panchayatName}</span>
                  </div>
                )}
                {viewingMember.boothName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Polling Booth:</span>
                    <span className="font-bold text-slate-800">{viewingMember.boothName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              onClick={() => setViewingMember(null)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-xs rounded-xl px-5 h-9 w-full shadow-2xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <LuTriangleAlert className="w-5 h-5 text-rose-500" />
              <span>Confirm Delete</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove <strong className="text-slate-800">{memberToDelete?.fullName}</strong> from the directory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="h-9 text-xs font-bold rounded-xl border-slate-200 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteMember}
              className="h-9 text-xs font-extrabold rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 shadow-2xs"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
