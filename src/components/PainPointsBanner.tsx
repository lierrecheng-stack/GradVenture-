import React, { useState } from 'react';
import { Users2, CalendarX, Compass, ReceiptText, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const PainPointsBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const painPointCards = [
    {
      icon: Users2,
      tag: '痛点 01',
      title: '人数多、意见杂、议而不决',
      problem: '群聊刷屏数百条，想去海边的、想徒步的、想躺平的各执一词，组织者做几十页攻略却难达成共识。',
      solution: '意向多维投票 + 民主热力收敛',
      detail: '全员在线填报时间空档与预算区间，自动锁定重叠黄金日期；心愿单点赞角逐必玩景点。',
      color: 'border-teal-200 bg-teal-50/40 text-teal-800',
    },
    {
      icon: CalendarX,
      tag: '痛点 02',
      title: '临行“鸽王”跳票、退订尴尬',
      problem: '口头答应热烈，到订车订房交钱时频频退团，导致原本谈好的人均平摊费用剧烈上涨。',
      solution: '邀请制小团 + 公账预付金池',
      detail: '专属6位口令私密组团；行前预收定金充入班费资金池，锁定真实出行承诺，统一支付大额定金。',
      color: 'border-amber-200 bg-amber-50/40 text-amber-800',
    },
    {
      icon: Compass,
      tag: '痛点 03',
      title: '行程全靠一人扛、累觉不爱',
      problem: '往往只有团长一人疯狂熬夜排计划，其他人既不提明确要求，到了现场又容易产生分歧与疲劳。',
      solution: '心愿池一键排期 + 节奏防疲劳诊断',
      detail: '人人皆可提交想打卡的特色小店，得票高的地点一键排入当日时间轴；系统实时测算路程与体力负荷。',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-800',
    },
    {
      icon: ReceiptText,
      tag: '痛点 04',
      title: '多笔垫付交叉混乱、AA尴尬',
      problem: 'A付了租车、B付了门票、C付了晚餐还有人没吃特定菜；事后几十笔账单对不清，甚至伤了同窗情谊。',
      solution: '公账划扣 + 最优债务清算算法',
      detail: '支持公账与私人垫付双轨制；内置贪心图论清账，无论账目多乱，最终仅需 2~3 笔转账即可全员平账！',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-800',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-teal-100 text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                毕业旅行组织痛点深度解析 & 毕游记解决方案对照
              </div>
              <div className="text-xs text-slate-500 hidden sm:block">
                针对人数多、目的地分散、预算不一、记账困难四大痛点，打造闭环协作工具
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <span>{isExpanded ? '收起分析' : '展开痛点剖析'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {painPointCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>{card.tag}</span>
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mb-1.5">{card.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{card.problem}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{card.solution}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 leading-normal">{card.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
