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
  LuCalendar,
  LuClock,
  LuMapPin,
  LuCircleCheck,
  LuUser,
  LuUsers,
  LuFilter,
  LuX,
  LuCheck,
  LuPhone,
  LuCalendarDays,
  LuTag,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  timeSlot: string;
  date: string;
  title: string;
  constituent: string;
  mobile: string;
  location: string;
  note: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'confirmed';
  type: 'Meeting' | 'Field Visit' | 'Event' | 'Consultation';
}

interface PendingRequest {
  id: string;
  initials: string;
  name: string;
  organization: string;
  mobile: string;
  timeAgo: string;
  details: string;
  preferredDate: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    timeSlot: '09:30 AM – 11:00 AM',
    date: 'Today',
    title: 'Public Grievance Hearing (Jana Samparka)',
    constituent: 'General Public (18 Registered)',
    mobile: '9437012345',
    location: 'MLA Camp Office, Korei',
    note: 'Priority focus on drinking water and road repair petitions.',
    status: 'completed',
    type: 'Meeting',
  },
  {
    id: 'app-2',
    timeSlot: '11:30 AM – 01:00 PM',
    date: 'Today',
    title: 'Meeting with RWSS Executive Engineers & BDO',
    constituent: 'Executive Engineer RWSS Jajpur & BDO Korei',
    mobile: '9861054321',
    location: 'Korei Block Development Office',
    note: 'Agenda: Drinking water pipeline review & solar pump installation across 14 Panchayats.',
    status: 'in_progress',
    type: 'Meeting',
  },
  {
    id: 'app-3',
    timeSlot: '03:00 PM – 05:00 PM',
    date: 'Today',
    title: 'Inspection: Korei Market Bypass & Drainage Spot Visit',
    constituent: 'Executive District Engineer & Market Association',
    mobile: '9438812390',
    location: 'Spot Visit at Korei Market Square',
    note: 'Joint inspection regarding monsoon waterlogging solutions.',
    status: 'upcoming',
    type: 'Field Visit',
  },
  {
    id: 'app-4',
    timeSlot: '06:00 PM – 07:30 PM',
    date: 'Today',
    title: 'Party Karyakarta & Youth Morcha Consultation',
    constituent: 'Constituency Youth Wing Delegates',
    mobile: '7008123456',
    location: 'Constituency Central HQ, Korei',
    note: 'Preparation for upcoming Youth Employment Mela and volunteer desks.',
    status: 'confirmed',
    type: 'Consultation',
  },
  {
    id: 'app-5',
    timeSlot: '10:00 AM – 11:30 AM',
    date: 'Tomorrow',
    title: 'Panchayat Representatives Coordination Meet',
    constituent: 'Sarpanches of Bandhalo, Asanpur & Pacchapur',
    mobile: '9937123987',
    location: 'MLA Camp Office, Korei',
    note: 'Discussion on pending rural concrete road allocations under Ama Odisha Nabin Odisha.',
    status: 'upcoming',
    type: 'Meeting',
  },
  {
    id: 'app-6',
    timeSlot: '02:00 PM – 04:00 PM',
    date: 'Tomorrow',
    title: 'Korei Community Health Centre Expansion Review',
    constituent: 'Chief District Medical Officer (CDMO) & Medical Staff',
    mobile: '9437198765',
    location: 'CHC Korei Hospital Premises',
    note: 'Review of doctor roster, 24/7 emergency service, and ambulance status.',
    status: 'confirmed',
    type: 'Field Visit',
  },
];

const INITIAL_REQUESTS: PendingRequest[] = [
  {
    id: 'req-1',
    initials: 'DK',
    name: 'Debendra Khatua & Delegation',
    organization: 'Nuagaon Farmers Association',
    mobile: '9861234890',
    timeAgo: '2 hrs ago',
    details: 'Sanctioning of lift irrigation sub-station near Baitarani River basin for Rabi crop season.',
    preferredDate: 'Tomorrow Morning',
  },
  {
    id: 'req-2',
    initials: 'SM',
    name: 'Smt. Manorama Mohanty',
    organization: 'Ward 7 Councillor Representative',
    mobile: '9437812901',
    timeAgo: '4 hrs ago',
    details: 'Staffing for primary healthcare center and dedicated ambulance for Korei Rural Hospital.',
    preferredDate: 'Next Monday',
  },
  {
    id: 'req-3',
    initials: 'RP',
    name: 'Rajendra Prasad Swain',
    organization: 'Korei Merchants Association',
    mobile: '7978123450',
    timeAgo: '5 hrs ago',
    details: 'Installation of high-mast street lights and market shed allocation at Korei Station Square.',
    preferredDate: 'This Friday',
  },
];

