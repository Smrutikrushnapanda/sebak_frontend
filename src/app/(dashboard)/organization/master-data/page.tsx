'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  useHierarchyStore,
  BlockItem,
  PanchayatItem,
  VillageItem,
  WardItem,
  BoothItem,
  UrbanLocalBodyItem,
  AssemblyConstituencyItem,
} from '@/store/useHierarchyStore';
import { useConstituencySettings } from '@/context/settings-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DataTable, Column } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  LuPlus,
  LuLayers,
  LuEye,
  LuPencil,
  LuTrash2,
  LuEllipsisVertical,
  LuBuilding2,
  LuLandmark,
  LuUsers,
  LuVote,
  LuMapPin,
  LuHouse,
  LuSettings,
} from 'react-icons/lu';

type ModalType = 'DISTRICT' | 'CONSTITUENCY' | 'BLOCK' | 'PANCHAYAT' | 'VILLAGE' | 'WARD' | 'BOOTH' | null;

export default function MasterDataPage() {
  const { isMP, settings, getOrganizationRootLabel } = useConstituencySettings();

  const {
    states,
    districts,
    assemblyConstituencies,
    blocks,
    urbanLocalBodies,
    panchayats,
    villages,
    wards,
    booths,
    getDistrictsByState,
    addDistrict,
    updateDistrict,
    deleteDistrict,
    addAssemblyConstituency,
    updateAssemblyConstituency,
    deleteAssemblyConstituency,
    addBlock,
    updateBlock,
    deleteBlock,
    addULB,
    updateULB,
    deleteULB,
    addPanchayat,
    updatePanchayat,
    deletePanchayat,
    addVillage,
    updateVillage,
    deleteVillage,
    addWard,
    updateWard,
    deleteWard,
    addBooth,
    updateBooth,
    deleteBooth,
  } = useHierarchyStore();

  const [activeTab, setActiveTab] = useState<string>('districts');

  // Cascading Filter States for Tabs
  const [selectedStateId, setSelectedStateId] = useState<number | string>(126); // Odisha ID
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | string>(126013); // Jajpur ID
  const [selectedBlockId, setSelectedBlockId] = useState<string>('ALL');
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<string>('ALL');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('ALL');
  const [selectedWardId, setSelectedWardId] = useState<string>('ALL');

  // Districts for selected state
  const districtList = useMemo(() => {
    return getDistrictsByState(selectedStateId);
  }, [selectedStateId, getDistrictsByState]);

  // Filtered Districts tab list
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      return !selectedStateId || selectedStateId === 'ALL' || String(d.stateId) === String(selectedStateId);
    });
  }, [districts, selectedStateId]);

  // Active Assemblies list (from settings context or store)
  const activeAssemblies = useMemo(() => {
    if (isMP && settings?.assemblyConstituencies && settings.assemblyConstituencies.length > 0) {
      return settings.assemblyConstituencies;
    }
    if (assemblyConstituencies && assemblyConstituencies.length > 0) {
      return assemblyConstituencies;
    }
    return [
      { id: '126013001', name: 'Korei Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
      { id: '126013002', name: 'Jajpur Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    ];
  }, [isMP, settings, assemblyConstituencies]);

  // Combined Blocks & Municipalities / ULBs list
  const filteredBlocksAndULBs = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      unitType: 'RURAL_BLOCK' | 'MUNICIPALITY' | 'NAC' | 'MUNICIPAL_CORPORATION';
      districtId?: number | string;
      assemblyId?: string;
      isULB: boolean;
      subUnitLabel: string;
      subUnitCount: number;
      original: any;
    }> = [];

    // 1. Rural Blocks
    blocks.forEach((b) => {
      if (!selectedDistrictId || selectedDistrictId === 'ALL' || String(b.districtId) === String(selectedDistrictId)) {
        const gpCount = panchayats.filter((p) => p.blockId === b.id).length;
        list.push({
          id: b.id,
          name: b.name,
          unitType: (b.unitType as any) || 'RURAL_BLOCK',
          districtId: b.districtId,
          assemblyId: b.assemblyId,
          isULB: false,
          subUnitLabel: 'Gram Panchayats',
          subUnitCount: gpCount,
          original: b,
        });
      }
    });

    // 2. Urban Local Bodies (Municipalities, NACs, Corporations)
    urbanLocalBodies.forEach((u) => {
      if (!selectedDistrictId || selectedDistrictId === 'ALL' || String(u.districtId) === String(selectedDistrictId)) {
        const wardCount = wards.filter((w) => w.parentType === 'ULB' && w.parentId === u.id).length;
        list.push({
          id: u.id,
          name: u.name,
          unitType: (u.ulbType as any) || 'MUNICIPALITY',
          districtId: u.districtId,
          assemblyId: u.assemblyId,
          isULB: true,
          subUnitLabel: 'Municipal Wards',
          subUnitCount: wardCount,
          original: u,
        });
      }
    });

    return list;
  }, [blocks, urbanLocalBodies, panchayats, wards, selectedDistrictId]);

  // Cascading Dropdown lists
  const filteredBlocks = useMemo(() => {
    if (selectedDistrictId && selectedDistrictId !== 'ALL') {
      return blocks.filter((b) => String(b.districtId) === String(selectedDistrictId));
    }
    return blocks;
  }, [blocks, selectedDistrictId]);

  const filteredPanchayats = useMemo(() => {
    if (selectedBlockId !== 'ALL') {
      return panchayats.filter((p) => p.blockId === selectedBlockId);
    }
    return panchayats;
  }, [panchayats, selectedBlockId]);

  const filteredVillages = useMemo(() => {
    if (selectedPanchayatId !== 'ALL') {
      return villages.filter((v) => v.panchayatId === selectedPanchayatId);
    }
    return villages;
  }, [villages, selectedPanchayatId]);

  const filteredWards = useMemo(() => {
    if (selectedVillageId !== 'ALL') {
      return wards.filter((w) => w.parentId === selectedVillageId);
    }
    return wards;
  }, [wards, selectedVillageId]);

  const filteredBooths = useMemo(() => {
    if (selectedWardId !== 'ALL') {
      return booths.filter((b) => b.wardId === selectedWardId);
    }
    return booths;
  }, [booths, selectedWardId]);

  // Modal Dialog States
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Modal Form States
  const [formName, setFormName] = useState('');
  const [formUnitType, setFormUnitType] = useState<'RURAL_BLOCK' | 'MUNICIPALITY' | 'NAC' | 'MUNICIPAL_CORPORATION'>('RURAL_BLOCK');
  const [formAssemblyId, setFormAssemblyId] = useState('');
  const [formParentId, setFormParentId] = useState('');
  const [formDistrictId, setFormDistrictId] = useState<number>(126013);
  const [formRuralEnabled, setFormRuralEnabled] = useState(true);
  const [formUrbanEnabled, setFormUrbanEnabled] = useState(true);
  const [formWardIds, setFormWardIds] = useState<string[]>([]);
  const [wardFilterTerm, setWardFilterTerm] = useState('');

  // Open Add Modal
  const openAddModal = (
    type: ModalType,
    defaultParentId = '',
    defaultUnitType: 'RURAL_BLOCK' | 'MUNICIPALITY' | 'NAC' | 'MUNICIPAL_CORPORATION' = 'RURAL_BLOCK',
  ) => {
    setModalType(type);
    setModalMode('add');
    setEditingItem(null);
    setFormName('');
    setFormUnitType(defaultUnitType);
    setFormAssemblyId(activeAssemblies[0]?.id || '126013001');
    setFormParentId(type === 'DISTRICT' ? String(selectedStateId) : defaultParentId);
    setFormDistrictId(Number(selectedDistrictId) || 126013);
    setFormRuralEnabled(true);
    setFormUrbanEnabled(true);
    setFormWardIds(defaultParentId ? [defaultParentId] : []);
    setWardFilterTerm('');
  };

  // Open Edit Modal
  const openEditModal = (type: ModalType, item: any) => {
    setModalType(type);
    setModalMode('edit');
    setEditingItem(item);
    setFormName(item.name || '');
    if (type === 'DISTRICT') {
      setFormParentId(String(item.stateId || selectedStateId));
    }
    if (type === 'CONSTITUENCY') {
      setFormDistrictId(item.districtId || 126013);
      setFormRuralEnabled(item.ruralEnabled ?? true);
      setFormUrbanEnabled(item.urbanEnabled ?? true);
    }
    if (type === 'BLOCK') {
      setFormDistrictId(item.districtId || 126013);
      setFormUnitType(item.unitType || item.ulbType || 'RURAL_BLOCK');
      setFormAssemblyId(item.assemblyId || '');
    }
    if (type === 'PANCHAYAT') setFormParentId(item.blockId || '');
    if (type === 'VILLAGE') setFormParentId(item.panchayatId || '');
    if (type === 'WARD') setFormParentId(item.parentId || '');
    if (type === 'BOOTH') {
      const initialWards = item.wardIds && item.wardIds.length > 0 ? item.wardIds : (item.wardId ? [item.wardId] : []);
      setFormWardIds(initialWards);
      setFormParentId(initialWards[0] || '');
      setWardFilterTerm('');
    }
  };

  // Open View Modal
  const openViewModal = (type: ModalType, item: any) => {
    setModalType(type);
    setModalMode('view');
    setEditingItem(item);
    if (type === 'BOOTH') {
      const initialWards = item.wardIds && item.wardIds.length > 0 ? item.wardIds : (item.wardId ? [item.wardId] : []);
      setFormWardIds(initialWards);
    }
  };

  // Handle Save Record
  const handleSave = () => {
    if (modalMode === 'view') {
      setModalType(null);
      return;
    }

    if (!formName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (modalType === 'DISTRICT') {
      if (modalMode === 'add') {
        addDistrict({
          name: formName.trim(),
          stateId: formParentId || selectedStateId,
        });
        toast.success(`District "${formName}" added successfully`);
      } else {
        updateDistrict(editingItem.id, {
          name: formName.trim(),
        });
        toast.success(`District updated successfully`);
      }
    } else if (modalType === 'CONSTITUENCY') {
      if (modalMode === 'add') {
        const cleanName = formName.trim().endsWith('Assembly') ? formName.trim() : `${formName.trim()} Assembly`;
        addAssemblyConstituency({
          name: cleanName,
          districtId: formDistrictId,
          ruralEnabled: formRuralEnabled,
          urbanEnabled: formUrbanEnabled,
        });
        toast.success(`Constituency "${cleanName}" added successfully`);
      } else {
        updateAssemblyConstituency(editingItem.id, {
          name: formName.trim(),
          ruralEnabled: formRuralEnabled,
          urbanEnabled: formUrbanEnabled,
        });
        toast.success(`Constituency updated successfully`);
      }
    } else if (modalType === 'BLOCK') {
      if (formUnitType === 'RURAL_BLOCK') {
        if (modalMode === 'add') {
          addBlock({
            name: formName.trim(),
            districtId: formDistrictId,
            assemblyId: formAssemblyId || undefined,
          });
          toast.success(`Rural Block "${formName}" added successfully`);
        } else {
          if (editingItem.isULB) {
            deleteULB(editingItem.id);
            addBlock({ name: formName.trim(), districtId: formDistrictId, assemblyId: formAssemblyId || undefined });
          } else {
            updateBlock(editingItem.id, { name: formName.trim() });
          }
          toast.success(`Block updated successfully`);
        }
      } else {
        // Urban Local Body (Municipality / NAC / Corporation)
        if (modalMode === 'add') {
          addULB({
            name: formName.trim(),
            ulbType: formUnitType,
            districtId: formDistrictId,
            assemblyId: formAssemblyId || undefined,
          });
          const typeLabel =
            formUnitType === 'MUNICIPALITY'
              ? 'Municipality'
              : formUnitType === 'NAC'
              ? 'NAC'
              : 'Municipal Corporation';
          toast.success(`${typeLabel} "${formName}" added successfully`);
        } else {
          if (!editingItem.isULB) {
            deleteBlock(editingItem.id);
            addULB({ name: formName.trim(), ulbType: formUnitType, districtId: formDistrictId, assemblyId: formAssemblyId || undefined });
          } else {
            updateULB(editingItem.id, { name: formName.trim(), ulbType: formUnitType });
          }
          toast.success(`Urban Local Body updated successfully`);
        }
      }
    } else if (modalType === 'PANCHAYAT') {
      if (!formParentId) {
        toast.error('Please select a parent Block');
        return;
      }
      if (modalMode === 'add') {
        addPanchayat({ name: formName.trim(), blockId: formParentId });
        toast.success(`Gram Panchayat "${formName}" added successfully`);
      } else {
        updatePanchayat(editingItem.id, { name: formName.trim(), blockId: formParentId });
        toast.success(`Gram Panchayat updated successfully`);
      }
    } else if (modalType === 'VILLAGE') {
      if (!formParentId) {
        toast.error('Please select a parent Gram Panchayat');
        return;
      }
      if (modalMode === 'add') {
        addVillage({ name: formName.trim(), panchayatId: formParentId });
        toast.success(`Village "${formName}" added successfully`);
      } else {
        updateVillage(editingItem.id, { name: formName.trim(), panchayatId: formParentId });
        toast.success(`Village updated successfully`);
      }
    } else if (modalType === 'WARD') {
      if (!formParentId) {
        toast.error('Please select a parent Village');
        return;
      }
      if (modalMode === 'add') {
        addWard({ name: formName.trim(), parentType: 'VILLAGE', parentId: formParentId });
        toast.success(`Ward "${formName}" added successfully`);
      } else {
        updateWard(editingItem.id, { name: formName.trim(), parentType: 'VILLAGE', parentId: formParentId });
        toast.success(`Ward updated successfully`);
      }
    } else if (modalType === 'BOOTH') {
      if (formWardIds.length === 0 && !formParentId) {
        toast.error('Please select at least one Polling Ward for this Booth');
        return;
      }
      const selectedWards = formWardIds.length > 0 ? formWardIds : (formParentId ? [formParentId] : []);
      const primaryWardId = selectedWards[0];
      if (modalMode === 'add') {
        addBooth({ name: formName.trim(), wardId: primaryWardId, wardIds: selectedWards });
        toast.success(`Polling Booth "${formName}" added with ${selectedWards.length} ward(s)`);
      } else {
        updateBooth(editingItem.id, { name: formName.trim(), wardId: primaryWardId, wardIds: selectedWards });
        toast.success(`Polling Booth updated successfully`);
      }
    }

    setModalType(null);
  };

  // Handle Delete Record
  const handleDelete = (type: ModalType, item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      return;
    }

    let res: { success: boolean; error?: string } = { success: true };
    if (type === 'DISTRICT') res = deleteDistrict(item.id);
    if (type === 'CONSTITUENCY') res = deleteAssemblyConstituency(item.id);
    if (type === 'BLOCK') {
      if (item.isULB) {
        res = deleteULB(item.id);
      } else {
        res = deleteBlock(item.id);
      }
    }
    if (type === 'PANCHAYAT') res = deletePanchayat(item.id);
    if (type === 'VILLAGE') res = deleteVillage(item.id);
    if (type === 'WARD') res = deleteWard(item.id);
    if (type === 'BOOTH') res = deleteBooth(item.id);

    if (res.success) {
      toast.success(`Deleted successfully`);
    } else {
      toast.error(res.error || 'Cannot delete item with dependent child nodes.');
    }
  };

  // 1. DISTRICTS COLUMNS
  const districtColumns: Column<any>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'District Name',
      sortable: true,
      render: (d) => <span className="font-bold text-slate-900">{d.name}</span>,
    },
    {
      key: 'stateId',
      header: 'State',
      sortable: true,
      render: (d) => {
        const stateName = states.find((s) => String(s.id) === String(d.stateId))?.name || 'Odisha';
        return <span className="text-slate-600 font-medium">{stateName}</span>;
      },
    },
    {
      key: 'stats',
      header: 'Hierarchy Coverage',
      render: (d) => {
        const acCount = assemblyConstituencies.filter((a) => String(a.districtId) === String(d.id)).length;
        const blkCount = blocks.filter((b) => String(b.districtId) === String(d.id)).length;
        return (
          <div className="flex items-center gap-1.5">
            <Badge className="bg-primary-50 text-primary-700 border-primary-200 font-semibold text-xs">
              {acCount} Assemblies
            </Badge>
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs">
              {blkCount} Blocks
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (d) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('DISTRICT', d)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('DISTRICT', d)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit District</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedDistrictId(d.id);
                openAddModal('CONSTITUENCY');
              }}
              className="text-xs text-primary-700 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5 mr-2" />
              <span>Add Constituency</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedDistrictId(d.id);
                openAddModal('BLOCK');
              }}
              className="text-xs text-emerald-700 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5 mr-2" />
              <span>Add Block / Municipality</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('DISTRICT', d)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 2. CONSTITUENCIES COLUMNS
  const constituencyColumns: Column<any>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'Assembly Constituency',
      sortable: true,
      render: (ac) => (
        <div>
          <span className="font-bold text-slate-900">{ac.name}</span>
          <p className="text-[11px] text-slate-500 font-medium">District: {ac.districtName || 'Jajpur'}</p>
        </div>
      ),
    },
    {
      key: 'coverage',
      header: 'Administrative Wings',
      render: (ac) => (
        <div className="flex items-center gap-1.5">
          {ac.ruralEnabled !== false && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
              🌾 Rural (Blocks & GPs)
            </Badge>
          )}
          {ac.urbanEnabled !== false && (
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs font-semibold">
              🏢 Urban (Municipalities)
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (ac) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('CONSTITUENCY', ac)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('CONSTITUENCY', ac)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit Constituency</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openAddModal('BLOCK', '', 'RURAL_BLOCK');
              }}
              className="text-xs text-primary-700 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5 mr-2" />
              <span>Add Block Under AC</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('CONSTITUENCY', ac)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 3. BLOCKS & ULBs COLUMNS
  const blockColumns: Column<any>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'Block / Municipality Name',
      sortable: true,
      render: (b) => (
        <div>
          <span className="font-bold text-slate-900">{b.name}</span>
          <p className="text-[11px] text-slate-500 font-medium">
            District: {districts.find((d) => String(d.id) === String(b.districtId))?.name || 'Jajpur'}
          </p>
        </div>
      ),
    },
    {
      key: 'unitType',
      header: 'Unit Type',
      sortable: true,
      render: (b) => {
        if (b.unitType === 'RURAL_BLOCK') {
          return (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
              🌾 Rural Block
            </Badge>
          );
        }
        if (b.unitType === 'MUNICIPALITY') {
          return (
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs font-semibold">
              🏢 Municipality
            </Badge>
          );
        }
        if (b.unitType === 'NAC') {
          return (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold">
              🏛️ NAC
            </Badge>
          );
        }
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
            🏙️ Corporation
          </Badge>
        );
      },
    },
    {
      key: 'subUnitCount',
      header: 'Sub-Units Coverage',
      sortable: true,
      render: (b) => (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs">
          {b.subUnitCount} {b.subUnitLabel}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (b) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('BLOCK', b.original)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('BLOCK', b.original)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit Unit</span>
            </DropdownMenuItem>
            {!b.isULB && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBlockId(b.id);
                  openAddModal('PANCHAYAT', b.id);
                }}
                className="text-xs text-primary-700 cursor-pointer"
              >
                <LuPlus className="w-3.5 h-3.5 mr-2" />
                <span>Add Gram Panchayat</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('BLOCK', b.original)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 4. PANCHAYATS COLUMNS
  const panchayatColumns: Column<PanchayatItem>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'Gram Panchayat Name',
      sortable: true,
      render: (p) => <span className="font-bold text-slate-900">{p.name}</span>,
    },
    {
      key: 'blockId',
      header: 'Parent Block',
      sortable: true,
      render: (p) => {
        const blk = blocks.find((b) => b.id === p.blockId);
        return <span className="text-slate-600 font-medium">{blk?.name || 'Korei Block'}</span>;
      },
    },
    {
      key: 'villages',
      header: 'Villages Count',
      render: (p) => {
        const vCount = villages.filter((v) => v.panchayatId === p.id).length;
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs">
            {vCount} Villages
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('PANCHAYAT', p)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('PANCHAYAT', p)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit GP</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedPanchayatId(p.id);
                openAddModal('VILLAGE', p.id);
              }}
              className="text-xs text-primary-700 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5 mr-2" />
              <span>Add Village</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('PANCHAYAT', p)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 5. VILLAGES COLUMNS
  const villageColumns: Column<VillageItem>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'Village / Locality Name',
      sortable: true,
      render: (v) => <span className="font-bold text-slate-900">{v.name}</span>,
    },
    {
      key: 'panchayatId',
      header: 'Gram Panchayat',
      sortable: true,
      render: (v) => {
        const gp = panchayats.find((p) => p.id === v.panchayatId);
        return <span className="text-slate-600 font-medium">{gp?.name || 'GP'}</span>;
      },
    },
    {
      key: 'wards',
      header: 'Polling Wards',
      render: (v) => {
        const wCount = wards.filter((w) => w.parentId === v.id).length;
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs">
            {wCount} Wards
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (v) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('VILLAGE', v)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('VILLAGE', v)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit Village</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedVillageId(v.id);
                openAddModal('WARD', v.id);
              }}
              className="text-xs text-primary-700 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5 mr-2" />
              <span>Add Polling Ward</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('VILLAGE', v)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 6. WARDS COLUMNS
  const wardColumns: Column<WardItem>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'Ward Name',
      sortable: true,
      render: (w) => (
        <div>
          <span className="font-bold text-slate-900">{w.name}</span>
          {w.wardNumber && (
            <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1 font-bold">
              #{w.wardNumber}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'parentType',
      header: 'Area / Parent Body',
      sortable: true,
      render: (w) => {
        if (w.parentType === 'ULB') {
          const ulb = urbanLocalBodies.find((u) => u.id === w.parentId);
          return (
            <div className="flex items-center space-x-1.5">
              <Badge variant="outline" className="text-[10px] py-0 px-1 font-bold bg-primary-50 text-primary-700 border-primary-200">
                Urban
              </Badge>
              <span className="text-xs font-medium text-slate-700">{ulb?.name || 'Vyasnagar Municipality'}</span>
            </div>
          );
        }
        const v = villages.find((item) => item.id === w.parentId);
        return (
          <div className="flex items-center space-x-1.5">
            <Badge variant="secondary" className="text-[10px] py-0 px-1 font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
              Rural
            </Badge>
            <span className="text-xs font-medium text-slate-700">{v?.name || w.parentId}</span>
          </div>
        );
      },
    },
    {
      key: 'malePopulation',
      header: 'Male',
      sortable: true,
      render: (w) => <span className="text-xs font-medium text-slate-700">{(w.malePopulation || 0).toLocaleString('en-IN')}</span>,
    },
    {
      key: 'femalePopulation',
      header: 'Female',
      sortable: true,
      render: (w) => <span className="text-xs font-medium text-slate-700">{(w.femalePopulation || 0).toLocaleString('en-IN')}</span>,
    },
    {
      key: 'census2011',
      header: '2011 Census',
      render: (w) => (
        <span className="text-xs font-bold text-slate-700">
          {(w.census2011Population || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'census2027',
      header: '2027 Est',
      render: (w) => (
        <Badge variant="accent" className="text-xs font-bold bg-amber-50 text-amber-900 border-amber-200">
          {(w.census2027Population || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'booths',
      header: 'Polling Booths',
      render: (w) => {
        const bCount = booths.filter((b) => b.wardId === w.id || (b.wardIds && b.wardIds.includes(w.id))).length;
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs">
            {bCount} Booth{bCount === 1 ? '' : 's'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (w) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('WARD', w)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('WARD', w)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit Ward</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedWardId(w.id);
                openAddModal('BOOTH', w.id);
              }}
              className="text-xs text-primary-700 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5 mr-2" />
              <span>Add Polling Booth</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('WARD', w)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 7. BOOTHS COLUMNS
  const boothColumns: Column<BoothItem>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },

    {
      key: 'name',
      header: 'Polling Booth Name',
      sortable: true,
      render: (b) => <span className="font-bold text-slate-900">{b.name}</span>,
    },
    {
      key: 'wardId',
      header: 'Covered Polling Wards',
      sortable: true,
      render: (b) => {
        const wardIdList = b.wardIds && b.wardIds.length > 0 ? b.wardIds : (b.wardId ? [b.wardId] : []);
        const mappedWards = wards.filter((w) => wardIdList.includes(w.id));
        if (mappedWards.length === 0) {
          return <span className="text-slate-400 text-xs">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {mappedWards.map((w) => (
              <Badge key={w.id} variant="outline" className="text-[11px] font-medium py-0 px-1.5 bg-slate-50 text-slate-700">
                {w.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (b) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem onClick={() => openViewModal('BOOTH', b)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal('BOOTH', b)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Edit Booth</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => handleDelete('BOOTH', b)} className="text-xs text-rose-600 cursor-pointer">
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Organization Master Data
            </h1>
            <span className="max-w-full text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-[#fff5ee] text-[#f97316] border border-orange-200/80 tracking-wider truncate">
              {getOrganizationRootLabel()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage Districts, Constituencies, Blocks, Municipalities, Gram Panchayats, Villages, Wards, and Polling Booths with integrated pagination and filters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
          <Link href="/settings" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="default"
              className="w-full sm:w-auto h-10 text-xs sm:text-sm font-semibold space-x-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs"
            >
              <LuSettings className="w-4 h-4 text-slate-600" />
              <span>Configure in Settings</span>
            </Button>
          </Link>

          <Button
            size="default"
            onClick={() => {
              if (activeTab === 'districts') openAddModal('DISTRICT');
              else if (activeTab === 'constituencies') openAddModal('CONSTITUENCY');
              else if (activeTab === 'blocks') openAddModal('BLOCK');
              else if (activeTab === 'panchayats') openAddModal('PANCHAYAT');
              else if (activeTab === 'villages') openAddModal('VILLAGE');
              else if (activeTab === 'wards') openAddModal('WARD');
              else if (activeTab === 'booths') openAddModal('BOOTH');
            }}
            className="w-full sm:w-auto bg-[#f97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-semibold space-x-2 h-10 px-4 rounded-xl shadow-2xs"
          >
            <LuPlus className="w-4 h-4" />
            <span>
              {activeTab === 'districts'
                ? 'Add District'
                : activeTab === 'constituencies'
                ? 'Add Constituency'
                : activeTab === 'blocks'
                ? 'Add Block / Municipality'
                : activeTab === 'panchayats'
                ? 'Add Panchayat'
                : activeTab === 'villages'
                ? 'Add Village'
                : activeTab === 'wards'
                ? 'Add Ward'
                : 'Add Booth'}
            </span>
          </Button>
        </div>
      </div>

      {/* 2. Main Tabbed Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-2 min-w-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Top Tabs Bar */}
          <div className="pb-1 overflow-x-auto">
            <TabsList className="bg-[#f8fafc] p-1.5 rounded-2xl h-auto inline-flex min-w-max items-center justify-start gap-1 border border-slate-200/60">
              <TabsTrigger
                value="districts"
                className="group flex-1 min-w-[120px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuMapPin className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Districts</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {filteredDistricts.length || 30}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="constituencies"
                className="group flex-1 min-w-[130px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuLandmark className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Constituencies</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {activeAssemblies.length || 7}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="blocks"
                className="group flex-1 min-w-[150px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuBuilding2 className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Blocks / Municipalities</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {filteredBlocksAndULBs.length || 3}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="panchayats"
                className="group flex-1 min-w-[130px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuUsers className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Gram Panchayats</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {filteredPanchayats.length || 37}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="villages"
                className="group flex-1 min-w-[110px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuHouse className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Villages</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {filteredVillages.length || 86}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="wards"
                className="group flex-1 min-w-[120px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuLayers className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Polling Wards</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {filteredWards.length || 31}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="booths"
                className="group flex-1 min-w-[120px] lg:min-w-0 justify-center text-center flex items-center space-x-1.5 text-xs font-bold px-2 py-1.5 rounded-xl transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#f97316] data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:shadow-2xs text-slate-600 hover:text-slate-900"
              >
                <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] flex items-center justify-center shrink-0">
                  <LuVote className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Polling Booths</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 group-data-[state=active]:bg-orange-100 group-data-[state=active]:text-[#f97316] text-slate-600 shrink-0">
                  {filteredBooths.length || 10}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: DISTRICTS */}
          <TabsContent value="districts" className="m-0 p-3 sm:p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Filter State</Label>
                <Select
                  value={String(selectedStateId)}
                  onValueChange={(val) => {
                    setSelectedStateId(val);
                    const d = getDistrictsByState(val);
                    if (d.length > 0) setSelectedDistrictId(d[0].id);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredDistricts}
              columns={districtColumns}
              searchPlaceholder="Search district name or code..."
              defaultPageSize={10}
            />
          </TabsContent>

          {/* TAB 2: CONSTITUENCIES */}
          <TabsContent value="constituencies" className="m-0 p-3 sm:p-4 space-y-4">
            <DataTable
              data={activeAssemblies}
              columns={constituencyColumns}
              searchPlaceholder="Search assembly constituency..."
              defaultPageSize={10}
            />
          </TabsContent>

          {/* TAB 3: BLOCKS & MUNICIPALITIES */}
          <TabsContent value="blocks" className="m-0 p-3 sm:p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Filter District</Label>
                <Select
                  value={String(selectedDistrictId)}
                  onValueChange={(val) => {
                    setSelectedDistrictId(val);
                    setSelectedBlockId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Districts</SelectItem>
                    {districtList.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)} className="text-xs">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredBlocksAndULBs}
              columns={blockColumns}
              searchPlaceholder="Search block or municipality name..."
              defaultPageSize={10}
            />
          </TabsContent>

          {/* TAB 4: GRAM PANCHAYATS */}
          <TabsContent value="panchayats" className="m-0 p-3 sm:p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">District</Label>
                <Select
                  value={String(selectedDistrictId)}
                  onValueChange={(val) => {
                    setSelectedDistrictId(val);
                    setSelectedBlockId('ALL');
                    setSelectedPanchayatId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Districts</SelectItem>
                    {districtList.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)} className="text-xs">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Parent Block</Label>
                <Select
                  value={selectedBlockId}
                  onValueChange={(val) => {
                    setSelectedBlockId(val);
                    setSelectedPanchayatId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Blocks</SelectItem>
                    {filteredBlocks.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredPanchayats}
              columns={panchayatColumns}
              searchPlaceholder="Search gram panchayat name..."
              defaultPageSize={10}
            />
          </TabsContent>

          {/* TAB 5: VILLAGES */}
          <TabsContent value="villages" className="m-0 p-3 sm:p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Parent Block</Label>
                <Select
                  value={selectedBlockId}
                  onValueChange={(val) => {
                    setSelectedBlockId(val);
                    setSelectedPanchayatId('ALL');
                    setSelectedVillageId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Blocks</SelectItem>
                    {filteredBlocks.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Gram Panchayat</Label>
                <Select
                  value={selectedPanchayatId}
                  onValueChange={(val) => {
                    setSelectedPanchayatId(val);
                    setSelectedVillageId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Panchayats</SelectItem>
                    {filteredPanchayats.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredVillages}
              columns={villageColumns}
              searchPlaceholder="Search village / locality name..."
              defaultPageSize={10}
            />
          </TabsContent>

          {/* TAB 6: POLLING WARDS */}
          <TabsContent value="wards" className="m-0 p-3 sm:p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Gram Panchayat</Label>
                <Select
                  value={selectedPanchayatId}
                  onValueChange={(val) => {
                    setSelectedPanchayatId(val);
                    setSelectedVillageId('ALL');
                    setSelectedWardId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Panchayats</SelectItem>
                    {panchayats.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Village / Locality</Label>
                <Select
                  value={selectedVillageId}
                  onValueChange={(val) => {
                    setSelectedVillageId(val);
                    setSelectedWardId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Villages</SelectItem>
                    {filteredVillages.map((v) => (
                      <SelectItem key={v.id} value={v.id} className="text-xs">
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredWards}
              columns={wardColumns}
              searchPlaceholder="Search ward number or name..."
              defaultPageSize={10}
            />
          </TabsContent>

          {/* TAB 7: POLLING BOOTHS */}
          <TabsContent value="booths" className="m-0 p-3 sm:p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Village</Label>
                <Select
                  value={selectedVillageId}
                  onValueChange={(val) => {
                    setSelectedVillageId(val);
                    setSelectedWardId('ALL');
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Villages</SelectItem>
                    {villages.map((v) => (
                      <SelectItem key={v.id} value={v.id} className="text-xs">
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Polling Ward</Label>
                <Select
                  value={selectedWardId}
                  onValueChange={(val) => setSelectedWardId(val)}
                >
                  <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Wards</SelectItem>
                    {filteredWards.map((w) => (
                      <SelectItem key={w.id} value={w.id} className="text-xs">
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredBooths}
              columns={boothColumns}
              searchPlaceholder="Search booth number or location..."
              defaultPageSize={10}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Dialog for Add / Edit / View */}
      <Dialog open={modalType !== null} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {modalMode === 'add' &&
                `Add New ${
                  modalType === 'DISTRICT'
                    ? 'District'
                    : modalType === 'CONSTITUENCY'
                    ? 'Assembly Constituency'
                    : modalType === 'BLOCK'
                    ? 'Block / Municipality'
                    : modalType === 'PANCHAYAT'
                    ? 'Gram Panchayat'
                    : modalType === 'VILLAGE'
                    ? 'Village / Locality'
                    : modalType === 'WARD'
                    ? 'Polling Ward'
                    : 'Polling Booth'
                }`}
              {modalMode === 'edit' &&
                `Edit ${
                  modalType === 'DISTRICT'
                    ? 'District'
                    : modalType === 'BLOCK'
                    ? 'Block / Municipality'
                    : modalType
                }`}
              {modalMode === 'view' &&
                `${
                  modalType === 'DISTRICT'
                    ? 'District'
                    : modalType === 'BLOCK'
                    ? 'Block / Municipality'
                    : modalType
                } Details`}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {modalMode === 'view'
                ? 'Detailed record information and hierarchical mapping'
                : 'Enter accurate administrative or polling station details'}
            </DialogDescription>
          </DialogHeader>

          {modalMode === 'view' && editingItem ? (
            <div className="space-y-3 py-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">ID:</span>
                  <span className="font-mono text-slate-800">{editingItem.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Name:</span>
                  <span className="font-bold text-slate-900">{editingItem.name}</span>
                </div>
                {editingItem.unitType && (
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500">Unit Type:</span>
                    <span className="font-semibold text-primary-700">{editingItem.unitType}</span>
                  </div>
                )}
                {modalType === 'BOOTH' && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-500 block">Covered Polling Wards:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {wards
                        .filter((w) => formWardIds.includes(w.id))
                        .map((w) => (
                          <Badge key={w.id} variant="secondary" className="text-xs bg-slate-100 text-slate-800">
                            {w.name} {w.wardNumber ? `(#${w.wardNumber})` : ''}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-3">
              {/* State Selector for District */}
              {modalType === 'DISTRICT' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">State *</Label>
                  <Select
                    value={String(formParentId || selectedStateId)}
                    onValueChange={(val) => setFormParentId(val)}
                  >
                    <SelectTrigger className="text-xs h-9 font-medium">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Unit Type Selector for Block / Municipality */}
              {modalType === 'BLOCK' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Unit Type *</Label>
                  <Select
                    value={formUnitType}
                    onValueChange={(val: any) => setFormUnitType(val)}
                  >
                    <SelectTrigger className="text-xs h-9 font-semibold">
                      <SelectValue placeholder="Select Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RURAL_BLOCK" className="text-xs font-semibold">
                        🌾 Rural Block (Panchayat Samiti)
                      </SelectItem>
                      <SelectItem value="MUNICIPALITY" className="text-xs font-semibold">
                        🏢 Municipality (Urban Local Body)
                      </SelectItem>
                      <SelectItem value="NAC" className="text-xs font-semibold">
                        🏛️ Notified Area Council (NAC)
                      </SelectItem>
                      <SelectItem value="MUNICIPAL_CORPORATION" className="text-xs font-semibold">
                        🏙️ Municipal Corporation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Name *</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={`e.g. ${
                    modalType === 'DISTRICT'
                      ? 'Jajpur'
                      : modalType === 'CONSTITUENCY'
                      ? 'Korei Assembly'
                      : modalType === 'BLOCK'
                      ? formUnitType === 'RURAL_BLOCK'
                        ? 'Korei Block'
                        : formUnitType === 'MUNICIPALITY'
                        ? 'Vyasanagar Municipality'
                        : 'NAC Name'
                      : modalType === 'PANCHAYAT'
                      ? 'Taharpur GP'
                      : modalType === 'VILLAGE'
                      ? 'Korei Pur'
                      : modalType === 'WARD'
                      ? 'Ward No. 01'
                      : 'Booth No. 101'
                  }`}
                  className="text-xs h-9 font-medium"
                  required
                />
              </div>

              {/* District Selector for Block / Municipality */}
              {modalType === 'BLOCK' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">District *</Label>
                  <Select
                    value={String(formDistrictId)}
                    onValueChange={(val) => setFormDistrictId(Number(val))}
                  >
                    <SelectTrigger className="text-xs h-9 font-medium">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtList.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)} className="text-xs">
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Assembly Constituency Selector for Block / Municipality */}
              {modalType === 'BLOCK' && activeAssemblies.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Assembly Constituency *</Label>
                  <Select
                    value={formAssemblyId}
                    onValueChange={setFormAssemblyId}
                  >
                    <SelectTrigger className="text-xs h-9 font-medium">
                      <SelectValue placeholder="Select Assembly Constituency" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeAssemblies.map((a) => (
                        <SelectItem key={a.id} value={a.id} className="text-xs">
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Assembly Constituency Checkboxes */}
              {modalType === 'CONSTITUENCY' && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <Label className="text-xs font-bold text-slate-700">Administrative Branches</Label>
                  <div className="flex items-center space-x-4 pt-1">
                    <label className="flex items-center space-x-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formRuralEnabled}
                        onChange={(e) => setFormRuralEnabled(e.target.checked)}
                      />
                      <span>🌾 Rural Hierarchy</span>
                    </label>
                    <label className="flex items-center space-x-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formUrbanEnabled}
                        onChange={(e) => setFormUrbanEnabled(e.target.checked)}
                      />
                      <span>🏢 Urban Hierarchy</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Parent Block for Panchayat */}
              {modalType === 'PANCHAYAT' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Parent Block *</Label>
                  <Select value={formParentId} onValueChange={setFormParentId}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Select parent block" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocks.map((b) => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Parent GP for Village */}
              {modalType === 'VILLAGE' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Parent Gram Panchayat *</Label>
                  <Select value={formParentId} onValueChange={setFormParentId}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Select parent GP" />
                    </SelectTrigger>
                    <SelectContent>
                      {panchayats.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Parent Village for Ward */}
              {modalType === 'WARD' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Parent Village *</Label>
                  <Select value={formParentId} onValueChange={setFormParentId}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Select parent village" />
                    </SelectTrigger>
                    <SelectContent>
                      {villages.map((v) => (
                        <SelectItem key={v.id} value={v.id} className="text-xs">
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Multi-Ward Checkbox Selection for Booth */}
              {modalType === 'BOOTH' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">
                      Assigned Polling Wards *{' '}
                      <span className="text-[11px] font-normal text-slate-500">
                        (Select 1 or more wards)
                      </span>
                    </Label>
                    <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 text-xs font-semibold">
                      {formWardIds.length} Ward{formWardIds.length === 1 ? '' : 's'} Selected
                    </Badge>
                  </div>

                  {/* Filter & Quick Actions */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={wardFilterTerm}
                      onChange={(e) => setWardFilterTerm(e.target.value)}
                      placeholder="Search wards by name or number..."
                      className="text-xs h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-[11px] h-8 shrink-0"
                      onClick={() => {
                        const matching = wards
                          .filter((w) => !wardFilterTerm || w.name.toLowerCase().includes(wardFilterTerm.toLowerCase()))
                          .map((w) => w.id);
                        const merged = Array.from(new Set([...formWardIds, ...matching]));
                        setFormWardIds(merged);
                      }}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-[11px] h-8 shrink-0 text-rose-600"
                      onClick={() => setFormWardIds([])}
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Scrollable Checkbox List */}
                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50/50 space-y-1 divide-y divide-slate-100">
                    {wards
                      .filter((w) => !wardFilterTerm || w.name.toLowerCase().includes(wardFilterTerm.toLowerCase()))
                      .map((w) => {
                        const isChecked = formWardIds.includes(w.id);
                        const isULB = w.parentType === 'ULB';
                        const parentName = isULB
                          ? urbanLocalBodies.find((u) => u.id === w.parentId)?.name || 'Municipality'
                          : villages.find((v) => v.id === w.parentId)?.name || 'Village';

                        return (
                          <label
                            key={w.id}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors pt-1.5 ${
                              isChecked ? 'bg-primary-50/80 border border-primary-200' : 'hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormWardIds([...formWardIds, w.id]);
                                  } else {
                                    setFormWardIds(formWardIds.filter((id) => id !== w.id));
                                  }
                                }}
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800">{w.name}</span>
                                <span className="text-[11px] text-slate-500 ml-2 font-medium">({parentName})</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {w.wardNumber && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1 font-bold">
                                  #{w.wardNumber}
                                </Badge>
                              )}
                              <Badge
                                variant="secondary"
                                className={`text-[10px] py-0 px-1 font-semibold ${
                                  isULB
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {isULB ? 'Urban' : 'Rural'}
                              </Badge>
                            </div>
                          </label>
                        );
                      })}
                    {wards.filter((w) => !wardFilterTerm || w.name.toLowerCase().includes(wardFilterTerm.toLowerCase())).length === 0 && (
                      <p className="text-xs text-center text-slate-400 py-3">No matching wards found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalType(null)}
              className="text-xs"
            >
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="bg-primary-600 hover:bg-primary-700 text-xs font-semibold"
              >
                Save Record
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
