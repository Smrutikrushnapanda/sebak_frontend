'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  LuShare2,
  LuCalendar,
  LuClock,
  LuThumbsUp,
  LuMessageCircle,
  LuRepeat,
  LuEye,
  LuSparkles,
  LuCheck,
  LuSend,
  LuImage,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface SocialPost {
  id: string;
  topic: string;
  channels: ('facebook' | 'twitter' | 'instagram' | 'youtube')[];
  content: string;
  contentOdia?: string;
  hashtags: string[];
  status: 'published' | 'scheduled' | 'draft';
  scheduledTime: string;
  likes: number;
  shares: number;
  comments: number;
  views: number;
  mediaType?: 'image' | 'video';
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    topic: 'Korei Block Drinking Water Project Review with RWSS Engineers',
    channels: ['facebook', 'twitter', 'instagram'],
    content:
      'Chaired an extensive coordination meeting today with RWSS Executive Engineers & BDO Korei. Reviewed rural drinking water pipeline connections and fast-tracked solar submersible pumps across 14 Gram Panchayats. Clean water for every household is our foremost priority.',
    contentOdia:
      'ଆଜି କୋରେଇ ବ୍ଲକରେ ପାନୀୟ ଜଳ ଯୋଗାଣ ସମୀକ୍ଷା ବୈଠକ ଅନୁଷ୍ଠିତ ହେଲା। ପ୍ରତ୍ୟେକ ପରିବାର ନିକଟରେ ବିଶୁଦ୍ଧ ପାନୀୟ ଜଳ ପହଞ୍ଚାଇବା ଆମର ମୁଖ୍ୟ ଲକ୍ଷ୍ୟ।',
    hashtags: ['#KoreiDevelopment', '#CleanWaterMission', '#ShriAkashDasnayak', '#Sebaka'],
    status: 'published',
    scheduledTime: 'Today at 02:30 PM',
    likes: 1240,
    shares: 312,
    comments: 89,
    views: 8940,
    mediaType: 'image',
  },
  {
    id: 'post-2',
    topic: 'Spot Visit & Embankment Reinforcement along Baitarani River',
    channels: ['facebook', 'twitter'],
    content:
      'Inspected the flood protection stone packing and river embankment works near Bandhalo Panchayat. Instructed irrigation engineers to accelerate pre-monsoon reinforcement to ensure complete safety of surrounding agrarian villages.',
    contentOdia:
      'ବୈତରଣୀ ନଦୀ ବନ୍ଧ ସୁରକ୍ଷା କାର୍ଯ୍ୟର କ୍ଷେତ୍ର ପରିଦର୍ଶନ। ଗ୍ରାମବାସୀଙ୍କ ସୁରକ୍ଷା ପାଇଁ ଆବଶ୍ୟକୀୟ ପଦକ୍ଷେପ ନିଆଯାଉଛି।',
    hashtags: ['#BaitaraniBasin', '#FieldInspection', '#KoreiProgress'],
    status: 'scheduled',
    scheduledTime: 'Tomorrow at 09:00 AM',
    likes: 0,
    shares: 0,
    comments: 0,
    views: 0,
    mediaType: 'image',
  },
  {
    id: 'post-3',
    topic: 'Upcoming Korei Mega Youth Employment Mela Announcement',
    channels: ['facebook', 'instagram', 'youtube'],
    content:
      'Delighted to announce the upcoming Korei Youth Skill & Employment Mela! Over 45 leading manufacturing, IT, and healthcare employers participating with spot job offers for our constituency youths. Registration desks open across all Block and Panchayat offices.',
    contentOdia:
      'କୋରେଇ ନିଯୁକ୍ତି ମେଳା - ଆମ ଯୁବପିଢ଼ିଙ୍କ ଉଜ୍ଜ୍ୱଳ ଭବିଷ୍ୟତ ପାଇଁ ଏକ ଅଭିନବ ପଦକ୍ଷେପ।',
    hashtags: ['#YouthEmpowerment', '#KoreiYouthMela', '#EmploymentDrive'],
    status: 'published',
    scheduledTime: 'Yesterday at 06:00 PM',
    likes: 2890,
    shares: 840,
    comments: 215,
    views: 24500,
    mediaType: 'video',
  },
  {
    id: 'post-4',
    topic: 'Korei Community Health Centre Solar Power Upgrade Complete',
    channels: ['facebook', 'twitter'],
    content:
      '24/7 dedicated solar power grid successfully commissioned at Korei CHC. Emergency labor rooms and medicine cold storage units are now fully protected from power outages.',
    hashtags: ['#HealthcareFirst', '#SolarOdisha', '#KoreiHealthcare'],
    status: 'draft',
    scheduledTime: 'Draft - Pending Final Photos',
    likes: 0,
    shares: 0,
    comments: 0,
    views: 0,
    mediaType: 'image',
  },
];

