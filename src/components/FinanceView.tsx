import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowLeftRight, BarChart3, CalendarDays, Plus, ReceiptText, Trash2, TrendingUp, Upload, Wallet } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { ExpenseRecord, IncomeRecord } from '../data/nookFinance';
import { expensePaymentFields, inferExpensePaymentMethod, normalizeExpensePayment, type FinancePaymentMethod } from '../lib/financePayments';
import { isSupabaseConfigured } from '../lib/supabase';
import { seedExpenseRecords, seedIncomeRecords } from '../lib/financeSeed';
import { CASH_MOVEMENT_SETTINGS_ID, LOCAL_CASH_MOVEMENTS_KEY, loadLocalCashMovements, movementDelta, normalizeCashMovements, type CashMovement, type CashMovementDirection } from '../lib/cashMovements';
import { deleteJsonRow, loadJsonRows, saveSingleton, upsertJsonRow, upsertJsonRows } from '../lib/supabaseSync';

type PeriodSummary = {
  key: string;
  label: string;
  income: number;
  expense: number;
  profit: number;
  margin: number;
};

type EditableIncomeRecord = IncomeRecord & { id: string };
type EditableExpenseRecord = ExpenseRecord & { id: string };

const FINANCE_TABLES = {
  income: 'finance_income',
  expenses: 'finance_expenses',
};
const SETTINGS_TABLE = 'app_settings';

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
  return money.format(Math.round(value || 0));
}

function formatInputNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

