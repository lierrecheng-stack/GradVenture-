import React from 'react';
import { DestinationCandidate, Member } from '../types/trip';
import { Check, Heart, Calendar, DollarSign, Crown, Sparkles, AlertCircle } from 'lucide-react';

interface ConsensusHubProps {
  destinations: DestinationCandidate[];
  members: Member[];
  currentMemberId: string;
  selectedDestinationName: string;
  onVoteDestination: (destId: string) => void;
  onSelectFinalDestination: (name: string) => void;
  onToggleDeposit: (memberId: string) => void;
}

export const ConsensusHub: React.FC<ConsensusHubProps> = ({
  destinations,
  members,
  currentMemberId,
  selectedDestinationName,
  onVoteDestination,
  onSelectFinalDestination,
  onToggleDeposit,
}) => {
  const currentMember = members.find((m) => m.id === currentMemberId);
  const isOrganizer = currentMember?.role === 'organizer';

  // 日期热力统计 (6/20 至 6/27)
  const candidateDates = [
    { date: '2026-06-20', label: '6/20 周六' },
    { date: '2026-06-21', label: '6/21 周日' },
    { date: '2026-06-22', label: '6/22 周一' },
    { date: '2026-06-23', label: '6/23 周二' },
    { date: '2026-06-24', label: '6/24 周三' },
    { date: '2026-06-25', label: '6/25 周四' },
    { date: '2026-06-26', label: '6/26 周五' },
    { date: '2026-06-27', label: '6/27 周六' },
  ];

  const dateStats = candidateDates.map((d) => {
    const availableMembers = members.filter((m) => m.availableDates.includes(d.date));
    return {
      ...d,
      count: availableMembers.length,
      ratio: availableMembers.length / members.length,
      isPerfect: availableMembers.length === members.length,
      members: availableMembers,
    };
  });

  return (
    <div className="space-y-6">
      {/* 模块介绍 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>意向收敛与民主决策工作台</span>
            <span className="text-xs font-normal text-slate-500">
              当前视角：<strong className="text-slate-700">{currentMember?.name}</strong> ({currentMember?.roleLabel})
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            解决毕业旅行“目的地分散、时间难凑、预算差异大”的核心痛点，通过投票收敛最优公约数
          </p>
        </div>

        {isOrganizer ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium shrink-0">
            <Crown className="w-4 h-4 text-teal-600" />
            <span>您是团长，拥有最终锁定方案权限</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 shrink-0">
            作为团员，您可以点赞投票，表达您的真实旅行期望
          </div>
        )}
      </div>

      {/* 1. 目的地多维度投票 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">1. 毕业旅行备选目的地意向投票</h3>
            <p className="text-xs text-slate-500 mt-0.5">每人可多选，得票最高的目的地优先排定路书</p>
          </div>
          <div className="text-xs text-slate-500">
            当前已锁定：<strong className="text-teal-700">{selectedDestinationName}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {destinations.map((dest) => {
            const hasVoted = dest.votes.includes(currentMemberId);
            const isSelected = selectedDestinationName.includes(dest.name.split('·')[1]?.trim() || dest.name);

            return (
              <div
                key={dest.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-400 bg-teal-50/20 ring-1 ring-teal-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{dest.name}</span>
                        {isSelected && (
                          <span className="text-[11px] font-medium text-teal-700">（已锁定为正选）</span>
                        )}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">{dest.tagline}</div>
                    </div>

                    <button
                      onClick={() => onVoteDestination(dest.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                        hasVoted
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500' : ''}`} />
                      <span>{dest.votes.length} 票</span>
                    </button>
                  </div>

                  {/* 核心亮点 */}
                  <p className="text-xs text-slate-600 leading-relaxed my-2.5 bg-slate-50 p-2 rounded-lg">
                    {dest.highlight}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 py-1">
                    <span className="tabular-nums">预计人均 ¥{dest.estimatedBudget}</span>
                    <span aria-hidden="true">·</span>
                    <span>建议玩 {dest.bestDays} 天</span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  {/* 已投同学头像展示 */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400 mr-1">支持者:</span>
                    <div className="flex -space-x-1.5">
                      {dest.votes.map((voterId) => {
                        const voter = members.find((m) => m.id === voterId);
                        if (!voter) return null;
                        return (
                          <img
                            key={voterId}
                            src={voter.avatar}
                            alt={voter.name}
                            title={`${voter.name} 投了此目的地`}
                            className="w-5 h-5 rounded-full object-cover border border-white"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {isOrganizer && !isSelected && (
                    <button
                      onClick={() => onSelectFinalDestination(dest.name)}
                      className="text-xs font-medium text-teal-600 hover:text-teal-700 underline"
                    >
                      锁定为此目的地
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 出行日期多维度重叠分析（时间热力表） */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>2. 全员空档时间重合度热力分析</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              绿色高亮表示全员均有空；系统已帮您锁定重合最完美的连续 5 天黄金窗口
            </p>
          </div>
          <div className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>推荐出发周期：6/21 至 6/25 (100% 全勤)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {dateStats.map((item) => (
            <div
              key={item.date}
              className={`p-3 rounded-lg border text-center transition-all ${
                item.isPerfect
                  ? 'border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-200'
                  : item.count >= 4
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-100 bg-slate-50/30 opacity-60'
              }`}
            >
              <div className="text-xs font-semibold text-slate-800">{item.label}</div>
              <div className="text-base font-bold text-slate-900 tabular-nums my-1">
                {item.count} <span className="text-[11px] font-normal text-slate-500">/ {members.length} 人</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {item.isPerfect ? (
                  <span className="text-emerald-700 font-medium">全员有空</span>
                ) : (
                  <span>{Math.round(item.ratio * 100)}% 重合</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 心理预算区间重叠与推荐基准 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>3. 团队心理预算交集与公约数分析</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            各成员能接受的预算上限不同，通过计算加权交集，制定不让任何人尴尬的合理标准
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {members.map((m) => {
            const minPercent = ((m.budgetMin - 1500) / 2500) * 100;
            const maxPercent = ((m.budgetMax - 1500) / 2500) * 100;
            const width = maxPercent - minPercent;

            return (
              <div key={m.id} className="flex items-center gap-4 text-xs">
                <div className="w-20 font-medium text-slate-800 shrink-0 truncate flex items-center gap-1.5">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span>{m.name}</span>
                </div>

                <div className="flex-1 bg-slate-100 h-3 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-teal-500 rounded-full opacity-80"
                    style={{ left: `${minPercent}%`, width: `${width}%` }}
                  />
                </div>

                <div className="w-32 text-right font-mono tabular-nums text-slate-600 shrink-0">
                  ¥{m.budgetMin} ~ ¥{m.budgetMax}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200/60 text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>智能推荐公约预算：¥2,600 ~ ¥3,000 元/人</strong>。此区间覆盖 100% 团员承受范围，不会带来超支负担。
            </span>
          </div>
          <div className="font-mono font-bold text-teal-800">当前实测预计 ¥2,450</div>
        </div>
      </div>

      {/* 4. 成员名录与公账定金缴付状态 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">4. 团员名录与公账预付金（班费）履约锁定</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            定金是防止“鸽王跳票”的关键机制；每人预缴 ¥500 入公账池，用于订房与租车，违约退团需扣除不可退损失
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{m.name}</span>
                    <span className="text-[11px] text-slate-500">· {m.roleLabel}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {m.major} · 备注: {m.note}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                    ¥{m.depositAmount}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">已缴纳至公账</div>
                </div>

                <button
                  onClick={() => onToggleDeposit(m.id)}
                  title="切换定金状态"
                  className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    m.hasPaidDeposit
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
