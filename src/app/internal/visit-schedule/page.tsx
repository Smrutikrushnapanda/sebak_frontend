'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  LuPlus,
  LuSearch,
  LuMapPin,
  LuCalendar,
  LuClock,
  LuUsers,
  LuCheck,
  LuCircleCheck,
  LuTrendingUp,
  LuCircleAlert,
  LuMap,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface FieldVisit {
  id: string;
  title: string;
  panchayat: string;
  exactLocation: string;
  date: string;
  timeSlot: string;
  officers: string;
  purpose: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  priority: 'High' | 'Medium' | 'Routine';
}

const INITIAL_VISITS: FieldVisit[] = [
  {
    id: 'fv-1',
    title: 'Spot Inspection: Baitarani River Embankment & Flood Wall',
    panchayat: 'Bandhalo GP',
    exactLocation: 'Baitarani Riverside Basin, Ward 4',
    date: 'Today',
    timeSlot: '03:00 PM – 05:00 PM',
    officers: 'Executive Engineer (Water Resources) & BDO Korei',
    purpose: 'Review pre-monsoon reinforcement stone packing and bund safety.',
    status: 'upcoming',
    priority: 'High',
  },
  {
    id: 'fv-2',
    title: 'Korei Market Square Drainage & Bypass Road Review',
    panchayat: 'Korei Urban Ward 2',
    exactLocation: 'Old Market Road to Station Bypass',
    date: 'Today',
    timeSlot: '11:00 AM – 01:00 PM',
    officers: 'PWD Assistant Engineer & Korei Tahasildar',
    purpose: 'Joint survey with merchant representatives to clear drain encroachments.',
    status: 'in_progress',
    priority: 'High',
  },
  {
    id: 'fv-3',
    title: 'Rural Mega Pipe Water Supply (RWSS) Inspection',
    panchayat: 'Pacchapur GP',
    exactLocation: 'Overhead Water Tank & Treatment Plant Site',
    date: 'Tomorrow',
    timeSlot: '10:00 AM – 12:30 PM',
    officers: 'RWSS Sub-Divisional Officer & Village Coordinator',
    purpose: 'Inspect household tap water supply pressure and pipeline laying quality.',
    status: 'upcoming',
    priority: 'Medium',
  },
  {
    id: 'fv-4',
    title: 'Upgraded High School Science Lab & Smart Classroom Inauguration',
    panchayat: 'Asanpur GP',
    exactLocation: 'Asanpur Nodal High School Campus',
    date: 'Tomorrow',
    timeSlot: '02:30 PM – 04:30 PM',
    officers: 'Block Education Officer (BEO) & Headmaster',
    purpose: '5T High School transformation handover and student interaction.',
    status: 'upcoming',
    priority: 'Routine',
  },
  {
    id: 'fv-5',
    title: 'Community Health Centre Solar Power Unit Assessment',
    panchayat: 'Korei Block HQ',
    exactLocation: 'CHC Hospital Rooftop & Cold Chain Room',
    date: 'Yesterday',
    timeSlot: '04:00 PM – 05:30 PM',
    officers: 'CDMO Representative & OREDA District Engineer',
    purpose: 'Verified 24/7 solar backup power for vaccine storage and labor ward.',
    status: 'completed',
    priority: 'Medium',
  },
];