function extraMetric(label: string, value: number | undefined) {
  return value == null || value === 0 ? [] : [{ label, value: formatMoney(value) }];
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function yearKey(date: string) {
  return date.slice(0, 4);
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
  if (year < 2000 || year > 2100) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function normalizeMonthName(value: string) {
  return value.slice(0, 3).toLowerCase();
}

function parseShortDate(value: string) {
  const match = value.trim().match(/^(\d{1,2})[-/\s]([a-zA-Z]{3,})[-/\s](\d{2,4})$/);
  if (!match) return '';

  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const day = Number(match[1]);
  const monthIndex = monthNames.indexOf(normalizeMonthName(match[2]));
  const rawYear = Number(match[3]);
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  if (!day || monthIndex < 0) return '';

  const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return isValidDateString(date) ? date : '';
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

function hasValidRecordDate(record: { date: string }) {
  return isValidDateString(record.date);
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

function textValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : value == null ? fallback : String(value).trim();
}

function syncError(error: unknown) {
  console.warn('Finance Supabase sync skipped:', error);
}

function identityPart(value: string | undefined) {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function incomeIdentity(record: IncomeRecord) {
  return [record.date, identityPart(record.product), identityPart(record.category)].join('|');
}

function expenseIdentity(record: ExpenseRecord) {
  return [record.date, identityPart(record.item), identityPart(record.category)].join('|');
}

function mergeFinanceRecords<T extends { id: string }>(
  current: T[],
  incoming: T[],
  getIdentity: (record: T) => string
) {
  const next = [...current];
  const indexByIdentity = new Map<string, number>();
  const removedIds: string[] = [];
  const upserts: T[] = [];
  let added = 0;
  let updated = 0;

  next.forEach((record, index) => {
    const identity = getIdentity(record);
    const existingIndex = indexByIdentity.get(identity);

    if (existingIndex == null) {
      indexByIdentity.set(identity, index);
      return;
    }

    removedIds.push(record.id);
    next[existingIndex] = { ...next[existingIndex], ...record, id: next[existingIndex].id };
    next[index] = { ...record, id: '' };
    upserts.push(next[existingIndex]);
    updated += 1;
  });

  incoming.forEach((record) => {
    const identity = getIdentity(record);
    const existingIndex = indexByIdentity.get(identity);

    if (existingIndex == null) {
      indexByIdentity.set(identity, next.length);
      next.push(record);
      upserts.push(record);
      added += 1;
      return;
    }

    const updatedRecord = { ...next[existingIndex], ...record, id: next[existingIndex].id };
    next[existingIndex] = updatedRecord;
    upserts.push(updatedRecord);
    updated += 1;
  });

  const uniqueUpserts = [...new Map(upserts.map((record) => [record.id, record])).values()];
  const uniqueRemovedIds = [...new Set(removedIds)];

  return {
    records: next.filter((record) => record.id),
    upserts: uniqueUpserts,
    removedIds: uniqueRemovedIds,
    added,
    updated,
  };
}

function persistFinanceMerge<T extends { id: string }>(table: string, upserts: T[], removedIds: string[]) {
  return Promise.all([
    upsertJsonRows(table, upserts),
    ...removedIds.map((id) => deleteJsonRow(table, id)),
  ]);
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

function readSheetRows(workbook: any, sheetName: string) {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return [];
  return window.XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, defval: null }) as unknown[][];
}

function normalizeSheetName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function readFirstMatchingSheetRows(workbook: any, sheetNames: string[]) {
  const availableNames = workbook.SheetNames || [];
  const normalizedTargets = new Set(sheetNames.map(normalizeSheetName));
  const matchedName = availableNames.find((name: string) => normalizedTargets.has(normalizeSheetName(name)));

  return matchedName ? readSheetRows(workbook, matchedName) : [];
}

function readSheetRowsContaining(workbook: any, terms: string[]) {
  const normalizedTerms = terms.map(normalizeSheetName);
  const availableNames = workbook.SheetNames || [];

  return availableNames
    .filter((name: string) => {
      const normalizedName = normalizeSheetName(name);
      return normalizedTerms.every((term) => normalizedName.includes(term));
    })
    .map((name: string) => ({ name, rows: readSheetRows(workbook, name) }));
}

function withIncomeIds(records: IncomeRecord[], prefix: string): EditableIncomeRecord[] {
  return records.map((record, index) => ({ ...record, id: `${prefix}-${index}-${record.date}` }));
}

function withExpenseIds(records: ExpenseRecord[], prefix: string): EditableExpenseRecord[] {
  return records.map((record, index) => normalizeExpensePayment({ ...record, id: `${prefix}-${index}-${record.date}` }));
}

function parseIncomeRows(rows: unknown[][]): EditableIncomeRecord[] {
  return rows.slice(6).flatMap((row, index) => {
    const date = normalizeDate(row[0]);
    const gross = toNumber(row[4]);
    const discount = toNumber(row[5]);
    const fee = toNumber(row[6]);
    const net = toNumber(row[7]) || gross - discount - fee;

    if (!date || (!gross && !discount && !fee && !net)) return [];

    return [{
      id: `import-income-${Date.now()}-${index}`,
      date,
      product: textValue(row[2], 'Sales'),
      category: textValue(row[3], 'Uncategorized'),
      gross: Math.round(gross),
      discount: Math.round(discount),
      fee: Math.round(fee),
      net: Math.round(net),
      note: textValue(row[8]),
    }];
  });
}

function parseExpenseRows(rows: unknown[][]): EditableExpenseRecord[] {
  return rows.slice(6).flatMap((row, index) => {
    const date = normalizeDate(row[0]);
    const gross = toNumber(row[4]);
    const tax = toNumber(row[5]);
    const fee = toNumber(row[6]);
    const note = textValue(row[8]);
    const net = toNumber(row[7]) || gross + tax + fee;
    const paymentMethod = inferExpensePaymentMethod({ note });

    if (!date || (!gross && !tax && !fee && !net)) return [];

    return [{
      id: `import-expense-${Date.now()}-${index}`,
      date,
      item: textValue(row[2], 'Expense'),
      category: textValue(row[3], 'Uncategorized'),
      gross: Math.round(gross),
      tax: Math.round(tax),
      fee: Math.round(fee),
      net: Math.round(net),
      note,
      ...expensePaymentFields(Math.round(net), paymentMethod),
    }];
  });
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

function parseDailyFinanceRows(rows: unknown[][], source: string) {
  const headerRowIndex = rows.findIndex((row) => {
    const cells = row.map((cell) => textValue(cell).toLowerCase());
    return cells.some((cell) => cell.includes('tanggal')) && cells.some((cell) => cell.includes('pendapatan'));
  });
  if (headerRowIndex < 0) return { income: [] as EditableIncomeRecord[], expenses: [] as EditableExpenseRecord[] };

  const headerRow = rows[headerRowIndex] || [];
  const detailRow = rows[headerRowIndex + 1] || [];
  const dateIndex = findHeaderIndex(headerRow, (cell) => cell.includes('tanggal'));
  const grossIndex = findHeaderIndex(headerRow, (cell) => cell.includes('pendapatan') && cell.includes('kotor'));
  const discountIndex = findHeaderIndex(headerRow, (cell) => cell.includes('diskon'));
  const receivedIndex = findHeaderIndex(headerRow, (cell) => cell.includes('uang') && cell.includes('diterima'));
  const cogsIndex = findHeaderIndex(headerRow, (cell) => cell === 'hpp' || cell.includes('cogs'));
  const productProfitIndex = findHeaderIndex(headerRow, (cell) => cell.includes('keuntungan') && cell.includes('produk'));
  const fixedCostIndex = findHeaderIndex(headerRow, (cell) => cell.includes('fix cost') || cell.includes('fixed cost'));
  const expenseIndex = findHeaderIndex(headerRow, (cell) => cell.includes('pengeluaran') || cell.includes('expense'));
  const noteIndex = findHeaderIndex(headerRow, (cell) => cell.includes('notes') || cell.includes('note'));
  const profitLossIndex = findHeaderIndex(headerRow, (cell) => cell.includes('laba') || cell.includes('profit') || cell.includes('loss'));
  const transactionIndex = findHeaderIndex(headerRow, (cell) => cell.includes('transaksi') || cell.includes('transaction'));
  const cashIndex = findHeaderIndex(detailRow, (cell) => cell.includes('cash'));
  const qrisIndex = findHeaderIndex(detailRow, (cell) => cell.includes('qris'));
  const deliveryTaxIndex = findHeaderIndex(detailRow, (cell) => cell.includes('grab') || cell.includes('tax'));
  if (dateIndex < 0) return { income: [] as EditableIncomeRecord[], expenses: [] as EditableExpenseRecord[] };

  let startIndex = headerRowIndex + 1;
  const nextRow = rows[startIndex]?.map((cell) => textValue(cell).toLowerCase()) || [];
  if (nextRow.some((cell) => cell.includes('cash')) || nextRow.some((cell) => cell.includes('qris'))) startIndex += 1;

  const income: EditableIncomeRecord[] = [];
  const expenses: EditableExpenseRecord[] = [];

  rows.slice(startIndex).forEach((row) => {
    const date = normalizeDate(rowValue(row, dateIndex));
    if (!date) return;

    const gross = Math.round(toNumber(rowValue(row, grossIndex)));
    const discount = Math.round(toNumber(rowValue(row, discountIndex)));
    const received = Math.round(toNumber(rowValue(row, receivedIndex)));
    const cogs = Math.round(toNumber(rowValue(row, cogsIndex)));
    const productProfit = Math.round(toNumber(rowValue(row, productProfitIndex)));
    const fixedCostDaily = Math.round(toNumber(rowValue(row, fixedCostIndex)));
    const expense = Math.round(toNumber(rowValue(row, expenseIndex)));
    const note = textValue(rowValue(row, noteIndex));
    const profitLoss = Math.round(toNumber(rowValue(row, profitLossIndex)));
    const cash = Math.round(toNumber(rowValue(row, cashIndex)));
    const qris = Math.round(toNumber(rowValue(row, qrisIndex)));
    const deliveryTax = Math.round(toNumber(rowValue(row, deliveryTaxIndex)));
    const transactionCount = Math.round(toNumber(rowValue(row, transactionIndex)));

    if (gross || discount || received || cogs || productProfit || cash || qris || deliveryTax) {
      income.push({
        id: `daily-income-${date}`,
        date,
        product: 'Daily Sales',
        category: 'Nook Veteran',
        gross,
        discount,
        fee: 0,
        net: received || gross - discount,
        note,
        received,
        cogs,
        productProfit,
        fixedCostDaily,
        profitLoss,
        cash,
        qris,
        deliveryTax,
        transactionCount,
        source,
      });
    }

    if (expense) {
      const paymentMethod = inferExpensePaymentMethod({ note });
      expenses.push({
        id: `daily-expense-${date}`,
        date,
        item: note || 'Daily Expense',
        category: 'Operations',
        gross: expense,
        tax: 0,
        fee: 0,
        net: expense,
        note,
        fixedCostDaily,
        profitLoss,
        ...expensePaymentFields(expense, paymentMethod),
        deliveryTax,
        transactionCount,
        source,
      });
    }
  });

  return { income, expenses };
}

function buildSummary(
  keys: string[],
  incomeRecords: IncomeRecord[],
  expenseRecords: ExpenseRecord[],
  labelForKey: (key: string) => string,
  getKey: (date: string) => string
): PeriodSummary[] {
  return keys.map((key) => {
    const income = incomeRecords
      .filter((item) => getKey(item.date) === key)
      .reduce((sum, item) => sum + item.net, 0);
    const expense = expenseRecords
      .filter((item) => getKey(item.date) === key)
      .reduce((sum, item) => sum + item.net, 0);
    const profit = income - expense;

    return {
      key,
      label: labelForKey(key),
      income,
      expense,
      profit,
      margin: income > 0 ? profit / income : 0,
    };
  });
}

export function FinanceView() {
  const hasLoadedSupabase = useRef(false);
  const [incomeRecords, setIncomeRecords] = useState<EditableIncomeRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem('nook-finance-income-records');
      if (saved) {
        const records = (JSON.parse(saved) as EditableIncomeRecord[]).filter(hasValidRecordDate);
        return records;
      }
      const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-income') || '[]') as IncomeRecord[];
      return [...seedIncomeRecords(), ...withIncomeIds(legacyManual, 'legacy-income')];
    } catch {
      return seedIncomeRecords();
    }
  });
  const [expenseRecords, setExpenseRecords] = useState<EditableExpenseRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem('nook-finance-expense-records');
      if (saved) {
        const records = (JSON.parse(saved) as EditableExpenseRecord[]).filter(hasValidRecordDate).map(normalizeExpensePayment);
        return records;
      }
      const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-expenses') || '[]') as ExpenseRecord[];
      return [...seedExpenseRecords(), ...withExpenseIds(legacyManual, 'legacy-expense')];
    } catch {
      return seedExpenseRecords();
    }
  });
  const [cashMovements, setCashMovements] = useState<CashMovement[]>(() => loadLocalCashMovements(isValidDateString));
  const incomeRecordsRef = useRef(incomeRecords);
  const expenseRecordsRef = useRef(expenseRecords);

  useEffect(() => {
    incomeRecordsRef.current = incomeRecords;
    window.localStorage.setItem('nook-finance-income-records', JSON.stringify(incomeRecords));
  }, [incomeRecords]);

  useEffect(() => {
    expenseRecordsRef.current = expenseRecords;
    window.localStorage.setItem('nook-finance-expense-records', JSON.stringify(expenseRecords));
  }, [expenseRecords]);

  useEffect(() => {
    if (!isSupabaseConfigured || hasLoadedSupabase.current) return;
    hasLoadedSupabase.current = true;

    void (async () => {
      try {
        const [supabaseIncome, supabaseExpenses, settings] = await Promise.all([
          loadJsonRows<EditableIncomeRecord>(FINANCE_TABLES.income),
          loadJsonRows<EditableExpenseRecord>(FINANCE_TABLES.expenses),
          loadJsonRows<{ id: string; movements?: CashMovement[] }>(SETTINGS_TABLE),
        ]);
        const validSupabaseIncome = supabaseIncome.filter(hasValidRecordDate);
        const invalidSupabaseIncome = supabaseIncome.filter((record) => !hasValidRecordDate(record));
        const validSupabaseExpenses = supabaseExpenses.filter(hasValidRecordDate).map(normalizeExpensePayment);
        const invalidSupabaseExpenses = supabaseExpenses.filter((record) => !hasValidRecordDate(record));

        if (validSupabaseIncome.length) {
          const merged = mergeFinanceRecords<EditableIncomeRecord>([], validSupabaseIncome, incomeIdentity);
          setIncomeRecords(merged.records);
          void persistFinanceMerge(
            FINANCE_TABLES.income,
            merged.upserts,
            [...merged.removedIds, ...invalidSupabaseIncome.map((record) => record.id)]
          ).catch(syncError);
        } else {
          setIncomeRecords([]);
          void Promise.all(invalidSupabaseIncome.map((record) => deleteJsonRow(FINANCE_TABLES.income, record.id))).catch(syncError);
        }
        if (validSupabaseExpenses.length) {
          const merged = mergeFinanceRecords<EditableExpenseRecord>([], validSupabaseExpenses, expenseIdentity);
          setExpenseRecords(merged.records);
          void persistFinanceMerge(
            FINANCE_TABLES.expenses,
            merged.upserts,
            [...merged.removedIds, ...invalidSupabaseExpenses.map((record) => record.id)]
          ).catch(syncError);
        } else {
          setExpenseRecords([]);
          void Promise.all(invalidSupabaseExpenses.map((record) => deleteJsonRow(FINANCE_TABLES.expenses, record.id))).catch(syncError);
        }
        const movementSettings = settings.find((item) => item.id === CASH_MOVEMENT_SETTINGS_ID);
        if (movementSettings?.movements) {
          const syncedMovements = normalizeCashMovements(movementSettings.movements, isValidDateString);
          setCashMovements(syncedMovements);
          window.localStorage.setItem(LOCAL_CASH_MOVEMENTS_KEY, JSON.stringify(syncedMovements));
        }
      } catch (error) {
        syncError(error);
      }
    })();
  }, []);

  const allMonths = useMemo(() => {
    return [...new Set([...incomeRecords.map((item) => monthKey(item.date)), ...expenseRecords.map((item) => monthKey(item.date))])].sort();
  }, [expenseRecords, incomeRecords]);

  const allYears = useMemo(() => {
    return [...new Set([...incomeRecords.map((item) => yearKey(item.date)), ...expenseRecords.map((item) => yearKey(item.date))])].sort();
  }, [expenseRecords, incomeRecords]);

  const [selectedMonth, setSelectedMonth] = useState(allMonths[allMonths.length - 1] || '');
  const [selectedYear, setSelectedYear] = useState(allYears[allYears.length - 1] || '');

  useEffect(() => {
    if (!selectedMonth || !allMonths.includes(selectedMonth)) {
      setSelectedMonth(allMonths[allMonths.length - 1] || '');
    }
    if (!selectedYear || !allYears.includes(selectedYear)) {
      setSelectedYear(allYears[allYears.length - 1] || '');
    }
  }, [allMonths, allYears, selectedMonth, selectedYear]);

  const monthlySummary = useMemo(() => {
    return buildSummary(
      allMonths,
      incomeRecords,
      expenseRecords,
      (key) => format(parseISO(`${key}-01`), 'MMM yyyy'),
      monthKey
    );
  }, [allMonths, expenseRecords, incomeRecords]);

  const yearlySummary = useMemo(() => {
    return buildSummary(allYears, incomeRecords, expenseRecords, (key) => key, yearKey);
  }, [allYears, expenseRecords, incomeRecords]);

  const selectedMonthSummary = monthlySummary.find((item) => item.key === selectedMonth) || monthlySummary[monthlySummary.length - 1];
  const selectedYearSummary = yearlySummary.find((item) => item.key === selectedYear) || yearlySummary[yearlySummary.length - 1];
  const fiveYearSummary = yearlySummary.slice(-5);
  const totalFiveYear = fiveYearSummary.reduce(
    (acc, item) => ({
      income: acc.income + item.income,
      expense: acc.expense + item.expense,
      profit: acc.profit + item.profit,
    }),
    { income: 0, expense: 0, profit: 0 }
  );
  const fiveYearKeys = new Set(fiveYearSummary.map((item) => item.key));
  const fiveYearMovements = cashMovements.filter((movement) => fiveYearKeys.has(yearKey(movement.date)));
  const fiveYearMovementDelta = movementDelta(fiveYearMovements);

  const persistCashMovements = (nextMovements: CashMovement[]) => {
    const normalized = normalizeCashMovements(nextMovements, isValidDateString);
    setCashMovements(normalized);
    window.localStorage.setItem(LOCAL_CASH_MOVEMENTS_KEY, JSON.stringify(normalized));
    void saveSingleton(SETTINGS_TABLE, CASH_MOVEMENT_SETTINGS_ID, { movements: normalized }).catch((error) => {
      syncError(error);
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

  const selectedMonthIncome = incomeRecords
    .filter((item) => monthKey(item.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date));
  const selectedMonthExpenses = expenseRecords
    .filter((item) => monthKey(item.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date));

  const yearlyMonthlyRows = useMemo(() => {
    if (!selectedYear) return [];

    return Array.from({ length: 12 }, (_, index) => {
      const key = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
      const income = incomeRecords
        .filter((item) => monthKey(item.date) === key)
        .reduce((sum, item) => sum + item.net, 0);
      const expense = expenseRecords
        .filter((item) => monthKey(item.date) === key)
        .reduce((sum, item) => sum + item.net, 0);
      const profit = income - expense;

      return {
        key,
        label: format(parseISO(`${key}-01`), 'MMMM'),
        income,
        expense,
        profit,
        margin: income > 0 ? profit / income : 0,
      };
    });
  }, [expenseRecords, incomeRecords, selectedYear]);

  const recentMonthlyChart = monthlySummary.slice(-12).map((item) => ({
    label: item.label,
    income: item.income,
    expense: item.expense,
    profit: item.profit,
  }));

  const addIncome = async (record: IncomeRecord) => {
    const nextRecord = { ...record, id: `manual-income-${Date.now()}` };
    const merged = mergeFinanceRecords<EditableIncomeRecord>(incomeRecordsRef.current, [nextRecord], incomeIdentity);
    setIncomeRecords(merged.records);

    try {
      await persistFinanceMerge(FINANCE_TABLES.income, merged.upserts, merged.removedIds);
      toast.success('Income saved');
    } catch (error) {
      syncError(error);
      toast.error('Income was not saved to Supabase');
    }
  };

  const addExpense = async (record: ExpenseRecord) => {
    const nextRecord = normalizeExpensePayment({ ...record, id: `manual-expense-${Date.now()}` });
    const merged = mergeFinanceRecords<EditableExpenseRecord>(expenseRecordsRef.current, [nextRecord], expenseIdentity);
    setExpenseRecords(merged.records);

    try {
      await persistFinanceMerge(FINANCE_TABLES.expenses, merged.upserts, merged.removedIds);
      toast.success('Expense saved');
    } catch (error) {
      syncError(error);
      toast.error('Expense was not saved to Supabase');
    }
  };

  const updateIncome = (id: string, updates: Partial<IncomeRecord>) => {
    setIncomeRecords((current) => current.map((record) => {
      if (record.id !== id) return record;
      const nextRecord = { ...record, ...updates };
      void upsertJsonRow(FINANCE_TABLES.income, nextRecord).catch(syncError);
      return nextRecord;
    }));
    toast.success('Income updated');
  };

  const updateExpense = (id: string, updates: Partial<ExpenseRecord>) => {
    setExpenseRecords((current) => current.map((record) => {
      if (record.id !== id) return record;
      const nextRecord = normalizeExpensePayment({ ...record, ...updates });
      void upsertJsonRow(FINANCE_TABLES.expenses, nextRecord).catch(syncError);
      return nextRecord;
    }));
    toast.success('Expense updated');
  };

  const deleteIncome = (id: string) => {
    setIncomeRecords((current) => current.filter((record) => record.id !== id));
    void deleteJsonRow(FINANCE_TABLES.income, id).catch(syncError);
    toast.info('Income deleted');
  };

  const deleteExpense = (id: string) => {
    setExpenseRecords((current) => current.filter((record) => record.id !== id));
    void deleteJsonRow(FINANCE_TABLES.expenses, id).catch(syncError);
    toast.info('Expense deleted');
  };

  const importExcel = async (file: File) => {
    try {
      const XLSX = await loadXlsxLibrary();
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: false });
      const dailySheets = readSheetRowsContaining(workbook, ['pendapatan', 'pengeluaran'])
        .map((sheet) => parseDailyFinanceRows(sheet.rows, sheet.name));
      const importedIncome = [
        ...parseIncomeRows(readFirstMatchingSheetRows(workbook, ['Pendapatan', 'Income'])),
        ...dailySheets.flatMap((sheet) => sheet.income),
      ];
      const importedExpenses = [
        ...parseExpenseRows(readFirstMatchingSheetRows(workbook, ['Pengeluaran', 'Expenses', 'Expense'])),
        ...dailySheets.flatMap((sheet) => sheet.expenses),
      ];

      if (!importedIncome.length && !importedExpenses.length) {
        toast.error('No readable income or expense data found');
        return;
      }

      toast.loading('Saving import to Supabase...', { id: 'finance-import' });

      const mergedIncome = mergeFinanceRecords<EditableIncomeRecord>(incomeRecordsRef.current, importedIncome, incomeIdentity);
      const mergedExpenses = mergeFinanceRecords<EditableExpenseRecord>(expenseRecordsRef.current, importedExpenses, expenseIdentity);

      setIncomeRecords(mergedIncome.records);
      setExpenseRecords(mergedExpenses.records);

      await Promise.all([
        persistFinanceMerge(FINANCE_TABLES.income, mergedIncome.upserts, mergedIncome.removedIds),
        persistFinanceMerge(FINANCE_TABLES.expenses, mergedExpenses.upserts, mergedExpenses.removedIds),
      ]);

      const latestDate = [...importedIncome.map((item) => item.date), ...importedExpenses.map((item) => item.date)].sort().at(-1);
      if (latestDate) {
        setSelectedMonth(monthKey(latestDate));
        setSelectedYear(yearKey(latestDate));
      }

      toast.success(`Import complete: ${importedIncome.length} income rows and ${importedExpenses.length} expense rows saved`, { id: 'finance-import' });
    } catch (error) {
      syncError(error);
      toast.error(error instanceof Error ? error.message : 'Excel import failed', { id: 'finance-import' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">NOOK BREW.Finance</h1>
        <p className="text-3xl md:text-4xl font-light tracking-tight text-foreground">Income & Expense Reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Income" value={formatMoney(totalFiveYear.income)} icon={Wallet} />
        <KpiCard title="Total Expense" value={formatMoney(totalFiveYear.expense)} icon={ReceiptText} />
        <KpiCard title="Net Profit" value={formatMoney(totalFiveYear.profit)} icon={TrendingUp} />
        <KpiCard title="Data Range" value={`${allMonths[0] || '-'} / ${allMonths[allMonths.length - 1] || '-'}`} icon={CalendarDays} />
      </div>

      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList variant="line" className="bg-transparent border-b border-border rounded-none h-auto min-h-10 w-full justify-start overflow-x-auto">
          <TabsTrigger value="monthly" className="uppercase text-[10px] tracking-widest px-5">Monthly</TabsTrigger>
          <TabsTrigger value="yearly" className="uppercase text-[10px] tracking-widest px-5">Yearly</TabsTrigger>
          <TabsTrigger value="five-year" className="uppercase text-[10px] tracking-widest px-5">5 Years</TabsTrigger>
          <TabsTrigger value="transactions" className="uppercase text-[10px] tracking-widest px-5">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-light tracking-tight">Monthly Report</h2>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-border rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {allMonths.map((month) => (
                  <SelectItem key={month} value={month}>{format(parseISO(`${month}-01`), 'MMM yyyy')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SummaryGrid summary={selectedMonthSummary} />
          <TrendChart data={recentMonthlyChart} />
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-light tracking-tight">Yearly Report</h2>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[140px] bg-card border-border rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {allYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SummaryGrid summary={selectedYearSummary} />
          <YearMonthlyTable rows={yearlyMonthlyRows} />
          <SummaryTable rows={yearlySummary} />
        </TabsContent>

        <TabsContent value="five-year" className="space-y-6">
          <h2 className="text-xl font-light tracking-tight">5 Year Report</h2>
          <SummaryGrid
            summary={{
              key: '5y',
              label: 'Last 5 Years',
              income: totalFiveYear.income,
              expense: totalFiveYear.expense,
              profit: totalFiveYear.profit,
              margin: totalFiveYear.income > 0 ? totalFiveYear.profit / totalFiveYear.income : 0,
            }}
          />
          <Card className="bg-card border-border p-6 rounded-sm shadow-none">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fiveYearSummary}>
                  <CartesianGrid stroke="#27272a" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => formatMoney(value)} contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: 2 }} />
                  <Bar dataKey="income" fill="#22c55e" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <CashMovementPanel
            movements={fiveYearMovements}
            delta={fiveYearMovementDelta}
            onAdd={addCashMovement}
            onUpdate={updateCashMovement}
            onDelete={deleteCashMovement}
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-light tracking-tight">Income & Expense Entries</h2>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-border rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {allMonths.map((month) => (
                  <SelectItem key={month} value={month}>{format(parseISO(`${month}-01`), 'MMM yyyy')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ExcelImportPanel onImport={importExcel} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <FinanceEntryForm type="income" onSubmit={addIncome} />
            <FinanceEntryForm type="expense" onSubmit={addExpense} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TransactionPanel title="Income" rows={selectedMonthIncome.map((item) => ({
              id: item.id,
              date: item.date,
              name: item.product,
              category: item.category,
              gross: item.gross,
              adjustment: item.discount,
              fee: item.fee,
              cogs: item.cogs ?? 0,
              amount: item.net,
              note: item.note,
              extra: [
                ...extraMetric('Received', item.received),
                ...extraMetric('COGS', item.cogs),
                ...extraMetric('Product Profit', item.productProfit),
                ...extraMetric('Fixed Cost', item.fixedCostDaily),
                ...extraMetric('Cash', item.cash),
                ...extraMetric('QRIS', item.qris),
                ...extraMetric('Delivery Tax', item.deliveryTax),
                ...extraMetric('Profit / Loss', item.profitLoss),
                ...(item.transactionCount ? [{ label: 'Transactions', value: String(item.transactionCount) }] : []),
              ],
            }))} tone="income" onUpdate={(id, updates) => updateIncome(id, {
              date: updates.date,
              product: updates.name,
              category: updates.category,
              gross: updates.gross,
              discount: updates.adjustment,
              fee: updates.fee,
              net: updates.gross - updates.adjustment - updates.fee,
              cogs: updates.cogs,
              productProfit: updates.gross - updates.adjustment - updates.fee - (updates.cogs || 0),
              note: updates.note,
            })} onDelete={deleteIncome} />
            <TransactionPanel title="Expense" rows={selectedMonthExpenses.map((item) => ({
              id: item.id,
              date: item.date,
              name: item.item,
              category: item.category,
              gross: item.gross,
              adjustment: item.tax,
              fee: item.fee,
              cogs: item.cogs ?? 0,
              amount: item.net,
              note: item.note,
              paymentMethod: inferExpensePaymentMethod(item),
              extra: [
                { label: 'Payment', value: inferExpensePaymentMethod(item).toUpperCase() },
                ...extraMetric('COGS', item.cogs),
                ...extraMetric('Fixed Cost', item.fixedCostDaily),
                ...extraMetric('Cash', item.cash),
                ...extraMetric('QRIS', item.qris),
                ...extraMetric('Delivery Tax', item.deliveryTax),
                ...extraMetric('Profit / Loss', item.profitLoss),
                ...(item.transactionCount ? [{ label: 'Transactions', value: String(item.transactionCount) }] : []),
              ],
            }))} tone="expense" onUpdate={(id, updates) => updateExpense(id, {
              date: updates.date,
              item: updates.name,
              category: updates.category,
              gross: updates.gross,
              tax: updates.adjustment,
              fee: updates.fee,
              net: updates.gross + updates.adjustment + updates.fee,
              cogs: updates.cogs,
              note: updates.note,
              ...expensePaymentFields(updates.gross + updates.adjustment + updates.fee, updates.paymentMethod || 'cash'),
            })} onDelete={deleteExpense} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Wallet }) {
  return (
    <Card className="bg-card border-border rounded-sm shadow-none p-6">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{title}</span>
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <p className="mt-4 text-2xl font-light tracking-tight text-foreground">{value}</p>
    </Card>
  );
}

function SummaryGrid({ summary }: { summary?: PeriodSummary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Metric label="Period" value={summary.label} />
      <Metric label="Income" value={formatMoney(summary.income)} />
      <Metric label="Expense" value={formatMoney(summary.expense)} />
      <Metric label="Profit / Margin" value={`${formatMoney(summary.profit)} (${(summary.margin * 100).toFixed(1)}%)`} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-sm p-5">
      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{label}</p>
      <p className="mt-3 text-lg font-light tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function TrendChart({ data }: { data: Array<{ label: string; income: number; expense: number; profit: number }> }) {
  return (
    <Card className="bg-card border-border p-6 rounded-sm shadow-none">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-4 w-4 text-foreground" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">12 Month Trend</span>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#27272a" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value: number) => formatMoney(value)} contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: 2 }} />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="profit" stroke="#eab308" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function SummaryTable({ rows }: { rows: PeriodSummary[] }) {
  return (
    <Card className="bg-card border-border rounded-sm shadow-none overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-5 gap-4 border-b border-border px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          <span>Year</span>
          <span>Income</span>
          <span>Expense</span>
          <span>Profit</span>
          <span>Margin</span>
        </div>
        {rows.map((row) => (
          <div key={row.key} className="grid grid-cols-5 gap-4 border-b border-border/60 px-6 py-4 text-xs text-foreground">
            <span>{row.label}</span>
            <span>{formatMoney(row.income)}</span>
            <span>{formatMoney(row.expense)}</span>
            <span>{formatMoney(row.profit)}</span>
            <span>{(row.margin * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ExcelImportPanel({ onImport }: { onImport: (file: File) => void }) {
  return (
    <Card className="bg-card border-border rounded-sm shadow-none p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 border border-border flex items-center justify-center text-foreground">
            <Upload className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Import Excel</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Upload an Excel file with Income, Expense, or Daily Income & Expense sheets. Matching dates are updated instead of duplicated.
            </p>
          </div>
        </div>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-foreground px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-background hover:opacity-90">
          Choose Excel File
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImport(file);
              event.currentTarget.value = '';
            }}
          />
        </label>
      </div>
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
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Cash Movement</h3>
          <p className="mt-2 text-xs text-muted-foreground">Move balance between Cash and QRIS without changing income or expense profit.</p>
        </div>
        <ArrowLeftRight className="h-4 w-4 text-foreground" />
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Date</Label>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-11 rounded-sm border-border bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Direction</Label>
              <Select value={direction} onValueChange={(value) => setDirection(value as CashMovementDirection)}>
                <SelectTrigger className="h-11 rounded-sm border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground">
                  <SelectItem value="cash-to-qris">Cash to QRIS</SelectItem>
                  <SelectItem value="qris-to-cash">QRIS to Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Amount</Label>
              <Input inputMode="numeric" value={formatInputNumber(amount)} onChange={(event) => setAmount(toNumber(event.target.value))} className="h-11 rounded-sm border-border bg-background font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Note</Label>
              <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional" className="h-11 rounded-sm border-border bg-background" />
            </div>
          </div>
          <Button type="button" onClick={submitMovement} className="h-11 w-full rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background">
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
        </div>

        <div className="overflow-x-auto rounded-sm border border-border">
          <div className="grid min-w-[680px] grid-cols-[120px_150px_130px_1fr_48px] border-b border-border bg-background text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {['Date', 'Direction', 'Amount', 'Note', ''].map((label) => (
              <span key={label} className="border-r border-border px-3 py-3 last:border-r-0">{label}</span>
            ))}
          </div>
          {movements.length ? movements.map((movement) => (
            <div key={movement.id} className="grid min-w-[680px] grid-cols-[120px_150px_130px_1fr_48px] border-b border-border/70 text-xs last:border-b-0">
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
            <div className="px-4 py-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              No cash movement yet
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function YearMonthlyTable({ rows }: { rows: PeriodSummary[] }) {
  return (
    <Card className="bg-card border-border rounded-sm shadow-none overflow-x-auto">
      <div className="border-b border-border bg-muted/20 px-6 py-5 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-foreground">Annual Detail</span>
      </div>
      <div className="min-w-[720px]">
        <div className="grid grid-cols-5 gap-4 border-b border-border px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          <span>Month</span>
          <span>Income</span>
          <span>Expense</span>
          <span>Profit</span>
          <span>Margin</span>
        </div>
        {rows.map((row) => (
          <div key={row.key} className="grid grid-cols-5 gap-4 border-b border-border/60 px-6 py-3 text-xs text-foreground">
            <span>{row.label}</span>
            <span>{row.income > 0 ? formatMoney(row.income) : '-'}</span>
            <span>{row.expense > 0 ? formatMoney(row.expense) : '-'}</span>
            <span>{row.income || row.expense ? formatMoney(row.profit) : '-'}</span>
            <span>{row.income > 0 ? `${(row.margin * 100).toFixed(2)}%` : '-'}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FinanceEntryForm({
  type,
  onSubmit,
}: {
  type: 'income' | 'expense';
  onSubmit: (record: IncomeRecord & ExpenseRecord) => void;
}) {
  const isIncome = type === 'income';
  const title = isIncome ? 'Add Income' : 'Add Expense';
  const amountLabel = 'Amount';
  const nameLabel = isIncome ? 'Product / Service' : 'Item / Product';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const date = String(formData.get('date') || '');
    const name = String(formData.get('name') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const amount = Number(formData.get('amount') || 0);
    const adjustment = Number(formData.get('adjustment') || 0);
    const fee = Number(formData.get('fee') || 0);
    const cogs = Number(formData.get('cogs') || 0);
    const note = String(formData.get('note') || '').trim();
    const paymentMethod = String(formData.get('paymentMethod') || 'cash') as FinancePaymentMethod;

    if (!date || !name || !category || amount <= 0) {
      toast.error('Date, name, category, and amount are required');
      return;
    }

    if (isIncome) {
      onSubmit({
        date,
        product: name,
        item: name,
        category,
        gross: amount,
        discount: adjustment,
        tax: 0,
        fee,
        net: amount - adjustment - fee,
        cogs,
        productProfit: amount - adjustment - fee - cogs,
        note,
      });
    } else {
      const net = amount + adjustment + fee;
      onSubmit({
        date,
        product: name,
        item: name,
        category,
        gross: amount,
        discount: 0,
        tax: adjustment,
        fee,
        net,
        cogs,
        note,
        ...expensePaymentFields(net, paymentMethod),
      });
    }

    form.reset();
  };

  return (
    <Card className="bg-card border-border rounded-sm shadow-none p-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className={isIncome ? 'h-4 w-4 text-emerald-500' : 'h-4 w-4 text-red-500'} />
        <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{title}</h3>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Date</Label>
          <Input name="date" type="date" required className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Category</Label>
          <Input name="category" required placeholder={isIncome ? 'Nook Main' : 'Raw Material'} className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{nameLabel}</Label>
          <Input name="name" required placeholder={isIncome ? 'Daily sales' : 'Coffee beans'} className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{amountLabel}</Label>
          <Input name="amount" type="number" min="0" required className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{isIncome ? 'Discount' : 'Tax'}</Label>
          <Input name="adjustment" type="number" min="0" defaultValue="0" className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Fee</Label>
          <Input name="fee" type="number" min="0" defaultValue="0" className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">COGS / HPP</Label>
          <Input name="cogs" type="number" min="0" defaultValue="0" className="bg-background border-border rounded-sm h-11" />
        </div>
        {!isIncome && (
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Payment</Label>
            <select name="paymentMethod" defaultValue="cash" className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none">
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Note</Label>
          <Input name="note" placeholder="Optional" className="bg-background border-border rounded-sm h-11" />
        </div>
        <Button type="submit" className="md:col-span-2 bg-foreground text-background hover:opacity-90 rounded-sm uppercase text-[10px] tracking-[0.2em] h-11">
          Add {isIncome ? 'Income' : 'Expense'}
        </Button>
      </form>
    </Card>
  );
}

function TransactionPanel({
  title,
  rows,
  tone,
  onUpdate,
  onDelete,
}: {
  title: string;
  rows: Array<{ id: string; date: string; name: string; category: string; gross: number; adjustment: number; fee: number; cogs: number; amount: number; note: string; paymentMethod?: FinancePaymentMethod; extra?: Array<{ label: string; value: string }> }>;
  tone: 'income' | 'expense';
  onUpdate: (id: string, updates: { date: string; name: string; category: string; gross: number; adjustment: number; fee: number; cogs: number; note: string; paymentMethod?: FinancePaymentMethod }) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ date: '', name: '', category: '', gross: 0, adjustment: 0, fee: 0, cogs: 0, note: '', paymentMethod: 'cash' as FinancePaymentMethod });

  const beginEdit = (row: { id: string; date: string; name: string; category: string; gross: number; adjustment: number; fee: number; cogs: number; note: string; paymentMethod?: FinancePaymentMethod }) => {
    setEditingId(row.id);
    setDraft({
      date: row.date,
      name: row.name,
      category: row.category,
      gross: row.gross,
      adjustment: row.adjustment,
      fee: row.fee,
      cogs: row.cogs,
      note: row.note,
      paymentMethod: row.paymentMethod || 'cash',
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!draft.date || !draft.name.trim() || !draft.category.trim() || draft.gross <= 0) {
      toast.error('Date, name, category, and amount are required');
      return;
    }
    onUpdate(editingId, draft);
    setEditingId(null);
  };

  return (
    <Card className="bg-card border-border rounded-sm shadow-none overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{title}</h3>
        <span className={tone === 'income' ? 'text-emerald-500 text-xs' : 'text-red-500 text-xs'}>{rows.length} entries</span>
      </div>
      <ScrollArea className="h-[440px]">
        <div className="divide-y divide-border/60">
          {rows.map((row) => {
            const isEditing = editingId === row.id;

            return (
              <div key={row.id} className="p-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs" />
                    <Input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Category" />
                    <Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs md:col-span-2" placeholder="Transaction name" />
                    <Input type="number" value={draft.gross} onChange={(event) => setDraft((current) => ({ ...current, gross: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Amount" />
                    <Input type="number" value={draft.adjustment} onChange={(event) => setDraft((current) => ({ ...current, adjustment: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder={tone === 'income' ? 'Discount' : 'Tax'} />
                    <Input type="number" value={draft.fee} onChange={(event) => setDraft((current) => ({ ...current, fee: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Fee" />
                    <Input type="number" value={draft.cogs} onChange={(event) => setDraft((current) => ({ ...current, cogs: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="COGS / HPP" />
                    {tone === 'expense' && (
                      <select value={draft.paymentMethod} onChange={(event) => setDraft((current) => ({ ...current, paymentMethod: event.target.value as FinancePaymentMethod }))} className="h-10 w-full rounded-sm border border-border bg-background px-3 text-xs text-foreground outline-none">
                        <option value="cash">Cash</option>
                        <option value="qris">QRIS</option>
                      </select>
                    )}
                    <Input value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Note" />
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-9 rounded-sm bg-transparent border-border text-[10px] uppercase tracking-widest">Cancel</Button>
                      <Button type="button" onClick={saveEdit} className="h-9 rounded-sm bg-foreground text-background text-[10px] uppercase tracking-widest">Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[88px_1fr_auto] sm:gap-4">
                    <span className="text-[10px] text-muted-foreground font-mono">{format(parseISO(row.date), 'dd MMM')}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground truncate">{row.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{row.category}{row.note ? ` / ${row.note}` : ''}</p>
                      {row.extra?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {row.extra.map((metric) => (
                            <span key={`${row.id}-${metric.label}`} className="rounded-sm border border-border px-2 py-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                              {metric.label}: <span className="text-foreground">{metric.value}</span>
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-3 flex gap-2">
                        <Button type="button" variant="outline" onClick={() => beginEdit(row)} className="h-7 rounded-sm bg-transparent border-border px-3 text-[9px] uppercase tracking-widest">Edit</Button>
                        <Button type="button" variant="outline" onClick={() => onDelete(row.id)} className="h-7 rounded-sm bg-transparent border-red-900/40 px-3 text-[9px] uppercase tracking-widest text-red-500 hover:bg-red-950/20">Delete</Button>
                      </div>
                    </div>
                    <span className={tone === 'income' ? 'text-xs text-emerald-500 font-mono' : 'text-xs text-red-500 font-mono'}>
                      {formatMoney(row.amount)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
