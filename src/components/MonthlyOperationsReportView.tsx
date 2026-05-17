import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart3, FileSpreadsheet, Save, Upload, WalletCards, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseRecord, IncomeRecord } from '../data/nookFinance';
import { hasPreSeedFinanceDates, seedExpenseRecords, seedIncomeRecords, shouldResetFinanceRows } from '../lib/financeSeed';
import { expensePaymentBreakdown, expensePaymentFields, inferExpensePaymentMethod, normalizeExpensePayment } from '../lib/financePayments';
import { loadJsonRows, replaceJsonRows, upsertJsonRows } from '../lib/supabaseSync';

type EditableIncomeRecord = IncomeRecord & { id: string };
type EditableExpenseRecord = ExpenseRecord & { id: string };

type DailyReportRow = {
  incomeId?: string;
  date: string;
  gross: number;
  discount: number;
  received: number;
  cogs: number;
  productProfit: number;
  fixedCost: number;
  expense: number;
  notes: string;
  profitLoss: number;
  cash: number;
  qris: number;
  deliveryTax: number;
  cashExpense: number;
  qrisExpense: number;
  expectedCash: number;
  expectedQris: number;
  actualCash: number;
  actualQris: number;
  actualCashEntered: boolean;
  actualQrisEntered: boolean;
  cashDifference: number;
  qrisDifference: number;
  total: number;
  transactions: number;
};

const FINANCE_TABLES = {
  income: 'finance_income',
  expenses: 'finance_expenses',
};
const SETTINGS_TABLE = 'app_settings';
const DEFAULT_FIXED_COST_DAILY = 280000;

declare global {
  interface Window {
    XLSX?: any;
  }
}

const money = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return money.format(Math.round(value || 0)).replace(/\s/g, ' ');
}

function formatPlainNumber(value: number) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value || 0);
}

function formatInputNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function textValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function excelSerialToDate(serial: number) {
  const epoch = new Date(Date.UTC(1899, 11, 30));
  epoch.setUTCDate(epoch.getUTCDate() + serial);
  return epoch.toISOString().slice(0, 10);
}

function isValidDateString(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const year = Number(date.slice(0, 4));
  return year >= 2000 && year <= 2100;
}

