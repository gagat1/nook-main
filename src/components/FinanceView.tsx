import { useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart3, CalendarDays, ReceiptText, TrendingUp, Upload, Wallet } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ExpenseRecord, IncomeRecord } from '../data/nookFinance';
import { expensePaymentFields, inferExpensePaymentMethod, normalizeExpensePayment } from '../lib/financePayments';
import { isSupabaseConfigured } from '../lib/supabase';
import { seedExpenseRecords, seedIncomeRecords } from '../lib/financeSeed';
import { deleteJsonRow, loadJsonRows, upsertJsonRows } from '../lib/supabaseSync';

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
        const [supabaseIncome, supabaseExpenses] = await Promise.all([
          loadJsonRows<EditableIncomeRecord>(FINANCE_TABLES.income),
          loadJsonRows<EditableExpenseRecord>(FINANCE_TABLES.expenses),
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
          <SummaryTable rows={fiveYearSummary} />
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
