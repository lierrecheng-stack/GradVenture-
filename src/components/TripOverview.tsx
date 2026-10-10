import React from 'react';
import { TripMetadata, Member, ItineraryDay, ExpenseRecord } from '../types/trip';
import { calculateSettlements } from '../utils/debtSettlement';
import {
  Calendar,
  MapPin,
  Key,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Coins,
  Compass,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface TripOverviewProps {
  metadata: TripMetadata;
  members: Member[];
  days: ItineraryDay[];
  expenses: ExpenseRecord[];
  onNavigateTab: (tab: 'overview' | 'consensus' | 'wishlist' | 'timeline' | 'finance') => void;
  onOpenInvite: () => void;
  onOpenExport: () => void;
  onResetData: () => void;
}

export const TripOverview: React.FC<TripOverviewProps> = ({
  metadata,
  members,
  days,
  expenses,
  onNavigateTab,
  onOpenInvite,
  onOpenExport,
  onResetData,
}) => {
  const [copiedCode, setCopiedCode] = React.useState(false);

  const settlement = calculateSettlements(members, expenses);
  const totalActivities = days.reduce((acc, d) => acc + d.activities.length, 0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(metadata.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 毕业旅行步骤
  const steps = [
    { num: '01', title: '发起建团与私密邀请', desc: '口令邀请同窗，杜绝陌生人', status: 'done' },
    { num: '02', title: '意向收集与民主投票', desc: '重合日期、预算区间、定目的地', status: 'done' },
    { num: '03', title: '心愿单协同与时间轴排期', desc: '景点点赞，一键插入每日日程', status: 'active' },
    { num: '04', title: '预付班费与行中记账', desc: '公账划扣零散开支，个人大额垫付', status: 'active' },
    { num: '05', title: '一键最优清账结清', desc: '贪心算法化解多角债，3笔搞定', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部主横幅：毕业季专属卡片 */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        {/* 背景柔和光晕装饰 */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-teal-300 font-medium">
              <span>{metadata.departureCity}</span>
              <span aria-hidden="true">·</span>
              <span>{metadata.daysCount} 天 {metadata.daysCount - 1} 晚</span>
              <span aria-hidden="true">·</span>
              <span>出行倒计时进行中</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {metadata.title}
            </h1>

            <p className="text-sm text-slate-300 italic">
              “{metadata.motto}”
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>目的地：{metadata.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>日期：{metadata.startDate} 至 {metadata.endDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>房间口令：</span>
                <span className="font-mono font-bold text-amber-300 tracking-wider">
                  {metadata.inviteCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="ml-1 p-1 hover:text-white text-slate-400 transition-colors"
                  title="复制口令"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenInvite}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>邀请室友 / 同学入团</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenExport}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-1.5"
            >
              <span>预览并导出旅行路书</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4大关键量化指标卡片 (严格遵循 Universal Design: 无药丸标签，全量 tabular-nums，层次清晰) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 指标 1：参团集结度 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>集结成员</span>
            <span className="text-teal-600 font-medium">100% 确认就绪</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mb-1">
            {members.length} <span className="text-sm font-normal text-slate-500">位毕业生</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>团长</span>
            <span aria-hidden="true">·</span>
            <span>财务官</span>
            <span aria-hidden="true">·</span>
            <span>摄影</span>
            <span aria-hidden="true">·</span>
            <span>老司机均已到齐</span>
          </div>
        </div>

        {/* 指标 2：人均消费测算 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>当前人均开销</span>
            <span className="text-emerald-600 font-medium">预算范围内</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mb-1">
            ¥{Math.round(settlement.perPersonAverage)} <span className="text-sm font-normal text-slate-500">/ 预算上限 ¥{metadata.overallTargetBudget}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>已入账消费合计 ¥{settlement.totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* 指标 3：公账资金池 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>公账预付金池 (班费)</span>
            <span className="text-amber-600 font-medium">李浩然掌管</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mb-1">
            ¥{settlement.remainingPoolCash} <span className="text-sm font-normal text-slate-500">结余 (注入 ¥{settlement.totalPoolDeposits})</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>已抵扣公共餐饮与过路费 ¥{settlement.totalPoolExpenses}</span>
          </div>
        </div>

        {/* 指标 4：行程密度 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>行程排期项</span>
            <span className="text-teal-600 font-medium">节奏平衡舒适</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mb-1">
            {totalActivities} <span className="text-sm font-normal text-slate-500">个体验节点</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>覆盖 5 天，平均每天 {(totalActivities / days.length).toFixed(1)} 项</span>
          </div>
        </div>
      </div>

      {/* 毕业旅行标准全流程看板 (Workflow Chain) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">毕业旅行全流程协作进度</h2>
            <p className="text-xs text-slate-500 mt-0.5">从班级群吹水到完美落地，五步告别组织心累与算账扯皮</p>
          </div>
          <button
            onClick={onResetData}
            className="text-xs text-slate-500 hover:text-slate-900 underline"
          >
            重置示例数据
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border transition-all ${
                step.status === 'done'
                  ? 'border-slate-200 bg-slate-50/60'
                  : step.status === 'active'
                  ? 'border-teal-300 bg-teal-50/30 ring-1 ring-teal-200'
                  : 'border-slate-200 bg-white opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-slate-400">{step.num}</span>
                {step.status === 'done' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {step.status === 'active' && <Clock className="w-4 h-4 text-teal-600 animate-pulse" />}
              </div>
              <div className="text-xs font-semibold text-slate-900 mb-1">{step.title}</div>
              <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 团员团队花名册与快捷通道 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：已入团同学花名册 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">参团同窗花名册 ({members.length}/6)</h3>
            <button
              onClick={() => onNavigateTab('consensus')}
              className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>查看意向与日期热力</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center gap-3"
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">{m.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      预付 ¥{m.depositAmount}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {m.major} · {m.roleLabel}
                  </div>
                  <div className="text-[10px] text-teal-700 truncate mt-0.5">
                    心理预算 ¥{m.budgetMin} ~ ¥{m.budgetMax}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：快速直达工具箱 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">协作工具快捷通道</h3>
            <p className="text-xs text-slate-500 mb-4">随时切换视图处理具体事项</p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('wishlist')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold text-slate-900">景点心愿单投票</div>
                    <div className="text-[11px] text-slate-500">7个打卡点正在热烈表决</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('timeline')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="font-semibold text-slate-900">5日可视化时间轴</div>
                    <div className="text-[11px] text-slate-500">查看交通、住宿与活动细节</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('finance')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-900">最优债务清账结果</div>
                    <div className="text-[11px] text-slate-500">仅需 3 笔转账即可全员清算</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-normal">
            数据本地安全持久化保存，离开页面后不丢失。
          </div>
        </div>
      </div>
    </div>
  );
};