export default function InternalSocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTopic, setFormTopic] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formContentOdia, setFormContentOdia] = useState('');
  const [formHashtags, setFormHashtags] = useState('#KoreiDevelopment #MLAAkashDasnayak #Sebaka');
  const [formStatus, setFormStatus] = useState<'published' | 'scheduled' | 'draft'>('scheduled');
  const [formScheduledTime, setFormScheduledTime] = useState('Today at 05:00 PM');
  const [formChannels, setFormChannels] = useState<('facebook' | 'twitter' | 'instagram' | 'youtube')[]>([
    'facebook',
    'twitter',
  ]);

  const toggleChannel = (ch: 'facebook' | 'twitter' | 'instagram' | 'youtube') => {
    setFormChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        search === '' ||
        p.topic.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase()) ||
        p.hashtags.some((h) => h.toLowerCase().includes(search.toLowerCase()));

      const matchChannel =
        selectedChannel === 'ALL' ||
        p.channels.includes(selectedChannel as any);

      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchSearch && matchChannel && matchStatus;
    });
  }, [posts, search, selectedChannel, selectedStatus]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim() || !formContent.trim()) {
      toast.error('Please enter post topic and content');
      return;
    }

    const tags = formHashtags
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.startsWith('#'));

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      topic: formTopic.trim(),
      channels: formChannels.length > 0 ? formChannels : ['facebook', 'twitter'],
      content: formContent.trim(),
      contentOdia: formContentOdia.trim() || undefined,
      hashtags: tags.length > 0 ? tags : ['#KoreiDevelopment', '#Sebaka'],
      status: formStatus,
      scheduledTime: formScheduledTime,
      likes: formStatus === 'published' ? 14 : 0,
      shares: formStatus === 'published' ? 3 : 0,
      comments: formStatus === 'published' ? 2 : 0,
      views: formStatus === 'published' ? 120 : 0,
      mediaType: 'image',
    };

    setPosts((prev) => [newPost, ...prev]);
    toast.success('Social media post scheduled successfully');
    setIsModalOpen(false);

    setFormTopic('');
    setFormContent('');
    setFormContentOdia('');
  };

  const handlePublishNow = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'published', scheduledTime: 'Just Now', likes: 12, views: 98 } : p,
      ),
    );
    toast.success('Post published across selected channels!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold select-none">
        <Link href="/internal/dashboard" className="hover:underline text-[#2563eb]">
          Internal Home
        </Link>
        <span className="text-slate-400 font-normal">&gt;</span>
        <span className="text-slate-500 font-normal">Social Media & Public Communications</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shrink-0">
            <LuShare2 className="w-7 h-7 text-rose-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Social Media Desk</h1>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 tracking-wider">
                {posts.length} Campaigns
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Broadcast developmental achievements, schedule bilingual social updates, and review citizen engagement.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs space-x-1.5 shrink-0"
        >
          <LuPlus className="w-4 h-4" />
          <span>Create Social Post</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <LuSend className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published Posts</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {posts.filter((p) => p.status === 'published').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <LuClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {posts.filter((p) => p.status === 'scheduled').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <LuEye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Impressions</p>
            <p className="text-xl font-black text-slate-900 leading-tight">33.4K</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <LuThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engagement</p>
            <p className="text-xl font-black text-slate-900 leading-tight">4,130</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-3 h-4 w-4 text-rose-500" />
          <Input
            placeholder="Search campaigns, content keywords, or hashtags..."
            className="pl-10 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-36 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Channels</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">X (Twitter)</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32 h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Feed Grid */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
            <LuShare2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No campaigns found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Create Social Post" to draft or broadcast an update.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.channels.map((ch) => (
                      <span
                        key={ch}
                        className={cn(
                          'text-[10px] font-black uppercase px-2 py-0.5 rounded-full border',
                          ch === 'facebook' && 'bg-blue-50 text-blue-700 border-blue-200',
                          ch === 'twitter' && 'bg-slate-900 text-white border-slate-900',
                          ch === 'instagram' && 'bg-pink-50 text-pink-700 border-pink-200',
                          ch === 'youtube' && 'bg-rose-50 text-rose-700 border-rose-200',
                        )}
                      >
                        {ch === 'twitter' ? 'X' : ch}
                      </span>
                    ))}
                    <span className="text-xs font-bold text-slate-400">• {post.scheduledTime}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1">
                    {post.topic}
                  </h3>
                </div>

                <span
                  className={cn(
                    'text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0',
                    post.status === 'published' && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                    post.status === 'scheduled' && 'bg-blue-50 text-blue-700 border border-blue-200',
                    post.status === 'draft' && 'bg-slate-100 text-slate-600 border border-slate-200',
                  )}
                >
                  {post.status}
                </span>
              </div>

              {/* Content Box */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-2.5">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {post.content}
                </p>
                {post.contentOdia && (
                  <p className="text-xs text-[#ea580c] leading-relaxed font-semibold pt-1 border-t border-slate-200/60">
                    {post.contentOdia}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.hashtags.map((h, i) => (
                    <span key={i} className="text-[11px] font-mono text-blue-600 font-bold">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Row: Metrics & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <LuThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>{post.likes.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LuRepeat className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{post.shares.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LuMessageCircle className="w-3.5 h-3.5 text-orange-600" />
                    <span>{post.comments.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LuEye className="w-3.5 h-3.5 text-purple-600" />
                    <span>{post.views.toLocaleString()}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {post.status !== 'published' && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishNow(post.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs h-8 px-3 rounded-lg shadow-2xs space-x-1"
                    >
                      <LuSend className="w-3 h-3" />
                      <span>Publish Now</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Social Post Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Create Social Media Post
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Compose bilingual campaign content and broadcast to official constituency handles.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePost} className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Topic / Campaign Title *</Label>
              <Input
                placeholder="e.g. Korei Block Drinking Water Project Inspection"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Publish Channels *</Label>
              <div className="flex gap-2 flex-wrap">
                {(['facebook', 'twitter', 'instagram', 'youtube'] as const).map((ch) => {
                  const active = formChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all border',
                        active
                          ? 'bg-[#f97316] text-white border-orange-500 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
                      )}
                    >
                      {ch === 'twitter' ? 'X (Twitter)' : ch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">English Post Content *</Label>
              <Textarea
                placeholder="Write the public update here..."
                rows={3}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="text-xs font-medium rounded-xl bg-slate-50/60 border-slate-200 resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-extrabold text-slate-700">Odia Translation (Optional)</Label>
              <Textarea
                placeholder="ଓଡ଼ିଆରେ ଅପଡେଟ୍ ଲେଖନ୍ତୁ..."
                rows={2}
                value={formContentOdia}
                onChange={(e) => setFormContentOdia(e.target.value)}
                className="text-xs font-medium rounded-xl bg-slate-50/60 border-slate-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Hashtags</Label>
                <Input
                  placeholder="#KoreiDevelopment #Sebaka"
                  value={formHashtags}
                  onChange={(e) => setFormHashtags(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-700">Schedule Time</Label>
                <Input
                  placeholder="e.g. Today at 05:00 PM"
                  value={formScheduledTime}
                  onChange={(e) => setFormScheduledTime(e.target.value)}
                  className="h-10 text-xs font-semibold rounded-xl bg-slate-50/60 border-slate-200"
                />
              </div>
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
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-2xs"
              >
                Save & Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
