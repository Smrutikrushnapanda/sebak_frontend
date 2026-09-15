'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useHierarchyStore,
  WardItem,
  VillageItem,
} from '@/store/useHierarchyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  LuArrowLeft,
  LuBuilding2,
  LuLandmark,
  LuPlus,
  LuUsers,
  LuSave,
  LuSparkles,
  LuLayers,
  LuVote,
  LuMapPin,
} from 'react-icons/lu';

export default function AddDemographicsPage() {
  const router = useRouter();
  const {
    urbanLocalBodies,
    blocks,
    panchayats,
    villages,
    wards,
    booths,
    addWard,
    addVillage,
    addBooth,
    getPanchayatsByBlock,
  } = useHierarchyStore();

  const [entryType, setEntryType] = useState<'urban' | 'rural'>('urban');

  // Urban Form Fields
  const [selectedULBId, setSelectedULBId] = useState<string>(
    urbanLocalBodies.length > 0 ? urbanLocalBodies[0].id : '126013901',
  );
  const [wardNumber, setWardNumber] = useState<string>('');
  const [wardName, setWardName] = useState<string>('');
  const [urbanMale, setUrbanMale] = useState<string>('');
  const [urbanFemale, setUrbanFemale] = useState<string>('');
  const [urbanCensus2011, setUrbanCensus2011] = useState<string>('');
  const [urbanCensus2027, setUrbanCensus2027] = useState<string>('');
  const [selectedBoothIds, setSelectedBoothIds] = useState<string[]>([]);

  // Rural Form Fields
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    blocks.length > 0 ? blocks[0].id : '',
  );
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<string>('');
  const [villageName, setVillageName] = useState<string>('');
  const [ruralMale, setRuralMale] = useState<string>('');
  const [ruralFemale, setRuralFemale] = useState<string>('');
  const [ruralCensus2011, setRuralCensus2011] = useState<string>('');
  const [ruralCensus2027, setRuralCensus2027] = useState<string>('');

  // Available Panchayats for chosen block
  const availablePanchayats = useMemo(() => {
    if (!selectedBlockId) return [];
    return getPanchayatsByBlock(selectedBlockId);
  }, [selectedBlockId, getPanchayatsByBlock]);

  // Computed Totals
  const urbanComputedSum = (Number(urbanMale) || 0) + (Number(urbanFemale) || 0);
  const ruralComputedSum = (Number(ruralMale) || 0) + (Number(ruralFemale) || 0);

  // Available booths for urban
  const availableBooths = useMemo(() => {
    return booths;
  }, [booths]);

  // Handle Ward Name auto-filling
  const handleWardNumberChange = (numStr: string) => {
    setWardNumber(numStr);
    if (numStr.trim()) {
      const padNum = numStr.trim().padStart(2, '0');
      setWardName(`Ward No. ${padNum}`);
    }
  };

  // Submit Urban Ward
  const handleSaveUrbanWard = (andAnother = false) => {
    if (!selectedULBId) {
      toast.error('Please select a Municipality / Urban Local Body.');
      return;
    }
    if (!wardName.trim()) {
      toast.error('Please enter a Ward Name or Ward Number.');
      return;
    }

    const targetULB = urbanLocalBodies.find((u) => u.id === selectedULBId);

    const newWard = addWard({
      name: wardName.trim(),
      wardNumber: wardNumber ? Number(wardNumber) : undefined,
      parentType: 'ULB',
      parentId: selectedULBId,
      assemblyId: targetULB?.assemblyId || '126013001',
      malePopulation: Number(urbanMale) || 0,
      femalePopulation: Number(urbanFemale) || 0,
      census2011Population: Number(urbanCensus2011) || (urbanComputedSum > 0 ? urbanComputedSum : 0),
      census2027Population: Number(urbanCensus2027) || 0,
      boothIds: selectedBoothIds,
    });

    toast.success(`Ward "${newWard.name}" created with population figures!`);

    if (andAnother) {
      const nextNum = wardNumber ? Number(wardNumber) + 1 : '';
      if (nextNum) {
        handleWardNumberChange(String(nextNum));
      } else {
        setWardNumber('');
        setWardName('');
      }
      setUrbanMale('');
      setUrbanFemale('');
      setUrbanCensus2011('');
      setUrbanCensus2027('');
      setSelectedBoothIds([]);
    } else {
      router.push('/organization/demographics');
    }
  };

  // Submit Rural Village / GP Demographics
  const handleSaveRuralVillage = (andAnother = false) => {
    if (!selectedBlockId) {
      toast.error('Please select a Block.');
      return;
    }
    if (!selectedPanchayatId) {
      toast.error('Please select a Gram Panchayat.');
      return;
    }
    if (!villageName.trim()) {
      toast.error('Please enter the Village Name.');
      return;
    }

    const newVillage = addVillage({
      name: villageName.trim(),
      panchayatId: selectedPanchayatId,
      malePopulation: Number(ruralMale) || 0,
      femalePopulation: Number(ruralFemale) || 0,
      census2011Population: Number(ruralCensus2011) || (ruralComputedSum > 0 ? ruralComputedSum : 0),
      census2027Population: Number(ruralCensus2027) || 0,
    });

    toast.success(`Village "${newVillage.name}" demographics added successfully!`);

    if (andAnother) {
      setVillageName('');
      setRuralMale('');
      setRuralFemale('');
      setRuralCensus2011('');
      setRuralCensus2027('');
    } else {
      router.push('/organization/demographics');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back link & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/organization/demographics">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-500 hover:text-slate-900">
              <LuArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add Population & Census Data</h1>
            <p className="text-xs text-slate-500">
              Record demographic details, gender metrics, 2011 Census, and 2027 Census projections.
            </p>
          </div>
        </div>

        <Badge variant="accent" className="text-xs font-bold px-2.5 py-1 uppercase tracking-wide">
          {entryType === 'urban' ? 'Urban Area' : 'Rural Area'}
        </Badge>
      </div>

      {/* Entry Type Switcher */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setEntryType('urban')}
          className={`flex items-center justify-center space-x-2.5 py-3 rounded-xl text-sm font-bold transition-all ${
            entryType === 'urban'
              ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LuBuilding2 className="w-4 h-4" />
          <span>Urban Municipality Ward</span>
        </button>

        <button
          type="button"
          onClick={() => setEntryType('rural')}
          className={`flex items-center justify-center space-x-2.5 py-3 rounded-xl text-sm font-bold transition-all ${
            entryType === 'rural'
              ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LuLandmark className="w-4 h-4" />
          <span>Rural Block / GP Village</span>
        </button>
      </div>

      {/* Urban Municipality Ward Form */}
      {entryType === 'urban' ? (
        <Card className="p-6 border-slate-200 shadow-sm bg-white space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <LuBuilding2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Municipal Ward Information</h2>
              <p className="text-xs text-slate-500">Directly associated under Municipality without intermediary levels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Municipality / Urban Body *</Label>
              <Select value={selectedULBId} onValueChange={setSelectedULBId}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select Municipality" />
                </SelectTrigger>
                <SelectContent>
                  {urbanLocalBodies.map((ulb) => (
                    <SelectItem key={ulb.id} value={ulb.id}>
                      {ulb.name} ({ulb.ulbType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Ward Number</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  value={wardNumber}
                  onChange={(e) => handleWardNumberChange(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Ward Name *</Label>
                <Input
                  placeholder="e.g. Ward No. 01"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Demographic Metrics */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LuUsers className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-900">Population & Census Metrics</h3>
              </div>
              {urbanComputedSum > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Gender Total: {urbanComputedSum.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  placeholder="e.g. 855"
                  value={urbanMale}
                  onChange={(e) => setUrbanMale(e.target.value)}
                  className="h-10 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  placeholder="e.g. 755"
                  value={urbanFemale}
                  onChange={(e) => setUrbanFemale(e.target.value)}
                  className="h-10 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Census 2011 Total</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1610"
                  value={urbanCensus2011}
                  onChange={(e) => setUrbanCensus2011(e.target.value)}
                  className="h-10 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-amber-900">Census 2027 (Approx 2026)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1272"
                  value={urbanCensus2027}
                  onChange={(e) => setUrbanCensus2027(e.target.value)}
                  className="h-10 text-xs font-bold text-amber-900 bg-amber-50/60 border-amber-200"
                />
              </div>
            </div>
          </div>

          {/* Polling Booth Mapping (1 or more wards make a booth) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-2">
              <LuVote className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-bold text-slate-900">Associated Polling Booths</h3>
            </div>
            <p className="text-xs text-slate-500">
              Select booths covering this ward (or booths composed of multiple wards):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {availableBooths.map((b) => {
                const isSelected = selectedBoothIds.includes(b.id);
                return (
                  <label
                    key={b.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all border text-xs ${
                      isSelected
                        ? 'bg-primary-50 border-primary-300 text-primary-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBoothIds([...selectedBoothIds, b.id]);
                        } else {
                          setSelectedBoothIds(selectedBoothIds.filter((id) => id !== b.id));
                        }
                      }}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="truncate">{b.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/organization/demographics')}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSaveUrbanWard(true)}
              className="text-primary-700 border-primary-200 hover:bg-primary-50 font-semibold"
            >
              Save & Add Another
            </Button>
            <Button
              size="sm"
              onClick={() => handleSaveUrbanWard(false)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold space-x-1.5 shadow-sm"
            >
              <LuSave className="w-4 h-4" />
              <span>Save Municipal Ward</span>
            </Button>
          </div>
        </Card>
      ) : (
        /* Rural Block / GP Village Form */
        <Card className="p-6 border-slate-200 shadow-sm bg-white space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <LuLandmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Rural GP & Village Information</h2>
              <p className="text-xs text-slate-500">Record village population under Block $\rightarrow$ Gram Panchayat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Block *</Label>
              <Select
                value={selectedBlockId}
                onValueChange={(val) => {
                  setSelectedBlockId(val);
                  setSelectedPanchayatId('');
                }}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Gram Panchayat *</Label>
              <Select value={selectedPanchayatId} onValueChange={setSelectedPanchayatId}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select Gram Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  {availablePanchayats.map((gp) => (
                    <SelectItem key={gp.id} value={gp.id}>
                      {gp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Village Name *</Label>
              <Input
                placeholder="e.g. Korei Village"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="h-10 text-xs"
              />
            </div>
          </div>

          {/* Demographic Metrics */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LuUsers className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-900">Population & Census Metrics</h3>
              </div>
              {ruralComputedSum > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Gender Total: {ruralComputedSum.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Male Population</Label>
                <Input
                  type="number"
                  placeholder="e.g. 450"
                  value={ruralMale}
                  onChange={(e) => setRuralMale(e.target.value)}
                  className="h-10 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Female Population</Label>
                <Input
                  type="number"
                  placeholder="e.g. 420"
                  value={ruralFemale}
                  onChange={(e) => setRuralFemale(e.target.value)}
                  className="h-10 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Census 2011 Total</Label>
                <Input
                  type="number"
                  placeholder="e.g. 870"
                  value={ruralCensus2011}
                  onChange={(e) => setRuralCensus2011(e.target.value)}
                  className="h-10 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-amber-900">Census 2027 (Approx 2026)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1150"
                  value={ruralCensus2027}
                  onChange={(e) => setRuralCensus2027(e.target.value)}
                  className="h-10 text-xs font-bold text-amber-900 bg-amber-50/60 border-amber-200"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/organization/demographics')}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSaveRuralVillage(true)}
              className="text-primary-700 border-primary-200 hover:bg-primary-50 font-semibold"
            >
              Save & Add Another
            </Button>
            <Button
              size="sm"
              onClick={() => handleSaveRuralVillage(false)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold space-x-1.5 shadow-sm"
            >
              <LuSave className="w-4 h-4" />
              <span>Save Village Data</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
