'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHierarchyStore } from '@/store/useHierarchyStore';
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
  LuSave,
} from 'react-icons/lu';

export default function RecordUrbanWardDemographicsPage() {
  const router = useRouter();
  const { updateWard, wards } = useHierarchyStore();

  const urbanWards = useMemo(() => {
    return wards
      .filter((w) => w.parentType === 'ULB')
      .sort((a, b) => (Number(a.wardNumber) || 0) - (Number(b.wardNumber) || 0));
  }, [wards]);

  const [selectedWardId, setSelectedWardId] = useState<string>(urbanWards[0]?.id || '');
  const [male, setMale] = useState<string>('');
  const [female, setFemale] = useState<string>('');
  const [census2011, setCensus2011] = useState<string>('');
  const [census2027, setCensus2027] = useState<string>('');

  useEffect(() => {
    if (!selectedWardId) return;
    const target = urbanWards.find((w) => w.id === selectedWardId);
    if (target) {
      setMale(target.malePopulation ? String(target.malePopulation) : '');
      setFemale(target.femalePopulation ? String(target.femalePopulation) : '');
      setCensus2011(target.census2011Population ? String(target.census2011Population) : '');
      setCensus2027(target.census2027Population ? String(target.census2027Population) : '');
    }
  }, [selectedWardId, urbanWards]);

  const computedSum = (Number(male) || 0) + (Number(female) || 0);

  const handleSave = () => {
    if (!selectedWardId) {
      toast.error('Please select an Urban Ward from the dropdown.');
      return;
    }

    const target = urbanWards.find((w) => w.id === selectedWardId);
    const maleNum = Number(male) || 0;
    const femaleNum = Number(female) || 0;
    const total2011 = Number(census2011) || (computedSum > 0 ? computedSum : 0);
    const total2027 = Number(census2027) || Math.round(total2011 * 1.44);

    updateWard(selectedWardId, {
      malePopulation: maleNum,
      femalePopulation: femaleNum,
      census2011Population: total2011,
      census2027Population: total2027,
    });

    toast.success(`Demographics for "${target?.name || 'Selected Ward'}" saved successfully!`);
    router.push('/demographics/urban');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/demographics/urban')}
          className="text-xs font-semibold gap-1.5 text-slate-600 hover:text-slate-900"
        >
          <LuArrowLeft className="w-4 h-4" />
          <span>Back to Urban Demographics</span>
        </Button>
      </div>

      {/* Main Form Card */}
      <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600">
              <LuBuilding2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Record Urban Ward Demographics
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Choose an existing Municipal Ward configured in Master Data and update population figures
              </p>
            </div>
          </div>
          <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs font-bold">
            Vyasanagar ULB
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Select Municipal Ward *</Label>
            <Select value={selectedWardId} onValueChange={setSelectedWardId}>
              <SelectTrigger className="text-xs h-9 font-semibold">
                <SelectValue placeholder="Select existing Ward from Master Data" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Male Population</Label>
              <Input
                type="number"
                value={male}
                onChange={(e) => setMale(e.target.value)}
                placeholder="e.g. 855"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Female Population</Label>
              <Input
                type="number"
                value={female}
                onChange={(e) => setFemale(e.target.value)}
                placeholder="e.g. 755"
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">Census 2011 Total</Label>
                {computedSum > 0 && (
                  <span className="text-[11px] text-slate-400 font-medium">Sum: {computedSum}</span>
                )}
              </div>
              <Input
                type="number"
                value={census2011}
                onChange={(e) => setCensus2011(e.target.value)}
                placeholder={computedSum > 0 ? String(computedSum) : 'e.g. 1610'}
                className="text-xs h-9 font-black text-slate-900 bg-slate-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Census 2027 Projected (Approx)</Label>
              <Input
                type="number"
                value={census2027}
                onChange={(e) => setCensus2027(e.target.value)}
                placeholder="e.g. 2318"
                className="text-xs h-9 font-bold text-orange-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/demographics/urban')}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold gap-1.5"
            >
              <LuSave className="w-4 h-4" />
              <span>Save Demographics</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
