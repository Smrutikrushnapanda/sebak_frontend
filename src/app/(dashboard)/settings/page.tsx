'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { useConstituencySettings, RepresentativeType, AssemblyConstituencyConfig } from '@/context/settings-context';
import { useHierarchyStore } from '@/store/useHierarchyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  LuSettings,
  LuPhone,
  LuMapPin,
  LuSave,
  LuCircleCheck,
  LuLayers,
  LuBuilding,
  LuPlus,
  LuTrash2,
  LuCheck,
  LuX,
  LuNetwork,
  LuVote,
} from 'react-icons/lu';

export default function SettingsPage() {
  const { settings, refreshSettings, updateSettingsState } = useConstituencySettings();
  const { states, getDistrictsByState, assemblyConstituencies, getAssembliesByDistrict } = useHierarchyStore();

  const [formType, setFormType] = useState<RepresentativeType>('MLA');
  const [formPortalName, setFormPortalName] = useState('');
  const [formName, setFormName] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string>('126'); // Odisha default
  const [formState, setFormState] = useState('Odisha');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('126013'); // Jajpur default
  const [formDistrict, setFormDistrict] = useState('Jajpur');
  const [formMobile, setFormMobile] = useState('');
  const [formAddress, setFormAddress] = useState('');

  // MLA Specific Configuration
  const [formAssemblyName, setFormAssemblyName] = useState('Korei Assembly');
  const [formRuralEnabled, setFormRuralEnabled] = useState(true);
  const [formUrbanEnabled, setFormUrbanEnabled] = useState(true);

  // MP Specific Configuration
  const [formLokSabhaName, setFormLokSabhaName] = useState('Jajpur (SC) Lok Sabha');
  const [formAssemblyList, setFormAssemblyList] = useState<AssemblyConstituencyConfig[]>([
    { id: 'ac-korei', name: 'Korei Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    { id: 'ac-jajpur', name: 'Jajpur Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    { id: 'ac-bari', name: 'Bari Assembly', ruralEnabled: true, urbanEnabled: false, districtName: 'Jajpur' },
    { id: 'ac-barchana', name: 'Barchana Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    { id: 'ac-dharmasala', name: 'Dharmasala Assembly', ruralEnabled: true, urbanEnabled: false, districtName: 'Jajpur' },
    { id: 'ac-sukinda', name: 'Sukinda Assembly', ruralEnabled: true, urbanEnabled: false, districtName: 'Jajpur' },
    { id: 'ac-binjharpur', name: 'Binjharpur Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
  ]);
  const [newAcName, setNewAcName] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Sync state & district from settings
  useEffect(() => {
    if (settings) {
      setFormType(settings.representativeType || 'MLA');
      setFormPortalName(settings.portalName || `${settings.representativeType || 'MLA'} Constituency Portal`);
      setFormName(settings.representativeName || '');
      setFormState(settings.stateName || 'Odisha');
      setFormDistrict(settings.districtName || 'Jajpur');
      setFormMobile(settings.representativeMobileDisplay || '');
      setFormAddress(settings.officeAddress || '');

      setFormAssemblyName(settings.assemblyName || settings.constituencyName || 'Korei Assembly');
      setFormRuralEnabled(settings.ruralEnabled ?? true);
      setFormUrbanEnabled(settings.urbanEnabled ?? true);

      setFormLokSabhaName(settings.lokSabhaName || settings.constituencyName || 'Jajpur (SC) Lok Sabha');
      if (settings.assemblyConstituencies && settings.assemblyConstituencies.length > 0) {
        setFormAssemblyList(settings.assemblyConstituencies);
      }

      // Find matching state in list
      const matchedState = states.find((s) => s.name.toLowerCase() === (settings.stateName || 'odisha').toLowerCase());
      if (matchedState) {
        setSelectedStateId(String(matchedState.id));
        const districts = getDistrictsByState(matchedState.id);
        const matchedDistrict = districts.find((d) => d.name.toLowerCase() === (settings.districtName || 'jajpur').toLowerCase());
        if (matchedDistrict) {
          setSelectedDistrictId(String(matchedDistrict.id));
        } else if (districts.length > 0) {
          setSelectedDistrictId(String(districts[0].id));
        }
      }
    }
  }, [settings, states, getDistrictsByState]);

  // Districts for selected state
  const districtList = useMemo(() => {
    return getDistrictsByState(selectedStateId);
  }, [selectedStateId, getDistrictsByState]);

  // Available Assembly Constituencies strictly filtered by the selected State & District
  const availableAssemblyOptions = useMemo(() => {
    const list: Array<{ id: string; name: string; ruralEnabled?: boolean; urbanEnabled?: boolean }> = [];
    const seen = new Set<string>();

    // 1. From hierarchy store for this district
    const storeDistrictAssemblies = getAssembliesByDistrict(selectedDistrictId);
    storeDistrictAssemblies.forEach((ac) => {
      if (!seen.has(ac.name.toLowerCase())) {
        seen.add(ac.name.toLowerCase());
        list.push({ id: ac.id, name: ac.name, ruralEnabled: ac.ruralEnabled, urbanEnabled: ac.urbanEnabled });
      }
    });

    // 2. Also check any assembly in store matching districtId or name
    assemblyConstituencies
      .filter((ac) => String(ac.districtId) === String(selectedDistrictId))
      .forEach((ac) => {
        if (!seen.has(ac.name.toLowerCase())) {
          seen.add(ac.name.toLowerCase());
          list.push({ id: ac.id, name: ac.name, ruralEnabled: ac.ruralEnabled, urbanEnabled: ac.urbanEnabled });
        }
      });

    // 3. If Jajpur District (126013 or 'Jajpur')
    if (String(selectedDistrictId) === '126013' || formDistrict.toLowerCase() === 'jajpur') {
      const jajpurDefaults = [
        { name: 'Korei Assembly', rural: true, urban: true },
        { name: 'Jajpur Assembly', rural: true, urban: true },
        { name: 'Bari Assembly', rural: true, urban: false },
        { name: 'Barchana Assembly', rural: true, urban: true },
        { name: 'Dharmasala Assembly', rural: true, urban: false },
        { name: 'Sukinda Assembly', rural: true, urban: false },
        { name: 'Binjharpur Assembly', rural: true, urban: true },
      ];
      jajpurDefaults.forEach((def) => {
        if (!seen.has(def.name.toLowerCase())) {
          seen.add(def.name.toLowerCase());
          list.push({
            id: `ac-${def.name.toLowerCase().replace(/\s+/g, '-')}`,
            name: def.name,
            ruralEnabled: def.rural,
            urbanEnabled: def.urban,
          });
        }
      });
    } else {
      // For any other district in India, provide realistic assemblies for that district if not added yet
      const defaultDistrictOptions = [
        `${formDistrict} Central Assembly`,
        `${formDistrict} Rural Assembly`,
        `${formDistrict} North Assembly`,
        `${formDistrict} South Assembly`,
        `${formDistrict} Sadar Assembly`,
      ];
      defaultDistrictOptions.forEach((optName) => {
        if (!seen.has(optName.toLowerCase())) {
          seen.add(optName.toLowerCase());
          list.push({
            id: `ac-${optName.toLowerCase().replace(/\s+/g, '-')}`,
            name: optName,
            ruralEnabled: true,
            urbanEnabled: true,
          });
        }
      });
    }

    return list;
  }, [selectedDistrictId, formDistrict, getAssembliesByDistrict, assemblyConstituencies]);

  // Handle State Change
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const matchedState = states.find((s) => String(s.id) === stateId);
    if (matchedState) {
      setFormState(matchedState.name);
      const districts = getDistrictsByState(stateId);
      if (districts.length > 0) {
        setSelectedDistrictId(String(districts[0].id));
        setFormDistrict(districts[0].name);

        // Auto-select first assembly for this new district
        const newAssemblies = getAssembliesByDistrict(districts[0].id);
        if (newAssemblies.length > 0) {
          setFormAssemblyName(newAssemblies[0].name);
          setFormRuralEnabled(newAssemblies[0].ruralEnabled ?? true);
          setFormUrbanEnabled(newAssemblies[0].urbanEnabled ?? true);
          setFormPortalName(`${newAssemblies[0].name} MLA Constituency Portal`);
        } else if (String(districts[0].id) === '126013' || districts[0].name.toLowerCase() === 'jajpur') {
          setFormAssemblyName('Korei Assembly');
          setFormRuralEnabled(true);
          setFormUrbanEnabled(true);
          setFormPortalName('Korei Assembly MLA Constituency Portal');
        } else {
          setFormAssemblyName(`${districts[0].name} Central Assembly`);
          setFormRuralEnabled(true);
          setFormUrbanEnabled(true);
          setFormPortalName(`${districts[0].name} Central Assembly MLA Constituency Portal`);
        }
      }
    }
  };

  // Handle District Change
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const matchedDistrict = districtList.find((d) => String(d.id) === districtId);
    if (matchedDistrict) {
      setFormDistrict(matchedDistrict.name);

      // Auto-update assembly constituency to match the new district
      const newAssemblies = getAssembliesByDistrict(districtId);
      if (newAssemblies.length > 0) {
        setFormAssemblyName(newAssemblies[0].name);
        setFormRuralEnabled(newAssemblies[0].ruralEnabled ?? true);
        setFormUrbanEnabled(newAssemblies[0].urbanEnabled ?? true);
        setFormPortalName(`${newAssemblies[0].name} MLA Constituency Portal`);
      } else if (String(districtId) === '126013' || matchedDistrict.name.toLowerCase() === 'jajpur') {
        setFormAssemblyName('Korei Assembly');
        setFormRuralEnabled(true);
        setFormUrbanEnabled(true);
        setFormPortalName('Korei Assembly MLA Constituency Portal');
      } else {
        setFormAssemblyName(`${matchedDistrict.name} Central Assembly`);
        setFormRuralEnabled(true);
        setFormUrbanEnabled(true);
        setFormPortalName(`${matchedDistrict.name} Central Assembly MLA Constituency Portal`);
      }
    }
  };

  // Handle Assembly Dropdown Change in MLA mode
  const handleAssemblyDropdownChange = (assemblyName: string) => {
    setFormAssemblyName(assemblyName);
    setFormPortalName(`${assemblyName} MLA Constituency Portal`);

    const matched = availableAssemblyOptions.find((a) => a.name === assemblyName);
    if (matched) {
      if (typeof matched.ruralEnabled === 'boolean') setFormRuralEnabled(matched.ruralEnabled);
      if (typeof matched.urbanEnabled === 'boolean') setFormUrbanEnabled(matched.urbanEnabled);
    }
  };

  // Add new Assembly Constituency to MP list
  const handleAddAssembly = () => {
    if (!newAcName.trim()) return;
    const cleanName = newAcName.trim().endsWith('Assembly') ? newAcName.trim() : `${newAcName.trim()} Assembly`;
    const newAc: AssemblyConstituencyConfig = {
      id: `ac-${Date.now()}`,
      name: cleanName,
      ruralEnabled: true,
      urbanEnabled: true,
      districtName: formDistrict,
    };
    setFormAssemblyList([...formAssemblyList, newAc]);
    setNewAcName('');
    toast.success(`Added ${newAc.name}`);
  };

  // Remove Assembly from MP list
  const handleRemoveAssembly = (id: string) => {
    if (formAssemblyList.length <= 1) {
      toast.error('An MP organization must contain at least 1 Assembly Constituency.');
      return;
    }
    setFormAssemblyList(formAssemblyList.filter((a) => a.id !== id));
  };

  // Toggle Rural for an AC in MP list
  const handleToggleAcRural = (id: string) => {
    setFormAssemblyList((prev) =>
      prev.map((ac) => {
        if (ac.id === id) {
          if (ac.ruralEnabled && !ac.urbanEnabled) {
            toast.error('Each Assembly Constituency must have at least one active area type (Rural or Urban).');
            return ac;
          }
          return { ...ac, ruralEnabled: !ac.ruralEnabled };
        }
        return ac;
      }),
    );
  };

  // Toggle Urban for an AC in MP list
  const handleToggleAcUrban = (id: string) => {
    setFormAssemblyList((prev) =>
      prev.map((ac) => {
        if (ac.id === id) {
          if (!ac.ruralEnabled && ac.urbanEnabled) {
            toast.error('Each Assembly Constituency must have at least one active area type (Rural or Urban).');
            return ac;
          }
          return { ...ac, urbanEnabled: !ac.urbanEnabled };
        }
        return ac;
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formPortalName.trim()) {
      toast.error('Please fill in Portal Name and Representative Full Name.');
      return;
    }

    if (formType === 'MLA') {
      if (!formRuralEnabled && !formUrbanEnabled) {
        toast.error('Invalid Configuration: An MLA constituency must have at least one enabled area type (Rural or Urban).');
        return;
      }
      if (!formAssemblyName.trim()) {
        toast.error('Please select or enter the Assembly Constituency Name.');
        return;
      }
    } else {
      if (!formLokSabhaName.trim()) {
        toast.error('Please enter the Lok Sabha Constituency Name.');
        return;
      }
      if (formAssemblyList.length === 0) {
        toast.error('An MP organization must configure at least 1 Assembly Constituency.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const constituencyDisplayName = formType === 'MLA' ? formAssemblyName.trim() : formLokSabhaName.trim();

      const payload = {
        representativeType: formType,
        portalName: formPortalName.trim(),
        representativeName: formName.trim(),
        constituencyName: constituencyDisplayName,
        stateName: formState,
        districtName: formDistrict,
        lokSabhaName: formLokSabhaName.trim(),
        lokSabhaId: `ls-${formLokSabhaName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        assemblyName: formAssemblyName.trim(),
        assemblyId: `ac-${formAssemblyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        ruralEnabled: formRuralEnabled,
        urbanEnabled: formUrbanEnabled,
        assemblyConstituencies: formAssemblyList,
        representativeMobileDisplay: formMobile.trim() || undefined,
        officeAddress: formAddress.trim() || undefined,
      };

      const updated = await ApiClient.patch('settings', payload);
      updateSettingsState(updated);
      toast.success('Organization Hierarchy & Settings saved successfully!');
      refreshSettings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold select-none">
        <Link href="/dashboard" className="hover:underline text-[#2563eb]">
          Home
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <span className="text-slate-500 font-normal">Organization Configuration</span>
      </div>

      {/* Page Header Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fff5ee] border border-orange-200/80 flex items-center justify-center shrink-0">
            <LuSettings className="w-7 h-7 text-[#f97316]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Configuration</h1>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-[#fff5ee] text-[#f97316] border border-orange-200/80 tracking-wider">
                {formType} Scope Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Configure electoral scope (MP / MLA), State, District, and constituent Assembly structures.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200/80 bg-[#fff5ee] text-[#f97316]">
            {formState} · {formDistrict}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Organization Type & Regional Location */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-orange-100/70 bg-[#fff8f3] flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#fff5ee] border border-orange-200/80 text-[#f97316] flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
              <LuNetwork className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                1. Organization Scope & Regional Location
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select whether this portal is for an MLA (Assembly) or MP (Parliament) organization.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Scope & Type Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Organization Scope & Representative Type *</Label>
              <Select
                value={formType}
                onValueChange={(val: RepresentativeType) => {
                  setFormType(val);
                  setFormPortalName(
                    val === 'MLA'
                      ? `${formAssemblyName} MLA Constituency Portal`
                      : `${formLokSabhaName} MP Constituency Portal`
                  );
                }}
              >
                <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="MLA" className="text-xs font-bold">
                    MLA — Member of Legislative Assembly (Vidhan Sabha Constituency)
                  </SelectItem>
                  <SelectItem value="MP" className="text-xs font-bold">
                    MP — Member of Parliament (Lok Sabha Parliamentary Constituency)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* State & District Dropdowns from JSON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* State Dropdown */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">State / Union Territory *</Label>
                <Select value={selectedStateId} onValueChange={handleStateChange}>
                  <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-md">
                    {states.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)} className="text-xs font-semibold">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">District *</Label>
                <Select value={selectedDistrictId} onValueChange={handleDistrictChange}>
                  <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-md">
                    {districtList.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)} className="text-xs font-semibold">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Assembly-Wise Electoral & Administrative Structure */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-orange-100/70 bg-[#fff8f3] flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#fff5ee] border border-orange-200/80 text-[#f97316] flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
              <LuLayers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                2. {formType === 'MLA' ? 'MLA Assembly & Area Structure' : 'MP Lok Sabha & Constituent Assemblies'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {formType === 'MLA'
                  ? `Select the Assembly Constituency name for ${formDistrict} and activate Rural and/or Urban branches.`
                  : 'Configure the Lok Sabha name and constituent Assembly Constituencies.'}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {formType === 'MLA' ? (
              /* MLA CONFIGURATION */
              <div className="space-y-5">
                {/* Assembly Dropdown Filtered by District */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-extrabold text-slate-700">
                      Assembly Constituency Name ({formDistrict}) *
                    </Label>
                    <span className="text-[10px] bg-[#fff5ee] text-[#f97316] border border-orange-200/80 font-extrabold px-2.5 py-0.5 rounded-full">
                      {availableAssemblyOptions.length} Constituencies in {formDistrict}
                    </span>
                  </div>

                  <Select value={formAssemblyName} onValueChange={handleAssemblyDropdownChange}>
                    <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <SelectValue placeholder={`Select Assembly Constituency in ${formDistrict}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 rounded-md">
                      {availableAssemblyOptions.map((a) => (
                        <SelectItem key={a.id} value={a.name} className="text-xs font-semibold">
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Filtered by <strong className="text-slate-600">{formDistrict} District ({formState})</strong>. Sourced from Master Data and Indian Electoral Reference.
                  </p>
                </div>

                {/* Rural & Urban Area Activation Cards */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Administrative Area Branches
                  </Label>
                  <p className="text-xs text-slate-500 font-medium">
                    Select which branches exist in {formAssemblyName}. You can enable <strong>Rural</strong>, <strong>Urban</strong>, or <strong>Both</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Rural Toggle Card */}
                    <div
                      onClick={() => {
                        if (formRuralEnabled && !formUrbanEnabled) {
                          toast.error('An Assembly must have at least one active branch (Rural or Urban).');
                          return;
                        }
                        setFormRuralEnabled(!formRuralEnabled);
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
                        formRuralEnabled
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-2xs'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          formRuralEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {formRuralEnabled ? <LuCheck className="w-4 h-4 stroke-[3]" /> : <LuX className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-900">🌾 Rural Area Hierarchy</span>
                          {formRuralEnabled && (
                            <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                          Block → Gram Panchayat → Village → Polling Ward → Polling Booth
                        </p>
                      </div>
                    </div>

                    {/* Urban Toggle Card */}
                    <div
                      onClick={() => {
                        if (!formRuralEnabled && formUrbanEnabled) {
                          toast.error('An Assembly must have at least one active branch (Rural or Urban).');
                          return;
                        }
                        setFormUrbanEnabled(!formUrbanEnabled);
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
                        formUrbanEnabled
                          ? 'border-amber-500 bg-amber-50/40 shadow-2xs'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          formUrbanEnabled ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {formUrbanEnabled ? <LuCheck className="w-4 h-4 stroke-[3]" /> : <LuX className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-900">🏢 Urban Area Hierarchy</span>
                          {formUrbanEnabled && (
                            <span className="text-[10px] font-extrabold bg-amber-600 text-white px-2 py-0.5 rounded-md">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                          Municipality / NAC / Corporation → Municipal Ward → Polling Booth
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MP CONFIGURATION */
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-extrabold text-slate-700">Lok Sabha Constituency Name *</Label>
                  <Input
                    value={formLokSabhaName}
                    onChange={(e) => setFormLokSabhaName(e.target.value)}
                    placeholder="e.g. Jajpur (SC) Lok Sabha"
                    className="h-10 text-xs font-semibold border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    The top-level Parliamentary Constituency containing multiple Assembly segments.
                  </p>
                </div>

                {/* Assembly Constituencies List */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Constituent Assembly Constituencies ({formAssemblyList.length})
                      </Label>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Configure independent Rural and Urban administrative branches for each Assembly.
                      </p>
                    </div>
                  </div>

                  {/* Add New Assembly Box */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Input
                      placeholder="Add Assembly (e.g. Korei Assembly)"
                      value={newAcName}
                      onChange={(e) => setNewAcName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAssembly();
                        }
                      }}
                      className="max-w-xs h-10 text-xs font-semibold border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddAssembly}
                      className="h-10 space-x-1 font-bold text-xs bg-[#fff5ee] border border-orange-200/80 text-[#f97316] hover:bg-orange-100/50 rounded-xl"
                    >
                      <LuPlus className="w-4 h-4" />
                      <span>Add Assembly</span>
                    </Button>
                  </div>

                  {/* AC Cards List */}
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {formAssemblyList.map((ac, idx) => (
                      <div
                        key={ac.id}
                        className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-extrabold text-slate-400 w-5 text-center">{idx + 1}</span>
                          <span className="text-xs font-extrabold text-slate-900">{ac.name}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Rural Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleAcRural(ac.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                              ac.ruralEnabled
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                            }`}
                          >
                            {ac.ruralEnabled ? <LuCheck className="w-3 h-3 stroke-[3]" /> : <LuX className="w-3 h-3" />}
                            <span>Rural Branch</span>
                          </button>

                          {/* Urban Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleAcUrban(ac.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                              ac.urbanEnabled
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                            }`}
                          >
                            {ac.urbanEnabled ? <LuCheck className="w-3 h-3 stroke-[3]" /> : <LuX className="w-3 h-3" />}
                            <span>Urban Branch</span>
                          </button>

                          {/* Delete */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAssembly(ac.id)}
                            className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <LuTrash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Representative Profile & Office Contact */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-orange-100/70 bg-[#fff8f3] flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#fff5ee] border border-orange-200/80 text-[#f97316] flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
              <LuBuilding className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                3. Representative Profile & Office Contact Details
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Public profile, contact info, and branding displayed across the topbar and dashboards.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Dynamic Portal Name / Title *</Label>
              <Input
                placeholder="e.g. Korei MLA Constituency Portal"
                value={formPortalName}
                onChange={(e) => setFormPortalName(e.target.value)}
                className="h-10 text-xs font-semibold border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Representative Full Name *</Label>
                <Input
                  placeholder="e.g. Shri Akash Dasnayak"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-10 text-xs font-semibold border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Office Contact Number</Label>
                <div className="relative">
                  <LuPhone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="+91 94370 12345"
                    className="pl-9 h-10 text-xs font-semibold border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Main Office Physical Address</Label>
              <div className="relative">
                <LuMapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="e.g. Main Constituency Office, Near Collectorate, Jajpur, Odisha - 755001"
                  className="pl-9 h-10 text-xs font-semibold border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-xs text-slate-500 font-semibold flex items-center space-x-2">
              <LuCircleCheck className="w-4 h-4 text-emerald-500" />
              <span>Saves & updates Master Data, Directory, and Navigation in real-time.</span>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs space-x-2 px-6 h-10 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <LuSave className="w-4 h-4" />
              <span>{isSaving ? 'Saving Configuration...' : 'Save Organization Settings'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
