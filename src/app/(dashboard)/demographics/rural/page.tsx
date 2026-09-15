'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useHierarchyStore, PanchayatItem, VillageItem } from '@/store/useHierarchyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DataTable, Column } from '@/components/ui/data-table';
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
  LuDownload,
  LuLandmark,
  LuUsers,
  LuPencil,
  LuTrash2,
  LuEye,
  LuEllipsisVertical,
  LuSearch,
  LuHouse,
  LuFilter,
  LuLayers,
} from 'react-icons/lu';

export default function RuralDemographicsPage() {
  const {
    panchayats,
    blocks,
    villages,
    updatePanchayat,
    deletePanchayat,
    addPanchayat,
    updateVillage,
    deleteVillage,
    addVillage,
  } = useHierarchyStore();

  // Active Tab: Gram Panchayats is FIRST (default), Revenue Villages is SECOND
  const [activeTab, setActiveTab] = useState<'gps' | 'villages'>('gps');

  // Filters
  const [selectedBlockId, setSelectedBlockId] = useState<string>('ALL');
  const [selectedGPId, setSelectedGPId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [editingGP, setEditingGP] = useState<PanchayatItem | null>(null);
  const [viewingGP, setViewingGP] = useState<PanchayatItem | null>(null);
  const [editingVillage, setEditingVillage] = useState<VillageItem | null>(null);
  const [viewingVillage, setViewingVillage] = useState<VillageItem | null>(null);

  const [isRecordGPModalOpen, setIsRecordGPModalOpen] = useState(false);
  const [isRecordVillageModalOpen, setIsRecordVillageModalOpen] = useState(false);

  // GP Record & Edit Form Fields
  const [recordGPBlockId, setRecordGPBlockId] = useState('126013008'); // Korei Block
  const [recordGPId, setRecordGPId] = useState('');
  const [gpMale, setGpMale] = useState('');
  const [gpFemale, setGpFemale] = useState('');
  const [gpTotal, setGpTotal] = useState('');
  const [gpST, setGpST] = useState('');
  const [gpSC, setGpSC] = useState('');
  const [gpOC, setGpOC] = useState('');
  const [gpWards, setGpWards] = useState('');

  // Village Record & Edit Form Fields
  const [recordVBlockId, setRecordVBlockId] = useState('126013008');
  const [recordVPanchayatId, setRecordVPanchayatId] = useState('');
  const [recordVillageId, setRecordVillageId] = useState('');
  const [vHouseholds, setVHouseholds] = useState('');
  const [vMale, setVMale] = useState('');
  const [vFemale, setVFemale] = useState('');
  const [vTotal, setVTotal] = useState('');

  // Available GPs for Record GP modal
  const recordAvailableGPs = useMemo(() => {
    return panchayats.filter((p) => p.blockId === recordGPBlockId);
  }, [panchayats, recordGPBlockId]);

  // Available GPs for Record Village modal
  const recordVillageGPs = useMemo(() => {
    return panchayats.filter((p) => p.blockId === recordVBlockId);
  }, [panchayats, recordVBlockId]);

  // Available Villages for Record Village modal
  const recordAvailableVillages = useMemo(() => {
    if (!recordVPanchayatId) return [];
    return villages.filter((v) => v.panchayatId === recordVPanchayatId);
  }, [villages, recordVPanchayatId]);

  // When GP is selected in Record GP modal, pre-fill its stats
  const handleSelectRecordGP = (gpId: string) => {
    setRecordGPId(gpId);
    const target = panchayats.find((p) => p.id === gpId);
    if (target) {
      setGpMale(target.malePopulation ? String(target.malePopulation) : '');
      setGpFemale(target.femalePopulation ? String(target.femalePopulation) : '');
      setGpTotal(target.totalPopulation || target.census2011Population ? String(target.totalPopulation || target.census2011Population) : '');
      setGpST(target.stPopulation ? String(target.stPopulation) : '');
      setGpSC(target.scPopulation ? String(target.scPopulation) : '');
      setGpOC(target.ocPopulation ? String(target.ocPopulation) : '');
      setGpWards(target.wardCount ? String(target.wardCount) : '');
    }
  };

  // When Village is selected in Record Village modal, pre-fill its stats
  const handleSelectRecordVillage = (vId: string) => {
    setRecordVillageId(vId);
    const target = villages.find((v) => v.id === vId);
    if (target) {
      setVHouseholds(target.households ? String(target.households) : '');
      setVMale(target.malePopulation ? String(target.malePopulation) : '');
      setVFemale(target.femalePopulation ? String(target.femalePopulation) : '');
      setVTotal(target.totalPopulation || target.census2011Population ? String(target.totalPopulation || target.census2011Population) : '');
    }
  };

  // Available GPs for filtering / table
  const availableGPs = useMemo(() => {
    if (selectedBlockId === 'ALL') return panchayats;
    return panchayats.filter((p) => p.blockId === selectedBlockId);
  }, [panchayats, selectedBlockId]);

  // 1. Filtered Gram Panchayats (Tab 1)
  const filteredPanchayats = useMemo(() => {
    return panchayats.filter((p) => {
      const matchBlock = selectedBlockId === 'ALL' || p.blockId === selectedBlockId;
      const matchSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (p.gpNumber && String(p.gpNumber).includes(searchTerm.trim()));
      return matchBlock && matchSearch;
    });
  }, [panchayats, selectedBlockId, searchTerm]);

  // 2. Filtered Revenue Villages (Tab 2)
  const filteredVillages = useMemo(() => {
    return villages.filter((v) => {
      const parentGP = panchayats.find((p) => p.id === v.panchayatId);
      const matchBlock =
        selectedBlockId === 'ALL' ||
        v.blockId === selectedBlockId ||
        parentGP?.blockId === selectedBlockId;
      const matchGP = selectedGPId === 'ALL' || v.panchayatId === selectedGPId;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        v.name.toLowerCase().includes(term) ||
        (parentGP && parentGP.name.toLowerCase().includes(term));
      return matchBlock && matchGP && matchSearch;
    });
  }, [villages, panchayats, selectedBlockId, selectedGPId, searchTerm]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalGPs = filteredPanchayats.length;
    const totalVillages = villages.length;
    const totalPop = filteredPanchayats.reduce((a, b) => a + (b.totalPopulation || b.census2011Population || 0), 0);
    const totalMale = filteredPanchayats.reduce((a, b) => a + (b.malePopulation || 0), 0);
    const totalFemale = filteredPanchayats.reduce((a, b) => a + (b.femalePopulation || 0), 0);
    const totalST = filteredPanchayats.reduce((a, b) => a + (b.stPopulation || 0), 0);
    const totalSC = filteredPanchayats.reduce((a, b) => a + (b.scPopulation || 0), 0);

    return { totalGPs, totalVillages, totalPop, totalMale, totalFemale, totalST, totalSC };
  }, [filteredPanchayats, villages]);

  // Open Record GP Demographics Modal
  const handleOpenRecordGP = () => {
    const defaultBlock = selectedBlockId !== 'ALL' ? selectedBlockId : '126013008';
    setRecordGPBlockId(defaultBlock);
    const blockGPs = panchayats.filter((p) => p.blockId === defaultBlock);
    const firstGP = blockGPs[0];
    if (firstGP) {
      handleSelectRecordGP(firstGP.id);
    } else {
      setRecordGPId('');
      setGpMale('');
      setGpFemale('');
      setGpTotal('');
      setGpST('');
      setGpSC('');
      setGpOC('');
      setGpWards('');
    }
    setIsRecordGPModalOpen(true);
  };

  // Open Record Village Demographics Modal
  const handleOpenRecordVillage = () => {
    const defaultBlock = selectedBlockId !== 'ALL' ? selectedBlockId : '126013008';
    setRecordVBlockId(defaultBlock);
    const blockGPs = panchayats.filter((p) => p.blockId === defaultBlock);
    const firstGP = blockGPs[0];
    const defaultGPId = selectedGPId !== 'ALL' ? selectedGPId : (firstGP?.id || '');
    setRecordVPanchayatId(defaultGPId);

    const gpVillages = villages.filter((v) => v.panchayatId === defaultGPId);
    const firstVillage = gpVillages[0];
    if (firstVillage) {
      handleSelectRecordVillage(firstVillage.id);
    } else {
      setRecordVillageId('');
      setVHouseholds('');
      setVMale('');
      setVFemale('');
      setVTotal('');
    }
    setIsRecordVillageModalOpen(true);
  };

  // Open Edit GP (from row)
  const handleOpenEditGP = (gp: PanchayatItem) => {
    setEditingGP(gp);
    setRecordGPBlockId(gp.blockId);
    setRecordGPId(gp.id);
    setGpMale(gp.malePopulation ? String(gp.malePopulation) : '');
    setGpFemale(gp.femalePopulation ? String(gp.femalePopulation) : '');
    setGpTotal(gp.totalPopulation || gp.census2011Population ? String(gp.totalPopulation || gp.census2011Population) : '');
    setGpST(gp.stPopulation ? String(gp.stPopulation) : '');
    setGpSC(gp.scPopulation ? String(gp.scPopulation) : '');
    setGpOC(gp.ocPopulation ? String(gp.ocPopulation) : '');
    setGpWards(gp.wardCount ? String(gp.wardCount) : '');
  };

  // Save Edit GP
  const handleSaveEditGP = () => {
    if (!editingGP) return;
    const m = Number(gpMale) || 0;
    const f = Number(gpFemale) || 0;
    const tot = Number(gpTotal) || (m + f > 0 ? m + f : 0);

    updatePanchayat(editingGP.id, {
      malePopulation: m,
      femalePopulation: f,
      totalPopulation: tot,
      census2011Population: tot,
      census2027Population: Math.round(tot * 1.44),
      stPopulation: Number(gpST) || 0,
      scPopulation: Number(gpSC) || 0,
      ocPopulation: Number(gpOC) || 0,
      wardCount: gpWards ? Number(gpWards) : undefined,
    });
    toast.success(`Demographics for "${editingGP.name}" updated successfully!`);
    setEditingGP(null);
  };

  // Save Record GP (from dropdown selection modal)
  const handleSaveRecordGP = () => {
    if (!recordGPId) {
      toast.error('Please select a Gram Panchayat from the dropdown.');
      return;
    }
    const targetGP = panchayats.find((p) => p.id === recordGPId);
    const m = Number(gpMale) || 0;
    const f = Number(gpFemale) || 0;
    const tot = Number(gpTotal) || (m + f > 0 ? m + f : 0);

    updatePanchayat(recordGPId, {
      malePopulation: m,
      femalePopulation: f,
      totalPopulation: tot,
      census2011Population: tot,
      census2027Population: Math.round(tot * 1.44),
      stPopulation: Number(gpST) || 0,
      scPopulation: Number(gpSC) || 0,
      ocPopulation: Number(gpOC) || 0,
      wardCount: gpWards ? Number(gpWards) : undefined,
    });
    toast.success(`Demographics for "${targetGP?.name || 'Selected GP'}" saved successfully!`);
    setIsRecordGPModalOpen(false);
  };

  // Open Edit Village (from row)
  const handleOpenEditVillage = (v: VillageItem) => {
    setEditingVillage(v);
    setRecordVillageId(v.id);
    setRecordVPanchayatId(v.panchayatId);
    setVHouseholds(v.households ? String(v.households) : '');
    setVMale(v.malePopulation ? String(v.malePopulation) : '');
    setVFemale(v.femalePopulation ? String(v.femalePopulation) : '');
    setVTotal(v.totalPopulation || v.census2011Population ? String(v.totalPopulation || v.census2011Population) : '');
  };

  // Save Edit Village
  const handleSaveEditVillage = () => {
    if (!editingVillage) return;
    const m = Number(vMale) || 0;
    const f = Number(vFemale) || 0;
    const tot = Number(vTotal) || (m + f > 0 ? m + f : 0);

    updateVillage(editingVillage.id, {
      households: vHouseholds ? Number(vHouseholds) : undefined,
      malePopulation: m,
      femalePopulation: f,
      totalPopulation: tot,
      census2011Population: tot,
      census2027Population: Math.round(tot * 1.44),
    });
    toast.success(`Demographics for Revenue Village "${editingVillage.name}" updated successfully!`);
    setEditingVillage(null);
  };

  // Save Record Village (from dropdown selection modal)
  const handleSaveRecordVillage = () => {
    if (!recordVillageId) {
      toast.error('Please select a Revenue Village from the dropdown.');
      return;
    }
    const targetVillage = villages.find((v) => v.id === recordVillageId);
    const m = Number(vMale) || 0;
    const f = Number(vFemale) || 0;
    const tot = Number(vTotal) || (m + f > 0 ? m + f : 0);

    updateVillage(recordVillageId, {
      households: vHouseholds ? Number(vHouseholds) : undefined,
      malePopulation: m,
      femalePopulation: f,
      totalPopulation: tot,
      census2011Population: tot,
      census2027Population: Math.round(tot * 1.44),
    });
    toast.success(`Demographics for "${targetVillage?.name || 'Selected Village'}" saved successfully!`);
    setIsRecordVillageModalOpen(false);
  };

  // Export CSV
  const exportToCSV = () => {
    if (activeTab === 'gps') {
      const headers = ['Sl No', 'Gram Panchayat', 'Block', 'Total Population (2011)', 'Male', 'Female', 'ST', 'SC', 'OC / General', 'Wards'];
      const rows = filteredPanchayats.map((p, idx) => {
        const blk = blocks.find((b) => b.id === p.blockId);
        return [idx + 1, `"${p.name}"`, `"${blk?.name || ''}"`, p.totalPopulation || p.census2011Population || 0, p.malePopulation || 0, p.femalePopulation || 0, p.stPopulation || 0, p.scPopulation || 0, p.ocPopulation || 0, p.wardCount || ''];
      });
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'Gram_Panchayats_Demographics.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Downloaded Gram Panchayats Demographics CSV');
    } else {
      const headers = ['Sl No', 'Revenue Village Name', 'Gram Panchayat', 'Block', 'Households', 'Male', 'Female', 'Total Population (2011)'];
      const rows = filteredVillages.map((v, idx) => {
        const parentGP = panchayats.find((p) => p.id === v.panchayatId);
        const blk = blocks.find((b) => b.id === (v.blockId || parentGP?.blockId));
        return [idx + 1, `"${v.name}"`, `"${parentGP?.name || ''}"`, `"${blk?.name || ''}"`, v.households || '', v.malePopulation || 0, v.femalePopulation || 0, v.totalPopulation || v.census2011Population || 0];
      });
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'Revenue_Villages_Demographics.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Downloaded Revenue Villages Demographics CSV');
    }
  };

  // 1. GRAM PANCHAYATS COLUMNS (TAB 1)
  const gpColumns: Column<PanchayatItem>[] = [
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
      render: (p) => (
        <div>
          <span className="font-bold text-slate-900 text-sm">{p.name}</span>
          <p className="text-[11px] text-slate-500 font-medium">
            {blocks.find((b) => b.id === p.blockId)?.name || 'Korei Block'}
          </p>
        </div>
      ),
    },
    {
      key: 'totalPopulation',
      header: 'Total Pop (2011)',
      align: 'right',
      sortable: true,
      render: (p) => (
        <span className="font-black text-slate-900 text-xs">
          {(p.totalPopulation || p.census2011Population || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'malePopulation',
      header: 'Male',
      align: 'right',
      sortable: true,
      render: (p) => (
        <span className="font-medium text-slate-700 text-xs">
          {(p.malePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'femalePopulation',
      header: 'Female',
      align: 'right',
      sortable: true,
      render: (p) => (
        <span className="font-medium text-slate-700 text-xs">
          {(p.femalePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'stPopulation',
      header: 'ST',
      align: 'right',
      sortable: true,
      render: (p) => (
        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-semibold">
          {(p.stPopulation || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'scPopulation',
      header: 'SC',
      align: 'right',
      sortable: true,
      render: (p) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs font-semibold">
          {(p.scPopulation || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'ocPopulation',
      header: 'OC / General',
      align: 'right',
      sortable: true,
      render: (p) => (
        <span className="text-xs font-medium text-slate-700">
          {(p.ocPopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'wardCount',
      header: 'Wards',
      align: 'center',
      render: (p) => (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs">
          {p.wardCount ? `${p.wardCount} Wards` : '-'}
        </Badge>
      ),
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
          <DropdownMenuContent align="end" className="w-44 p-1">
            <DropdownMenuItem onClick={() => setViewingGP(p)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenEditGP(p)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Update Demographics</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => {
                if (confirm(`Delete Gram Panchayat "${p.name}"?`)) {
                  deletePanchayat(p.id);
                  toast.success('GP deleted.');
                }
              }}
              className="text-xs text-rose-600 cursor-pointer"
            >
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 2. REVENUE VILLAGES COLUMNS (TAB 2)
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
      header: 'Revenue Village Name',
      sortable: true,
      render: (v) => {
        const parentGP = panchayats.find((p) => p.id === v.panchayatId);
        return (
          <div>
            <span className="font-bold text-slate-900 text-sm">{v.name}</span>
            <p className="text-[11px] text-slate-500 font-medium">
              GP: {parentGP?.name || 'Gram Panchayat'}
            </p>
          </div>
        );
      },
    },
    {
      key: 'panchayat',
      header: 'Parent Gram Panchayat',
      sortable: true,
      render: (v) => {
        const parentGP = panchayats.find((p) => p.id === v.panchayatId);
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold text-xs">
            {parentGP?.name || '-'}
          </Badge>
        );
      },
    },
    {
      key: 'households',
      header: 'Households',
      align: 'right',
      sortable: true,
      render: (v) => (
        <span className="font-semibold text-slate-800 text-xs">
          {v.households ? v.households.toLocaleString('en-IN') : '-'}
        </span>
      ),
    },
    {
      key: 'malePopulation',
      header: 'Male',
      align: 'right',
      sortable: true,
      render: (v) => (
        <span className="font-medium text-slate-700 text-xs">
          {(v.malePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'femalePopulation',
      header: 'Female',
      align: 'right',
      sortable: true,
      render: (v) => (
        <span className="font-medium text-slate-700 text-xs">
          {(v.femalePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'totalPopulation',
      header: 'Total Pop (2011)',
      align: 'right',
      sortable: true,
      render: (v) => (
        <span className="font-black text-slate-900 text-xs">
          {(v.totalPopulation || v.census2011Population || 0).toLocaleString('en-IN')}
        </span>
      ),
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
          <DropdownMenuContent align="end" className="w-44 p-1">
            <DropdownMenuItem onClick={() => setViewingVillage(v)} className="text-xs cursor-pointer">
              <LuEye className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenEditVillage(v)} className="text-xs cursor-pointer">
              <LuPencil className="w-3.5 h-3.5 mr-2 text-primary-600" />
              <span>Update Demographics</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => {
                if (confirm(`Delete Revenue Village "${v.name}"?`)) {
                  deleteVillage(v.id);
                  toast.success('Village deleted.');
                }
              }}
              className="text-xs text-rose-600 cursor-pointer"
            >
              <LuTrash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold select-none">
        <Link href="/dashboard" className="hover:underline text-[#2563eb]">
          Home
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <Link href="/organization/directory" className="hover:underline text-[#2563eb]">
          Organization
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <span className="text-slate-500 font-normal">Rural Demographics</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fff5ee] border border-orange-200/80 flex items-center justify-center shrink-0">
            <LuLandmark className="w-7 h-7 text-[#f97316]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Rural Demographics
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Census 2011 Demographic Records for Korei &amp; Rasulpur Rural Blocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="default"
            onClick={exportToCSV}
            className="bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs h-10 px-4 rounded-xl shadow-2xs flex items-center gap-2"
          >
            <LuDownload className="w-4 h-4 text-[#f97316]" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => (activeTab === 'gps' ? handleOpenRecordGP() : handleOpenRecordVillage())}
            size="default"
            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs flex items-center gap-1.5"
          >
            <LuPlus className="w-4 h-4" />
            <span>{activeTab === 'gps' ? 'Record GP Demographics' : 'Record Village Demographics'}</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Gram Panchayats */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">GRAM PANCHAYATS</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{metrics.totalGPs}</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">Korei &amp; Rasulpur</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <LuLandmark className="w-6 h-6 text-emerald-600" />
          </div>
        </Card>

        {/* Revenue Villages */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">REVENUE VILLAGES</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{metrics.totalVillages}</h3>
            <span className="text-xs font-bold text-blue-600 mt-1 block">Census 2011</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <LuHouse className="w-6 h-6 text-blue-600" />
          </div>
        </Card>

        {/* Total Population */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL POPULATION</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#f97316] mt-0.5">{metrics.totalPop.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-[#f97316] mt-1 block">
              M: {metrics.totalMale.toLocaleString('en-IN')} · F: {metrics.totalFemale.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100/60 border border-orange-200/80 text-[#f97316] flex items-center justify-center shrink-0">
            <LuUsers className="w-6 h-6 text-[#f97316]" />
          </div>
        </Card>

        {/* ST & SC Community */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">ST &amp; SC COMMUNITY</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {(metrics.totalST + metrics.totalSC).toLocaleString('en-IN')}
            </h3>
            <span className="text-xs font-medium text-amber-700 mt-1 block">
              ST: {metrics.totalST.toLocaleString('en-IN')} · SC: {metrics.totalSC.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <LuUsers className="w-6 h-6 text-amber-600" />
          </div>
        </Card>
      </div>

      {/* Main Tabs Container: Gram Panchayats FIRST, Revenue Villages SECOND */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-4">
        {/* Tab Selection Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
            <TabsTrigger
              value="gps"
              className="text-xs font-black gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-xs rounded-lg transition-all"
            >
              <LuLandmark className="w-4 h-4" />
              <span>1. Gram Panchayats</span>
              <Badge className="ml-1 bg-emerald-100 text-emerald-800 border-none text-[10px] px-1.5 py-0 font-bold">
                {filteredPanchayats.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="villages"
              className="text-xs font-black gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-xs rounded-lg transition-all"
            >
              <LuHouse className="w-4 h-4" />
              <span>2. Revenue Villages</span>
              <Badge className="ml-1 bg-blue-100 text-blue-800 border-none text-[10px] px-1.5 py-0 font-bold">
                {filteredVillages.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Block Filter */}
            <Select
              value={selectedBlockId}
              onValueChange={(val) => {
                setSelectedBlockId(val);
                setSelectedGPId('ALL');
              }}
            >
              <SelectTrigger className="w-36 text-xs h-9 bg-white font-semibold">
                <SelectValue placeholder="All Blocks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs font-bold">
                  All Blocks
                </SelectItem>
                {blocks.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* GP Filter for Revenue Villages */}
            {activeTab === 'villages' && (
              <Select value={selectedGPId} onValueChange={setSelectedGPId}>
                <SelectTrigger className="w-44 text-xs h-9 bg-white font-semibold">
                  <SelectValue placeholder="All Panchayats" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  <SelectItem value="ALL" className="text-xs font-bold">
                    All Panchayats
                  </SelectItem>
                  {availableGPs.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'gps' ? 'Search GP Name...' : 'Search Village Name...'}
                className="pl-9 text-xs h-9 bg-white"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: GRAM PANCHAYATS */}
        <TabsContent value="gps" className="mt-0">
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LuLandmark className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Gram Panchayats List ({filteredPanchayats.length} GPs)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Census 2011 Data</span>
            </div>

            <DataTable
              columns={gpColumns}
              data={filteredPanchayats}
              defaultPageSize={30}
            />
          </Card>
        </TabsContent>

        {/* TAB 2: REVENUE VILLAGES */}
        <TabsContent value="villages" className="mt-0">
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LuHouse className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Revenue Villages List ({filteredVillages.length} Villages)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">With Household & Population Breakdowns</span>
            </div>

            <DataTable
              columns={villageColumns}
              data={filteredVillages}
              defaultPageSize={30}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record / Update Gram Panchayat Demographics Modal (Dropdown Selection) */}
      <Dialog open={isRecordGPModalOpen} onOpenChange={setIsRecordGPModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LuLandmark className="w-5 h-5 text-emerald-600" />
              <span>Record / Update GP Demographics</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select an existing Gram Panchayat configured in Master Data to enter or update Census 2011 data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Select Rural Block *</Label>
                <Select
                  value={recordGPBlockId}
                  onValueChange={(val) => {
                    setRecordGPBlockId(val);
                    const firstGP = panchayats.find((p) => p.blockId === val);
                    if (firstGP) {
                      handleSelectRecordGP(firstGP.id);
                    } else {
                      setRecordGPId('');
                    }
                  }}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Select Block" />
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

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Select Gram Panchayat *</Label>
                <Select value={recordGPId} onValueChange={handleSelectRecordGP}>
                  <SelectTrigger className="text-xs h-9 font-semibold">
                    <SelectValue placeholder="Choose GP from Master Data" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {recordAvailableGPs.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  value={gpMale}
                  onChange={(e) => setGpMale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  value={gpFemale}
                  onChange={(e) => setGpFemale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-amber-700">ST Pop</Label>
                <Input
                  type="number"
                  value={gpST}
                  onChange={(e) => setGpST(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-blue-700">SC Pop</Label>
                <Input
                  type="number"
                  value={gpSC}
                  onChange={(e) => setGpSC(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-purple-700">OC Pop</Label>
                <Input
                  type="number"
                  value={gpOC}
                  onChange={(e) => setGpOC(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Total GP Pop (2011)</Label>
                <Input
                  type="number"
                  value={gpTotal}
                  onChange={(e) => setGpTotal(e.target.value)}
                  placeholder="Total"
                  className="text-xs h-9 font-black text-slate-900 bg-slate-50"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Number of Wards</Label>
                <Input
                  type="number"
                  value={gpWards}
                  onChange={(e) => setGpWards(e.target.value)}
                  placeholder="e.g. 15"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecordGPModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveRecordGP}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
            >
              Save GP Demographics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record / Update Revenue Village Demographics Modal (Cascading Dropdown Selection) */}
      <Dialog open={isRecordVillageModalOpen} onOpenChange={setIsRecordVillageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LuHouse className="w-5 h-5 text-blue-600" />
              <span>Record / Update Village Demographics</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select an existing Revenue Village from Master Data to enter or update demographic figures.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">1. Select Rural Block *</Label>
                <Select
                  value={recordVBlockId}
                  onValueChange={(val) => {
                    setRecordVBlockId(val);
                    const firstGP = panchayats.find((p) => p.blockId === val);
                    const newGPId = firstGP?.id || '';
                    setRecordVPanchayatId(newGPId);
                    const firstVillage = villages.find((v) => v.panchayatId === newGPId);
                    if (firstVillage) {
                      handleSelectRecordVillage(firstVillage.id);
                    } else {
                      setRecordVillageId('');
                    }
                  }}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Select Block" />
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

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">2. Select Gram Panchayat *</Label>
                <Select
                  value={recordVPanchayatId}
                  onValueChange={(val) => {
                    setRecordVPanchayatId(val);
                    const firstVillage = villages.find((v) => v.panchayatId === val);
                    if (firstVillage) {
                      handleSelectRecordVillage(firstVillage.id);
                    } else {
                      setRecordVillageId('');
                      setVHouseholds('');
                      setVMale('');
                      setVFemale('');
                      setVTotal('');
                    }
                  }}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Select Gram Panchayat" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {recordVillageGPs.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">3. Select Revenue Village *</Label>
              <Select value={recordVillageId} onValueChange={handleSelectRecordVillage}>
                <SelectTrigger className="text-xs h-9 font-semibold">
                  <SelectValue placeholder="Choose Village from Master Data" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {recordAvailableVillages.map((v) => (
                    <SelectItem key={v.id} value={v.id} className="text-xs">
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Number of Households</Label>
              <Input
                type="number"
                value={vHouseholds}
                onChange={(e) => setVHouseholds(e.target.value)}
                placeholder="e.g. 769"
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  value={vMale}
                  onChange={(e) => setVMale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  value={vFemale}
                  onChange={(e) => setVFemale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Total Village Population (2011)</Label>
              <Input
                type="number"
                value={vTotal}
                onChange={(e) => setVTotal(e.target.value)}
                placeholder="Total"
                className="text-xs h-9 font-black text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecordVillageModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveRecordVillage}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
            >
              Save Village Demographics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit GP Modal (from Table Row) */}
      <Dialog open={!!editingGP} onOpenChange={(open) => !open && setEditingGP(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Update Demographics — {editingGP?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update Census 2011 population figures.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  value={gpMale}
                  onChange={(e) => setGpMale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  value={gpFemale}
                  onChange={(e) => setGpFemale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-amber-700">ST Pop</Label>
                <Input
                  type="number"
                  value={gpST}
                  onChange={(e) => setGpST(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-blue-700">SC Pop</Label>
                <Input
                  type="number"
                  value={gpSC}
                  onChange={(e) => setGpSC(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-purple-700">OC Pop</Label>
                <Input
                  type="number"
                  value={gpOC}
                  onChange={(e) => setGpOC(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Total GP Pop (2011)</Label>
                <Input
                  type="number"
                  value={gpTotal}
                  onChange={(e) => setGpTotal(e.target.value)}
                  placeholder="Total"
                  className="text-xs h-9 font-black text-slate-900 bg-slate-50"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Number of Wards</Label>
                <Input
                  type="number"
                  value={gpWards}
                  onChange={(e) => setGpWards(e.target.value)}
                  placeholder="e.g. 15"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingGP(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEditGP}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Village Modal (from Table Row) */}
      <Dialog open={!!editingVillage} onOpenChange={(open) => !open && setEditingVillage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Update Demographics — {editingVillage?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update population and household statistics.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Number of Households</Label>
              <Input
                type="number"
                value={vHouseholds}
                onChange={(e) => setVHouseholds(e.target.value)}
                placeholder="e.g. 769"
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  value={vMale}
                  onChange={(e) => setVMale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  value={vFemale}
                  onChange={(e) => setVFemale(e.target.value)}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Total Village Population (2011)</Label>
              <Input
                type="number"
                value={vTotal}
                onChange={(e) => setVTotal(e.target.value)}
                placeholder="Total"
                className="text-xs h-9 font-black text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingVillage(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEditVillage}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View GP Modal */}
      <Dialog open={!!viewingGP} onOpenChange={(open) => !open && setViewingGP(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LuLandmark className="w-5 h-5 text-emerald-600" />
              <span>{viewingGP?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Gram Panchayat Demographic Profile
            </DialogDescription>
          </DialogHeader>

          {viewingGP && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Block Name:</span>
                  <span className="font-bold text-slate-900">
                    {blocks.find((b) => b.id === viewingGP.blockId)?.name || 'Korei'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Total Population:</span>
                  <span className="font-black text-slate-900">
                    {(viewingGP.totalPopulation || viewingGP.census2011Population || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium">Male:</span>
                    <p className="font-bold text-slate-800">{(viewingGP.malePopulation || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Female:</span>
                    <p className="font-bold text-slate-800">{(viewingGP.femalePopulation || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-amber-700 font-medium">ST Pop:</span>
                    <p className="font-bold text-amber-800">{(viewingGP.stPopulation || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">SC Pop:</span>
                    <p className="font-bold text-blue-800">{(viewingGP.scPopulation || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">OC Pop:</span>
                    <p className="font-bold text-purple-800">{(viewingGP.ocPopulation || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-500">Revenue Villages:</span>
                  <span className="font-bold text-emerald-700">
                    {villages.filter((v) => v.panchayatId === viewingGP.id).length} Villages
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setViewingGP(null)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Village Modal */}
      <Dialog open={!!viewingVillage} onOpenChange={(open) => !open && setViewingVillage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LuHouse className="w-5 h-5 text-emerald-600" />
              <span>{viewingVillage?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Revenue Village Census Profile
            </DialogDescription>
          </DialogHeader>

          {viewingVillage && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Gram Panchayat:</span>
                  <span className="font-bold text-slate-900">
                    {panchayats.find((p) => p.id === viewingVillage.panchayatId)?.name || 'GP'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Block:</span>
                  <span className="font-bold text-slate-900">
                    {blocks.find((b) => b.id === (viewingVillage.blockId || panchayats.find((p) => p.id === viewingVillage.panchayatId)?.blockId))?.name || 'Korei'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Households:</span>
                  <span className="font-semibold text-slate-800">
                    {viewingVillage.households ? viewingVillage.households.toLocaleString('en-IN') : '-'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-500">Male Population:</span>
                  <span className="font-semibold text-slate-800">{(viewingVillage.malePopulation || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Female Population:</span>
                  <span className="font-semibold text-slate-800">{(viewingVillage.femalePopulation || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Total Population (2011):</span>
                  <span className="font-black text-slate-900">{(viewingVillage.totalPopulation || viewingVillage.census2011Population || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setViewingVillage(null)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
