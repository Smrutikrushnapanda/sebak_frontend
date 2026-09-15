'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useHierarchyStore, WardItem } from '@/store/useHierarchyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/ui/data-table';
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  LuPlus,
  LuDownload,
  LuBuilding2,
  LuUsers,
  LuTrendingUp,
  LuPencil,
  LuTrash2,
  LuEye,
  LuEllipsisVertical,
  LuSearch,
  LuVote,
  LuCircleCheck,
  LuUser,
} from 'react-icons/lu';

export default function UrbanDemographicsPage() {
  const { wards, booths, updateWard, deleteWard } = useHierarchyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingWard, setEditingWard] = useState<WardItem | null>(null);
  const [viewingWard, setViewingWard] = useState<WardItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Selected Ward for demographic recording
  const [selectedWardId, setSelectedWardId] = useState<string>('');

  // Form states
  const [formMale, setFormMale] = useState('');
  const [formFemale, setFormFemale] = useState('');
  const [formCensus2011, setFormCensus2011] = useState('');
  const [formCensus2027, setFormCensus2027] = useState('');

  // Filter only Urban Wards (Vyasanagar Municipality)
  const urbanWards = useMemo(() => {
    return wards
      .filter((w) => w.parentType === 'ULB')
      .sort((a, b) => {
        const numA = Number(a.wardNumber) || 0;
        const numB = Number(b.wardNumber) || 0;
        return numA - numB;
      });
  }, [wards]);

  // When selected ward changes in record modal, pre-fill its stats
  useEffect(() => {
    if (!selectedWardId) return;
    const target = urbanWards.find((w) => w.id === selectedWardId);
    if (target) {
      setFormMale(target.malePopulation ? String(target.malePopulation) : '');
      setFormFemale(target.femalePopulation ? String(target.femalePopulation) : '');
      setFormCensus2011(target.census2011Population ? String(target.census2011Population) : '');
      setFormCensus2027(target.census2027Population ? String(target.census2027Population) : '');
    }
  }, [selectedWardId, urbanWards]);

  // Filtered by search
  const filteredWards = useMemo(() => {
    if (!searchTerm.trim()) return urbanWards;
    const term = searchTerm.toLowerCase();
    return urbanWards.filter(
      (w) =>
        w.name.toLowerCase().includes(term) ||
        (w.wardNumber && String(w.wardNumber).includes(term)),
    );
  }, [urbanWards, searchTerm]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalWards = urbanWards.length;
    const totalMale = urbanWards.reduce((acc, w) => acc + (w.malePopulation || 0), 0);
    const totalFemale = urbanWards.reduce((acc, w) => acc + (w.femalePopulation || 0), 0);
    const total2011 = urbanWards.reduce((acc, w) => acc + (w.census2011Population || 0), 0);
    const total2027 = urbanWards.reduce((acc, w) => acc + (w.census2027Population || 0), 0);
    const totalBooths = booths.filter((b) =>
      b.wardIds?.some((wId) => urbanWards.some((uw) => uw.id === wId)) ||
      urbanWards.some((uw) => uw.id === b.wardId),
    ).length;

    return { totalWards, totalMale, totalFemale, total2011, total2027, totalBooths };
  }, [urbanWards, booths]);

  // Open Edit Modal for a specific row
  const handleOpenEdit = (ward: WardItem) => {
    setEditingWard(ward);
    setFormMale(ward.malePopulation ? String(ward.malePopulation) : '');
    setFormFemale(ward.femalePopulation ? String(ward.femalePopulation) : '');
    setFormCensus2011(ward.census2011Population ? String(ward.census2011Population) : '');
    setFormCensus2027(ward.census2027Population ? String(ward.census2027Population) : '');
    setIsEditModalOpen(true);
  };

  // Open Record Modal from Header Button
  const handleOpenRecordModal = () => {
    const defaultWard = urbanWards[0]?.id || '';
    setSelectedWardId(defaultWard);
    if (urbanWards[0]) {
      setFormMale(urbanWards[0].malePopulation ? String(urbanWards[0].malePopulation) : '');
      setFormFemale(urbanWards[0].femalePopulation ? String(urbanWards[0].femalePopulation) : '');
      setFormCensus2011(urbanWards[0].census2011Population ? String(urbanWards[0].census2011Population) : '');
      setFormCensus2027(urbanWards[0].census2027Population ? String(urbanWards[0].census2027Population) : '');
    } else {
      setFormMale('');
      setFormFemale('');
      setFormCensus2011('');
      setFormCensus2027('');
    }
    setIsRecordModalOpen(true);
  };

  // Save Edit from table row
  const handleSaveEdit = () => {
    if (!editingWard) return;

    const male = Number(formMale) || 0;
    const female = Number(formFemale) || 0;
    const sum2011 = Number(formCensus2011) || (male + female > 0 ? male + female : 0);

    updateWard(editingWard.id, {
      malePopulation: male,
      femalePopulation: female,
      census2011Population: sum2011,
      census2027Population: Number(formCensus2027) || Math.round(sum2011 * 1.44),
    });

    toast.success(`Demographics for "${editingWard.name}" updated successfully!`);
    setIsEditModalOpen(false);
  };

  // Save Record Demographics from dropdown selection
  const handleSaveRecord = () => {
    if (!selectedWardId) {
      toast.error('Please select an Urban Ward from the dropdown.');
      return;
    }

    const targetWard = urbanWards.find((w) => w.id === selectedWardId);
    const male = Number(formMale) || 0;
    const female = Number(formFemale) || 0;
    const sum2011 = Number(formCensus2011) || (male + female > 0 ? male + female : 0);

    updateWard(selectedWardId, {
      malePopulation: male,
      femalePopulation: female,
      census2011Population: sum2011,
      census2027Population: Number(formCensus2027) || Math.round(sum2011 * 1.44),
    });

    toast.success(`Demographics for "${targetWard?.name || 'Selected Ward'}" saved successfully!`);
    setIsRecordModalOpen(false);
  };

  // Delete Ward
  const handleDelete = (ward: WardItem) => {
    if (!confirm(`Are you sure you want to delete "${ward.name}"?`)) return;
    const res = deleteWard(ward.id);
    if (res.success) {
      toast.success(`Ward "${ward.name}" deleted.`);
    } else {
      toast.error(res.error || 'Cannot delete ward.');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Ward Number',
      'Ward Name',
      'Male Population',
      'Female Population',
      'Census 2011 Total',
      'Census 2027 (Approx)',
    ];

    const rows = filteredWards.map((w) => [
      w.wardNumber || '',
      `"${w.name}"`,
      w.malePopulation || 0,
      w.femalePopulation || 0,
      w.census2011Population || 0,
      w.census2027Population || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Vyasnagar_Municipality_Demographics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded Vyasnagar Municipality Demographics CSV');
  };

  // Table Columns
  const columns: Column<WardItem>[] = [
    {
      key: 'sl',
      header: 'Sl No.',
      align: 'center',
      className: 'w-16',
      render: (_, idx) => <span className="font-bold text-slate-400 text-xs">{idx + 1}</span>,
    },
    {
      key: 'wardNumber',
      header: 'Ward No.',
      align: 'center',
      className: 'w-24',
      sortable: true,
      render: (w) => (
        <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200 font-bold text-xs px-2 py-0.5">
          #{w.wardNumber || '-'}
        </Badge>
      ),
    },
    {
      key: 'name',
      header: 'Ward Name',
      sortable: true,
      render: (w) => (
        <div>
          <span className="font-bold text-slate-900 text-sm">{w.name}</span>
          <p className="text-[11px] text-slate-500 font-medium">Vyasanagar Municipality</p>
        </div>
      ),
    },
    {
      key: 'malePopulation',
      header: 'Male',
      align: 'right',
      sortable: true,
      render: (w) => (
        <span className="font-semibold text-slate-700 text-xs">
          {(w.malePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'femalePopulation',
      header: 'Female',
      align: 'right',
      sortable: true,
      render: (w) => (
        <span className="font-semibold text-slate-700 text-xs">
          {(w.femalePopulation || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'census2011',
      header: 'Census 2011',
      align: 'right',
      sortable: true,
      render: (w) => (
        <span className="font-bold text-slate-900 text-xs">
          {(w.census2011Population || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'census2027',
      header: 'Census 2027 (Approx)',
      align: 'right',
      sortable: true,
      render: (w) => (
        <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-bold text-xs">
          {(w.census2027Population || 0).toLocaleString('en-IN')}
        </Badge>
      ),
    },
    {
      key: 'booths',
      header: 'Polling Booths',
      align: 'center',
      render: (w) => {
        const count = booths.filter((b) =>
          b.wardIds?.includes(w.id) || b.wardId === w.id,
        ).length;
        return (
          <div className="flex items-center justify-center gap-1">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold text-xs gap-1">
              <LuVote className="w-3 h-3 text-primary-600" />
              <span>{count} {count === 1 ? 'Booth' : 'Booths'}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (ward) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
              <LuEllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setViewingWard(ward)} className="text-xs gap-2">
              <LuEye className="w-3.5 h-3.5 text-slate-500" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenEdit(ward)} className="text-xs gap-2">
              <LuPencil className="w-3.5 h-3.5 text-primary-600" />
              <span>Update Demographics</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(ward)} className="text-xs gap-2 text-rose-600 focus:text-rose-600">
              <LuTrash2 className="w-3.5 h-3.5" />
              <span>Delete Ward</span>
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
        <span className="text-slate-500 font-normal">Urban Demographics</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fff5ee] border border-orange-200/80 flex items-center justify-center shrink-0">
            <LuBuilding2 className="w-7 h-7 text-[#f97316]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Urban Demographics — Vyasanagar Municipality
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Official 2011 Census and 2027 Projected Population for all 26 Municipal Wards
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
            onClick={handleOpenRecordModal}
            size="default"
            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs flex items-center gap-1.5"
          >
            <LuPlus className="w-4 h-4" />
            <span>Record / Update Ward Data</span>
          </Button>
        </div>
      </div>

      {/* High-Level Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Wards */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL WARDS</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{stats.totalWards}</h3>
            <span className="text-xs font-bold text-blue-600 mt-1 block">Vyasanagar ULB</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <LuBuilding2 className="w-6 h-6 text-blue-600" />
          </div>
        </Card>

        {/* 2011 Census */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">2011 CENSUS</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{stats.total2011.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">Official Census</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <LuUsers className="w-6 h-6 text-emerald-600" />
          </div>
        </Card>

        {/* 2027 Projected */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">2027 PROJECTED</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#f97316] mt-0.5">{stats.total2027.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-[#f97316] mt-1 block">+44.1% Growth</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100/60 border border-orange-200/80 text-[#f97316] flex items-center justify-center shrink-0">
            <LuTrendingUp className="w-6 h-6 text-[#f97316]" />
          </div>
        </Card>

        {/* Male Population */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">MALE POPULATION</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{stats.totalMale.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-medium text-slate-500 mt-1 block">
              {stats.total2011 > 0 ? ((stats.totalMale / stats.total2011) * 100).toFixed(1) : 0}% of Total
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <LuUser className="w-6 h-6 text-blue-600" />
          </div>
        </Card>

        {/* Female Population */}
        <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">FEMALE POPULATION</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{stats.totalFemale.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-medium text-slate-500 mt-1 block">
              {stats.total2011 > 0 ? ((stats.totalFemale / stats.total2011) * 100).toFixed(1) : 0}% of Total
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50/80 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
            <LuUser className="w-6 h-6 text-rose-500" />
          </div>
        </Card>
      </div>

      {/* Main Data Table */}
      <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ward name or number..."
              className="pl-9 text-xs h-9 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1">
              Showing {filteredWards.length} of {urbanWards.length} Wards
            </Badge>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredWards}
          defaultPageSize={30}
        />
      </Card>

      {/* Record / Update Ward Demographics Modal with Dropdown */}
      <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Record / Update Ward Demographics
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Choose an existing Municipal Ward configured in Master Data to enter or update census data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Select Municipal Ward *</Label>
              <Select value={selectedWardId} onValueChange={setSelectedWardId}>
                <SelectTrigger className="text-xs h-9 font-semibold">
                  <SelectValue placeholder="Choose Ward from Master Data" />
                </SelectTrigger>
                <SelectContent>
                  {urbanWards.map((w) => (
                    <SelectItem key={w.id} value={w.id} className="text-xs">
                      {w.name} {w.wardNumber ? `(Ward #${w.wardNumber})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  value={formMale}
                  onChange={(e) => setFormMale(e.target.value)}
                  placeholder="e.g. 855"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  value={formFemale}
                  onChange={(e) => setFormFemale(e.target.value)}
                  placeholder="e.g. 755"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Census 2011 Total</Label>
                <Input
                  type="number"
                  value={formCensus2011}
                  onChange={(e) => setFormCensus2011(e.target.value)}
                  placeholder="e.g. 1610"
                  className="text-xs h-9 font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Census 2027 (Approx)</Label>
                <Input
                  type="number"
                  value={formCensus2027}
                  onChange={(e) => setFormCensus2027(e.target.value)}
                  placeholder="e.g. 1272"
                  className="text-xs h-9 font-bold text-orange-600"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecordModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveRecord}
              className="bg-primary-600 hover:bg-primary-700 text-xs font-semibold"
            >
              Save Demographics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Row Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Update Demographics — {editingWard?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update Census 2011 and projected 2027 population figures for this ward.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  value={formMale}
                  onChange={(e) => setFormMale(e.target.value)}
                  placeholder="e.g. 855"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  value={formFemale}
                  onChange={(e) => setFormFemale(e.target.value)}
                  placeholder="e.g. 755"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Census 2011 Total</Label>
                <Input
                  type="number"
                  value={formCensus2011}
                  onChange={(e) => setFormCensus2011(e.target.value)}
                  placeholder="e.g. 1610"
                  className="text-xs h-9 font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Census 2027 (Approx)</Label>
                <Input
                  type="number"
                  value={formCensus2027}
                  onChange={(e) => setFormCensus2027(e.target.value)}
                  placeholder="e.g. 1272"
                  className="text-xs h-9 font-bold text-orange-600"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              className="bg-primary-600 hover:bg-primary-700 text-xs font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ward Modal */}
      <Dialog open={!!viewingWard} onOpenChange={(open) => !open && setViewingWard(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LuBuilding2 className="w-5 h-5 text-primary-600" />
              <span>{viewingWard?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Vyasanagar Municipality Ward Census Profile
            </DialogDescription>
          </DialogHeader>

          {viewingWard && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Ward Number:</span>
                  <span className="font-bold text-slate-900">#{viewingWard.wardNumber || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Male Population:</span>
                  <span className="font-semibold text-slate-800">{(viewingWard.malePopulation || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Female Population:</span>
                  <span className="font-semibold text-slate-800">{(viewingWard.femalePopulation || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Census 2011 Total:</span>
                  <span className="font-black text-slate-900">{(viewingWard.census2011Population || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-orange-700">Census 2027 Projected:</span>
                  <span className="font-black text-orange-600">{(viewingWard.census2027Population || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setViewingWard(null)}
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
