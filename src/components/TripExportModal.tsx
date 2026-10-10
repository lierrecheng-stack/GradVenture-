import React, { useState } from 'react';
import { TripMetadata, Member, ItineraryDay, ExpenseRecord } from '../types/trip';
import { calculateSettlements } from '../utils/debtSettlement';
import { X, Copy, Check, Printer, FileText, ArrowRight, GraduationCap } from 'lucide-react';

interface TripExportModalProps {
  metadata: TripMetadata;
  members: Member[];
  days: ItineraryDay[];
  expenses: ExpenseRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export const TripExportModal: React.FC<TripExportModalProps> = ({
  metadata,
  members,
  days,
  expenses,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const settlement = calculateSettlements(members, expenses);

  const handleCopyFullText = () => {
    const lines = [
      `🎓 ===================================`,
      `    ${metadata.title}`,
      `    “${metadata.motto}”`,
      `===================================`,
      `📍 目的地：${metadata.destination}`,
      `📅 日期周期：${metadata.startDate} ~ ${metadata.endDate} (${metadata.daysCount}天)`,
      `👥 参团毕业生 (${members.length}人)：${members.map((m) => m.name).join('、')}`,
      `💰 预算与支出：总支出 ¥${settlement.totalExpenses.toLocaleString()} (人均 ¥${Math.round(
        settlement.perPersonAverage
      )})`,
      `🏦 班费公账结余：¥${settlement.remainingPoolCash} (已计入结算转账)`,
      ``,
      `-----------------------------------`,
      `【每日行程时间简表】:`,
    ];

    days.forEach((day) => {
      lines.push(`\n📅 Day ${day.dayNumber} · ${day.dateStr} (${day.weekday}) - ${day.theme}`);
      day.activities.forEach((act) => {
        lines.push(`   - ${act.time} ${act.title} (${act.location}, 人均¥${act.costPerPerson})`);
      });
    });

    lines.push(``);
    lines.push(`-----------------------------------`);
    lines.push(`【全团最终最优清账指令 (仅需 ${settlement.transfers.length} 笔)】:`);
    settlement.transfers.forEach((t, i) => {
      const fromMem = members.find((m) => m.id === t.fromMemberId);
      const toMem = members.find((m) => m.id === t.toMemberId);
      lines.push(`   ${i + 1}. [${fromMem?.name}] ➡️ 向 [${toMem?.name}] 微信转账 ¥${t.amount} 元`);
    });
    lines.push(`\n转账完毕全员平账！祝大家毕业快乐，前程似锦！🌟`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* 顶部操作 */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">毕业旅行路书与清算总单预览</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              title="打印或保存PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyFullText}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制长文案' : '复制微信群排版'}</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 预览长卡片内容 */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 font-sans print:p-0">
          <div className="text-center space-y-1 pb-4 border-b border-slate-200">
            <div className="text-slate-500 font-mono text-[11px]">GRADUATION TRAVEL ROADBOOK & EXPENSE REPORT</div>
            <h2 className="text-xl font-bold text-slate-900">{metadata.title}</h2>
            <p className="text-slate-600 italic">“{metadata.motto}”</p>
            <div className="flex justify-center gap-4 text-slate-500 pt-1 text-[11px]">
              <span>目的地：{metadata.destination}</span>
              <span>·</span>
              <span>时间：{metadata.startDate} ~ {metadata.endDate}</span>
              <span>·</span>
              <span>人数：{members.length}人</span>
            </div>
          </div>

          {/* 核心指标概览 */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400">旅程总消费</div>
              <div className="font-bold text-slate-900 text-sm">¥{settlement.totalExpenses.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">平均每人实际花费</div>
              <div className="font-bold text-slate-900 text-sm">¥{Math.round(settlement.perPersonAverage)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">公账结余抵扣</div>
              <div className="font-bold text-emerald-700 text-sm">¥{settlement.remainingPoolCash}</div>
            </div>
          </div>

          {/* 行程时间轴简况 */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm border-l-2 border-teal-600 pl-2">
              一、行程排期表概览
            </h4>
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day.dayNumber} className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                    <span>Day {day.dayNumber} ({day.weekday}) · {day.theme}</span>
                    <span className="text-[10px] text-slate-400">{day.activities.length} 项日程</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    {day.activities.map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-[11px]">
                        <span>{a.time} {a.title} ({a.location})</span>
                        <span className="font-mono text-slate-400">¥{a.costPerPerson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最优清账结论 */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-sm border-l-2 border-teal-600 pl-2">
              二、团队最终最优清账方案（极简 {settlement.transfers.length} 笔转账）
            </h4>
            <div className="space-y-2">
              {settlement.transfers.map((t, idx) => {
                const fromMem = members.find((m) => m.id === t.fromMemberId);
                const toMem = members.find((m) => m.id === t.toMemberId);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-teal-50/50 rounded-lg border border-teal-200/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-800">#{idx + 1}</span>
                      <span>
                        <strong className="text-slate-900">{fromMem?.name}</strong> ➡️ 向{' '}
                        <strong className="text-slate-900">{toMem?.name}</strong> 转账
                      </span>
                    </div>
                    <span className="font-mono font-bold text-teal-900 text-sm tabular-nums">
                      ¥{t.amount} 元
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              * 经算法多角对冲，所有成员账户差额已在上述转账后精准清零，无需任何多余转账。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
