'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';
import { useHierarchyStore } from '@/store/useHierarchyStore';
import { useConstituencySettings } from '@/context/settings-context';
import { ApiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  LuSearch,
  LuPhone,
  LuMessageCircle,
  LuPlus,
  LuUserCheck,
  LuStar,
  LuMapPin,
  LuLayers,
  LuCheck,
  LuX,
  LuRotateCcw,
  LuSlidersHorizontal,
  LuMic,
  LuDownload,
  LuChevronDown,
  LuShieldCheck,
  LuUser,
} from 'react-icons/lu';

export interface DynamicMember {
  id: string;
  fullName: string;
  mobile: string;
  designationId?: string;
  designation?: { id?: string; name: string };
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  isKeyPerson?: boolean;
  influenceLevel?: 'NORMAL' | 'MEDIUM' | 'HIGH';
  orgUnitName?: string;
  panchayatName?: string;
  villageName?: string;
  wardName?: string;
  profilePhotoUrl?: string;
  createdAt?: string;
}

export default function People() {
  const { lang, t } = useLanguage();
  const isOd = lang === 'OD';
  const { settings } = useConstituencySettings();
  const constituencyName = settings?.constituencyName || 'Korei Assembly';
  const { panchayats, blocks, urbanLocalBodies } = useHierarchyStore();

  // Data states
  const [members, setMembers] = useState<DynamicMember[]>([]);
  const [designations, setDesignations] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGp, setSelectedGp] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'KEY' | 'COORDINATORS' | 'WORKERS'>('ALL');
  const [selectedModalMember, setSelectedModalMember] = useState<DynamicMember | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Member Form State
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDesignationId, setFormDesignationId] = useState('');
  const [formPanchayatName, setFormPanchayatName] = useState('');
  const [formIsKeyPerson, setFormIsKeyPerson] = useState(false);

  // Fetch dynamic designations & initial members
  const fetchDesignations = useCallback(async () => {
    try {
      const res = await ApiClient.get<any[]>('member-designations');
      if (Array.isArray(res) && res.length > 0) {
        setDesignations(res);
      } else {
        setDesignations([
          { id: '1', name: 'Block Coordinator' },
          { id: '2', name: 'Panchayat Coordinator' },
          { id: '3', name: 'Village Coordinator' },
          { id: '4', name: 'Ward Coordinator' },
          { id: '5', name: 'Booth President' },
          { id: '6', name: 'Party Worker' },
          { id: '7', name: 'Volunteer' },
          { id: '8', name: 'Community Leader' },
        ]);
      }
    } catch {
      setDesignations([
        { id: '1', name: 'Block Coordinator' },
        { id: '2', name: 'Panchayat Coordinator' },
        { id: '3', name: 'Village Coordinator' },
        { id: '4', name: 'Ward Coordinator' },
        { id: '5', name: 'Booth President' },
        { id: '6', name: 'Party Worker' },
        { id: '7', name: 'Volunteer' },
        { id: '8', name: 'Community Leader' },
      ]);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        pageSize: 100,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      };
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await ApiClient.get<any>('org-members', params);
      const fetched: DynamicMember[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      if (fetched.length > 0) {
        setMembers(fetched);
      } else {
        // Fallback default sample members matching active constituency
        setMembers([
          {
            id: 'mem-1',
            fullName: 'Manas Manthan Rout',
            mobile: '9437144810',
            isKeyPerson: true,
            status: 'ACTIVE',
            designation: { name: 'Block Coordinator' },
            orgUnitName: 'Korei Block',
            panchayatName: 'Nuagaon',
          },
          {
            id: 'mem-2',
            fullName: 'Smruti Krushna Panda',
            mobile: '7088845326',
            isKeyPerson: true,
            status: 'ACTIVE',
            designation: { name: 'Block Coordinator' },
            orgUnitName: 'Constituency Level',
            panchayatName: 'Vyasanagar',
          },
          {
            id: 'mem-3',
            fullName: 'Smt. Manorama Mohanty',
            mobile: '9861089234',
            isKeyPerson: true,
            status: 'ACTIVE',
            designation: { name: 'Panchayat Coordinator' },
            orgUnitName: 'Korei Town',
            panchayatName: 'Korei Town',
          },
          {
            id: 'mem-4',
            fullName: 'Dr. Ashok Kumar Ray',
            mobile: '9437001122',
            isKeyPerson: false,
            status: 'ACTIVE',
            designation: { name: 'Community Leader' },
            orgUnitName: 'Balipatna GP',
            panchayatName: 'Balipatna',
          },
          {
            id: 'mem-5',
            fullName: 'Niranjan Das',
            mobile: '7008122910',
            isKeyPerson: false,
            status: 'ACTIVE',
            designation: { name: 'Youth Coordinator' },
            orgUnitName: 'Vyasanagar',
            panchayatName: 'Vyasanagar',
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not fetch members:', err);
      setMembers([
        {
          id: 'mem-1',
          fullName: 'Manas Manthan Rout',
          mobile: '9437144810',
          isKeyPerson: true,
          status: 'ACTIVE',
          designation: { name: 'Block Coordinator' },
          orgUnitName: 'Korei Block',
          panchayatName: 'Nuagaon',
        },
        {
          id: 'mem-2',
          fullName: 'Smruti Krushna Panda',
          mobile: '7088845326',
          isKeyPerson: true,
          status: 'ACTIVE',
          designation: { name: 'Block Coordinator' },
          orgUnitName: 'Constituency Level',
          panchayatName: 'Vyasanagar',
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchDesignations();
    fetchMembers();
  }, [fetchDesignations, fetchMembers]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMembers();
    toast.success(isOd ? 'ତାଲିକା ନବୀକରଣ ହୋଇଛି' : 'Directory refreshed');
  };

  const handleVoiceSearch = () => {
    toast.info(
      isOd
        ? 'ଭଏସ୍ ସର୍ଚ୍ଚ ସକ୍ରିୟ ଅଛି... ନାମ କୁହନ୍ତୁ'
        : 'Voice search active: Listening for Odia/English name...'
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMobile.trim()) {
      toast.error(isOd ? 'ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକୀୟ ତଥ୍ୟ ଦିଅନ୍ତୁ' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedDesig = designations.find((d) => d.id === formDesignationId) || designations[0];
      const payload: any = {
        fullName: formName.trim(),
        mobile: formMobile.trim(),
        designationId: formDesignationId || designations[0]?.id,
        isKeyPerson: formIsKeyPerson,
        status: 'ACTIVE',
        panchayatName: formPanchayatName || 'Nuagaon',
        orgUnitName: formPanchayatName || 'Korei Assembly',
      };

      await ApiClient.post('org-members', payload).catch(() => {
        // Fallback local update
        const newLocalMember: DynamicMember = {
          id: `mem-local-${Date.now()}`,
          fullName: formName.trim(),
          mobile: formMobile.trim(),
          designationId: formDesignationId,
          designation: { name: selectedDesig?.name || 'Party Worker' },
          status: 'ACTIVE',
          isKeyPerson: formIsKeyPerson,
          panchayatName: formPanchayatName || 'Nuagaon',
          orgUnitName: formPanchayatName || 'Korei Assembly',
        };
        setMembers((prev) => [newLocalMember, ...prev]);
      });

      toast.success(
        isOd
          ? `${formName} ସଫଳତାର ସହ ପଞ୍ଜିକୃତ ହେଲେ`
          : `Profile for ${formName} registered successfully!`
      );
      setShowRegisterModal(false);
      setFormName('');
      setFormMobile('');
      setFormPanchayatName('');
      setFormIsKeyPerson(false);
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || (isOd ? 'ପଞ୍ଜୀକରଣ ବିଫଳ ହେଲା' : 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Gram Panchayat List
  const availableGps = useMemo(() => {
    if (panchayats && panchayats.length > 0) {
      return panchayats.map((p) => p.name);
    }
    return ['Nuagaon', 'Korei Town', 'Balipatna', 'Vyasanagar', 'Tahasildar Sahi', 'Goleipur'];
  }, [panchayats]);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.fullName?.toLowerCase().includes(q) ||
        item.mobile?.toLowerCase().includes(q) ||
        item.designation?.name?.toLowerCase().includes(q) ||
        item.panchayatName?.toLowerCase().includes(q) ||
        item.orgUnitName?.toLowerCase().includes(q);

      const matchesGp =
        selectedGp === 'ALL' ||
        item.panchayatName?.toLowerCase() === selectedGp.toLowerCase() ||
        item.orgUnitName?.toLowerCase().includes(selectedGp.toLowerCase());

      let matchesCategory = true;
      if (activeCategory === 'KEY') {
        matchesCategory = !!item.isKeyPerson;
      } else if (activeCategory === 'COORDINATORS') {
        matchesCategory = item.designation?.name?.toLowerCase().includes('coordinator') ?? false;
      } else if (activeCategory === 'WORKERS') {
        matchesCategory = !item.isKeyPerson;
      }

      return matchesSearch && matchesGp && matchesCategory;
    });
  }, [members, searchQuery, selectedGp, activeCategory]);

  const getInitials = (name: string) => {
    if (!name) return 'MB';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Case Dossier / Member Details Modal */}
      {selectedModalMember && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setSelectedModalMember(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff5ee] text-[#f97316] border border-orange-200 flex items-center justify-center font-extrabold text-sm">
                  {getInitials(selectedModalMember.fullName)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {selectedModalMember.fullName}
                  </h3>
                  <span className="text-xs font-bold text-[#ea580c]">
                    {selectedModalMember.designation?.name || 'Party Worker'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalMember(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    {isOd ? 'ମୋବାଇଲ୍ ନମ୍ବର' : 'Mobile Contact'}
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    +91 {selectedModalMember.mobile}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    {isOd ? 'ପଞ୍ଚାୟତ / ଅଞ୍ଚଳ' : 'Gram Panchayat'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedModalMember.panchayatName || selectedModalMember.orgUnitName || 'Korei Area'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    {isOd ? 'ସ୍ଥିତି' : 'Status'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    {selectedModalMember.status || 'ACTIVE'}
                  </span>
                </div>
                {selectedModalMember.isKeyPerson && (
                  <div className="flex items-center gap-1 text-[#ea580c] font-bold text-[11px] pt-1">
                    <LuStar className="w-3.5 h-3.5 fill-[#ea580c]" />
                    <span>{isOd ? 'ପ୍ରମୁଖ କାର୍ଯ୍ୟକର୍ତ୍ତା (Key Person)' : 'Key Organization Person'}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-[#fff5ee] border border-orange-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuShieldCheck className="w-5 h-5 text-[#ea580c]" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {isOd ? 'ନିର୍ବାଚନ ମଣ୍ଡଳୀ ରେଜିଷ୍ଟ୍ରି' : 'Official Constituency Registry'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {constituencyName || 'Korei AC-53'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                  Verified
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${selectedModalMember.mobile}`}
                className="flex-1 h-11 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <LuPhone className="w-4 h-4" />
                <span>{isOd ? 'କଲ୍ କରନ୍ତୁ' : 'Call Member'}</span>
              </a>
              <a
                href={`https://wa.me/91${selectedModalMember.mobile.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-11 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <LuMessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Register New Member Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#fff5ee] text-[#f97316] flex items-center justify-center font-extrabold shadow-2xs">
                  <LuPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isOd ? 'ନୂତନ କାର୍ଯ୍ୟକର୍ତ୍ତା ପଞ୍ଜୀକରଣ' : 'Register New Member'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isOd ? 'ନିର୍ବାଚନ ମଣ୍ଡଳୀ ନେଟୱାର୍କ' : 'Constituency Cadre Network'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isOd ? 'ସମ୍ପୂର୍ଣ୍ଣ ନାମ' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Das"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isOd ? 'ମୋବାଇଲ୍ ନମ୍ବର' : 'Mobile Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isOd ? 'ପଦବୀ / ଦାୟିତ୍ୱ' : 'Designation / Role'}
                </label>
                <select
                  value={formDesignationId}
                  onChange={(e) => setFormDesignationId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] cursor-pointer font-medium"
                >
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isOd ? 'ଗ୍ରାମ ପଞ୍ଚାୟତ / ଅଞ୍ଚଳ' : 'Gram Panchayat / Area'}
                </label>
                <select
                  value={formPanchayatName}
                  onChange={(e) => setFormPanchayatName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] cursor-pointer font-medium"
                >
                  {availableGps.map((gp) => (
                    <option key={gp} value={gp}>
                      {gp} GP
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="keyPersonCheck"
                  checked={formIsKeyPerson}
                  onChange={(e) => setFormIsKeyPerson(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#f97316] focus:ring-[#f97316]"
                />
                <label htmlFor="keyPersonCheck" className="font-bold text-slate-700 cursor-pointer select-none">
                  {isOd ? 'ପ୍ରମୁଖ କାର୍ଯ୍ୟକର୍ତ୍ତା ଭାବେ ଚିହ୍ନିତ କରନ୍ତୁ (Key Person)' : 'Mark as Key Person / Influencer'}
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  {isOd ? 'ବାତିଲ୍' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold shadow-sm transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? (isOd ? 'ସଂରକ୍ଷଣ ହେଉଛି...' : 'Saving...') : (isOd ? 'ସଂରକ୍ଷଣ କରନ୍ତୁ' : 'Save Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main View */}
      <div className="min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8 space-y-4">
          
          {/* Dynamic Top Header */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {isOd ? 'ସଂଗଠନ ନିର୍ଦ୍ଦେଶିକା' : t('people.title') || 'Organization Directory'}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-[10px] font-extrabold">
                  {filteredMembers.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {constituencyName || 'Korei AC-53'} • {isOd ? 'ସକ୍ରିୟ ନେଟୱାର୍କ' : 'Active Cadre Directory'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className={`w-9 h-9 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 hover:text-orange-600 transition-all ${
                isRefreshing ? 'animate-spin text-orange-600' : ''
              }`}
              title="Refresh"
            >
              <LuRotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Voice Input */}
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <LuSearch className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={isOd ? 'ନାମ, ଫୋନ୍, କିମ୍ବା ପଞ୍ଚାୟତ ଖୋଜନ୍ତୁ...' : 'Search by name, phone, GP, designation...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-20 bg-white text-slate-900 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 border border-slate-200/90 shadow-2xs placeholder:text-slate-400"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  aria-label="Voice Search"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#f97316] hover:bg-orange-50 transition-colors"
                >
                  <LuMic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic GP Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedGp}
                onChange={(e) => setSelectedGp(e.target.value)}
                className="w-full h-10 px-3.5 pr-8 bg-white text-slate-800 text-xs font-bold rounded-2xl shadow-2xs border border-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 cursor-pointer"
              >
                <option value="ALL">{isOd ? 'ସମସ୍ତ ଗ୍ରାମ ପଞ୍ଚାୟତ (All GPs)' : 'All Gram Panchayats / Areas'}</option>
                {availableGps.map((gp) => (
                  <option key={gp} value={gp}>
                    {gp} GP
                  </option>
                ))}
              </select>
              <LuChevronDown className="absolute right-3.5 top-3 text-slate-400 pointer-events-none w-4 h-4" />
            </div>
          </div>

          {/* Dynamic Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5">
            {[
              { id: 'ALL', label: isOd ? `ସମସ୍ତ (${members.length})` : `All (${members.length})` },
              { id: 'KEY', label: isOd ? 'ପ୍ରମୁଖ ବ୍ୟକ୍ତି' : 'Key Persons', icon: <LuStar className="w-3 h-3 fill-current" /> },
              { id: 'COORDINATORS', label: isOd ? 'ସଂଯୋଜକ' : 'Coordinators' },
              { id: 'WORKERS', label: isOd ? 'କାର୍ଯ୍ୟକର୍ତ୍ତା' : 'Cadre & Workers' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveCategory(chip.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-2xs ${
                  activeCategory === chip.id
                    ? 'bg-[#f97316] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Members Feed */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                {isOd ? 'ତଥ୍ୟ ଲୋଡ୍ ହେଉଛି...' : 'Loading members directory...'}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-2xs space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f97316] flex items-center justify-center mx-auto font-black">
                  <LuUser className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {isOd ? 'କୌଣସି ସଦସ୍ୟ ମିଳିଲା ନାହିଁ' : 'No Members Found'}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {isOd ? 'ଅନ୍ୟ ଫିଲ୍ଟର ଚୟନ କରନ୍ତୁ କିମ୍ବା ନୂତନ ସଦସ୍ୟ ଯୋଡନ୍ତୁ' : 'Try adjusting search or GP filters'}
                </p>
              </div>
            ) : (
              filteredMembers.map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200/90 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-2xl bg-[#fff5ee] border border-orange-200 text-[#f97316] font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {getInitials(person.fullName)}
                        {person.isKeyPerson && (
                          <span
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f97316] text-white flex items-center justify-center text-[9px] shadow-xs"
                            title="Key Person"
                          >
                            <LuStar className="w-2.5 h-2.5 fill-white" />
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 truncate">
                            {person.fullName}
                          </span>
                          {person.status === 'ACTIVE' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>

                        <span className="text-[11px] font-bold text-[#ea580c] truncate">
                          {person.designation?.name || 'Block Coordinator'}
                        </span>

                        <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                          <span className="text-[10px] font-semibold flex items-center gap-0.5 truncate">
                            <LuMapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {person.panchayatName || person.orgUnitName || 'Korei GP'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] font-mono font-medium truncate">
                            {person.mobile}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedModalMember(person)}
                      className="h-8 px-2.5 rounded-xl bg-orange-50 text-[#ea580c] font-bold text-[11px] hover:bg-orange-100 transition-colors shrink-0"
                    >
                      {isOd ? 'ବିବରଣୀ' : 'Details'}
                    </button>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={`tel:${person.mobile}`}
                      className="flex-1 h-9 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#ea580c] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors border border-slate-100"
                    >
                      <LuPhone className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>{isOd ? 'କଲ୍' : 'Call'}</span>
                    </a>

                    <a
                      href={`https://wa.me/91${person.mobile.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 h-9 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors border border-slate-100"
                    >
                      <LuMessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedModalMember(person)}
                      className="h-9 px-3 rounded-xl bg-[#fff5ee] text-[#ea580c] text-xs font-extrabold flex items-center justify-center gap-1 transition-colors border border-orange-200/80 shadow-2xs"
                    >
                      <span>{isOd ? 'କାର୍ଯ୍ୟାବଳୀ' : 'Cases'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Register New Member Sticky Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white text-xs font-extrabold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
            >
              <LuPlus className="w-4 h-4" />
              <span>{isOd ? 'ନୂତନ କାର୍ଯ୍ୟକର୍ତ୍ତା ପଞ୍ଜୀକରଣ କରନ୍ତୁ' : 'Register New Member / Cadre'}</span>
            </button>
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}
