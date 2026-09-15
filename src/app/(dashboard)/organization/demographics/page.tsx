'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  useHierarchyStore,
  WardItem,
  VillageItem,
  PanchayatItem,
  UrbanLocalBodyItem,
  BlockItem,
} from '@/store/useHierarchyStore';
import { useConstituencySettings } from '@/context/settings-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  LuChartPie,
  LuUsers,
  LuBuilding2,
  LuTrendingUp,
  LuDownload,
  LuPencil,
  LuTrash2,
  LuEllipsisVertical,
  LuLandmark,
  LuVote,
  LuSearch,
  LuSparkles,
} from 'react-icons/lu';

export default function DemographicsPage() {
  const { settings } = useConstituencySettings();
  const {
    urbanLocalBodies,
    blocks,
    panchayats,
    villages,
    wards,
    booths,
    updateWard,
    deleteWard,
    updateVillage,
    deleteVillage,
    getWardsByULB,
    getVillagesByPanchayat,
    getPanchayatsByBlock,
  } = useHierarchyStore();

  const [activeAreaType, setActiveAreaType] = useState<'urban' | 'rural'>('urban');
  const [selectedULBId, setSelectedULBId] = useState<string>('ALL');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('ALL');
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editWardModal, setEditWardModal] = useState<{ open: boolean; ward: WardItem | null }>({
    open: false,
    ward: null,
  });
  const [editVillageModal, setEditVillageModal] = useState<{ open: boolean; village: VillageItem | null }>({
    open: false,
    village: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: 'ward' | 'village'; id: string; name: string }>({
    open: false,
    type: 'ward',
    id: '',
    name: '',
  });

  // Edit form states for Ward
  const [wardForm, setWardForm] = useState({
    name: '',
    male: 0,
    female: 0,
    census2011: 0,
    census2027: 0,
  });

  // Edit form states for Village
  const [villageForm, setVillageForm] = useState({
    name: '',
    male: 0,
    female: 0,
    census2011: 0,
    census2027: 0,
  });

  // Filtered Urban Wards list
  const filteredUrbanWards = useMemo(() => {
    let list = wards.filter((w) => w.parentType === 'ULB');
    if (selectedULBId && selectedULBId !== 'ALL') {
      list = list.filter((w) => w.parentId === selectedULBId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          String(w.wardNumber || '').includes(q) ||
          String(w.id).toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => {
      const numA = Number(a.wardNumber) || 0;
      const numB = Number(b.wardNumber) || 0;
      return numA - numB;
    });
  }, [wards, selectedULBId, searchQuery]);

  // Filtered Rural Villages list
  const filteredRuralVillages = useMemo(() => {
    let list = [...villages];
    if (selectedPanchayatId && selectedPanchayatId !== 'ALL') {
      list = list.filter((v) => v.panchayatId === selectedPanchayatId);
    } else if (selectedBlockId && selectedBlockId !== 'ALL') {
      const gpsInBlock = panchayats.filter((p) => p.blockId === selectedBlockId).map((p) => p.id);
      list = list.filter((v) => gpsInBlock.includes(v.panchayatId));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) => v.name.toLowerCase().includes(q) || String(v.id).toLowerCase().includes(q));
    }
    return list;
  }, [villages, panchayats, selectedBlockId, selectedPanchayatId, searchQuery]);

  // Panchayats dropdown options for selected Block
  const availablePanchayats = useMemo(() => {
    if (!selectedBlockId || selectedBlockId === 'ALL') return panchayats;
    return getPanchayatsByBlock(selectedBlockId);
  }, [selectedBlockId, panchayats, getPanchayatsByBlock]);

  // Urban Summary Stats
  const urbanStats = useMemo(() => {
    const totalMale = filteredUrbanWards.reduce((acc, w) => acc + (w.malePopulation || 0), 0);
    const totalFemale = filteredUrbanWards.reduce((acc, w) => acc + (w.femalePopulation || 0), 0);
    const total2011 = filteredUrbanWards.reduce((acc, w) => acc + (w.census2011Population || 0), 0);
    const total2027 = filteredUrbanWards.reduce((acc, w) => acc + (w.census2027Population || 0), 0);
    const growthPercent = total2011 > 0 ? (((total2027 - total2011) / total2011) * 100).toFixed(1) : '0';
    const sexRatio = totalMale > 0 ? Math.round((totalFemale / totalMale) * 1000) : 0;

    return {
      wardCount: filteredUrbanWards.length,
      totalMale,
      totalFemale,
      total2011,
      total2027,
      growthPercent,
      sexRatio,
    };
  }, [filteredUrbanWards]);

  // Rural Summary Stats
  const ruralStats = useMemo(() => {
    const totalMale = filteredRuralVillages.reduce((acc, v) => acc + (v.malePopulation || 0), 0);
    const totalFemale = filteredRuralVillages.reduce((acc, v) => acc + (v.femalePopulation || 0), 0);
    const total2011 = filteredRuralVillages.reduce((acc, v) => acc + (v.census2011Population || 0), 0);
    const total2027 = filteredRuralVillages.reduce((acc, v) => acc + (v.census2027Population || 0), 0);
    const growthPercent = total2011 > 0 ? (((total2027 - total2011) / total2011) * 100).toFixed(1) : '0';

    return {
      villageCount: filteredRuralVillages.length,
      totalMale,
      totalFemale,
      total2011,
      total2027,
      growthPercent,
    };
  }, [filteredRuralVillages]);

  // Quick Edit Ward Handlers
  const handleOpenEditWard = (ward: WardItem) => {
    setWardForm({
      name: ward.name,
      male: ward.malePopulation || 0,
      female: ward.femalePopulation || 0,
      census2011: ward.census2011Population || 0,
      census2027: ward.census2027Population || 0,
    });
    setEditWardModal({ open: true, ward });
  };

  const handleSaveWard = () => {
    if (!editWardModal.ward) return;
    updateWard(editWardModal.ward.id, {
      name: wardForm.name,
      malePopulation: Number(wardForm.male),
      femalePopulation: Number(wardForm.female),
      census2011Population: Number(wardForm.census2011),
      census2027Population: Number(wardForm.census2027),
    });
    toast.success('Ward demographics updated successfully');
    setEditWardModal({ open: false, ward: null });
  };

  // Quick Edit Village Handlers
  const handleOpenEditVillage = (village: VillageItem) => {
    setVillageForm({
      name: village.name,
      male: village.malePopulation || 0,
      female: village.femalePopulation || 0,
      census2011: village.census2011Population || 0,
      census2027: village.census2027Population || 0,
    });
    setEditVillageModal({ open: true, village });
  };

  const handleSaveVillage = () => {
    if (!editVillageModal.village) return;
    updateVillage(editVillageModal.village.id, {
      name: villageForm.name,
      malePopulation: Number(villageForm.male),
      femalePopulation: Number(villageForm.female),
      census2011Population: Number(villageForm.census2011),
      census2027Population: Number(villageForm.census2027),
    });
    toast.success('Village demographics updated successfully');
    setEditVillageModal({ open: false, village: null });
  };

  const handleExecuteDelete = () => {
    if (deleteConfirm.type === 'ward') {
      const res = deleteWard(deleteConfirm.id);
      if (res.success) {
        toast.success(`Ward "${deleteConfirm.name}" deleted successfully.`);
      } else {
        toast.error(res.error || 'Failed to delete ward.');
      }
    } else {
      const res = deleteVillage(deleteConfirm.id);
      if (res.success) {
        toast.success(`Village "${deleteConfirm.name}" deleted successfully.`);
      } else {
        toast.error(res.error || 'Failed to delete village.');
      }
    }
    setDeleteConfirm({ open: false, type: 'ward', id: '', name: '' });
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (activeAreaType === 'urban') {
      const headers = [
        'Ward No',
        'Ward Name',
        'Municipality / ULB',
        'Male Population',
        'Female Population',
        'Census 2011 Population',
        'Census 2027 Population (Est)',
      ];
      const rows = filteredUrbanWards.map((w) => {
        const ulb = urbanLocalBodies.find((u) => u.id === w.parentId);
        return [
          w.wardNumber || '-',
          `"${w.name}"`,
          `"${ulb?.name || '-'}"`,
          w.malePopulation || 0,
          w.femalePopulation || 0,
          w.census2011Population || 0,
          w.census2027Population || 0,
        ].join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `urban-wards-demographics-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      toast.success('Urban demographics exported to CSV');
    } else {
      const headers = [
        'Village ID',
        'Village Name',
        'Gram Panchayat',
        'Block',
        'Male Population',
        'Female Population',
        'Census 2011 Population',
        'Census 2027 Population (Est)',
      ];
      const rows = filteredRuralVillages.map((v) => {
        const gp = panchayats.find((p) => p.id === v.panchayatId);
        const blk = blocks.find((b) => b.id === gp?.blockId);
        return [
          v.id,
          `"${v.name}"`,
          `"${gp?.name || '-'}"`,
          `"${blk?.name || '-'}"`,
          v.malePopulation || 0,
          v.femalePopulation || 0,
          v.census2011Population || 0,
          v.census2027Population || 0,
        ].join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rural-villages-demographics-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      toast.success('Rural demographics exported to CSV');
    }
  };

  // Urban Table Columns
  const urbanColumns: Column<WardItem>[] = [
    {
      key: 'wardNumber',
      header: 'Ward #',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md text-xs">
          {row.wardNumber ? `Ward ${row.wardNumber}` : row.name}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Ward Name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-sm">{row.name}</span>
          <p className="text-[11px] text-slate-400">ID: {row.id}</p>
        </div>
      ),
    },
    {
      key: 'ulb',
      header: 'Municipality / ULB',
      render: (row) => {
        const ulb = urbanLocalBodies.find((u) => u.id === row.parentId);
        return (
          <div className="flex items-center space-x-1.5 text-xs text-slate-700">
            <LuBuilding2 className="w-3.5 h-3.5 text-primary-500" />
            <span className="font-medium">{ulb?.name || 'Vyasnagar Municipality'}</span>
          </div>
        );
      },
    },
    {
      key: 'malePopulation',
      header: 'Male',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          {(row.malePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'femalePopulation',
      header: 'Female',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          {(row.femalePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'census2011Population',
      header: 'Census 2011',
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className="font-semibold text-xs border-slate-300 text-slate-700">
          {(row.census2011Population || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'census2027Population',
      header: 'Census 2027 (Est)',
      sortable: true,
      render: (row) => (
        <Badge variant="accent" className="font-bold text-xs bg-amber-50 text-amber-900 border-amber-200">
          {(row.census2027Population || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'booths',
      header: 'Booths Linked',
      render: (row) => {
        const linkedBooths = booths.filter((b) => b.wardId === row.id || (b.wardIds && b.wardIds.includes(row.id)));
        return (
          <Badge variant="secondary" className="text-xs font-medium">
            <LuVote className="w-3 h-3 mr-1 text-primary-600" />
            {linkedBooths.length} Booth{linkedBooths.length === 1 ? '' : 's'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEditWard(row)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-primary-600"
            title="Edit Demographics"
          >
            <LuPencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setDeleteConfirm({
                open: true,
                type: 'ward',
                id: row.id,
                name: row.name,
              })
            }
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
            title="Delete Ward"
          >
            <LuTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Rural Table Columns
  const ruralColumns: Column<VillageItem>[] = [
    {
      key: 'name',
      header: 'Village Name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-sm">{row.name}</span>
          <p className="text-[11px] text-slate-400">ID: {row.id}</p>
        </div>
      ),
    },
    {
      key: 'gp',
      header: 'Gram Panchayat',
      render: (row) => {
        const gp = panchayats.find((p) => p.id === row.panchayatId);
        return (
          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {gp?.name || '-'}
          </span>
        );
      },
    },
    {
      key: 'block',
      header: 'Block',
      render: (row) => {
        const gp = panchayats.find((p) => p.id === row.panchayatId);
        const blk = blocks.find((b) => b.id === gp?.blockId);
        return <span className="text-xs font-semibold text-primary-700">{blk?.name || '-'}</span>;
      },
    },
    {
      key: 'male',
      header: 'Male',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {(row.malePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'female',
      header: 'Female',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {(row.femalePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'census2011',
      header: 'Census 2011',
      render: (row) => (
        <Badge variant="outline" className="text-xs font-semibold">
          {(row.census2011Population || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'census2027',
      header: 'Census 2027 (Est)',
      render: (row) => (
        <Badge variant="accent" className="text-xs font-bold bg-amber-50 text-amber-900 border-amber-200">
          {(row.census2027Population || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEditVillage(row)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-primary-600"
            title="Edit Demographics"
          >
            <LuPencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setDeleteConfirm({
                open: true,
                type: 'village',
                id: row.id,
                name: row.name,
              })
            }
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
            title="Delete Village"
          >
            <LuTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Demographics & Census</h1>
            <Badge variant="primarySolid" className="text-xs font-bold px-2 py-0.5">
              Population Hub
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage population metrics, gender demographics, 2011 Census, and 2027 Census projections for Urban Municipalities & Rural Blocks.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="space-x-1.5 text-xs font-semibold">
            <LuDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
          <Link href="/organization/demographics/add">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold space-x-1.5 shadow-sm">
              <LuPlus className="w-4 h-4" />
              <span>Add Population Data</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Highlights */}
      {activeAreaType === 'urban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary-50/70 to-white border-primary-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projected (2027)</p>
                <p className="text-2xl font-black text-primary-700 mt-1">{urbanStats.total2027.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
                <LuTrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
              <span>+{urbanStats.growthPercent}% growth</span>
              <span className="text-slate-400">vs 2011 ({urbanStats.total2011.toLocaleString('en-IN')})</span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50/60 to-white border-amber-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Male Population</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{urbanStats.totalMale.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <LuUsers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">
              <span>{((urbanStats.totalMale / (urbanStats.total2011 || 1)) * 100).toFixed(1)}% of 2011 base</span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-rose-50/60 to-white border-rose-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Female Population</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{urbanStats.totalFemale.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <LuUsers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-xs text-rose-700 font-semibold">
              <span>Sex Ratio: {urbanStats.sexRatio} F / 1000 M</span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Wards</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{urbanStats.wardCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-md shadow-slate-700/20">
                <LuBuilding2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium truncate">
              <span>Vyasnagar Municipality (26 Wards)</span>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary-50/70 to-white border-primary-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rural Villages Tracked</p>
                <p className="text-2xl font-black text-primary-700 mt-1">{ruralStats.villageCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
                <LuLandmark className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">
              <span>Across {panchayats.length} Gram Panchayats</span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50/60 to-white border-amber-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Male (Rural)</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{ruralStats.totalMale.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <LuUsers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">
              <span>Female: {ruralStats.totalFemale.toLocaleString('en-IN')}</span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-emerald-50/60 to-white border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">2027 Projected Pop</p>
                <p className="text-2xl font-black text-emerald-800 mt-1">{ruralStats.total2027.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <LuTrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-xs text-emerald-700 font-medium">
              <span>2011 Base: {ruralStats.total2011.toLocaleString('en-IN')}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content & Tabs */}
      <Card className="p-5 border-slate-200 shadow-sm bg-white">
        <Tabs value={activeAreaType} onValueChange={(v) => setActiveAreaType(v as 'urban' | 'rural')}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="urban" className="rounded-lg text-xs font-bold px-4 py-2 space-x-1.5 data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm">
                <LuBuilding2 className="w-4 h-4" />
                <span>Urban Municipal Wards ({wards.filter((w) => w.parentType === 'ULB').length})</span>
              </TabsTrigger>
              <TabsTrigger value="rural" className="rounded-lg text-xs font-bold px-4 py-2 space-x-1.5 data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm">
                <LuLandmark className="w-4 h-4" />
                <span>Rural Blocks & GPs ({villages.length} Villages)</span>
              </TabsTrigger>
            </TabsList>

            {/* Quick Filters */}
            <div className="flex items-center space-x-2.5">
              <div className="relative w-56 sm:w-64">
                <LuSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder={activeAreaType === 'urban' ? 'Search ward name or #' : 'Search village or GP'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              {activeAreaType === 'urban' ? (
                <div className="w-52">
                  <Select value={selectedULBId} onValueChange={setSelectedULBId}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="All Municipalities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Municipalities</SelectItem>
                      {urbanLocalBodies.map((ulb) => (
                        <SelectItem key={ulb.id} value={ulb.id}>
                          {ulb.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-44">
                    <Select
                      value={selectedBlockId}
                      onValueChange={(val) => {
                        setSelectedBlockId(val);
                        setSelectedPanchayatId('ALL');
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="All Blocks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Blocks</SelectItem>
                        {blocks.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-44">
                    <Select value={selectedPanchayatId} onValueChange={setSelectedPanchayatId}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="All GPs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Gram Panchayats</SelectItem>
                        {availablePanchayats.map((gp) => (
                          <SelectItem key={gp.id} value={gp.id}>
                            {gp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Urban Wards Tab */}
          <TabsContent value="urban" className="mt-4 space-y-4">
            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LuSparkles className="w-4 h-4 text-amber-500" />
                <span>
                  Showing <strong>{filteredUrbanWards.length}</strong> municipal wards under <strong>Vyasnagar Municipality</strong> (Census 2011 vs 2027 Projected).
                </span>
              </div>
              <span className="font-semibold text-primary-700">Total Population: {urbanStats.total2027.toLocaleString('en-IN')}</span>
            </div>

            <DataTable
              columns={urbanColumns}
              data={filteredUrbanWards}
              defaultPageSize={30}
              emptyMessage="No municipal wards found matching criteria."
            />
          </TabsContent>

          {/* Rural Blocks Tab */}
          <TabsContent value="rural" className="mt-4 space-y-4">
            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <LuSparkles className="w-4 h-4 text-primary-600" />
                <span>
                  Showing <strong>{filteredRuralVillages.length}</strong> villages across Gram Panchayats (Korei Block / Jajpur).
                </span>
              </div>
              <Link href="/organization/demographics/add">
                <Button size="sm" variant="outline" className="h-7 text-xs font-semibold space-x-1">
                  <LuPlus className="w-3.5 h-3.5" />
                  <span>Add GP / Village Data</span>
                </Button>
              </Link>
            </div>

            <DataTable
              columns={ruralColumns}
              data={filteredRuralVillages}
              defaultPageSize={20}
              emptyMessage="No rural villages found. Click 'Add Population Data' to enter GP-wise village demographics."
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit Ward Modal */}
      <Dialog
        open={editWardModal.open}
        onOpenChange={(open) => !open && setEditWardModal({ open: false, ward: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Edit Demographics — {editWardModal.ward?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update population and census figures for this municipal ward.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Ward Display Name</label>
              <Input
                value={wardForm.name}
                onChange={(e) => setWardForm({ ...wardForm, name: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Male Population</label>
                <Input
                  type="number"
                  value={wardForm.male}
                  onChange={(e) => setWardForm({ ...wardForm, male: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Female Population</label>
                <Input
                  type="number"
                  value={wardForm.female}
                  onChange={(e) => setWardForm({ ...wardForm, female: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Census 2011 Total</label>
                <Input
                  type="number"
                  value={wardForm.census2011}
                  onChange={(e) => setWardForm({ ...wardForm, census2011: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Census 2027 (Approx 2026)</label>
                <Input
                  type="number"
                  value={wardForm.census2027}
                  onChange={(e) => setWardForm({ ...wardForm, census2027: Number(e.target.value) })}
                  className="mt-1 text-xs font-bold text-amber-900 bg-amber-50/50"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditWardModal({ open: false, ward: null })}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveWard} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Village Modal */}
      <Dialog
        open={editVillageModal.open}
        onOpenChange={(open) => !open && setEditVillageModal({ open: false, village: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Edit Demographics — {editVillageModal.village?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update population and census figures for this village.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Village Name</label>
              <Input
                value={villageForm.name}
                onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Male Population</label>
                <Input
                  type="number"
                  value={villageForm.male}
                  onChange={(e) => setVillageForm({ ...villageForm, male: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Female Population</label>
                <Input
                  type="number"
                  value={villageForm.female}
                  onChange={(e) => setVillageForm({ ...villageForm, female: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Census 2011 Total</label>
                <Input
                  type="number"
                  value={villageForm.census2011}
                  onChange={(e) => setVillageForm({ ...villageForm, census2011: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Census 2027 (Approx 2026)</label>
                <Input
                  type="number"
                  value={villageForm.census2027}
                  onChange={(e) => setVillageForm({ ...villageForm, census2027: Number(e.target.value) })}
                  className="mt-1 text-xs font-bold text-amber-900 bg-amber-50/50"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditVillageModal({ open: false, village: null })}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveVillage} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog
        open={deleteConfirm.open}
        onOpenChange={(open) => !open && setDeleteConfirm({ open: false, type: 'ward', id: '', name: '' })}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirm({ open: false, type: 'ward', id: '', name: '' })}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={handleExecuteDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