export default function InternalVisitSchedulePage() {
  const [visits, setVisits] = useState<FieldVisit[]>(INITIAL_VISITS);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPanchayat, setSelectedPanchayat] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formPanchayat, setFormPanchayat] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState('Tomorrow');
  const [formTimeSlot, setFormTimeSlot] = useState('11:00 AM – 01:00 PM');
  const [formOfficers, setFormOfficers] = useState('');
  const [formPurpose, setFormPurpose] = useState('');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Routine'>('High');

  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchSearch =
        search === '' ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.panchayat.toLowerCase().includes(search.toLowerCase()) ||
        v.exactLocation.toLowerCase().includes(search.toLowerCase()) ||
        v.officers.toLowerCase().includes(search.toLowerCase()) ||
        v.purpose.toLowerCase().includes(search.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || v.status === selectedStatus;
      const matchPanchayat = selectedPanchayat === 'ALL' || v.panchayat.includes(selectedPanchayat);

      return matchSearch && matchStatus && matchPanchayat;
    });
  }, [visits, search, selectedStatus, selectedPanchayat]);

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPanchayat.trim() || !formLocation.trim()) {
      toast.error('Please enter visit title, panchayat, and exact location');
      return;
    }

    const newVisit: FieldVisit = {
      id: `fv-${Date.now()}`,
      title: formTitle.trim(),
      panchayat: formPanchayat.trim(),
      exactLocation: formLocation.trim(),
      date: formDate,
      timeSlot: formTimeSlot,
      officers: formOfficers.trim() || 'BDO Korei & Line Department Staff',
      purpose: formPurpose.trim() || 'Constituency spot review inspection',
      status: 'upcoming',
      priority: formPriority,
    };

    setVisits((prev) => [newVisit, ...prev]);
    toast.success('Field visit scheduled successfully');
    setIsModalOpen(false);

    setFormTitle('');
    setFormPanchayat('');
    setFormLocation('');
    setFormOfficers('');
    setFormPurpose('');
  };

  const handleUpdateStatus = (id: string, status: FieldVisit['status']) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v)),
    );
    toast.success(`Visit marked as ${status.replace('_', ' ')}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold select-none">
        <Link href="/internal/dashboard" className="hover:underline text-[#2563eb]">
          Internal Home
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <span className="text-slate-500 font-normal">Field Visit Schedule</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <LuMapPin className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Field Visit Schedule</h1>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 tracking-wider">
                {visits.length} Visits
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Organise constituency tours, spot inspections, and development project verifications.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs space-x-1.5 shrink-0"
        >
          <LuPlus className="w-4 h-4" />
          <span>Schedule Field Visit</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <LuMap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tours</p>
            <p className="text-xl font-black text-slate-900 leading-tight">{visits.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <LuClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Visits</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {visits.filter((v) => v.date === 'Today').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <LuCircleAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High Priority</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {visits.filter((v) => v.priority === 'High').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <LuCircleCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {visits.filter((v) => v.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
          <Input
            placeholder="Search visits by location, panchayat, or attending officer..."
            className="pl-10 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedPanchayat} onValueChange={setSelectedPanchayat}>
            <SelectTrigger className="w-36 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="Panchayat" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Areas</SelectItem>
              <SelectItem value="Bandhalo">Bandhalo</SelectItem>
              <SelectItem value="Pacchapur">Pacchapur</SelectItem>
              <SelectItem value="Asanpur">Asanpur</SelectItem>
              <SelectItem value="Korei">Korei Block/Urban</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Visits Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVisits.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
            <LuMapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No field visits scheduled</p>
            <p className="text-xs text-slate-400 mt-1">Click "Schedule Field Visit" to add an inspection tour.</p>
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      {visit.panchayat}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {visit.date}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold uppercase',
                        visit.priority === 'High' && 'bg-rose-50 text-rose-700 border-rose-200',
                        visit.priority === 'Medium' && 'bg-amber-50 text-amber-700 border-amber-200',
                        visit.priority === 'Routine' && 'bg-slate-100 text-slate-600 border-slate-200',
                      )}
                    >
                      {visit.priority} Priority
                    </Badge>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0',
                      visit.status === 'completed' && 'bg-slate-100 text-slate-600 border border-slate-200',
                      visit.status === 'in_progress' && 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse',
                      visit.status === 'upcoming' && 'bg-blue-50 text-blue-700 border border-blue-200',
                    )}
                  >
                    {visit.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  {visit.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <LuMapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Location:</strong> {visit.exactLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Time:</strong> {visit.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuUsers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate"><strong>Attending:</strong> {visit.officers}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  <strong className="text-slate-700">Purpose:</strong> {visit.purpose}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {visit.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUpdateStatus(visit.id, 'completed')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-3 rounded-lg"
                  >
                    <LuCheck className="w-3.5 h-3.5 mr-1" />
                    <span>Mark Done</span>
                  </Button>
                )}
                {visit.status === 'upcoming' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUpdateStatus(visit.id, 'in_progress')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3 rounded-lg"
                  >
                    <LuClock className="w-3.5 h-3.5 mr-1" />
                    <span>Start Inspection</span>
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Field Visit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Schedule Field Visit Inspection
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Enter location coordinates, accompanying line department officers, and inspection agenda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateVisit} className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Visit Inspection Title *</Label>
              <Input
                placeholder="e.g. Lift Irrigation Point Survey & Pipeline Review"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Panchayat / Ward *</Label>
                <Input
                  placeholder="e.g. Bandhalo GP"
                  value={formPanchayat}
                  onChange={(e) => setFormPanchayat(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Priority Level</Label>
                <Select value={formPriority} onValueChange={(v: any) => setFormPriority(v)}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Routine">Routine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Exact Spot / Landmark Location *</Label>
              <Input
                placeholder="e.g. Baitarani Riverside Embankment Point, Ward 4"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Date *</Label>
                <Select value={formDate} onValueChange={setFormDate}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="This Saturday">This Saturday</SelectItem>
                    <SelectItem value="Next Week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Time Slot *</Label>
                <Input
                  placeholder="e.g. 03:00 PM – 05:00 PM"
                  value={formTimeSlot}
                  onChange={(e) => setFormTimeSlot(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Accompanying Officials / Team</Label>
              <Input
                placeholder="e.g. Executive Engineer RWSS, BDO Korei, Sarpanch"
                value={formOfficers}
                onChange={(e) => setFormOfficers(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Inspection Agenda & Purpose</Label>
              <Input
                placeholder="Brief purpose of the spot inspection..."
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="h-10 text-xs font-bold rounded-xl border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs"
              >
                Schedule Field Visit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
