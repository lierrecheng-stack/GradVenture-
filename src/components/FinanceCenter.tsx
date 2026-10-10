import React, { useState } from 'react';
import { ExpenseRecord, Member, ExpenseCategory } from '../types/trip';
import { calculateSettlements } from '../utils/debtSettlement';
import {
  Wallet,
  Plus,
  Coins,
  Receipt,
  ArrowRight,
  Trash2,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  X,
  CreditCard,
  Building,
} from 'lucide-react';

interface FinanceCenterProps {
  expenses: ExpenseRecord[];
  members: Member[];
  currentMemberId: string;
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const FinanceCenter: React.FC<FinanceCenterProps> = ({
  expenses,
  members,
  currentMemberId,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'pool' | 'personal'>('all');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // New expense form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number>(100);
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('food');
  const [newPayerType, setNewPayerType] = useState<'pool' | 'member'>('pool');
  const [newPayerMemberId, setNewPayerMemberId] = useState<string>(members[0]?.id || '');
  const [selectedSplitMemberIds, setSelectedSplitMemberIds] = useState<string[]>(
    members.map((m) => m.id)
  );
  const [newReceiptNote, setNewReceiptNote] = useState('');

  const currentMember = members.find((m) => m.id === currentMemberId);

  // 运行最优债务清算算法
  const settlement = calculateSettlements(members, expenses);

  const filteredExpenses = expenses.filter((e) => {
    if (filterType === 'pool') return e.isPoolFund || e.payerId === 'POOL';
    if (filterType === 'personal') return !e.isPoolFund && e.payerId !== 'POOL';
    return true;
  });

  const handleSelectAllSplit = () => {
    setSelectedSplitMemberIds(members.map((m) => m.id));
  };

  const handleToggleSplitMember = (memberId: string) => {
    if (selectedSplitMemberIds.includes(memberId)) {
      if (selectedSplitMemberIds.length > 1) {
        setSelectedSplitMemberIds(selectedSplitMemberIds.filter((id) => id !== memberId));
      }
    } else {
      setSelectedSplitMemberIds([...selectedSplitMemberIds, memberId]);
    }
  };

  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount <= 0) return;

    onAddExpense({
      title: newTitle.trim(),
      amount: Number(newAmount),
      category: newCategory,
      payerId: newPayerType === 'pool' ? 'POOL' : newPayerMemberId,
      isPoolFund: newPayerType === 'pool',
      splitMemberIds: selectedSplitMemberIds,
      date: new Date().toISOString().split('T')[0],
      receiptNote: newReceiptNote.trim() || undefined,
    });

    setNewTitle('');
    setNewAmount(100);
    setNewReceiptNote('');
    setIsAddExpenseOpen(false);
  };

