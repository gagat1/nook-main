import { ExpenseRecord, IncomeRecord, nookExpenses, nookIncome } from '../data/nookFinance';
import { normalizeExpensePayment } from './financePayments';

export type SeedIncomeRecord = IncomeRecord & { id: string };
export type SeedExpenseRecord = ExpenseRecord & { id: string };

export const FINANCE_SEED_START_DATE = '2025-09-01';

export function seedIncomeRecords(): SeedIncomeRecord[] {
  return nookIncome.map((record) => ({ ...record, id: `daily-income-${record.date}` }));
}

export function seedExpenseRecords(): SeedExpenseRecord[] {
  return nookExpenses.map((record, index) => normalizeExpensePayment({
    ...record,
    id: `expense-${record.date}-${String(index + 1).padStart(4, '0')}`,
  }));
}