function parseShortDate(value: string) {
  const match = value.trim().match(/^(\d{1,2})[-/\s]([a-zA-Z]{3,})[-/\s](\d{2,4})$/);
  if (!match) return '';
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthIndex = monthNames.indexOf(match[2].slice(0, 3).toLowerCase());
  const year = Number(match[3]) < 100 ? 2000 + Number(match[3]) : Number(match[3]);
  const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(Number(match[1])).padStart(2, '0')}`;
  return monthIndex >= 0 && isValidDateString(date) ? date : '';
}

function normalizeDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const date = value.toISOString().slice(0, 10);
    return isValidDateString(date) ? date : '';
  }
  if (typeof value === 'number') {
    if (value < 25000 || value > 60000) return '';
    const date = excelSerialToDate(value);
    return isValidDateString(date) ? date : '';
  }
  if (typeof value === 'string') {
    const shortDate = parseShortDate(value);
    if (shortDate) return shortDate;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const date = parsed.toISOString().slice(0, 10);
      return isValidDateString(date) ? date : '';
    }
  }
  return '';
}

function withIncomeIds(records: IncomeRecord[], prefix: string): EditableIncomeRecord[] {
  return records.map((record, index) => ({ ...record, id: `${prefix}-${index}-${record.date}` }));
}

function withExpenseIds(records: ExpenseRecord[], prefix: string): EditableExpenseRecord[] {
  return records.map((record, index) => normalizeExpensePayment({ ...record, id: `${prefix}-${index}-${record.date}` }));
}

function loadLocalIncome() {
  try {
    const saved = window.localStorage.getItem('nook-finance-income-records');
    if (saved) {
      const records = (JSON.parse(saved) as EditableIncomeRecord[]).filter((record) => isValidDateString(record.date));
      return hasPreSeedFinanceDates(records) ? seedIncomeRecords() : records;
    }
    const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-income') || '[]') as IncomeRecord[];
    return [...seedIncomeRecords(), ...withIncomeIds(legacyManual, 'legacy-income')];
  } catch {
    return seedIncomeRecords();
  }
}

function loadLocalExpenses() {
  try {
    const saved = window.localStorage.getItem('nook-finance-expense-records');
    if (saved) {
      const records = (JSON.parse(saved) as EditableExpenseRecord[]).filter((record) => isValidDateString(record.date)).map(normalizeExpensePayment);
      return hasPreSeedFinanceDates(records) ? seedExpenseRecords() : records;
    }
    const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-expenses') || '[]') as ExpenseRecord[];
    return [...seedExpenseRecords(), ...withExpenseIds(legacyManual, 'legacy-expense')];
  } catch {
    return seedExpenseRecords();
  }
}

function loadLocalFixedCostDaily() {
  if (typeof window === 'undefined') return DEFAULT_FIXED_COST_DAILY;
  const saved = Number(window.localStorage.getItem('nook-fixed-cost-daily'));
  return Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_FIXED_COST_DAILY;
}

function sum(records: number[]) {
  return records.reduce((total, value) => total + (value || 0), 0);
}

function expenseCashAmount(record: EditableExpenseRecord) {
  return expensePaymentBreakdown(record).cash;
}

function expenseQrisAmount(record: EditableExpenseRecord) {
  return expensePaymentBreakdown(record).qris;
}

function buildDailyRows(incomeRecords: EditableIncomeRecord[], expenseRecords: EditableExpenseRecord[], selectedMonth: string, fixedCostDaily: number) {
  const dates = [...new Set([
    ...incomeRecords.filter((record) => monthKey(record.date) === selectedMonth).map((record) => record.date),
    ...expenseRecords.filter((record) => monthKey(record.date) === selectedMonth).map((record) => record.date),
  ])].sort();

  return dates.map((date): DailyReportRow => {
    const dayIncome = incomeRecords.filter((record) => record.date === date);
    const dayExpenses = expenseRecords.filter((record) => record.date === date);
    const primaryIncome = dayIncome.find((record) => record.id.startsWith('daily-income-')) || dayIncome[0];
    const gross = sum(dayIncome.map((record) => record.gross));
    const discount = sum(dayIncome.map((record) => record.discount));
    const received = gross - discount;
    const cogs = sum(dayIncome.map((record) => record.cogs ?? 0));
    const productProfit = received - cogs;
    const storedFixedCost = sum(dayIncome.map((record) => record.fixedCostDaily ?? 0));
    const fixedCost = storedFixedCost || fixedCostDaily;
    const expense = sum(dayExpenses.map((record) => record.net));
    const cash = sum(dayIncome.map((record) => record.cash ?? 0));
    const qris = sum(dayIncome.map((record) => record.qris ?? 0));
    const deliveryTax = sum(dayIncome.map((record) => record.deliveryTax ?? 0));
    const cashExpense = sum(dayExpenses.map(expenseCashAmount));
    const qrisExpense = sum(dayExpenses.map(expenseQrisAmount));
    const expectedCash = cash - cashExpense;
    const expectedQris = qris + deliveryTax - qrisExpense;
    const hasActualCash = dayIncome.some((record) => record.actualCash != null);
    const hasActualQris = dayIncome.some((record) => record.actualQris != null);
    const actualCash = hasActualCash ? sum(dayIncome.map((record) => record.actualCash ?? 0)) : expectedCash;
    const actualQris = hasActualQris ? sum(dayIncome.map((record) => record.actualQris ?? 0)) : expectedQris;
    const importedProfitLoss = dayIncome.some((record) => record.profitLoss != null)
      ? sum(dayIncome.map((record) => record.profitLoss ?? 0))
      : productProfit - fixedCost - expense;
    const notes = [...new Set([...dayIncome, ...dayExpenses].map((record) => record.note).filter(Boolean))].join(', ');

    return {
      date,
      incomeId: primaryIncome?.id,
      gross,
      discount,
      received,
      cogs,
      productProfit: received - cogs,
      fixedCost,
      expense,
      notes,
      profitLoss: importedProfitLoss || productProfit - fixedCost,
      cash,
      qris,
      deliveryTax,
      cashExpense,
      qrisExpense,
      expectedCash,
      expectedQris,
      actualCash,
      actualQris,
      actualCashEntered: hasActualCash,
      actualQrisEntered: hasActualQris,
      cashDifference: actualCash - expectedCash,
      qrisDifference: actualQris - expectedQris,
      total: actualCash + actualQris || received,
      transactions: sum(dayIncome.map((record) => record.transactionCount ?? 0)),
    };
  });
}

function withFormula(row: DailyReportRow): DailyReportRow {
  const received = row.gross - row.discount;
  const productProfit = received - row.cogs;
  const expectedCash = row.cash - row.cashExpense;
  const expectedQris = row.qris + row.deliveryTax - row.qrisExpense;
  return {
    ...row,
    received,
    productProfit,
    profitLoss: productProfit - row.fixedCost,
    expectedCash,
    expectedQris,
    cashDifference: row.actualCash - expectedCash,
    qrisDifference: row.actualQris - expectedQris,
    total: row.cash + row.qris,
  };
}

function blankDailyRow(date: string): DailyReportRow {
  return withFormula({
    date,
    incomeId: undefined,
    gross: 0,
    discount: 0,
    received: 0,
    cogs: 0,
    productProfit: 0,
    fixedCost: 0,
    expense: 0,
    notes: '',
    profitLoss: 0,
    cash: 0,
    qris: 0,
    deliveryTax: 0,
    cashExpense: 0,
    qrisExpense: 0,
    expectedCash: 0,
    expectedQris: 0,
    actualCash: 0,
    actualQris: 0,
    actualCashEntered: false,
    actualQrisEntered: false,
    cashDifference: 0,
    qrisDifference: 0,
    total: 0,
    transactions: 0,
  });
}

function rowsToFinanceRecords(rows: DailyReportRow[], currentIncome: EditableIncomeRecord[] = []) {
  const income = rows.map((row) => {
    const formulaRow = withFormula(row);
    const id = formulaRow.incomeId || `daily-income-${formulaRow.date}`;
    const existing = currentIncome.find((record) => record.id === id) || currentIncome.find((record) => record.date === formulaRow.date);
    return {
      ...existing,
      id,
      date: formulaRow.date,
      product: 'Daily Sales',
      category: 'Nook Veteran',
      gross: Math.round(formulaRow.gross),
      discount: Math.round(formulaRow.discount),
      fee: 0,
      net: Math.round(formulaRow.received || formulaRow.gross - formulaRow.discount),
      note: formulaRow.notes,
      received: Math.round(formulaRow.received),
      cogs: Math.round(formulaRow.cogs),
      productProfit: Math.round(formulaRow.productProfit),
      fixedCostDaily: Math.round(formulaRow.fixedCost),
      profitLoss: Math.round(formulaRow.profitLoss),
      cash: Math.round(formulaRow.cash),
      qris: Math.round(formulaRow.qris),
      deliveryTax: Math.round(formulaRow.deliveryTax),
      actualCash: formulaRow.actualCashEntered ? Math.round(formulaRow.actualCash) : existing?.actualCash,
      actualQris: formulaRow.actualQrisEntered ? Math.round(formulaRow.actualQris) : existing?.actualQris,
      transactionCount: Math.round(formulaRow.transactions),
      source: 'Monthly Operations',
    } satisfies EditableIncomeRecord;
  });
  const expenses = rows.filter((row) => row.expense || row.notes).map((row) => {
    const paymentMethod = inferExpensePaymentMethod({ note: row.notes });
    return {
      id: `daily-expense-${row.date}`,
      date: row.date,
      item: row.notes || 'Daily Expense',
      category: 'Operations',
      gross: Math.round(row.expense),
      tax: 0,
      fee: 0,
      net: Math.round(row.expense),
      note: row.notes,
      fixedCostDaily: Math.round(row.fixedCost),
      profitLoss: Math.round(withFormula(row).profitLoss),
      ...expensePaymentFields(row.expense, paymentMethod),
      deliveryTax: Math.round(row.deliveryTax),
      transactionCount: Math.round(row.transactions),
      source: 'Monthly Operations',
    } satisfies EditableExpenseRecord;
  });

  return { income, expenses };
}

function rowsToActualIncomeRecords(rows: DailyReportRow[], currentIncome: EditableIncomeRecord[]) {
  return rows.map((row) => {
    const existing = currentIncome.find((record) => record.id === `daily-income-${row.date}`) || currentIncome.find((record) => record.date === row.date);
    const formulaRow = withFormula(row);
    return {
      ...(existing || {
        id: `daily-income-${formulaRow.date}`,
        date: formulaRow.date,
        product: 'Daily Sales',
        category: 'Nook Veteran',
        gross: formulaRow.gross,
        discount: formulaRow.discount,
        fee: 0,
        net: formulaRow.received || formulaRow.gross - formulaRow.discount,
        note: formulaRow.notes,
      }),
      actualCash: Math.round(formulaRow.actualCash),
      actualQris: Math.round(formulaRow.actualQris),
      source: existing?.source || 'Monthly Operations',
    } satisfies EditableIncomeRecord;
  });
}

function mergeById<T extends { id: string; date: string }>(current: T[], incoming: T[]) {
  const next = new Map(current.map((record) => [record.id, record]));
  incoming.forEach((record) => next.set(record.id, record));
  return [...next.values()].filter((record) => isValidDateString(record.date));
}

function normalizedHeader(value: unknown) {
  return textValue(value).toLowerCase().replace(/\s+/g, ' ');
}

function findHeaderIndex(row: unknown[], matcher: (value: string) => boolean) {
  return row.findIndex((cell) => matcher(normalizedHeader(cell)));
}

function rowValue(row: unknown[], index: number) {
  return index >= 0 ? row[index] : null;
}

function parseDailyFinanceRows(rows: unknown[][]) {
  const headerRowIndex = rows.findIndex((row) => {
    const cells = row.map((cell) => textValue(cell).toLowerCase());
    return cells.some((cell) => cell.includes('tanggal')) && cells.some((cell) => cell.includes('pendapatan'));
  });
  if (headerRowIndex < 0) return [] as DailyReportRow[];

  const headerRow = rows[headerRowIndex] || [];
  const detailRow = rows[headerRowIndex + 1] || [];
  const dateIndex = findHeaderIndex(headerRow, (cell) => cell.includes('tanggal'));
  const grossIndex = findHeaderIndex(headerRow, (cell) => cell.includes('pendapatan') && cell.includes('kotor'));
  const discountIndex = findHeaderIndex(headerRow, (cell) => cell.includes('diskon'));
  const receivedIndex = findHeaderIndex(headerRow, (cell) => cell.includes('uang') && cell.includes('diterima'));
  const cogsIndex = findHeaderIndex(headerRow, (cell) => cell === 'hpp' || cell.includes('cogs'));
  const fixedCostIndex = findHeaderIndex(headerRow, (cell) => cell.includes('fix cost') || cell.includes('fixed cost'));
  const expenseIndex = findHeaderIndex(headerRow, (cell) => cell.includes('pengeluaran') || cell.includes('expense'));
  const noteIndex = findHeaderIndex(headerRow, (cell) => cell.includes('notes') || cell.includes('note'));
  const transactionIndex = findHeaderIndex(headerRow, (cell) => cell.includes('transaksi') || cell.includes('transaction'));
  const cashIndex = findHeaderIndex(detailRow, (cell) => cell.includes('cash'));
  const qrisIndex = findHeaderIndex(detailRow, (cell) => cell.includes('qris'));
  const deliveryTaxIndex = findHeaderIndex(detailRow, (cell) => cell.includes('grab') || cell.includes('tax'));
  if (dateIndex < 0) return [];

  let startIndex = headerRowIndex + 1;
  const nextRow = rows[startIndex]?.map((cell) => textValue(cell).toLowerCase()) || [];
  if (nextRow.some((cell) => cell.includes('cash')) || nextRow.some((cell) => cell.includes('qris'))) startIndex += 1;

  return rows.slice(startIndex).flatMap((row) => {
    const date = normalizeDate(rowValue(row, dateIndex));
    if (!date) return [];

    const expense = Math.round(toNumber(rowValue(row, expenseIndex)));
    const paymentMethod = inferExpensePaymentMethod({ note: textValue(rowValue(row, noteIndex)) });
    const expenseBreakdown = expensePaymentFields(expense, paymentMethod);

    return [withFormula({
      date,
      incomeId: undefined,
      gross: Math.round(toNumber(rowValue(row, grossIndex))),
      discount: Math.round(toNumber(rowValue(row, discountIndex))),
      received: Math.round(toNumber(rowValue(row, receivedIndex))),
      cogs: Math.round(toNumber(rowValue(row, cogsIndex))),
      productProfit: 0,
      fixedCost: Math.round(toNumber(rowValue(row, fixedCostIndex))),
      expense,
      notes: textValue(rowValue(row, noteIndex)),
      profitLoss: 0,
      cash: Math.round(toNumber(rowValue(row, cashIndex))),
      qris: Math.round(toNumber(rowValue(row, qrisIndex))),
      deliveryTax: Math.round(toNumber(rowValue(row, deliveryTaxIndex))),
      cashExpense: expenseBreakdown.cash,
      qrisExpense: expenseBreakdown.qris,
      expectedCash: 0,
      expectedQris: 0,
      actualCash: 0,
      actualQris: 0,
      actualCashEntered: false,
      actualQrisEntered: false,
      cashDifference: 0,
      qrisDifference: 0,
      total: 0,
      transactions: Math.round(toNumber(rowValue(row, transactionIndex))),
    })];
  });
}

function loadXlsxLibrary() {
  if (window.XLSX) return Promise.resolve(window.XLSX);

  return new Promise<any>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    script.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error('Excel parser failed to load'));
    script.onerror = () => reject(new Error('Excel parser failed to load'));
    document.head.appendChild(script);
  });
}

export function MonthlyOperationsReportView() {
  const [incomeRecords, setIncomeRecords] = useState<EditableIncomeRecord[]>(loadLocalIncome);
  const [expenseRecords, setExpenseRecords] = useState<EditableExpenseRecord[]>(loadLocalExpenses);
  const [fixedCostDaily, setFixedCostDaily] = useState(loadLocalFixedCostDaily);
  const [isEditing, setIsEditing] = useState(false);
  const [draftRows, setDraftRows] = useState<DailyReportRow[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [income, expenses, settings] = await Promise.all([
          loadJsonRows<EditableIncomeRecord>(FINANCE_TABLES.income),
          loadJsonRows<EditableExpenseRecord>(FINANCE_TABLES.expenses),
          loadJsonRows<{ id: string; fixedCostDaily?: number }>(SETTINGS_TABLE),
        ]);
        const validIncome = income.filter((record) => isValidDateString(record.date));
        const validExpenses = expenses.filter((record) => isValidDateString(record.date)).map(normalizeExpensePayment);
        if (shouldResetFinanceRows(validIncome)) {
          const seededIncome = seedIncomeRecords();
          setIncomeRecords(seededIncome);
          void replaceJsonRows(FINANCE_TABLES.income, seededIncome).catch((error) => console.warn('Monthly report seed sync skipped:', error));
        } else {
          setIncomeRecords(validIncome);
        }
        if (shouldResetFinanceRows(validExpenses)) {
          const seededExpenses = seedExpenseRecords();
          setExpenseRecords(seededExpenses);
          void replaceJsonRows(FINANCE_TABLES.expenses, seededExpenses).catch((error) => console.warn('Monthly report seed sync skipped:', error));
        } else {
          setExpenseRecords(validExpenses);
        }
        const financeSettings = settings.find((item) => item.id === 'finance');
        if (financeSettings?.fixedCostDaily) {
          setFixedCostDaily(financeSettings.fixedCostDaily);
          window.localStorage.setItem('nook-fixed-cost-daily', String(financeSettings.fixedCostDaily));
        }
      } catch (error) {
        console.warn('Monthly report sync skipped:', error);
      }
    })();
  }, []);

  const months = useMemo(() => {
    return [...new Set([...incomeRecords, ...expenseRecords].map((record) => monthKey(record.date)).filter(Boolean))].sort();
  }, [expenseRecords, incomeRecords]);
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1] || '');

  useEffect(() => {
    if (!selectedMonth || !months.includes(selectedMonth)) setSelectedMonth(months[months.length - 1] || '');
  }, [months, selectedMonth]);

  const dailyRows = useMemo(() => buildDailyRows(incomeRecords, expenseRecords, selectedMonth, fixedCostDaily), [expenseRecords, fixedCostDaily, incomeRecords, selectedMonth]);
  const activeRows = isEditing ? draftRows.map(withFormula) : dailyRows;
  const activeDays = activeRows.filter((row) => row.gross || row.received || row.expense).length || 1;
  const summary = {
    cash: sum(activeRows.map((row) => row.actualCash)),
    qris: sum(activeRows.map((row) => row.actualQris)),
    expectedCash: sum(activeRows.map((row) => row.expectedCash)),
    expectedQris: sum(activeRows.map((row) => row.expectedQris)),
    cashDifference: sum(activeRows.map((row) => row.cashDifference)),
    qrisDifference: sum(activeRows.map((row) => row.qrisDifference)),
    deliveryTax: sum(activeRows.map((row) => row.deliveryTax)),
    total: sum(activeRows.map((row) => row.total)),
    transactions: sum(activeRows.map((row) => row.transactions)),
    gross: sum(activeRows.map((row) => row.gross)),
    discount: sum(activeRows.map((row) => row.discount)),
    received: sum(activeRows.map((row) => row.received)),
    cogs: sum(activeRows.map((row) => row.cogs)),
    productProfit: sum(activeRows.map((row) => row.productProfit)),
    fixedCost: sum(activeRows.map((row) => row.fixedCost)),
    expenses: sum(activeRows.map((row) => row.expense)),
    cashExpense: sum(activeRows.map((row) => row.cashExpense)),
    qrisExpense: sum(activeRows.map((row) => row.qrisExpense)),
  };
  const totalNetProfit = summary.productProfit - summary.fixedCost - summary.expenses;
  const selectedLabel = selectedMonth ? format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy') : 'No Data';
  const latestInputIndex = (() => {
    for (let index = activeRows.length - 1; index >= 0; index -= 1) {
      if (activeRows[index].actualCashEntered || activeRows[index].actualQrisEntered) return index;
    }
    return activeRows.length - 1;
  })();
  const latestInputRow = latestInputIndex >= 0 ? activeRows[latestInputIndex] : undefined;
  const monthlyExpectedCash = summary.expectedCash;
  const monthlyExpectedQris = summary.expectedQris;
  const latestActualCash = latestInputRow?.actualCash ?? 0;
  const latestActualQris = latestInputRow?.actualQris ?? 0;

  useEffect(() => {
    if (!isEditing) setDraftRows(dailyRows);
  }, [dailyRows, isEditing]);

  const updateDailyRow = (index: number, updates: Partial<DailyReportRow>) => {
    setDraftRows((current) => {
      const source = isEditing ? current : dailyRows;
      return source.map((row, rowIndex) => {
        if (rowIndex !== index) return row;
        return withFormula({
          ...row,
          ...updates,
          actualCashEntered: 'actualCash' in updates ? true : row.actualCashEntered,
          actualQrisEntered: 'actualQris' in updates ? true : row.actualQrisEntered,
        });
      });
    });
    if (!isEditing) setIsEditing(true);
  };

  const updateLatestActual = (updates: Pick<DailyReportRow, 'actualCash'> | Pick<DailyReportRow, 'actualQris'>) => {
    setDraftRows((current) => {
      const source = isEditing ? current : dailyRows;
      const targetIndex = (() => {
        for (let index = source.length - 1; index >= 0; index -= 1) {
          if (source[index].actualCashEntered || source[index].actualQrisEntered) return index;
        }
        return source.length - 1;
      })();
      const next = targetIndex >= 0
        ? source.map((row, rowIndex) => {
          if (rowIndex !== targetIndex) return row;
          return withFormula({
            ...row,
            ...updates,
            actualCashEntered: 'actualCash' in updates ? true : row.actualCashEntered,
            actualQrisEntered: 'actualQris' in updates ? true : row.actualQrisEntered,
          });
        })
        : [withFormula({
          ...blankDailyRow(selectedMonth ? `${selectedMonth}-01` : new Date().toISOString().slice(0, 10)),
          ...updates,
          actualCashEntered: 'actualCash' in updates,
          actualQrisEntered: 'actualQris' in updates,
        })];
      return next.sort((a, b) => a.date.localeCompare(b.date));
    });
    if (!isEditing) setIsEditing(true);
  };

  const importRows = async (rows: DailyReportRow[]) => {
    const validRows = rows.map(withFormula).filter((row) => isValidDateString(row.date));
    const { income, expenses } = rowsToFinanceRecords(validRows, incomeRecords);
    const nextIncome = mergeById(incomeRecords, income);
    const nextExpenses = mergeById(expenseRecords, expenses);
    setIncomeRecords(nextIncome);
    setExpenseRecords(nextExpenses);
    window.localStorage.setItem('nook-finance-income-records', JSON.stringify(nextIncome));
    window.localStorage.setItem('nook-finance-expense-records', JSON.stringify(nextExpenses));
    await Promise.all([
      upsertJsonRows(FINANCE_TABLES.income, income),
      upsertJsonRows(FINANCE_TABLES.expenses, expenses),
    ]);
  };

  const saveDraft = async () => {
    try {
      const { income } = rowsToFinanceRecords(draftRows.map(withFormula), incomeRecords);
      const nextIncome = mergeById(incomeRecords, income);
      setIncomeRecords(nextIncome);
      window.localStorage.setItem('nook-finance-income-records', JSON.stringify(nextIncome));
      await upsertJsonRows(FINANCE_TABLES.income, income);
      setIsEditing(false);
      toast.success('Monthly report saved');
    } catch (error) {
      console.warn('Monthly report save failed:', error);
      toast.error('Report was saved locally, but Supabase sync failed');
    }
  };

  const importExcel = async (file: File) => {
    try {
      const XLSX = await loadXlsxLibrary();
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const importedRows = (workbook.SheetNames || [])
        .flatMap((name: string) => parseDailyFinanceRows(window.XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, raw: true, defval: null }) as unknown[][]));
      if (!importedRows.length) {
        toast.error('No readable monthly report rows found');
        return;
      }
      await importRows(importedRows);
      const latestMonth = importedRows.map((row) => monthKey(row.date)).sort().at(-1);
      if (latestMonth) setSelectedMonth(latestMonth);
      toast.success(`Imported ${importedRows.length} daily rows`);
    } catch (error) {
      console.warn('Monthly report import failed:', error);
      toast.error(error instanceof Error ? error.message : 'Excel import failed');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">NOOK BREW.Monthly Operations</h1>
          <p className="text-3xl font-light tracking-tight text-foreground md:text-4xl">Cash, QRIS & Profit Report</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full rounded-sm border-border bg-card sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {months.map((month) => (
                <SelectItem key={month} value={month}>{format(parseISO(`${month}-01`), 'MMM yyyy')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-sm border border-border bg-card px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground hover:border-foreground">
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importExcel(file);
                event.currentTarget.value = '';
              }}
            />
          </label>
          {isEditing ? (
            <>
              <Button type="button" variant="outline" onClick={() => { setDraftRows(dailyRows); setIsEditing(false); }} className="h-10 rounded-sm border-border bg-transparent text-[10px] uppercase tracking-[0.2em]">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="button" onClick={saveDraft} className="h-10 rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard icon={WalletCards} label="Expected Cash" value={formatMoney(monthlyExpectedCash)} />
        <EditableMetricCard icon={WalletCards} label="Latest Actual Cash" value={latestActualCash} onChange={(value) => updateLatestActual({ actualCash: value })} />
        <MetricCard icon={BarChart3} label="Cash Difference" value={formatMoney(latestActualCash - monthlyExpectedCash)} />
        <MetricCard icon={WalletCards} label="Expected QRIS" value={formatMoney(monthlyExpectedQris)} />
        <EditableMetricCard icon={WalletCards} label="Latest Actual QRIS" value={latestActualQris} onChange={(value) => updateLatestActual({ actualQris: value })} />
        <MetricCard icon={BarChart3} label="QRIS Difference" value={formatMoney(latestActualQris - monthlyExpectedQris)} />
      </div>

      <DailyReportTable rows={activeRows} onChangeRow={updateDailyRow} />

      <div className="max-w-5xl">
        <ReportSummaryCard
          monthLabel={selectedLabel}
          rows={[
            ['Total Gross Revenue', formatMoney(summary.gross)],
            ['Discount', formatMoney(summary.discount), 'danger'],
            ['Money Received', formatMoney(summary.received)],
            ['COGS', formatMoney(summary.cogs), 'danger'],
            ['Product Profit', formatMoney(summary.productProfit)],
            ['Fixed Cost', formatMoney(summary.fixedCost), 'danger'],
            ['Other Expenses', formatMoney(summary.expenses), 'danger'],
            ['Cash Expenses', formatMoney(summary.cashExpense), 'danger'],
            ['QRIS Expenses', formatMoney(summary.qrisExpense), 'danger'],
            ['Total Cash + QRIS', formatMoney(summary.total)],
            ['Latest Actual Cash', formatMoney(latestActualCash)],
            ['Latest Actual QRIS', formatMoney(latestActualQris)],
            ['Total Net Profit', formatMoney(totalNetProfit), 'total'],
          ]}
        />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof FileSpreadsheet; label: string; value: string }) {
  return (
    <Card className="rounded-sm border-border bg-card p-5 shadow-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <p className="mt-4 font-mono text-2xl text-foreground">{value}</p>
    </Card>
  );
}

function EditableMetricCard({ icon: Icon, label, value, onChange }: { icon: typeof FileSpreadsheet; label: string; value: number; onChange: (value: number) => void }) {
  return (
    <Card className="rounded-sm border-border bg-card p-5 shadow-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <Input
        inputMode="numeric"
        value={formatInputNumber(value)}
        onChange={(event) => onChange(toNumber(event.target.value))}
        className="mt-4 h-14 rounded-sm border-border bg-background px-3 font-mono text-2xl text-foreground"
      />
    </Card>
  );
}

function ReportSummaryCard({ monthLabel, rows }: { monthLabel: string; rows: Array<[string, string, ('danger' | 'total')?]> }) {
  return (
    <Card className="overflow-hidden rounded-sm border-border bg-card shadow-none">
      <div className="border-b border-border bg-muted/60 px-4 py-3 text-sm font-bold text-foreground">
        Report {monthLabel}
      </div>
      <div className="divide-y divide-border/70">
        {rows.map(([label, value, tone]) => (
          <div key={label} className={tone === 'total' ? 'grid grid-cols-[1fr_auto] gap-4 bg-blue-950/30 px-4 py-2 text-sm' : 'grid grid-cols-[1fr_auto] gap-4 px-4 py-2 text-sm'}>
            <span className={tone === 'danger' ? 'font-semibold text-red-500' : 'text-foreground'}>{label}</span>
            <span className={tone === 'danger' ? 'font-mono font-semibold text-red-500' : 'font-mono text-foreground'}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DailyReportTable({
  rows,
  onChangeRow,
}: {
  rows: DailyReportRow[];
  onChangeRow: (index: number, updates: Partial<DailyReportRow>) => void;
}) {
  const columns = 'grid-cols-[126px_138px_112px_132px_112px_170px_132px_132px_132px_132px_132px]';
  return (
    <Card className="overflow-x-auto rounded-sm border-border bg-card shadow-none">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Daily Detail</span>
      </div>
      <div className="min-w-[1420px]">
        <div className={`grid ${columns} border-b border-border bg-muted/60 text-[10px] font-bold text-foreground`}>
          {['Tanggal', 'Pendapatan Kotor', 'Diskon', 'Uang Diterima', 'HPP', 'Keuntungan Bersih', 'Fix Cost Daily', 'Laba/Rugi', 'Cash', 'QRIS', 'Total Cash + QRIS'].map((label) => (
            <span key={label} className="border-r border-border px-3 py-3 last:border-r-0">{label}</span>
          ))}
        </div>
        {rows.map((row, index) => (
          <div key={`${row.date}-${index}`} className={`${columns} grid border-b border-border/70 text-xs text-foreground`}>
            <EditableDateCell value={row.date} onChange={(value) => onChangeRow(index, { date: value })} />
            <EditableMoneyCell value={row.gross} onChange={(value) => onChangeRow(index, { gross: value })} />
            <EditableMoneyCell value={row.discount} onChange={(value) => onChangeRow(index, { discount: value })} />
            <MoneyCell value={row.received} />
            <EditableMoneyCell value={row.cogs} onChange={(value) => onChangeRow(index, { cogs: value })} />
            <MoneyCell value={row.productProfit} negativeParens />
            <MoneyCell value={row.fixedCost} />
            <MoneyCell value={row.profitLoss} negativeParens />
            <EditableMoneyCell value={row.cash} onChange={(value) => onChangeRow(index, { cash: value })} />
            <EditableMoneyCell value={row.qris} onChange={(value) => onChangeRow(index, { qris: value })} />
            <MoneyCell value={row.total} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return <span className="min-h-10 border-r border-border/70 px-3 py-2 last:border-r-0">{children}</span>;
}

function EditableDateCell({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <span className="min-h-10 border-r border-border/70 p-1.5 last:border-r-0">
      <Input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 rounded-sm border-border bg-background px-2 text-xs"
      />
    </span>
  );
}

function EditableMoneyCell({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <span className="min-h-10 border-r border-border/70 p-1.5 last:border-r-0">
      <Input
        inputMode="numeric"
        value={formatInputNumber(value)}
        onChange={(event) => onChange(toNumber(event.target.value))}
        className="h-8 rounded-sm border-border bg-background px-2 font-mono text-xs"
      />
    </span>
  );
}

function MoneyCell({ value, negativeParens = false }: { value: number; negativeParens?: boolean }) {
  const formatted = value < 0 && negativeParens
    ? `(${formatMoney(Math.abs(value)).replace('Rp', '').trim()})`
    : formatMoney(value);
  return <Cell>{value ? formatted : '-'}</Cell>;
}
