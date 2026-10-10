import React, { useState } from 'react';
import { ItineraryDay, TimelineActivity, ActivityType } from '../types/trip';
import {
  Clock,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  Train,
  Car,
  Utensils,
  Hotel,
  Camera,
  Coffee,
  CheckCircle2,
  X,
  Luggage,
} from 'lucide-react';

interface DailyTimelineProps {
  days: ItineraryDay[];
  onAddActivity: (dayNumber: number, activity: Omit<TimelineActivity, 'id'>) => void;
  onDeleteActivity: (dayNumber: number, activityId: string) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  days,
  onAddActivity,
  onDeleteActivity,
}) => {
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState<boolean>(false);

  // Form states for new activity
  const [newTime, setNewTime] = useState('10:00');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ActivityType>('spot');
  const [newLocation, setNewLocation] = useState('');
  const [newCost, setNewCost] = useState(40);
  const [newDuration, setNewDuration] = useState('2小时');
  const [newNote, setNewNote] = useState('');
  const [newTip, setNewTip] = useState('');

  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'train':
      case 'flight':
        return <Train className="w-4 h-4 text-sky-600" />;
      case 'car':
        return <Car className="w-4 h-4 text-indigo-600" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-purple-600" />;
      case 'leisure':
        return <Coffee className="w-4 h-4 text-rose-600" />;
      case 'spot':
      default:
        return <Camera className="w-4 h-4 text-teal-600" />;
    }
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case 'train':
        return '高铁动车';
      case 'flight':
        return '航班飞行';
      case 'car':
        return '租车自驾';
      case 'meal':
        return '正餐美食';
      case 'hotel':
        return '酒店客栈';
      case 'leisure':
        return '休闲民谣';
      case 'spot':
      default:
        return '景点游览';
    }
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddActivity(activeDayNumber, {
      time: newTime,
      title: newTitle.trim(),
      type: newType,
      location: newLocation.trim() || '目的地周边',
      costPerPerson: Number(newCost) || 0,
      duration: newDuration || '2小时',
      note: newNote.trim(),
      essentialTip: newTip.trim() || undefined,
    });

    setNewTitle('');
    setNewLocation('');
    setNewNote('');
    setNewTip('');
    setIsAddingModalOpen(false);
  };

  // 毕业旅行专属行囊提示
  const packingChecklist = [
    '大学毕业学士服 & 领带/学位帽（拍合照必备）',
    '实体身份证原件（进景区及高铁刷证）',
    '未过期的学生证（部分索道与景区仍享半价优惠）',
    '高倍数防晒霜、墨镜、遮阳伞（滇西北高原紫外线极强）',
    '三脚架、无人机、相机备用电池与SD大卡',
    '便携充电宝、常备晕车药、肠胃药、创可贴',
  ];

  const totalDayCost = currentDay.activities.reduce((sum, a) => sum + a.costPerPerson, 0);

  return (
    <div className="space-y-6">
      {/* 模块主头 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">每日可视化行程时间轴（Daily Itinerary）</h2>
          <p className="text-xs text-slate-500 mt-1">
            将全员心愿单与交通住宿编排成有序的时间流，支持添加节点、防疲劳节奏诊断与开销测算
          </p>
        </div>

        <button
          onClick={() => setIsAddingModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>在 Day {activeDayNumber} 插入日程项</span>
        </button>
      </div>

      {/* Day 1 ~ Day 5 选项卡 (遵循 Anti-slop 与 Clean Segmented Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDayNumber(day.dayNumber)}
            className={`px-4 py-2.5 rounded-xl border text-left transition-all shrink-0 min-w-[130px] ${
              activeDayNumber === day.dayNumber
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-0.5">
              <span>Day {day.dayNumber}</span>
              <span className={activeDayNumber === day.dayNumber ? 'text-teal-300' : 'text-slate-400'}>
                {day.weekday}
              </span>
            </div>
            <div className="text-xs font-bold truncate">
              {day.theme.split('·')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* 当日概览与节奏诊断条 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold">
            <span>Day {currentDay.dayNumber} · {currentDay.dateStr} ({currentDay.weekday})</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{currentDay.activities.length} 个活动安排</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">{currentDay.theme}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{currentDay.pacingSummary}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-right">
            <div className="text-slate-400 text-[10px]">当日预计人均花费</div>
            <div className="font-bold text-slate-900 tabular-nums text-sm">¥{totalDayCost}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：时间轴核心流 (2 列跨度) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {currentDay.activities.map((act) => (
              <div key={act.id} className="relative group">
                {/* 轴上节点指示圆 */}
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                </div>

                {/* 活动项主卡片 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {act.time}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        {getActivityIcon(act.type)}
                        <span>{getActivityTypeLabel(act.type)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                        ¥{act.costPerPerson}/人
                      </span>
                      <button
                        onClick={() => onDeleteActivity(currentDay.dayNumber, act.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="删除此日程项"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">{act.title}</h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{act.location}</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>约 {act.duration}</span>
                    </div>
                  </div>

                  {act.note && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mb-2 leading-relaxed">
                      {act.note}
                    </p>
                  )}

                  {act.essentialTip && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/70 px-2.5 py-1.5 rounded-md border border-amber-200/50">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{act.essentialTip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：毕业旅行装备与注意事项随身锦囊 */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Luggage className="w-4 h-4 text-teal-600" />
              <span>毕业旅行随行必备核对清单</span>
            </h3>
            <p className="text-xs text-slate-500">
              出行前在微信群逐一核对，确保不落下毕业纪念专属物件与证件
            </p>

            <ul className="space-y-2 pt-1 text-xs text-slate-700">
              {packingChecklist.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <div className="font-semibold text-slate-800">💡 组织者防疲劳建议：</div>
            <p>
              每日行程不宜超过 4 个大项，留出 1~2 小时充裕的拍照和喝茶时间，更能给毕业生留下美好从容的青春回忆。
            </p>
          </div>
        </div>
      </div>

      {/* 插入日程项弹窗 */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">在 Day {activeDayNumber} 插入日程项</h3>
                <p className="text-xs text-slate-500 mt-0.5">规划新的交通、游玩、聚餐或住宿节点</p>
              </div>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">开始时间 *</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">活动类型</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ActivityType)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    <option value="spot">景点游览</option>
                    <option value="meal">正餐美食</option>
                    <option value="car">租车自驾</option>
                    <option value="train">高铁动车</option>
                    <option value="hotel">酒店客栈</option>
                    <option value="leisure">休闲民谣</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">活动标题 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：苍山洗马潭索道、大理古城散步"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">地点名称</label>
                  <input
                    type="text"
                    placeholder="如：双廊海街"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">预计游玩时长</label>
                <input
                  type="text"
                  placeholder="如：2小时 / 45分钟"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">详细描述与安排</label>
                <textarea
                  rows={2}
                  placeholder="写下具体的行程安排，例如在何处集合、分工情况..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">注意事项 / 贴士 (选填)</label>
                <input
                  type="text"
                  placeholder="如：带学生证享优惠、提前预约..."
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
                >
                  添加日程
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