export default function InternalAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [requests, setRequests] = useState<PendingRequest[]>(INITIAL_REQUESTS);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'Meeting' | 'Field Visit' | 'Event' | 'Consultation'>('Meeting');
  const [formConstituent, setFormConstituent] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDate, setFormDate] = useState('Today');
  const [formTimeSlot, setFormTimeSlot] = useState('10:00 AM – 11:30 AM');
  const [formLocation, setFormLocation] = useState('MLA Camp Office, Korei');
  const [formNote, setFormNote] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchSearch =
        search === '' ||
        appt.title.toLowerCase().includes(search.toLowerCase()) ||
        appt.constituent.toLowerCase().includes(search.toLowerCase()) ||
        appt.location.toLowerCase().includes(search.toLowerCase()) ||
        appt.note.toLowerCase().includes(search.toLowerCase());

      const matchType = selectedType === 'ALL' || appt.type === selectedType;
      const matchStatus = selectedStatus === 'ALL' || appt.status === selectedStatus;
      const matchDate = selectedDate === 'ALL' || appt.date === selectedDate;

      return matchSearch && matchType && matchStatus && matchDate;
    });
  }, [appointments, search, selectedType, selectedStatus, selectedDate]);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formConstituent.trim()) {
      toast.error('Please enter appointment title and constituent name');
      return;
    }

    const newAppt: Appointment = {
      id: `app-${Date.now()}`,
      title: formTitle.trim(),
      type: formType,
      constituent: formConstituent.trim(),
      mobile: formMobile.trim() || '+91 94370 12345',
      date: formDate,
      timeSlot: formTimeSlot,
      location: formLocation.trim() || 'MLA Camp Office, Korei',
      note: formNote.trim() || 'Scheduled via Internal Operations Desk',
      status: 'upcoming',
    };

    setAppointments((prev) => [newAppt, ...prev]);
    toast.success('New appointment scheduled successfully');
    setIsModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormConstituent('');
    setFormMobile('');
    setFormNote('');
  };

  const handleMarkStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    toast.success(`Appointment marked as ${status.replace('_', ' ')}`);
  };

  const handleApproveRequest = (req: PendingRequest) => {
    const approved: Appointment = {
      id: `app-req-${Date.now()}`,
      title: `Meeting with ${req.name}`,
      type: 'Meeting',
      constituent: `${req.name} (${req.organization})`,
      mobile: req.mobile,
      date: 'Tomorrow',
      timeSlot: '04:00 PM – 05:00 PM',
      location: 'MLA Camp Office, Korei',
      note: req.details,
      status: 'confirmed',
    };
    setAppointments((prev) => [approved, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    toast.success(`Approved request from ${req.name}`);
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info('Appointment request declined');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold select-none">
        <Link href="/internal/dashboard" className="hover:underline text-[#2563eb]">
          Internal Home
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <span className="text-slate-500 font-normal">Appointments & Tour Schedule</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fff5ee] border border-orange-200/80 flex items-center justify-center shrink-0">
            <LuCalendarDays className="w-7 h-7 text-[#f97316]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Appointments Desk</h1>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wider">
                {appointments.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Schedule and manage constituent meetings, field reviews, and official consultations.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs space-x-1.5 shrink-0"
        >
          <LuPlus className="w-4 h-4" />
          <span>New Appointment</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <LuCalendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Scheduled</p>
            <p className="text-xl font-black text-slate-900 leading-tight">{appointments.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <LuClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Sessions</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {appointments.filter((a) => a.date === 'Today').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <LuUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</p>
            <p className="text-xl font-black text-slate-900 leading-tight">{requests.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <LuCircleCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {appointments.filter((a) => a.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Timeline + Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filter & Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LuSearch className="absolute left-3.5 top-3 h-4 w-4 text-orange-500" />
                <Input
                  placeholder="Search appointments, constituents, or locations..."
                  className="pl-10 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Field Visit">Field Visit</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-32 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Dates</SelectItem>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
                <LuCalendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No appointments found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter filters.</p>
              </div>
            ) : (
              filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-[#f97316] bg-[#fff5ee] border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                          {appt.timeSlot}
                        </span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {appt.date}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-bold uppercase tracking-wider',
                            appt.type === 'Meeting' && 'bg-blue-50 text-blue-700 border-blue-200',
                            appt.type === 'Field Visit' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            appt.type === 'Consultation' && 'bg-violet-50 text-violet-700 border-violet-200',
                            appt.type === 'Event' && 'bg-amber-50 text-amber-700 border-amber-200',
                          )}
                        >
                          {appt.type}
                        </Badge>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1">
                        {appt.title}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        'text-[11px] font-black uppercase px-2.5 py-1 rounded-full shrink-0',
                        appt.status === 'completed' && 'bg-slate-100 text-slate-600 border border-slate-200',
                        appt.status === 'in_progress' && 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse',
                        appt.status === 'upcoming' && 'bg-blue-50 text-blue-700 border border-blue-200',
                        appt.status === 'confirmed' && 'bg-purple-50 text-purple-700 border border-purple-200',
                      )}
                    >
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <LuUser className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>Constituent:</strong> {appt.constituent}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>Location:</strong> {appt.location}
                      </span>
                    </div>
                  </div>

                  {appt.note && (
                    <p className="text-xs text-slate-500 font-medium">
                      <strong className="text-slate-700">Agenda / Notes:</strong> {appt.note}
                    </p>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    {appt.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkStatus(appt.id, 'completed')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-3 rounded-lg"
                      >
                        <LuCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Mark Completed</span>
                      </Button>
                    )}
                    {appt.status !== 'in_progress' && appt.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkStatus(appt.id, 'in_progress')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3 rounded-lg"
                      >
                        <LuClock className="w-3.5 h-3.5 mr-1" />
                        <span>Start Session</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pending Requests (1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#f97316] flex items-center justify-center font-bold">
                  <LuUsers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Pending Requests</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Require MLA office slotting</p>
                </div>
              </div>
              <Badge className="bg-orange-500 text-white font-black text-xs">{requests.length}</Badge>
            </div>

            {requests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No pending requests right now.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                          {req.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 leading-tight">{req.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{req.organization}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{req.timeAgo}</span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">{req.details}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Pref: <strong>{req.preferredDate}</strong></span>
                      <a href={`tel:${req.mobile}`} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                        <LuPhone className="w-3 h-3" />
                        {req.mobile}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(req)}
                        className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-8 rounded-lg shadow-2xs"
                      >
                        Approve & Slot
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeclineRequest(req.id)}
                        className="text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 rounded-lg"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Schedule New Appointment
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Enter appointment details, constituent contacts, and allocated time slot.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAppointment} className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Subject / Agenda Title *</Label>
              <Input
                placeholder="e.g. Village Road Repair Review Delegation"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Appointment Type *</Label>
                <Select value={formType} onValueChange={(v: any) => setFormType(v)}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Field Visit">Field Visit</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Date *</Label>
                <Select value={formDate} onValueChange={setFormDate}>
                  <SelectTrigger className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="Upcoming Friday">Upcoming Friday</SelectItem>
                    <SelectItem value="Next Week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Constituent / Delegation *</Label>
                <Input
                  placeholder="e.g. Shri Pradeep Nayak"
                  value={formConstituent}
                  onChange={(e) => setFormConstituent(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Contact Number</Label>
                <Input
                  placeholder="e.g. 9437012345"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="h-10 text-xs font-mono font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Time Slot *</Label>
                <Input
                  placeholder="e.g. 10:00 AM – 11:30 AM"
                  value={formTimeSlot}
                  onChange={(e) => setFormTimeSlot(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Location</Label>
                <Input
                  placeholder="e.g. MLA Camp Office, Korei"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Notes & Brief Agenda</Label>
              <Input
                placeholder="Background notes or petitions to review..."
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
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
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs"
              >
                Schedule Appointment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
