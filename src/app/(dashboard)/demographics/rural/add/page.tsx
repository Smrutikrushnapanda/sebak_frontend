'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHierarchyStore } from '@/store/useHierarchyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  LuLandmark,
  LuHouse,
  LuSave,
} from 'react-icons/lu';

export default function RecordRuralDemographicsPage() {
  const router = useRouter();
  const { updatePanchayat, updateVillage, blocks, panchayats, villages } = useHierarchyStore();

  const [activeTab, setActiveTab] = useState<'gp' | 'village'>('gp');

  // GP Form state
  const [gpBlockId, setGpBlockId] = useState('126013008'); // Korei Block
  const [selectedGPId, setSelectedGPId] = useState('');
  const [gpMale, setGpMale] = useState('');
  const [gpFemale, setGpFemale] = useState('');
  const [gpTotal, setGpTotal] = useState('');
  const [gpST, setGpST] = useState('');
  const [gpSC, setGpSC] = useState('');
  const [gpOC, setGpOC] = useState('');
  const [gpWards, setGpWards] = useState('');

  // Available GPs for block
  const blockGPs = useMemo(() => {
    return panchayats.filter((p) => p.blockId === gpBlockId);
  }, [panchayats, gpBlockId]);

  useEffect(() => {
    if (blockGPs.length > 0 && !blockGPs.some((p) => p.id === selectedGPId)) {
      handleSelectGP(blockGPs[0].id);
    }
  }, [blockGPs]);

  const handleSelectGP = (gpId: string) => {
    setSelectedGPId(gpId);
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

  // Village Form state
  const [vBlockId, setVBlockId] = useState('126013008');
  const [vPanchayatId, setVPanchayatId] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');
  const [vHouseholds, setVHouseholds] = useState('');
  const [vMale, setVMale] = useState('');
  const [vFemale, setVFemale] = useState('');
  const [vTotal, setVTotal] = useState('');

  const vGPs = useMemo(() => {
    return panchayats.filter((p) => p.blockId === vBlockId);
  }, [panchayats, vBlockId]);

  useEffect(() => {
    if (vGPs.length > 0 && !vGPs.some((p) => p.id === vPanchayatId)) {
      setVPanchayatId(vGPs[0].id);
    }
  }, [vGPs]);

  const gpVillages = useMemo(() => {
    if (!vPanchayatId) return [];
    return villages.filter((v) => v.panchayatId === vPanchayatId);
  }, [villages, vPanchayatId]);

  useEffect(() => {
    if (gpVillages.length > 0 && !gpVillages.some((v) => v.id === selectedVillageId)) {
      handleSelectVillage(gpVillages[0].id);
    }
  }, [gpVillages]);

  const handleSelectVillage = (vId: string) => {
    setSelectedVillageId(vId);
    const target = villages.find((v) => v.id === vId);
    if (target) {
      setVHouseholds(target.households ? String(target.households) : '');
      setVMale(target.malePopulation ? String(target.malePopulation) : '');
      setVFemale(target.femalePopulation ? String(target.femalePopulation) : '');
      setVTotal(target.totalPopulation || target.census2011Population ? String(target.totalPopulation || target.census2011Population) : '');
    }
  };

  const handleSaveGP = () => {
    if (!selectedGPId) {
      toast.error('Please select a Gram Panchayat from the dropdown.');
      return;
    }

    const m = Number(gpMale) || 0;
    const f = Number(gpFemale) || 0;
    const tot = Number(gpTotal) || (m + f > 0 ? m + f : 0);
    const target = panchayats.find((p) => p.id === selectedGPId);

    updatePanchayat(selectedGPId, {
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

    toast.success(`Demographics for "${target?.name || 'Selected GP'}" saved successfully!`);
    router.push('/demographics/rural');
  };

  const handleSaveVillage = () => {
    if (!selectedVillageId) {
      toast.error('Please select a Revenue Village from the dropdown.');
      return;
    }

    const m = Number(vMale) || 0;
    const f = Number(vFemale) || 0;
    const tot = Number(vTotal) || (m + f > 0 ? m + f : 0);
    const target = villages.find((v) => v.id === selectedVillageId);

    updateVillage(selectedVillageId, {
      households: vHouseholds ? Number(vHouseholds) : undefined,
      malePopulation: m,
      femalePopulation: f,
      totalPopulation: tot,
      census2011Population: tot,
      census2027Population: Math.round(tot * 1.44),
    });

    toast.success(`Demographics for "${target?.name || 'Selected Village'}" saved successfully!`);
    router.push('/demographics/rural');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/demographics/rural')}
          className="text-xs font-semibold gap-1.5 text-slate-600 hover:text-slate-900"
        >
          <LuArrowLeft className="w-4 h-4" />
          <span>Back to Rural Demographics</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
          <TabsTrigger
            value="gp"
            className="text-xs font-black gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-xs rounded-lg transition-all"
          >
            <LuLandmark className="w-4 h-4" />
            <span>1. Record Gram Panchayat Demographics</span>
          </TabsTrigger>
          <TabsTrigger
            value="village"
            className="text-xs font-black gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-xs rounded-lg transition-all"
          >
            <LuHouse className="w-4 h-4" />
            <span>2. Record Revenue Village Demographics</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Gram Panchayat Demographics */}
        <TabsContent value="gp" className="mt-0">
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <LuLandmark className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900">
                    Record Gram Panchayat Demographics
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Choose an existing Gram Panchayat configured in Master Data to record or update Census 2011 statistics
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                Rural GP
              </Badge>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">1. Select Rural Block *</Label>
                  <Select value={gpBlockId} onValueChange={setGpBlockId}>
                    <SelectTrigger className="text-xs h-9 font-semibold">
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

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">2. Select Gram Panchayat *</Label>
                  <Select value={selectedGPId} onValueChange={handleSelectGP}>
                    <SelectTrigger className="text-xs h-9 font-semibold">
                      <SelectValue placeholder="Choose GP from Master Data" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {blockGPs.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                  <Input
                    type="number"
                    value={gpMale}
                    onChange={(e) => setGpMale(e.target.value)}
                    placeholder="e.g. 4246"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                  <Input
                    type="number"
                    value={gpFemale}
                    onChange={(e) => setGpFemale(e.target.value)}
                    placeholder="e.g. 3968"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-amber-700">ST Population</Label>
                  <Input
                    type="number"
                    value={gpST}
                    onChange={(e) => setGpST(e.target.value)}
                    placeholder="e.g. 1064"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-blue-700">SC Population</Label>
                  <Input
                    type="number"
                    value={gpSC}
                    onChange={(e) => setGpSC(e.target.value)}
                    placeholder="e.g. 1324"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-purple-700">OC / General Population</Label>
                  <Input
                    type="number"
                    value={gpOC}
                    onChange={(e) => setGpOC(e.target.value)}
                    placeholder="e.g. 5826"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Total GP Population (2011)</Label>
                  <Input
                    type="number"
                    value={gpTotal}
                    onChange={(e) => setGpTotal(e.target.value)}
                    placeholder="e.g. 8214"
                    className="text-xs h-9 font-black text-slate-900 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
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

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/demographics/rural')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveGP}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5"
                >
                  <LuSave className="w-4 h-4" />
                  <span>Save GP Demographics</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Revenue Village Demographics */}
        <TabsContent value="village" className="mt-0">
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <LuHouse className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900">
                    Record Revenue Village Demographics
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Choose an existing Revenue Village configured under a Gram Panchayat to record census statistics
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
                Revenue Village
              </Badge>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">1. Select Rural Block *</Label>
                  <Select value={vBlockId} onValueChange={setVBlockId}>
                    <SelectTrigger className="text-xs h-9 font-semibold">
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

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">2. Select Gram Panchayat *</Label>
                  <Select value={vPanchayatId} onValueChange={setVPanchayatId}>
                    <SelectTrigger className="text-xs h-9 font-semibold">
                      <SelectValue placeholder="Select Gram Panchayat" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {vGPs.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">3. Select Revenue Village *</Label>
                  <Select value={selectedVillageId} onValueChange={handleSelectVillage}>
                    <SelectTrigger className="text-xs h-9 font-semibold">
                      <SelectValue placeholder="Choose Village from Master Data" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {gpVillages.map((v) => (
                        <SelectItem key={v.id} value={v.id} className="text-xs">
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Number of Households</Label>
                <Input
                  type="number"
                  value={vHouseholds}
                  onChange={(e) => setVHouseholds(e.target.value)}
                  placeholder="e.g. 769"
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Male Population</Label>
                  <Input
                    type="number"
                    value={vMale}
                    onChange={(e) => setVMale(e.target.value)}
                    placeholder="e.g. 1928"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Female Population</Label>
                  <Input
                    type="number"
                    value={vFemale}
                    onChange={(e) => setVFemale(e.target.value)}
                    placeholder="e.g. 1774"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Total Village Population (2011)</Label>
                <Input
                  type="number"
                  value={vTotal}
                  onChange={(e) => setVTotal(e.target.value)}
                  placeholder="e.g. 3702"
                  className="text-xs h-9 font-black text-slate-900 bg-slate-50"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/demographics/rural')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveVillage}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
                >
                  <LuSave className="w-4 h-4" />
                  <span>Save Village Demographics</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
