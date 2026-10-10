import React, { useState } from 'react';
import { WishlistItem, Member, WishlistCategory } from '../types/trip';
import { Heart, Plus, Sparkles, Clock, MapPin, Calendar, Check, X } from 'lucide-react';

interface WishlistDeckProps {
  wishlist: WishlistItem[];
  members: Member[];
  currentMemberId: string;
  daysCount: number;
  onVoteWishlist: (itemId: string) => void;
  onAddWishlistItem: (item: Omit<WishlistItem, 'id' | 'votes'>) => void;
  onScheduleWishlistItem: (itemId: string, dayNumber: number, timeStr: string) => void;
}

export const WishlistDeck: React.FC<WishlistDeckProps> = ({
  wishlist,
  members,
  currentMemberId,
  daysCount,
  onVoteWishlist,
  onAddWishlistItem,
  onScheduleWishlistItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'cost'>('votes');
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [schedulingItemId, setSchedulingItemId] = useState<string | null>(null);
  const [scheduleDay, setScheduleDay] = useState<number>(1);
  const [scheduleTime, setScheduleTime] = useState<string>('14:00');

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WishlistCategory>('sightseeing');
  const [newLocation, setNewLocation] = useState('');
  const [newCost, setNewCost] = useState(50);
  const [newDuration, setNewDuration] = useState('2小时');
  const [newReason, setNewReason] = useState('');

  const currentMember = members.find((m) => m.id === currentMemberId);

  const categories = [
    { key: 'all', label: '全部心愿' },
    { key: 'sightseeing', label: '必打卡景点' },
    { key: 'food', label: '特色美食' },
    { key: 'activity', label: '体验活动' },
    { key: 'leisure', label: '夜生活/休闲' },
  ];

  const filteredItems = wishlist
    .filter((item) => {
      if (selectedCategory === 'all') return true;
      return item.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes.length - a.votes.length;
      return a.estimatedCost - b.estimatedCost;
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const categoryLabels: Record<WishlistCategory, string> = {
      sightseeing: '必打卡景点',
      food: '特色美食',
      activity: '体验活动',
      stay: '特色住宿',
      transport: '交通体验',
    };

    onAddWishlistItem({
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || '心愿项目',
      locationName: newLocation.trim() || '云南大理/丽江',
      estimatedCost: Number(newCost) || 0,
      suggestedDuration: newDuration || '2小时',
      addedByMemberId: currentMemberId,
      reason: newReason.trim() || '毕业生强烈推荐打卡！',
    });

    setNewTitle('');
    setNewLocation('');
    setNewReason('');
    setIsAddingOpen(false);
  };

  const handleConfirmSchedule = () => {
    if (schedulingItemId) {
      onScheduleWishlistItem(schedulingItemId, scheduleDay, scheduleTime);
      setSchedulingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 模块头部 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>全员景点与美食心愿单（Wishlist）</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            每个人都可以提议想去的地方；全员投票表决，高票项可直接一键排入每日行程时间轴！
          </p>
        </div>

        <button
          onClick={() => setIsAddingOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>提议我想去的打卡点</span>
        </button>
      </div>

      {/* 过滤与排序条 (遵循 Zero-Pill，使用交互 Tab/按键控件) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>排序方式:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSortBy('votes')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                sortBy === 'votes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              票数最高优先
            </button>
            <button
              onClick={() => setSortBy('cost')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                sortBy === 'cost' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              人均费用从低到高
            </button>
          </div>
        </div>
      </div>

      {/* 心愿单卡片列表网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const hasVoted = item.votes.includes(currentMemberId);
          const author = members.find((m) => m.id === item.addedByMemberId);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-[11px] text-teal-700 font-semibold mb-1">
                      {item.categoryLabel}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onVoteWishlist(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                      hasVoted
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{item.votes.length} 票</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.locationName}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.suggestedDuration}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed mb-4">
                  “{item.reason}”
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mb-3">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={author?.avatar}
                      alt={author?.name}
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span>由 {author?.name} 发起</span>
                  </div>

                  <div className="font-mono font-semibold text-slate-900 tabular-nums">
                    预估 ¥{item.estimatedCost}/人
                  </div>
                </div>

                {/* 操作排期 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1.5">
                      {item.votes.map((vId) => {
                        const vMember = members.find((m) => m.id === vId);
                        if (!vMember) return null;
                        return (
                          <img
                            key={vId}
                            src={vMember.avatar}
                            alt={vMember.name}
                            title={`${vMember.name} 赞同`}
                            className="w-5 h-5 rounded-full object-cover border border-white"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {item.scheduledDay ? (
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      已排入第 {item.scheduledDay} 天
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSchedulingItemId(item.id);
                        setScheduleDay(1);
                      }}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                    >
                      排入行程时间轴
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 排入日程微弹窗 */}
      {schedulingItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>排入每日行程时间轴</span>
              </h3>
              <button
                onClick={() => setSchedulingItemId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">选择排入天数：</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: daysCount }).map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => setScheduleDay(i + 1)}
                      className={`py-1.5 rounded text-xs font-semibold transition-colors ${
                        scheduleDay === i + 1
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Day {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">计划到达时间：</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSchedulingItemId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSchedule}
                className="px-3 py-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
              >
                确认添加进日程
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 提议新心愿点弹窗 */}
      {isAddingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">提议毕业旅行打卡心愿</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  以 <strong className="text-slate-800">{currentMember?.name}</strong> 身份发起
                </p>
              </div>
              <button
                onClick={() => setIsAddingOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">心愿标题 / 地点名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：洱海露天海边日落咖啡、玉龙雪山云杉坪"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">心愿类型</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as WishlistCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    <option value="sightseeing">必打卡景点</option>
                    <option value="food">特色美食</option>
                    <option value="activity">体验活动</option>
                    <option value="leisure">夜生活/休闲</option>
                    <option value="stay">特色住宿</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">具体地点 / 区域</label>
                  <input
                    type="text"
                    placeholder="如：大理双廊 / 丽江束河"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">预计人均花费 (元)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">建议游玩时长</label>
                  <input
                    type="text"
                    placeholder="如：2小时 / 半天"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">安利理由 / 毕业意义</label>
                <textarea
                  rows={2}
                  placeholder="写下你为什么特别想去，比如出片机位、学生半价、四年回忆..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
                >
                  发布并邀请同学点赞
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
