import { Member, ExpenseRecord, DebtSettlement } from '../types/trip';

export interface MemberFinancialSummary {
  memberId: string;
  name: string;
  avatar: string;
  role: string;
  paidDirectly: number; // 个人垫付的金额
  paidDeposit: number;  // 缴纳的公账预付金
  totalSpentOnThem: number; // 个人应分摊的消费总额
  netBalance: number; // > 0 应收款, < 0 应付款, = 0 平账
  isTreasurer: boolean;
  heldPoolCash?: number; // 如果是公账掌管人，手中尚存的公账现金
}

export interface SettlementAnalysis {
  totalExpenses: number;
  totalDirectExpenses: number;
  totalPoolExpenses: number;
  totalPoolDeposits: number;
  remainingPoolCash: number;
  perPersonAverage: number;
  memberSummaries: MemberFinancialSummary[];
  transfers: DebtSettlement[];
}

/**
 * 计算团队财务收支与最少转账次数的最优债务清算算法
 */
export function calculateSettlements(
  members: Member[],
  expenses: ExpenseRecord[],
  treasurerId?: string
): SettlementAnalysis {
  // 1. 确定公账掌管人（默认为角色是 treasurer 的成员，若无则取首位成员或组织者）
  const actualTreasurerId =
    treasurerId ||
    members.find((m) => m.role === 'treasurer')?.id ||
    members.find((m) => m.role === 'organizer')?.id ||
    members[0]?.id ||
    '';

  // 2. 统计公账存款总额
  let totalPoolDeposits = 0;
  const depositMap: Record<string, number> = {};
  members.forEach((m) => {
    const deposit = m.hasPaidDeposit ? m.depositAmount : 0;
    depositMap[m.id] = deposit;
    totalPoolDeposits += deposit;
  });

  // 3. 统计支出
  let totalDirectExpenses = 0;
  let totalPoolExpenses = 0;
  const directPaidMap: Record<string, number> = {};
  const consumedMap: Record<string, number> = {};

  members.forEach((m) => {
    directPaidMap[m.id] = 0;
    consumedMap[m.id] = 0;
  });

  expenses.forEach((expense) => {
    const amount = Number(expense.amount) || 0;
    if (expense.isPoolFund || expense.payerId === 'POOL') {
      totalPoolExpenses += amount;
    } else {
      totalDirectExpenses += amount;
      if (directPaidMap[expense.payerId] !== undefined) {
        directPaidMap[expense.payerId] += amount;
      }
    }

    // 分摊计算
    const splitCount = expense.splitMemberIds.length;
    if (splitCount > 0) {
      const share = amount / splitCount;
      expense.splitMemberIds.forEach((memId) => {
        if (consumedMap[memId] !== undefined) {
          consumedMap[memId] += share;
        }
      });
    }
  });

  const totalExpenses = totalDirectExpenses + totalPoolExpenses;
  const remainingPoolCash = Math.max(0, totalPoolDeposits - totalPoolExpenses);
  const perPersonAverage = members.length > 0 ? totalExpenses / members.length : 0;

  // 4. 计算每人的 Net Balance
  // 公式：原始净额 = 垫付 + 缴纳公费 - 个人消费
  // 财务官手中持有 remainingPoolCash 现金（未花完的班费），故财务官的应付/应收需减去该手头现金
  const memberSummaries: MemberFinancialSummary[] = members.map((m) => {
    const paidDirectly = directPaidMap[m.id] || 0;
    const paidDeposit = depositMap[m.id] || 0;
    const totalSpentOnThem = consumedMap[m.id] || 0;
    const isTreasurer = m.id === actualTreasurerId;

    let netBalance = paidDirectly + paidDeposit - totalSpentOnThem;

    if (isTreasurer) {
      netBalance -= remainingPoolCash;
    }

    return {
      memberId: m.id,
      name: m.name,
      avatar: m.avatar,
      role: m.role,
      paidDirectly: Math.round(paidDirectly * 100) / 100,
      paidDeposit: Math.round(paidDeposit * 100) / 100,
      totalSpentOnThem: Math.round(totalSpentOnThem * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
      isTreasurer,
      heldPoolCash: isTreasurer ? Math.round(remainingPoolCash * 100) / 100 : undefined,
    };
  });

  // 5. 贪心双指针债务消除算法 (Optimal Debt Clearing)
  // 将债务人（net < 0，欠钱需转出）与债权人（net > 0，垫资需收款）匹配
  type BalanceEntry = { memberId: string; amount: number };
  const debtors: BalanceEntry[] = [];
  const creditors: BalanceEntry[] = [];

  memberSummaries.forEach((s) => {
    if (s.netBalance < -0.01) {
      debtors.push({ memberId: s.memberId, amount: -s.netBalance });
    } else if (s.netBalance > 0.01) {
      creditors.push({ memberId: s.memberId, amount: s.netBalance });
    }
  });

  // 按金额从大到小排序，优先消除大额配对
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers: DebtSettlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.min(debtor.amount, creditor.amount);
    if (settleAmount > 0.01) {
      transfers.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount: Math.round(settleAmount * 100) / 100,
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalDirectExpenses: Math.round(totalDirectExpenses * 100) / 100,
    totalPoolExpenses: Math.round(totalPoolExpenses * 100) / 100,
    totalPoolDeposits: Math.round(totalPoolDeposits * 100) / 100,
    remainingPoolCash: Math.round(remainingPoolCash * 100) / 100,
    perPersonAverage: Math.round(perPersonAverage * 100) / 100,
    memberSummaries,
    transfers,
  };
}
