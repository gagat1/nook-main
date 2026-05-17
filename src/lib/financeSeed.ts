import { ExpenseRecord, IncomeRecord, nookExpenses, nookIncome } from '../data/nookFinance';

export type SeedIncomeRecord = IncomeRecord & { id: string };
export type SeedExpenseRecord = ExpenseRecord & { id: string };

export const FINANCE_SEED_START_DATE = '2025-09-01';

export function seedIncomeRecords(): SeedIncomeRecord[] {
  return nookIncome.map((record) => ({ ...record, id: `daily-income-${record.date}` }));
}

export function seedExpenseRecords(): SeedExpenseRecord[] {
  return nookExpenses.map((record, index) => ({
    ...record,
    id: `expense-${record.date}-${String(index + 1).padStart(4, '0')}`,
  }));
}

export function hasPreSeedFinanceDates(records: { date: string }[]) {
  return records.some((record) => record.date && record.date < FINANCE_SEED_START_DATE);
}

export function shouldResetFinanceRows(records: { date: string }[]) {
  return !records.length || hasPreSeedFinanceDates(records);
}
