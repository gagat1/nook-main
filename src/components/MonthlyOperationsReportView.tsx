import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowLeftRight, ArrowUpDown, BarChart3, FileSpreadsheet, Plus, Save, Trash2, Upload, WalletCards, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpenseRecord, IncomeRecord } from '../data/nookFinance';
import { seedExpenseRecords, seedIncomeRecords } from '../lib/financeSeed';
import { expensePaymentBreakdown, expensePaymentFields, inferExpensePaymentMethod, normalizeExpensePayment, type FinancePaymentMethod } from '../lib/financePayments';
import { CASH_MOVEMENT_SETTINGS_ID, LOCAL_CASH_MOVEMENTS_KEY, loadLocalCashMovements, movementDelta, normalizeCashMovements, type CashMovement, type CashMovementDirection } from '../lib/cashMovements';
import { deleteJsonRow, loadJsonRows, saveSingleton, upsertJsonRow, upsertJsonRows } from '../lib/supabaseSync';

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

function nextMonthKey(month: string) {
  const baseDate = month ? new Date(`${month}-01T00:00:00`) : new Date();
  baseDate.setMonth(baseDate.getMonth() + 1);
  return `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}`;
}

function monthDates(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);
  if (!year || !monthNumber) return [];

  const totalDays = new Date(year, monthNumber, 0).getDate();
  return Array.from({ length: totalDays }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`);
}

function excelSerialToDate(serial: number) {
  const epoch = new Date(Date.UTC(1899, 11, 30));
  epoch.setUTCDate(epoch.getUTCDate() + Math.floor(serial));
  return epoch.toISOString().slice(0, 10);
}

function dateToLocalKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
    const date = dateToLocalKey(value);
    return isValidDateString(date) ? date : '';
  }
  if (typeof value === 'number') {
    if (value < 25000 || value > 60000) return '';
    const date = excelSerialToDate(value);
    return isValidDateString(date) ? date : '';
  }
  if (typeof value === 'string') {
    const isoDate = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoDate) return isValidDateString(isoDate[1]) ? isoDate[1] : '';
    const shortDate = parseShortDate(value);
    if (shortDate) return shortDate;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const date = dateToLocalKey(parsed);
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
      return records;
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
      return records;
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

function blankDailyRow(date: string, fixedCost = 0): DailyReportRow {
  return withFormula({
    date,
    incomeId: undefined,
    gross: 0,
    discount: 0,
    received: 0,
    cogs: 0,
    productProfit: 0,
    fixedCost,
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
  const [cashMovements, setCashMovements] = useState<CashMovement[]>(() => loadLocalCashMovements(isValidDateString));
  const [fixedCostDaily, setFixedCostDaily] = useState(loadLocalFixedCostDaily);
  const [isEditing, setIsEditing] = useState(false);
  const [draftRows, setDraftRows] = useState<DailyReportRow[]>([]);
  const [isAddingMonth, setIsAddingMonth] = useState(false);
  const [manualMonths, setManualMonths] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [income, expenses, settings] = await Promise.all([
          loadJsonRows<EditableIncomeRecord>(FINANCE_TABLES.income),
          loadJsonRows<EditableExpenseRecord>(FINANCE_TABLES.expenses),
          loadJsonRows<{ id: string; fixedCostDaily?: number; movements?: CashMovement[] }>(SETTINGS_TABLE),
        ]);
        const validIncome = income.filter((record) => isValidDateString(record.date));
        const validExpenses = expenses.filter((record) => isValidDateString(record.date)).map(normalizeExpensePayment);
        setIncomeRecords(validIncome);
        setExpenseRecords(validExpenses);
        const financeSettings = settings.find((item) => item.id === 'finance');
        if (financeSettings?.fixedCostDaily) {
          setFixedCostDaily(financeSettings.fixedCostDaily);
          window.localStorage.setItem('nook-fixed-cost-daily', String(financeSettings.fixedCostDaily));
        }
        const movementSettings = settings.find((item) => item.id === CASH_MOVEMENT_SETTINGS_ID);
        if (movementSettings?.movements) {
          const syncedMovements = normalizeCashMovements(movementSettings.movements, isValidDateString);
          setCashMovements(syncedMovements);
          window.localStorage.setItem(LOCAL_CASH_MOVEMENTS_KEY, JSON.stringify(syncedMovements));
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
  const [newMonth, setNewMonth] = useState(nextMonthKey(months[months.length - 1] || ''));
  const availableMonths = useMemo(() => {
    return [...new Set([...months, ...manualMonths, selectedMonth].filter(Boolean))].sort();
  }, [manualMonths, months, selectedMonth]);

  useEffect(() => {
    if (!selectedMonth || !availableMonths.includes(selectedMonth)) setSelectedMonth(availableMonths[availableMonths.length - 1] || '');
  }, [availableMonths, selectedMonth]);

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
  const totalNetProfit = summary.gross - summary.cogs - summary.discount - summary.fixedCost;
  const selectedMonthMovements = useMemo(() => {
    return cashMovements
      .filter((movement) => monthKey(movement.date) === selectedMonth)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [cashMovements, selectedMonth]);
  const selectedMovementDelta = movementDelta(selectedMonthMovements);
  const selectedMonthExpenses = useMemo(() => {
    return expenseRecords
      .filter((expense) => monthKey(expense.date) === selectedMonth)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenseRecords, selectedMonth]);
  const selectedLabel = selectedMonth ? format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy') : 'No Data';
  const latestInputIndex = (() => {
    for (let index = activeRows.length - 1; index >= 0; index -= 1) {
      if (activeRows[index].actualCashEntered || activeRows[index].actualQrisEntered) return index;
    }
    return activeRows.length - 1;
  })();
  const latestInputRow = latestInputIndex >= 0 ? activeRows[latestInputIndex] : undefined;
  const monthlyExpectedCash = summary.expectedCash + selectedMovementDelta.cash;
  const monthlyExpectedQris = summary.expectedQris + selectedMovementDelta.qris;
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
      const workbook = XLSX.read(data, { type: 'array', cellDates: false });
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

  const createMonth = async () => {
    if (!/^\d{4}-\d{2}$/.test(newMonth)) {
      toast.error('Choose a valid month');
      return;
    }

    const monthRows = monthDates(newMonth).map((date) => blankDailyRow(date, fixedCostDaily));

    if (!monthRows.length) {
      toast.error('Could not create this month');
      return;
    }

    const { income } = rowsToFinanceRecords(monthRows, incomeRecords);
    const nextIncome = mergeById(incomeRecords, income);
    setIncomeRecords(nextIncome);
    setManualMonths((current) => [...new Set([...current, newMonth])]);
    setSelectedMonth(newMonth);
    setDraftRows(monthRows);
    setIsEditing(false);
    window.localStorage.setItem('nook-finance-income-records', JSON.stringify(nextIncome));

    try {
      await upsertJsonRows(FINANCE_TABLES.income, income);
      toast.success(`${format(parseISO(`${newMonth}-01`), 'MMMM yyyy')} created`);
      setNewMonth(nextMonthKey(newMonth));
      setIsAddingMonth(false);
    } catch (error) {
      console.warn('Create month failed:', error);
      toast.error('Month was created locally, but Supabase sync failed');
    }
  };

  const persistCashMovements = (nextMovements: CashMovement[]) => {
    const normalized = normalizeCashMovements(nextMovements, isValidDateString);
    setCashMovements(normalized);
    window.localStorage.setItem(LOCAL_CASH_MOVEMENTS_KEY, JSON.stringify(normalized));
    void saveSingleton(SETTINGS_TABLE, CASH_MOVEMENT_SETTINGS_ID, { movements: normalized }).catch((error) => {
      console.warn('Cash movement sync failed:', error);
      toast.error('Cash movement was saved locally, but Supabase sync failed');
    });
  };

  const addCashMovement = (movement: Omit<CashMovement, 'id'>) => {
    persistCashMovements([
      ...cashMovements,
      { ...movement, id: `cash-movement-${Date.now()}` },
    ]);
    toast.success('Cash movement added');
  };

  const updateCashMovement = (id: string, updates: Partial<CashMovement>) => {
    persistCashMovements(cashMovements.map((movement) => (
      movement.id === id ? { ...movement, ...updates } : movement
    )));
  };

  const deleteCashMovement = (id: string) => {
    persistCashMovements(cashMovements.filter((movement) => movement.id !== id));
    toast.info('Cash movement deleted');
  };

  const persistExpenses = (nextExpenses: EditableExpenseRecord[]) => {
    setExpenseRecords(nextExpenses);
    window.localStorage.setItem('nook-finance-expense-records', JSON.stringify(nextExpenses));
  };

  const addExpense = async (record: ExpenseRecord) => {
    const nextRecord = normalizeExpensePayment({ ...record, id: `manual-expense-${Date.now()}` });
    const nextExpenses = [...expenseRecords, nextRecord].filter((expense) => isValidDateString(expense.date));
    persistExpenses(nextExpenses);

    try {
      await upsertJsonRow(FINANCE_TABLES.expenses, nextRecord);
      toast.success('Expense saved');
    } catch (error) {
      console.warn('Expense save failed:', error);
      toast.error('Expense was saved locally, but Supabase sync failed');
    }
  };

  const updateExpense = (id: string, updates: Partial<ExpenseRecord>) => {
    setExpenseRecords((current) => {
      const nextExpenses = current.map((record) => {
        if (record.id !== id) return record;
        const nextRecord = normalizeExpensePayment({ ...record, ...updates });
        void upsertJsonRow(FINANCE_TABLES.expenses, nextRecord).catch((error) => {
          console.warn('Expense update failed:', error);
          toast.error('Expense was updated locally, but Supabase sync failed');
        });
        return nextRecord;
      });
      window.localStorage.setItem('nook-finance-expense-records', JSON.stringify(nextExpenses));
      return nextExpenses;
    });
    toast.success('Expense updated');
  };

  const deleteExpense = (id: string) => {
    const nextExpenses = expenseRecords.filter((record) => record.id !== id);
    persistExpenses(nextExpenses);
    void deleteJsonRow(FINANCE_TABLES.expenses, id).catch((error) => {
      console.warn('Expense delete failed:', error);
      toast.error('Expense was deleted locally, but Supabase sync failed');
    });
    toast.info('Expense deleted');
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
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>{format(parseISO(`${month}-01`), 'MMM yyyy')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAddingMonth ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="month"
                value={newMonth}
                onChange={(event) => setNewMonth(event.target.value)}
                className="h-10 rounded-sm border-border bg-card sm:w-[160px]"
              />
              <Button type="button" onClick={createMonth} className="h-10 rounded-sm bg-foreground px-4 text-[10px] uppercase tracking-[0.2em] text-background">
                Create
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingMonth(false)} className="h-10 rounded-sm border-border bg-transparent px-4 text-[10px] uppercase tracking-[0.2em]">
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="button" variant="outline" onClick={() => { setNewMonth(nextMonthKey(selectedMonth || months[months.length - 1] || '')); setIsAddingMonth(true); }} className="h-10 rounded-sm border-border bg-card px-4 text-[10px] uppercase tracking-[0.2em] text-foreground hover:border-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add Month
            </Button>
          )}
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

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
        <ReportSummaryCard
          monthLabel={selectedLabel}
          rows={[
            ['Total Gross Revenue', formatMoney(summary.gross)],
            ['COGS', formatMoney(summary.cogs), 'danger'],
            ['Discount', formatMoney(summary.discount), 'danger'],
            ['Fixed Cost', formatMoney(summary.fixedCost), 'danger'],
            ['Total Net Profit', formatMoney(totalNetProfit), 'total'],
          ]}
        />
        <CashMovementPanel
          movements={selectedMonthMovements}
          delta={selectedMovementDelta}
          onAdd={addCashMovement}
          onUpdate={updateCashMovement}
          onDelete={deleteCashMovement}
        />
      </div>

      <ExpenseTransactionsSection
        expenses={selectedMonthExpenses}
        onAdd={addExpense}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />
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

function CashMovementPanel({
  movements,
  delta,
  onAdd,
  onUpdate,
  onDelete,
}: {
  movements: CashMovement[];
  delta: { cash: number; qris: number };
  onAdd: (movement: Omit<CashMovement, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CashMovement>) => void;
  onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState(dateToLocalKey(new Date()));
  const [direction, setDirection] = useState<CashMovementDirection>('cash-to-qris');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  const submitMovement = () => {
    if (!isValidDateString(date) || amount <= 0) {
      toast.error('Date and amount are required');
      return;
    }
    onAdd({
      date,
      direction,
      amount: Math.round(amount),
      note: note.trim(),
    });
    setAmount(0);
    setNote('');
  };

  return (
    <Card className="overflow-hidden rounded-sm border-border bg-card shadow-none">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cash Movement</h3>
          <p className="mt-2 text-xs text-muted-foreground">Move balance between Cash and QRIS.</p>
        </div>
        <ArrowLeftRight className="h-4 w-4 text-foreground" />
      </div>

      <div className="space-y-5 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-10 rounded-sm border-border bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Direction</Label>
            <Select value={direction} onValueChange={(value) => setDirection(value as CashMovementDirection)}>
              <SelectTrigger className="h-10 rounded-sm border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                <SelectItem value="cash-to-qris">Cash to QRIS</SelectItem>
                <SelectItem value="qris-to-cash">QRIS to Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Amount</Label>
            <Input inputMode="numeric" value={formatInputNumber(amount)} onChange={(event) => setAmount(toNumber(event.target.value))} className="h-10 rounded-sm border-border bg-background font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Note</Label>
            <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional" className="h-10 rounded-sm border-border bg-background" />
          </div>
        </div>

        <Button type="button" onClick={submitMovement} className="h-10 w-full rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background">
          Add Movement
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-sm border border-border bg-background p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cash Impact</p>
            <p className="mt-2 font-mono text-sm text-foreground">{formatMoney(delta.cash)}</p>
          </div>
          <div className="rounded-sm border border-border bg-background p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">QRIS Impact</p>
            <p className="mt-2 font-mono text-sm text-foreground">{formatMoney(delta.qris)}</p>
          </div>
        </div>

        <div className="max-h-[320px] overflow-auto rounded-sm border border-border">
          <div className="grid min-w-[520px] grid-cols-[115px_135px_120px_1fr_42px] border-b border-border bg-background text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {['Date', 'Direction', 'Amount', 'Note', ''].map((label) => (
              <span key={label} className="border-r border-border px-3 py-3 last:border-r-0">{label}</span>
            ))}
          </div>
          {movements.length ? movements.map((movement) => (
            <div key={movement.id} className="grid min-w-[520px] grid-cols-[115px_135px_120px_1fr_42px] border-b border-border/70 text-xs last:border-b-0">
              <span className="border-r border-border/70 p-1.5">
                <Input type="date" value={movement.date} onChange={(event) => onUpdate(movement.id, { date: event.target.value })} className="h-8 rounded-sm border-border bg-background px-2 text-xs" />
              </span>
              <span className="border-r border-border/70 p-1.5">
                <Select value={movement.direction} onValueChange={(value) => onUpdate(movement.id, { direction: value as CashMovementDirection })}>
                  <SelectTrigger className="h-8 rounded-sm border-border bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-foreground">
                    <SelectItem value="cash-to-qris">Cash to QRIS</SelectItem>
                    <SelectItem value="qris-to-cash">QRIS to Cash</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              <span className="border-r border-border/70 p-1.5">
                <Input inputMode="numeric" value={formatInputNumber(movement.amount)} onChange={(event) => onUpdate(movement.id, { amount: toNumber(event.target.value) })} className="h-8 rounded-sm border-border bg-background px-2 font-mono text-xs" />
              </span>
              <span className="border-r border-border/70 p-1.5">
                <Input value={movement.note} onChange={(event) => onUpdate(movement.id, { note: event.target.value })} className="h-8 rounded-sm border-border bg-background px-2 text-xs" />
              </span>
              <button type="button" onClick={() => onDelete(movement.id)} className="flex items-center justify-center text-muted-foreground hover:text-red-500" aria-label="Delete cash movement">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )) : (
            <div className="px-4 py-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              No cash movement yet
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ExpenseTransactionsSection({
  expenses,
  onAdd,
  onUpdate,
  onDelete,
}: {
  expenses: EditableExpenseRecord[];
  onAdd: (record: ExpenseRecord) => void;
  onUpdate: (id: string, updates: Partial<ExpenseRecord>) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <ExpenseEntryForm onSubmit={onAdd} />
      <ExpenseHistory expenses={expenses} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}

function ExpenseEntryForm({ onSubmit }: { onSubmit: (record: ExpenseRecord) => void }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const date = String(formData.get('date') || '');
    const item = String(formData.get('item') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const amount = toNumber(formData.get('amount'));
    const tax = toNumber(formData.get('tax'));
    const fee = toNumber(formData.get('fee'));
    const cogs = toNumber(formData.get('cogs'));
    const note = String(formData.get('note') || '').trim();
    const paymentMethod = String(formData.get('paymentMethod') || 'cash') as FinancePaymentMethod;

    if (!date || !item || !category || amount <= 0) {
      toast.error('Date, item, category, and amount are required');
      return;
    }

    const net = amount + tax + fee;
    onSubmit({
      date,
      item,
      product: item,
      category,
      gross: amount,
      discount: 0,
      tax,
      fee,
      net,
      cogs,
      note,
      ...expensePaymentFields(net, paymentMethod),
    });
    form.reset();
  };

  return (
    <Card className="rounded-sm border-border bg-card p-5 shadow-none">
      <div className="mb-5 flex items-center gap-3">
        <Plus className="h-4 w-4 text-red-500" />
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Add Expense</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
            <Input name="date" type="date" required className="h-10 rounded-sm border-border bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Payment</Label>
            <select name="paymentMethod" defaultValue="cash" className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none">
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
            <Input name="category" required placeholder="Operations" className="h-10 rounded-sm border-border bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Item</Label>
            <Input name="item" required placeholder="Milk, rent, utilities" className="h-10 rounded-sm border-border bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Amount</Label>
            <Input name="amount" inputMode="numeric" required className="h-10 rounded-sm border-border bg-background font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tax</Label>
              <Input name="tax" inputMode="numeric" defaultValue="0" className="h-10 rounded-sm border-border bg-background font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Fee</Label>
              <Input name="fee" inputMode="numeric" defaultValue="0" className="h-10 rounded-sm border-border bg-background font-mono" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">COGS / HPP</Label>
            <Input name="cogs" inputMode="numeric" defaultValue="0" className="h-10 rounded-sm border-border bg-background font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Note</Label>
            <Input name="note" placeholder="Optional" className="h-10 rounded-sm border-border bg-background" />
          </div>
        </div>
        <Button type="submit" className="h-10 w-full rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background md:w-auto">
          Add Expense
        </Button>
      </form>
    </Card>
  );
}

function ExpenseHistory({
  expenses,
  onUpdate,
  onDelete,
}: {
  expenses: EditableExpenseRecord[];
  onUpdate: (id: string, updates: Partial<ExpenseRecord>) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');
  const [draft, setDraft] = useState({
    date: '',
    item: '',
    category: '',
    gross: 0,
    tax: 0,
    fee: 0,
    cogs: 0,
    note: '',
    paymentMethod: 'cash' as FinancePaymentMethod,
  });

  const beginEdit = (expense: EditableExpenseRecord) => {
    setEditingId(expense.id);
    setDraft({
      date: expense.date,
      item: expense.item,
      category: expense.category,
      gross: expense.gross,
      tax: expense.tax,
      fee: expense.fee,
      cogs: expense.cogs ?? 0,
      note: expense.note,
      paymentMethod: inferExpensePaymentMethod(expense),
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!draft.date || !draft.item.trim() || !draft.category.trim() || draft.gross <= 0) {
      toast.error('Date, item, category, and amount are required');
      return;
    }
    const net = draft.gross + draft.tax + draft.fee;
    onUpdate(editingId, {
      date: draft.date,
      item: draft.item,
      product: draft.item,
      category: draft.category,
      gross: draft.gross,
      tax: draft.tax,
      fee: draft.fee,
      net,
      cogs: draft.cogs,
      note: draft.note,
      ...expensePaymentFields(net, draft.paymentMethod),
    });
    setEditingId(null);
  };

  const totalExpense = expenses.reduce((total, expense) => total + expense.net, 0);
  const groupedExpenses = useMemo(() => {
    const groups = expenses.reduce((map, expense) => {
      const list = map.get(expense.date) || [];
      list.push(expense);
      map.set(expense.date, list);
      return map;
    }, new Map<string, EditableExpenseRecord[]>());

    return [...groups.entries()]
      .sort(([dateA], [dateB]) => dateSort === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA))
      .map(([date, records]) => ({
        date,
        total: records.reduce((sum, expense) => sum + expense.net, 0),
        records: records.sort((a, b) => a.item.localeCompare(b.item)),
      }));
  }, [dateSort, expenses]);

  return (
    <Card className="overflow-hidden rounded-sm border-border bg-card shadow-none">
      <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Expense History</h3>
          <p className="mt-2 text-xs text-muted-foreground">Edit or delete expenses for the selected month.</p>
        </div>
        <div className="flex flex-col gap-3 text-left sm:items-end sm:text-right">
          <button type="button" onClick={() => setDateSort((current) => current === 'asc' ? 'desc' : 'asc')} className="inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-border bg-background px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-foreground hover:border-foreground">
            Date {dateSort === 'asc' ? 'Oldest' : 'Newest'}
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{expenses.length} entries</p>
            <p className="mt-1 font-mono text-sm text-red-500">{formatMoney(totalExpense)}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[520px]">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_150px] border-b border-border bg-background text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <span className="border-r border-border px-4 py-4 text-center">Item</span>
            <span className="border-r border-border px-4 py-4 text-center">Category / Note</span>
            <span className="border-r border-border px-4 py-4 text-center">Payment</span>
            <span className="border-r border-border px-4 py-4 text-center">Amount</span>
            <span className="px-4 py-4 text-center">Action</span>
          </div>

          {groupedExpenses.length ? groupedExpenses.map((group) => (
            <div key={group.date} className="border-b border-border/70 last:border-b-0">
              <div className="flex items-center justify-between bg-muted/20 px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-foreground">{format(parseISO(group.date), 'dd MMM yyyy')}</span>
                  <span className="rounded-sm border border-border px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    {group.records.length} entries
                  </span>
                </div>
                <span className="font-mono text-sm text-red-500">{formatMoney(group.total)}</span>
              </div>

              {group.records.map((expense) => {
                const isEditing = editingId === expense.id;
                const paymentMethod = inferExpensePaymentMethod(expense);

                return (
                  <div key={expense.id} className="border-t border-border/60">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
                        <Input type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} className="h-10 rounded-sm border-border bg-background text-xs" />
                        <select value={draft.paymentMethod} onChange={(event) => setDraft((current) => ({ ...current, paymentMethod: event.target.value as FinancePaymentMethod }))} className="h-10 w-full rounded-sm border border-border bg-background px-3 text-xs text-foreground outline-none">
                          <option value="cash">Cash</option>
                          <option value="qris">QRIS</option>
                        </select>
                        <Input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} placeholder="Category" className="h-10 rounded-sm border-border bg-background text-xs" />
                        <Input value={draft.item} onChange={(event) => setDraft((current) => ({ ...current, item: event.target.value }))} placeholder="Item" className="h-10 rounded-sm border-border bg-background text-xs" />
                        <Input inputMode="numeric" value={formatInputNumber(draft.gross)} onChange={(event) => setDraft((current) => ({ ...current, gross: toNumber(event.target.value) }))} placeholder="Amount" className="h-10 rounded-sm border-border bg-background font-mono text-xs" />
                        <Input inputMode="numeric" value={formatInputNumber(draft.cogs)} onChange={(event) => setDraft((current) => ({ ...current, cogs: toNumber(event.target.value) }))} placeholder="COGS / HPP" className="h-10 rounded-sm border-border bg-background font-mono text-xs" />
                        <Input inputMode="numeric" value={formatInputNumber(draft.tax)} onChange={(event) => setDraft((current) => ({ ...current, tax: toNumber(event.target.value) }))} placeholder="Tax" className="h-10 rounded-sm border-border bg-background font-mono text-xs" />
                        <Input inputMode="numeric" value={formatInputNumber(draft.fee)} onChange={(event) => setDraft((current) => ({ ...current, fee: toNumber(event.target.value) }))} placeholder="Fee" className="h-10 rounded-sm border-border bg-background font-mono text-xs" />
                        <Input value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} placeholder="Note" className="h-10 rounded-sm border-border bg-background text-xs md:col-span-2" />
                        <div className="flex justify-end gap-2 md:col-span-2">
                          <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-9 rounded-sm border-border bg-transparent text-[10px] uppercase tracking-widest">Cancel</Button>
                          <Button type="button" onClick={saveEdit} className="h-9 rounded-sm bg-foreground text-[10px] uppercase tracking-widest text-background">Save</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_150px] items-center text-xs text-foreground">
                        <div className="min-w-0 border-r border-border/60 px-4 py-4">
                          <p className="truncate text-sm text-foreground">{expense.item}</p>
                        </div>
                        <div className="min-w-0 border-r border-border/60 px-4 py-4">
                          <p className="truncate text-xs uppercase tracking-widest text-muted-foreground">{expense.category}</p>
                          {expense.note ? <p className="mt-1 truncate text-xs text-foreground">{expense.note}</p> : null}
                        </div>
                        <div className="border-r border-border/60 px-4 py-4 text-center">
                          <span className={paymentMethod === 'cash' ? 'rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400' : 'rounded-full bg-sky-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400'}>
                            {paymentMethod}
                          </span>
                        </div>
                        <div className="border-r border-border/60 px-4 py-4">
                          <p className="font-mono text-sm text-red-500">{formatMoney(expense.net)}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-sm border border-border px-2 py-1 text-[9px] uppercase tracking-widest text-muted-foreground">Base <span className="text-foreground">{formatMoney(expense.gross)}</span></span>
                            {expense.cogs ? <span className="rounded-sm border border-border px-2 py-1 text-[9px] uppercase tracking-widest text-muted-foreground">COGS <span className="text-foreground">{formatMoney(expense.cogs)}</span></span> : null}
                            {expense.tax ? <span className="rounded-sm border border-border px-2 py-1 text-[9px] uppercase tracking-widest text-muted-foreground">Tax <span className="text-foreground">{formatMoney(expense.tax)}</span></span> : null}
                            {expense.fee ? <span className="rounded-sm border border-border px-2 py-1 text-[9px] uppercase tracking-widest text-muted-foreground">Fee <span className="text-foreground">{formatMoney(expense.fee)}</span></span> : null}
                          </div>
                        </div>
                        <div className="flex justify-center gap-2 px-4 py-4">
                          <Button type="button" variant="outline" onClick={() => beginEdit(expense)} className="h-8 rounded-sm border-border bg-transparent px-3 text-[9px] uppercase tracking-widest">Edit</Button>
                          <Button type="button" variant="outline" onClick={() => onDelete(expense.id)} className="h-8 rounded-sm border-red-900/40 bg-transparent px-3 text-[9px] uppercase tracking-widest text-red-500 hover:bg-red-950/20">Delete</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )) : (
            <div className="px-4 py-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              No expenses for this month
            </div>
          )}
        </div>
      </ScrollArea>
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
          <div key={label} className={tone === 'total' ? 'mt-4 grid grid-cols-[1fr_auto] gap-4 bg-blue-950/30 px-4 py-2 text-sm' : 'grid grid-cols-[1fr_auto] gap-4 px-4 py-2 text-sm'}>
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
