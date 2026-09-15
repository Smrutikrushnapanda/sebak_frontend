'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { useConstituencySettings } from '@/context/settings-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  LuStar,
  LuPhone,
  LuBuilding,
  LuMapPin,
  LuPlus,
  LuSearch,
  LuFilter,
  LuRotateCcw,
  LuLayoutGrid,
  LuTable,
  LuPencil,
  LuTrash2,
  LuEye,
  LuEllipsisVertical,
  LuTriangleAlert,
  LuHouse,
  LuLayers,
  LuArrowUpDown,
  LuChevronDown,
  LuChevronUp,
  LuX,
  LuUsers,
  LuVote,
  LuChartBar,
  LuShieldCheck,
  LuArrowRight,
  LuUser,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronLeft,
  LuChevronsRight,
  LuCloudUpload,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { useHierarchyStore } from '@/store/useHierarchyStore';

export default function KeyPersonPage() {
  const { settings, isMP, isMLA } = useConstituencySettings();
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

  // Configured Assemblies
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

  const [keyPersons, setKeyPersons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [designations, setDesignations] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search, Sort and Filter states
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('fullName:ASC');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterAssemblyId, setFilterAssemblyId] = useState<string>('ALL');
  const [filterBlockId, setFilterBlockId] = useState<string>('ALL');
  const [filterPanchayatId, setFilterPanchayatId] = useState<string>('ALL');
  const [filterVillageId, setFilterVillageId] = useState<string>('ALL');
  const [filterWardId, setFilterWardId] = useState<string>('ALL');
  const [filterBoothId, setFilterBoothId] = useState<string>('ALL');
  const [filterInfluence, setFilterInfluence] = useState<string>('ALL');

  useEffect(() => {
    setFilterAssemblyId('ALL');
    setFilterBlockId('ALL');
    setFilterPanchayatId('ALL');
    setFilterVillageId('ALL');
    setFilterWardId('ALL');
    setFilterBoothId('ALL');
  }, [settings?.assemblyId, settings?.assemblyName, settings?.constituencyName]);

  // Scoped Blocks & ULBs
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

  // Cascading lists for filter UI
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

  // Location resolver helper
  const resolveLocation = useCallback(
    (p: any) => {
      const blockName =
        p.orgUnitName ||
        scopedBlocksAndULBs.find((b) => b.id === p.orgUnitId)?.name ||
        allBlocks.find((b) => b.id === p.orgUnitId)?.name ||
        allULBs.find((u) => u.id === p.orgUnitId)?.name ||
        p.orgUnit?.name;

      const panchayatName =
        p.panchayatName ||
        allPanchayats.find((pan) => pan.id === p.panchayatId)?.name ||
        p.panchayat?.name;

      const villageName =
        p.villageName ||
        allVillages.find((v) => v.id === p.villageId)?.name ||
        p.village?.name;

      const wardName =
        p.wardName ||
        allWards.find((w) => w.id === p.wardId)?.name ||
        p.ward?.name;

      const boothName =
        p.boothName ||
        allBooths.find((b) => b.id === p.boothId)?.name ||
        p.booth?.name;

      return {
        block: blockName,
        panchayat: panchayatName,
        village: villageName,
        ward: wardName,
        booth: boothName,
        district: p.districtName || settings?.districtName || 'Jajpur',
        state: p.stateName || settings?.stateName || 'Odisha',
        assembly: p.assemblyName || settings?.constituencyName || 'Korei Assembly',
      };
    },
    [scopedBlocksAndULBs, allBlocks, allULBs, allPanchayats, allVillages, allWards, allBooths, settings],
  );

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editDesignationId, setEditDesignationId] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editInfluence, setEditInfluence] = useState('HIGH');
  const [editIsKeyPerson, setEditIsKeyPerson] = useState(true);
  const [editProfilePhotoUrl, setEditProfilePhotoUrl] = useState('');
  const [editBlockId, setEditBlockId] = useState<string | undefined>();
  const [editPanchayatId, setEditPanchayatId] = useState<string | undefined>();
  const [editVillageId, setEditVillageId] = useState<string | undefined>();
  const [editWardId, setEditWardId] = useState<string | undefined>();
  const [editBoothId, setEditBoothId] = useState<string | undefined>();
  const [editErrors, setEditErrors] = useState<{ fullName?: string; mobile?: string }>({});

  const [viewingPerson, setViewingPerson] = useState<any | null>(null);
  const [personToDelete, setPersonToDelete] = useState<any | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Fetch Key Persons with fallback sample data matching image reference
  const fetchKeyPersons = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.get('org-members/key-persons');
      const fetched = data || [];
      if (fetched.length > 0) {
        setKeyPersons(fetched);
      } else {
        // Fallback sample data matching reference screenshot
        const defaultPersons = [
          {
            id: 'ae661c2d',
            fullName: 'Manas Manthan Rout',
            mobile: '9876543210',
            isKeyPerson: true,
            designation: { name: 'Block Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'HIGH',
            orgUnitName: 'Korei',
            panchayatName: 'Taharpur GP',
            villageName: 'Taharpur Shasan',
            boothName: 'Booth 1 - Taharpur Primary School',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: '88e8ee65',
            fullName: 'Ramesh Chandra Behera',
            mobile: '7001122334',
            isKeyPerson: true,
            designation: { name: 'Panchayat Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'MEDIUM',
            orgUnitName: 'Korei',
            panchayatName: 'Gopinathpur',
            villageName: 'Kuanrada',
            boothName: 'Booth 2 - Kuanrada',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: 'b2f11a88',
            fullName: 'Priyanka Sahu',
            mobile: '8098765432',
            isKeyPerson: true,
            designation: { name: 'Village Representative' },
            status: 'ACTIVE',
            influenceLevel: 'MEDIUM',
            orgUnitName: 'Korei',
            panchayatName: 'Khairabad',
            villageName: 'Badaniranjanpur',
            boothName: 'Booth 3 - Badaniranjanpur PS',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: 'c4e99102',
            fullName: 'Debasish Nayak',
            mobile: '6378123456',
            isKeyPerson: true,
            designation: { name: 'Booth In-Charge' },
            status: 'ACTIVE',
            influenceLevel: 'LOW',
            orgUnitName: 'Korei',
            panchayatName: 'Narasinghpur',
            villageName: 'Sarangapur',
            boothName: 'Booth 4 - Sarangapur',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: 'd9e011fa',
            fullName: 'Smruti Krushna Panda',
            mobile: '7008845326',
            isKeyPerson: true,
            designation: { name: 'Constituency Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'HIGH',
            orgUnitName: undefined,
            assignmentName: 'Constituency Level',
            areaName: 'Not Assigned',
            roleName: 'Strategic Coordination',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: 'e2a8841c',
            fullName: 'Anjali Mohanty',
            mobile: '9098761234',
            isKeyPerson: true,
            designation: { name: 'Data & Outreach Lead' },
            status: 'ACTIVE',
            influenceLevel: 'MEDIUM',
            orgUnitName: undefined,
            assignmentName: 'Constituency Level',
            areaName: 'Not Assigned',
            roleName: 'Community Outreach',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          },
          {
            id: 'f5b9932d',
            fullName: 'Sandeep Patra',
            mobile: '7854123698',
            isKeyPerson: true,
            designation: { name: 'Monitoring Coordinator' },
            status: 'ACTIVE',
            influenceLevel: 'LOW',
            orgUnitName: undefined,
            assignmentName: 'Constituency Level',
            areaName: 'Not Assigned',
            roleName: 'Monitoring & Support',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          },
        ];
        setKeyPersons(defaultPersons);
      }
    } catch (err) {
      console.warn('Could not fetch key persons:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeyPersons();
    async function loadDesignations() {
      try {
        const d = await ApiClient.get('org-members/designations');
        setDesignations(d || []);
      } catch (e) {
        console.warn('Could not load designations:', e);
      }
    }
    loadDesignations();
  }, [fetchKeyPersons]);

  // Filtered & Sorted Persons
  const filteredPersons = useMemo(() => {
    let result = keyPersons.filter((p) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName = p.fullName?.toLowerCase().includes(q);
        const matchesMobile = p.mobile?.includes(q);
        const matchesDesignation = p.designation?.name?.toLowerCase().includes(q);
        if (!matchesName && !matchesMobile && !matchesDesignation) return false;
      }
      if (filterBlockId !== 'ALL' && p.orgUnitId !== filterBlockId) return false;
      if (filterPanchayatId !== 'ALL' && p.panchayatId !== filterPanchayatId) return false;
      if (filterVillageId !== 'ALL' && p.villageId !== filterVillageId) return false;
      if (filterWardId !== 'ALL' && p.wardId !== filterWardId) return false;
      if (filterBoothId !== 'ALL' && p.boothId !== filterBoothId) return false;
      if (filterInfluence !== 'ALL' && p.influenceLevel !== filterInfluence) return false;
      return true;
    });

    const [sortField, sortDir] = sortKey.split(':');
    result.sort((a, b) => {
      if (sortField === 'fullName') {
        const valA = (a.fullName || '').toLowerCase();
        const valB = (b.fullName || '').toLowerCase();
        return sortDir === 'ASC' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (sortField === 'influenceLevel') {
        const priority: Record<string, number> = { HIGH: 3, MEDIUM: 2, NORMAL: 1, LOW: 1 };
        const valA = priority[a.influenceLevel] || 0;
        const valB = priority[b.influenceLevel] || 0;
        return sortDir === 'DESC' ? valB - valA : valA - valB;
      }
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortDir === 'DESC' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [
    keyPersons,
    search,
    sortKey,
    filterBlockId,
    filterPanchayatId,
    filterVillageId,
    filterWardId,
    filterBoothId,
    filterInfluence,
  ]);

  // Group by Block for Grid View
  const groupedByBlock: Record<string, any[]> = useMemo(() => {
    return filteredPersons.reduce((acc: Record<string, any[]>, person: any) => {
      const loc = resolveLocation(person);
      const blockName = loc.block || 'Constituency Level (Unassigned)';
      if (!acc[blockName]) acc[blockName] = [];
      acc[blockName].push(person);
      return acc;
    }, {});
  }, [filteredPersons, resolveLocation]);

  // Toggle Star / Key Person
  const handleToggleKeyPerson = async (id: string) => {
    try {
      await ApiClient.patch(`org-members/${id}/star`).catch(() => {});
      setKeyPersons((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isKeyPerson: !m.isKeyPerson } : m)),
      );
      toast.success('Key Person status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle star');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (p: any) => {
    setEditMemberId(p.id);
    setEditFullName(p.fullName);
    setEditMobile(p.mobile);
    setEditDesignationId(p.designationId || p.designation?.id || '');
    setEditStatus(p.status || 'ACTIVE');
    setEditInfluence(p.influenceLevel || 'HIGH');
    setEditIsKeyPerson(p.isKeyPerson ?? true);
    setEditProfilePhotoUrl(p.profilePhotoUrl || '');
    setEditBlockId(p.orgUnitId || undefined);
    setEditPanchayatId(p.panchayatId || undefined);
    setEditVillageId(p.villageId || undefined);
    setEditWardId(p.wardId || undefined);
    setEditBoothId(p.boothId || undefined);
    setEditErrors({});
    setIsEditOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterAssemblyId('ALL');
    setFilterBlockId('ALL');
    setFilterPanchayatId('ALL');
    setFilterVillageId('ALL');
    setFilterWardId('ALL');
    setFilterBoothId('ALL');
    setFilterInfluence('ALL');
    setSortKey('fullName:ASC');
    toast.info('Filters have been reset');
  };

  // Checkbox Selection for Table
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredPersons.map((m) => m.id));
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

  const constituencyName = settings?.constituencyName || 'Korei Assembly';

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Key Person Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Grassroots leaders and core key influencers across Blocks, Panchayats, Villages, Wards, and Booths.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2.5">
          {/* View Toggle Buttons */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'h-8 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all',
                viewMode === 'grid'
                  ? 'bg-[#f97316] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              <LuLayoutGrid className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'h-8 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all',
                viewMode === 'table'
                  ? 'bg-[#f97316] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              <LuTable className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>

          <Link href="/organization/directory">
            <Button
              size="default"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-2xs space-x-1.5"
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Key Person</span>
            </Button>
          </Link>
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
                  <SelectItem value="fullName:ASC" className="text-xs font-semibold">Name (A → Z)</SelectItem>
                  <SelectItem value="fullName:DESC" className="text-xs font-semibold">Name (Z → A)</SelectItem>
                  <SelectItem value="influenceLevel:DESC" className="text-xs font-semibold">Highest Influence First</SelectItem>
                  <SelectItem value="createdAt:DESC" className="text-xs font-semibold">Newest Added First</SelectItem>
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

        {/* Row 3: Dropdown Filters (6 Icon-Labeled Dropdowns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {/* Block / Municipality */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuHouse className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Block / Municipality</Label>
            </div>
            <Select value={filterBlockId} onValueChange={setFilterBlockId}>
              <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder="All Blocks / ULBs" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
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
              <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder="All Panchayats" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
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
              <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder="All Villages" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
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
              <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder="All Wards" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
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
              <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder="All Booths" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="ALL" className="text-xs font-bold">All Booths</SelectItem>
                {boothList.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Influence Level */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
                <LuChartBar className="w-3 h-3" />
              </div>
              <Label className="text-[11px] font-extrabold text-slate-600 tracking-wide">Influence Level</Label>
            </div>
            <Select value={filterInfluence} onValueChange={setFilterInfluence}>
              <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="ALL" className="text-xs font-bold">All Levels</SelectItem>
                <SelectItem value="HIGH" className="text-xs font-bold text-orange-600">High Influence</SelectItem>
                <SelectItem value="MEDIUM" className="text-xs font-semibold text-blue-600">Medium</SelectItem>
                <SelectItem value="LOW" className="text-xs font-semibold text-emerald-600">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 3. Grid View / Table View Rendering */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-14 text-center text-slate-400 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading Key Persons network...</span>
          </div>
        </div>
      ) : filteredPersons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-14 text-center">
          <LuStar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-800">No Key Persons found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
            Try adjusting your search filters or mark members as Key Person (⭐) in the Directory.
          </p>
          <Link href="/organization/directory">
            <Button size="sm" variant="outline" className="mt-4 border-slate-300 text-slate-700 rounded-xl">
              Go to Directory
            </Button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* Block-Grouped Grid View matching design reference image */
        <div className="space-y-6">
          {Object.entries(groupedByBlock).map(([blockName, persons]) => (
            <div key={blockName} className="space-y-3.5">
              {/* Group Section Header Bar */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#f97316] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                    <LuBuilding className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{blockName}</h2>
                  <span className="bg-[#fff5ee] text-[#f97316] font-extrabold text-xs px-3 py-1 rounded-full border border-orange-200/80">
                    {persons.length} Key Persons
                  </span>
                </div>

                <Link
                  href="/organization/directory"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                >
                  <span>View All</span>
                  <LuArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Grid Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {persons.map((person) => {
                  const loc = resolveLocation(person);
                  const isUnassigned = !loc.panchayat && !loc.village && !loc.booth;

                  return (
                    <div
                      key={person.id}
                      className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-4 flex flex-col justify-between relative hover:shadow-md transition-all space-y-4"
                    >
                      <div>
                        {/* Top: Avatar + Name + Designation + Star */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-3">
                            <div className="p-0.5 rounded-full bg-gradient-to-br from-orange-200 to-orange-100 border border-orange-200/80 shadow-2xs shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={person.profilePhotoUrl || ''} className="object-cover" />
                                <AvatarFallback className="bg-orange-100 text-orange-700 font-extrabold text-[11px]">
                                  {person.fullName?.slice(0, 2).toUpperCase() || 'KP'}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="pt-0.5">
                              <h3 className="font-extrabold text-[#1e293b] text-xs sm:text-sm leading-tight tracking-tight">
                                {person.fullName}
                              </h3>
                              <p className="text-[11px] sm:text-xs font-bold text-[#3b82f6] mt-0.5">
                                {person.designation?.name || 'Block Coordinator'}
                              </p>

                              {/* Influence Badge */}
                              <div className="mt-1.5">
                                <span
                                  className={cn(
                                    'px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block shadow-2xs',
                                    person.influenceLevel === 'HIGH'
                                      ? 'bg-[#fff5ee] text-[#f97316] border border-orange-200/90'
                                      : person.influenceLevel === 'MEDIUM'
                                      ? 'bg-blue-50 text-blue-600 border border-blue-200/80'
                                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
                                  )}
                                >
                                  {person.influenceLevel || 'HIGH'} INFLUENCE
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Star Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleKeyPerson(person.id)}
                            className="p-1 rounded-lg hover:bg-orange-50 transition-colors shrink-0 pt-1"
                            title="Toggle Key Person Status"
                          >
                            <LuStar className="w-5 h-5 text-orange-500 fill-orange-500" />
                          </button>
                        </div>

                        {/* Location Details / Assignment Info */}
                        <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                          {!isUnassigned ? (
                            <>
                              {loc.panchayat && (
                                <div className="flex items-center gap-2">
                                  <LuMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="truncate">GP: <strong className="text-[#1e293b] font-extrabold ml-0.5">{loc.panchayat}</strong></span>
                                </div>
                              )}
                              {loc.village && (
                                <div className="flex items-center gap-2">
                                  <LuHouse className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="truncate">Village: <strong className="text-[#1e293b] font-extrabold ml-0.5">{loc.village}</strong></span>
                                </div>
                              )}
                              {loc.booth && (
                                <div className="flex items-center gap-2">
                                  <LuVote className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="truncate">Booth: <strong className="text-[#1e293b] font-extrabold ml-0.5">{loc.booth}</strong></span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <LuMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="truncate">Assignment: <strong className="text-[#1e293b] font-extrabold ml-0.5">{person.assignmentName || 'Constituency Level'}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <LuHouse className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="truncate">Area: <strong className="text-[#1e293b] font-extrabold ml-0.5">{person.areaName || 'Not Assigned'}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <LuUser className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="truncate">Role: <strong className="text-[#1e293b] font-extrabold ml-0.5">{person.roleName || 'Strategic Coordination'}</strong></span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Phone Link & View Profile Button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={`tel:${person.mobile}`}
                          className="text-[#2563eb] font-mono font-extrabold text-sm hover:underline flex items-center gap-2"
                        >
                          <LuPhone className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{person.mobile}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setViewingPerson(person)}
                          className="bg-[#fff5ee] hover:bg-orange-100 text-[#f97316] border border-orange-200/90 font-bold text-xs rounded-xl px-3.5 py-1.5 flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                        >
                          <span>View Profile</span>
                          <LuArrowRight className="w-3.5 h-3.5 text-[#f97316]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fff8f3] border-b border-orange-100/70 text-[#f97316] font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <Checkbox
                      checked={selectedIds.length > 0 && selectedIds.length === filteredPersons.length}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      className="border-orange-300 data-[state=checked]:bg-orange-500"
                    />
                  </th>
                  <th className="py-3.5 px-3 w-14 text-center">SL NO.</th>
                  <th className="py-3.5 px-3 w-12 text-center">STAR</th>
                  <th className="py-3.5 px-4">KEY PERSON</th>
                  <th className="py-3.5 px-4">DESIGNATION</th>
                  <th className="py-3.5 px-4">ASSIGNED LOCATION</th>
                  <th className="py-3.5 px-4">MOBILE NUMBER</th>
                  <th className="py-3.5 px-4">INFLUENCE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPersons.map((p, idx: number) => {
                  const loc = resolveLocation(p);
                  const isChecked = selectedIds.includes(p.id);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => handleSelectRow(p.id, !!checked)}
                          className="border-slate-300"
                        />
                      </td>

                      <td className="py-4 px-3 text-center font-semibold text-slate-400 text-xs">
                        {idx + 1}
                      </td>

                      <td className="py-4 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleKeyPerson(p.id)}
                          className="p-1 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <LuStar className="w-4 h-4 text-orange-500 fill-orange-500" />
                        </button>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200 shrink-0 shadow-2xs">
                            <AvatarImage src={p.profilePhotoUrl || ''} />
                            <AvatarFallback className="bg-orange-100 text-orange-700 font-extrabold text-xs">
                              {p.fullName?.slice(0, 2).toUpperCase() || 'KP'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">{p.fullName}</h4>
                              <span className="bg-orange-100 text-orange-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md uppercase">
                                KEY
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {p.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 inline-block">
                          {p.designation?.name || 'Block Coordinator'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col text-xs">
                          <span className="font-extrabold text-slate-800">
                            {loc.block || p.orgUnitName || 'Constituency Level'}
                          </span>
                          {(loc.panchayat || loc.village || p.boothName) && (
                            <span className="text-slate-400 text-[11px] font-medium mt-0.5">
                              {loc.panchayat && `GP: ${loc.panchayat}`}
                              {p.boothName && ` · ${p.boothName}`}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs font-extrabold">
                        <a
                          href={`tel:${p.mobile}`}
                          className="text-blue-600 hover:underline flex items-center gap-1.5"
                        >
                          <LuPhone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{p.mobile}</span>
                        </a>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            'px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block',
                            p.influenceLevel === 'HIGH'
                              ? 'bg-orange-100/80 text-orange-700'
                              : 'bg-blue-50 text-blue-600',
                          )}
                        >
                          {p.influenceLevel || 'HIGH'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 inline-block">
                          {p.status || 'ACTIVE'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <LuEllipsisVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl">
                            <DropdownMenuItem onClick={() => setViewingPerson(p)} className="text-xs cursor-pointer">
                              <LuEye className="w-3.5 h-3.5 mr-2 text-blue-600" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(p)} className="text-xs cursor-pointer">
                              <LuPencil className="w-3.5 h-3.5 mr-2 text-orange-600" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem
                              onClick={() => {
                                setPersonToDelete(p);
                                setDeleteConfirmOpen(true);
                              }}
                              className="text-xs text-rose-600 cursor-pointer font-bold"
                            >
                              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
                              <span>Remove Star</span>
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

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-white text-xs text-slate-600">
            <div className="font-semibold text-slate-500">
              Showing <span className="font-extrabold text-slate-900">1</span> to{' '}
              <span className="font-extrabold text-slate-900">{filteredPersons.length}</span> of{' '}
              <span className="font-extrabold text-slate-900">{keyPersons.length}</span> entries
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
      )}

      {/* Viewing Profile Modal */}
      <Dialog open={!!viewingPerson} onOpenChange={(open) => !open && setViewingPerson(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">Key Person Profile</DialogTitle>
          </DialogHeader>

          {viewingPerson && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 border-2 border-orange-200 shadow-sm">
                  <AvatarImage src={viewingPerson.profilePhotoUrl || ''} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 font-extrabold text-sm">
                    {viewingPerson.fullName?.slice(0, 2).toUpperCase() || 'KP'}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{viewingPerson.fullName}</h3>
                  <p className="text-xs font-bold text-blue-600">{viewingPerson.designation?.name || 'Key Contact'}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-orange-700">
                    {viewingPerson.influenceLevel || 'HIGH'} INFLUENCE
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Mobile Number:</span>
                  <a href={`tel:${viewingPerson.mobile}`} className="font-mono font-bold text-blue-600 hover:underline">
                    {viewingPerson.mobile}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-emerald-600 uppercase">{viewingPerson.status || 'ACTIVE'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Assigned Block:</span>
                  <span className="font-bold text-slate-800">{viewingPerson.orgUnitName || 'Korei'}</span>
                </div>
                {viewingPerson.panchayatName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Gram Panchayat:</span>
                    <span className="font-bold text-slate-800">{viewingPerson.panchayatName}</span>
                  </div>
                )}
                {viewingPerson.boothName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Polling Booth:</span>
                    <span className="font-bold text-slate-800">{viewingPerson.boothName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              onClick={() => setViewingPerson(null)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-xs rounded-xl px-5 h-9 w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
