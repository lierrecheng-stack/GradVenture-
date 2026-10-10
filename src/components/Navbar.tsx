import React from 'react';
import { Member, TripMetadata } from '../types/trip';
import { Compass, Users, Sparkles, CalendarDays, Wallet, Share2, GraduationCap, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'consensus' | 'wishlist' | 'timeline' | 'finance';
  setActiveTab: (tab: 'overview' | 'consensus' | 'wishlist' | 'timeline' | 'finance') => void;
  metadata: TripMetadata;
  members: Member[];
  currentMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenInvite: () => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  metadata,
  members,
  currentMemberId,
  onSelectMember,
  onOpenInvite,
  onOpenExport,
}) => {
  const currentMember = members.find((m) => m.id === currentMemberId) || members[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                GradVenture 毕游记
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">毕业旅行拼团规划</span>
            </div>
          </div>

          {/* Zone 2: 4-5 clean single-line navigation links / tabs */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>团概览</span>
            </button>

            <button
              onClick={() => setActiveTab('consensus')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'consensus'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-teal-600" />
              <span>成员与意向</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'wishlist'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>心愿单投票</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'timeline'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-teal-600" />
              <span>每日行程</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'finance'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Wallet className="w-4 h-4 text-teal-600" />
              <span>费用与AA结算</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action & Identity switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Member Context Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 cursor-pointer transition-colors">
                <img
                  src={currentMember?.avatar}
                  alt={currentMember?.name}
                  className="w-5 h-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden sm:inline">视角：{currentMember?.name}</span>
                <span className="text-slate-400 text-[10px]">({currentMember?.roleLabel.split('/')[0]})</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400">切换体验视角</div>
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors ${
                      m.id === currentMemberId ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div>{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.roleLabel}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenInvite}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              邀请同学
            </button>

            <button
              onClick={onOpenExport}
              title="导出路书与账单"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto no-scrollbar gap-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'overview' ? 'text-teal-700 bg-teal-50' : 'text-slate-600'
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('consensus')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'consensus' ? 'text-teal-700 bg-teal-50' : 'text-slate-600'
            }`}
          >
            成员与意向
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'wishlist' ? 'text-teal-700 bg-teal-50' : 'text-slate-600'
            }`}
          >
            心愿单
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'timeline' ? 'text-teal-700 bg-teal-50' : 'text-slate-600'
            }`}
          >
            每日行程
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'finance' ? 'text-teal-700 bg-teal-50' : 'text-slate-600'
            }`}
          >
            费用结算
          </button>
        </div>
      </div>
    </header>
  );
};
