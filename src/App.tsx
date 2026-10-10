/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PainPointsBanner } from './components/PainPointsBanner';
import { TripOverview } from './components/TripOverview';
import { ConsensusHub } from './components/ConsensusHub';
import { WishlistDeck } from './components/WishlistDeck';
import { DailyTimeline } from './components/DailyTimeline';
import { FinanceCenter } from './components/FinanceCenter';
import { InviteModal } from './components/InviteModal';
import { TripExportModal } from './components/TripExportModal';
import {
  initialTripMetadata,
  initialMembers,
  initialDestinations,
  initialWishlist,
  initialItineraryDays,
  initialExpenses,
} from './data/mockData';
import {
  TripMetadata,
  Member,
  DestinationCandidate,
  WishlistItem,
  ItineraryDay,
  ExpenseRecord,
  TimelineActivity,
} from './types/trip';

const STORAGE_KEY = 'gradventure_trip_state_v1';

export default function App() {
  // Load state from localStorage or initial data
  const [metadata, setMetadata] = useState<TripMetadata>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meta`);
    return saved ? JSON.parse(saved) : initialTripMetadata;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [destinations, setDestinations] = useState<DestinationCandidate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dests`);
    return saved ? JSON.parse(saved) : initialDestinations;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_wishlist`);
    return saved ? JSON.parse(saved) : initialWishlist;
  });

  const [days, setDays] = useState<ItineraryDay[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_days`);
    return saved ? JSON.parse(saved) : initialItineraryDays;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'consensus' | 'wishlist' | 'timeline' | 'finance'>('overview');
  const [currentMemberId, setCurrentMemberId] = useState<string>('m1'); // 张子涵 (团长)
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_meta`, JSON.stringify(metadata));
  }, [metadata]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
  }, [members]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_dests`, JSON.stringify(destinations));
  }, [destinations]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wishlist`, JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_days`, JSON.stringify(days));
  }, [days]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('是否重置为默认「大理丽江 5 日毕业青春行」演示数据？')) {
      setMetadata(initialTripMetadata);
      setMembers(initialMembers);
      setDestinations(initialDestinations);
      setWishlist(initialWishlist);
      setDays(initialItineraryDays);
      setExpenses(initialExpenses);
      setCurrentMemberId('m1');
    }
  };

  // 1. Destination voting & lock
  const handleVoteDestination = (destId: string) => {
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === destId) {
          const hasVoted = d.votes.includes(currentMemberId);
          return {
            ...d,
            votes: hasVoted
              ? d.votes.filter((id) => id !== currentMemberId)
              : [...d.votes, currentMemberId],
          };
        }
        return d;
      })
    );
  };

  const handleSelectFinalDestination = (destName: string) => {
    setMetadata((prev) => ({
      ...prev,
      destination: destName,
    }));
  };

  // 2. Deposit status toggle
  const handleToggleDeposit = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            hasPaidDeposit: !m.hasPaidDeposit,
          };
        }
        return m;
      })
    );
  };

  // 3. Wishlist voting, adding & scheduling
  const handleVoteWishlist = (itemId: string) => {
    setWishlist((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const hasVoted = item.votes.includes(currentMemberId);
          return {
            ...item,
            votes: hasVoted
              ? item.votes.filter((id) => id !== currentMemberId)
              : [...item.votes, currentMemberId],
          };
        }
        return item;
      })
    );
  };

  const handleAddWishlistItem = (newItem: Omit<WishlistItem, 'id' | 'votes'>) => {
    const item: WishlistItem = {
      ...newItem,
      id: `w-${Date.now()}`,
      votes: [currentMemberId],
    };
    setWishlist((prev) => [item, ...prev]);
  };

  const handleScheduleWishlistItem = (itemId: string, dayNumber: number, timeStr: string) => {
    const wish = wishlist.find((w) => w.id === itemId);
    if (!wish) return;

    // Mark as scheduled in wishlist
    setWishlist((prev) =>
      prev.map((w) => (w.id === itemId ? { ...w, scheduledDay: dayNumber } : w))
    );

    // Add activity into the target day
    const newAct: TimelineActivity = {
      id: `act-wish-${Date.now()}`,
      time: timeStr,
      title: wish.title,
      type: wish.category === 'food' ? 'meal' : 'spot',
      location: wish.locationName,
      costPerPerson: wish.estimatedCost,
      duration: wish.suggestedDuration,
      note: wish.reason,
    };

    setDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber === dayNumber) {
          const updatedActs = [...day.activities, newAct].sort((a, b) =>
            a.time.localeCompare(b.time)
          );
          return {
            ...day,
            activities: updatedActs,
          };
        }
        return day;
      })
    );

    setActiveTab('timeline');
  };

  // 4. Timeline activity add & delete
  const handleAddActivity = (dayNumber: number, activity: Omit<TimelineActivity, 'id'>) => {
    const act: TimelineActivity = {
      ...activity,
      id: `act-${Date.now()}`,
    };

    setDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber === dayNumber) {
          const updatedActs = [...day.activities, act].sort((a, b) =>
            a.time.localeCompare(b.time)
          );
          return {
            ...day,
            activities: updatedActs,
          };
        }
        return day;
      })
    );
  };

  const handleDeleteActivity = (dayNumber: number, actId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            activities: day.activities.filter((a) => a.id !== actId),
          };
        }
        return day;
      })
    );
  };

  // 5. Expense add & delete
  const handleAddExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const record: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [record, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // 6. Member simulation join
  const handleSimulateJoin = (name: string, major: string) => {
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    ];

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      major,
      role: 'member',
      roleLabel: '新加入团员',
      budgetMin: 2000,
      budgetMax: 3000,
      availableDates: ['2026-06-21', '2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25'],
      hasPaidDeposit: true,
      depositAmount: 500,
      note: '通过邀请口令火速加入',
    };

    setMembers((prev) => [...prev, newMember]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* 顶部统一导航栏 (Top Bar Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metadata={metadata}
        members={members}
        currentMemberId={currentMemberId}
        onSelectMember={setCurrentMemberId}
        onOpenInvite={() => setIsInviteOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* 毕业旅行组织痛点与解决方案看板 (可折叠) */}
      <PainPointsBanner />

      {/* 主工作区视图 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <TripOverview
            metadata={metadata}
            members={members}
            days={days}
            expenses={expenses}
            onNavigateTab={setActiveTab}
            onOpenInvite={() => setIsInviteOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'consensus' && (
          <ConsensusHub
            destinations={destinations}
            members={members}
            currentMemberId={currentMemberId}
            selectedDestinationName={metadata.destination}
            onVoteDestination={handleVoteDestination}
            onSelectFinalDestination={handleSelectFinalDestination}
            onToggleDeposit={handleToggleDeposit}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistDeck
            wishlist={wishlist}
            members={members}
            currentMemberId={currentMemberId}
            daysCount={metadata.daysCount}
            onVoteWishlist={handleVoteWishlist}
            onAddWishlistItem={handleAddWishlistItem}
            onScheduleWishlistItem={handleScheduleWishlistItem}
          />
        )}

        {activeTab === 'timeline' && (
          <DailyTimeline
            days={days}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceCenter
            expenses={expenses}
            members={members}
            currentMemberId={currentMemberId}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </main>

      {/* 底部版权与设计标识 */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-800">GradVenture 毕游记</strong> · 毕业旅行拼团与AA结算规划工具
          </div>
          <div className="flex items-center gap-3">
            <span>青春不散场，风花雪月敬同窗</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleResetData}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              重置预设方案
            </button>
          </div>
        </div>
      </footer>

      {/* 弹窗组件 */}
      <InviteModal
        metadata={metadata}
        members={members}
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSimulateJoin={handleSimulateJoin}
      />

      <TripExportModal
        metadata={metadata}
        members={members}
        days={days}
        expenses={expenses}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