  const getCategoryLabel = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'transport':
        return '交通/租车';
      case 'hotel':
        return '酒店民宿';
      case 'food':
        return '正餐饮食';
      case 'ticket':
        return '门票索道';
      case 'leisure':
        return '休闲娱乐';
      case 'other':
      default:
        return '物资/杂支';
    }
  };

  const handleCopySettlementText = () => {
    const lines = [
      `【毕业旅行最终清算单 · 毕游记】`,
      `全团总消费: ¥${settlement.totalExpenses.toLocaleString()} 元`,
      `参团人数: ${members.length} 人 (人均: ¥${Math.round(settlement.perPersonAverage)} 元)`,
      `公账注入: ¥${settlement.totalPoolDeposits} | 公账结余: ¥${settlement.remainingPoolCash}`,
      `--------------------------`,
      `【极简最优平账指令 (仅需 ${settlement.transfers.length} 笔转账)】:`,
    ];

    settlement.transfers.forEach((t, i) => {
      const fromMem = members.find((m) => m.id === t.fromMemberId);
      const toMem = members.find((m) => m.id === t.toMemberId);
      lines.push(`${i + 1}. [${fromMem?.name}] ➡️ 向 [${toMem?.name}] 微信转账 ¥${t.amount} 元`);
    });

    lines.push(`--------------------------`);
    lines.push(`转账完毕后，全员账户彻底平账结清！祝大家毕业快乐，前程似锦！`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 模块头部 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-teal-600" />
            <span>费用管理与最优债务清算（Optimal Settlement）</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            采用“公账预付金池 + 个人垫付”混合记账模式，内置贪心图论清算，消除多角网状转账，最少笔数彻底平账！
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>记一笔支出</span>
        </button>
      </div>

      {/* 1. 公账预付金池（班费）仪表盘 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">公账注入总额 (预缴班费)</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            ¥{settlement.totalPoolDeposits}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {members.length} 人 × 每人 ¥{members[0]?.depositAmount || 500} 元
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">公账划扣已支出</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            ¥{settlement.totalPoolExpenses}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            已抵扣洗尘宴、双廊烧烤、高速费、腊排骨等
          </div>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200">
          <div className="text-xs text-emerald-800 font-semibold mb-1">公账现存结余现金</div>
          <div className="text-2xl font-bold text-emerald-900 tabular-nums">
            ¥{settlement.remainingPoolCash}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            由财务官李浩然持有，清账时已并入最优转账抵扣
          </div>
        </div>
      </div>

      {/* 2. 核心高光：最优债务清算方案卡片 (The Optimal Debt Clearing Result) */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>算法赋能 · 最优债务抵消引擎</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              全团结账：仅需 {settlement.transfers.length} 笔微信转账即可全员彻底平账！
            </h3>
            <p className="text-xs text-slate-300">
              若按原始单据逐一算账，需进行多达 15 笔网状多角转账；经过净额贪心对冲后，转账路径降至最优。
            </p>
          </div>

          <button
            onClick={handleCopySettlementText}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? '已复制群清账结论' : '复制发至微信群'}</span>
          </button>
        </div>

        {/* 转账卡片流 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {settlement.transfers.map((transfer, idx) => {
            const fromMem = members.find((m) => m.id === transfer.fromMemberId);
            const toMem = members.find((m) => m.id === transfer.toMemberId);
            const fromIsTreasurer = fromMem?.role === 'treasurer';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-teal-300 mb-2">
                    <span className="font-mono">指令 0{idx + 1}</span>
                    <span className="text-[11px] text-slate-300">微信/支付宝转账</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 my-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={fromMem?.avatar}
                        alt={fromMem?.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{fromMem?.name}</div>
                        <div className="text-[10px] text-rose-300">
                          {fromIsTreasurer ? '含公账余款' : '应付清算'}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />

                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <div className="text-xs font-bold text-white">{toMem?.name}</div>
                        <div className="text-[10px] text-emerald-300">大额垫付收款</div>
                      </div>
                      <img
                        src={toMem?.avatar}
                        alt={toMem?.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">转账金额</span>
                  <span className="text-lg font-bold text-amber-300 font-mono tabular-nums">
                    ¥{transfer.amount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 成员收支平衡对账表 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">3. 成员收支净额明细对账表（Balance Sheet）</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            计算逻辑：净额 = (个人实际垫付 + 缴纳公费) - 个人应分摊消费（正数为应收款，负数为应付款）
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">成员</th>
                <th className="py-2.5 px-3 text-right">个人垫付总额</th>
                <th className="py-2.5 px-3 text-right">缴纳班费预付</th>
                <th className="py-2.5 px-3 text-right">应分摊消费总额</th>
                <th className="py-2.5 px-3 text-right">结算前净额 (Net Balance)</th>
                <th className="py-2.5 px-3 text-center">平账结论</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlement.memberSummaries.map((s) => {
                const isPositive = s.netBalance > 0.01;
                const isNegative = s.netBalance < -0.01;

                return (
                  <tr key={s.memberId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900 flex items-center gap-2">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-6 h-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span>{s.name}</span>
                      {s.isTreasurer && (
                        <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                          财务官持有公账
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      ¥{s.paidDirectly.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      ¥{s.paidDeposit.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      ¥{s.totalSpentOnThem.toLocaleString()}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-600'
                      }`}
                    >
                      {isPositive ? `+¥${s.netBalance}` : isNegative ? `-¥${Math.abs(s.netBalance)}` : '¥0.00'}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {isPositive ? (
                        <span className="text-emerald-700 font-medium">应收回 ¥{s.netBalance}</span>
                      ) : isNegative ? (
                        <span className="text-rose-700 font-medium">应补交 ¥{Math.abs(s.netBalance)}</span>
                      ) : (
                        <span className="text-slate-400">已平账</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 支出明细流水账目 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">4. 旅程全部支出流水 ({expenses.length} 笔)</h3>
            <p className="text-xs text-slate-500 mt-0.5">每笔款项皆有据可查，支持自定义参与分摊人员名单</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              全部支出
            </button>
            <button
              onClick={() => setFilterType('pool')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'pool' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              公账划扣
            </button>
            <button
              onClick={() => setFilterType('personal')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'personal' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              个人垫付
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredExpenses.map((exp) => {
            const isPool = exp.isPoolFund || exp.payerId === 'POOL';
            const payerMember = members.find((m) => m.id === exp.payerId);

            return (
              <div key={exp.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      {getCategoryLabel(exp.category)}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{exp.title}</h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      {isPool ? (
                        <span className="text-amber-700 font-medium">公账划扣支付</span>
                      ) : (
                        <span>由 <strong>{payerMember?.name}</strong> 垫付</span>
                      )}
                    </div>
                    <span aria-hidden="true">·</span>
                    <span>{exp.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      分摊对象：{exp.splitMemberIds.length === members.length ? '全员6人均摊' : `${exp.splitMemberIds.length}人分摊`}
                    </span>
                  </div>

                  {exp.receiptNote && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      凭据备注: {exp.receiptNote}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                      ¥{exp.amount}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      人均 ¥{(exp.amount / exp.splitMemberIds.length).toFixed(1)}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="删除此笔账目"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 记一笔支出模态框 */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">记一笔毕业旅行支出</h3>
                <p className="text-xs text-slate-500 mt-0.5">支持公账划款或指定同学垫付</p>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">支出项目名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：苍山洗马潭索道门票、超市零食水饮"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">支出金额 (元) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none tabular-nums font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">消费类别</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    <option value="food">正餐饮食</option>
                    <option value="transport">交通/租车/加油</option>
                    <option value="hotel">酒店民宿</option>
                    <option value="ticket">景区门票/索道</option>
                    <option value="leisure">休闲娱乐/酒吧</option>
                    <option value="other">其他/物资</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">谁出的这笔钱？</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setNewPayerType('pool')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 ${
                      newPayerType === 'pool'
                        ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-semibold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <Building className="w-4 h-4 text-teal-600" />
                    <div>
                      <div>从公账班费扣</div>
                      <div className="text-[10px] text-slate-400">结余 ¥{settlement.remainingPoolCash}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPayerType('member')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 ${
                      newPayerType === 'member'
                        ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-semibold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-teal-600" />
                    <div>
                      <div>某位同学个人垫付</div>
                      <div className="text-[10px] text-slate-400">事后统一平账</div>
                    </div>
                  </button>
                </div>

                {newPayerType === 'member' && (
                  <select
                    value={newPayerMemberId}
                    onChange={(e) => setNewPayerMemberId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.roleLabel})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-medium">
                    分摊人员名单 ({selectedSplitMemberIds.length}/{members.length} 人)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllSplit}
                    className="text-teal-600 hover:text-teal-700 underline text-[11px]"
                  >
                    全员均摊
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  {members.map((m) => {
                    const isChecked = selectedSplitMemberIds.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => handleToggleSplitMember(m.id)}
                        className={`px-2 py-1.5 rounded text-left flex items-center gap-1.5 text-xs transition-colors ${
                          isChecked
                            ? 'bg-teal-600 text-white font-medium'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2 className={`w-3 h-3 ${isChecked ? 'text-white' : 'text-slate-300'}`} />
                        <span className="truncate">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">票据发票与备注 (选填)</label>
                <input
                  type="text"
                  placeholder="如：大众点评团购、滴滴电子发票..."
                  value={newReceiptNote}
                  onChange={(e) => setNewReceiptNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
                >
                  录入账目并重算清账
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
