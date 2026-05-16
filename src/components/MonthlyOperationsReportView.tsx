import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart3, CalendarDays, FileSpreadsheet, Pencil, Plus, Save, Upload, WalletCards, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseRecord, IncomeRecord, nookExpenses, nookIncome } from '../data/nookFinance';
import { loadJsonRows, upsertJsonRows } from '../lib/supabaseSync';

type EditableIncomeRecord = IncomeRecord & { id: string };
type EditableExpenseRecord = ExpenseRecord & { id: string };

type DailyReportRow = {
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
  total: number;
  transactions: number;
};

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
  return money.format(Math.round(value || 0)).replace(/\s/g, ' ');
}

function formatPlainNumber(value: number) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value || 0);
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
  return records.map((record, index) => ({ ...record, id: `${prefix}-${index}-${record.date}` }));
}

function loadLocalIncome() {
  try {
    const saved = window.localStorage.getItem('nook-finance-income-records');
    if (saved) return (JSON.parse(saved) as EditableIncomeRecord[]).filter((record) => isValidDateString(record.date));
    const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-income') || '[]') as IncomeRecord[];
    return [...withIncomeIds(nookIncome, 'seed-income'), ...withIncomeIds(legacyManual, 'legacy-income')];
  } catch {
    return withIncomeIds(nookIncome, 'seed-income');
  }
}

function loadLocalExpenses() {
  try {
    const saved = window.localStorage.getItem('nook-finance-expense-records');
    if (saved) return (JSON.parse(saved) as EditableExpenseRecord[]).filter((record) => isValidDateString(record.date));
    const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-expenses') || '[]') as ExpenseRecord[];
    return [...withExpenseIds(nookExpenses, 'seed-expense'), ...withExpenseIds(legacyManual, 'legacy-expense')];
  } catch {
    return withExpenseIds(nookExpenses, 'seed-expense');
  }
}

function sum(records: number[]) {
  return records.reduce((total, value) => total + (value || 0), 0);
}

function buildDailyRows(incomeRecords: EditableIncomeRecord[], expenseRecords: EditableExpenseRecord[], selectedMonth: string) {
  const dates = [...new Set([
    ...incomeRecords.filter((record) => monthKey(record.date) === selectedMonth).map((record) => record.date),
    ...expenseRecords.filter((record) => monthKey(record.date) === selectedMonth).map((record) => record.date),
  ])].sort();

  return dates.map((date): DailyReportRow => {
    const dayIncome = incomeRecords.filter((record) => record.date === date);
    const dayExpenses = expenseRecords.filter((record) => record.date === date);
    const gross = sum(dayIncome.map((record) => record.gross));
    const discount = sum(dayIncome.map((record) => record.discount));
    const received = sum(dayIncome.map((record) => record.received ?? record.net));
    const cogs = sum(dayIncome.map((record) => record.cogs ?? 0));
    const productProfit = sum(dayIncome.map((record) => record.productProfit ?? ((record.received ?? record.net) - (record.cogs ?? 0))));
    const fixedCost = sum(dayIncome.map((record) => record.fixedCostDaily ?? 0));
    const expense = sum(dayExpenses.map((record) => record.net));
    const cash = sum(dayIncome.map((record) => record.cash ?? 0));
    const qris = sum(dayIncome.map((record) => record.qris ?? 0));
    const deliveryTax = sum(dayIncome.map((record) => record.deliveryTax ?? 0));
    const importedProfitLoss = dayIncome.some((record) => record.profitLoss != null)
      ? sum(dayIncome.map((record) => record.profitLoss ?? 0))
      : productProfit - fixedCost - expense;
    const notes = [...new Set([...dayIncome, ...dayExpenses].map((record) => record.note).filter(Boolean))].join(', ');

    return {
      date,
      gross,
      discount,
      received,
      cogs,
      productProfit: received - cogs,
      fixedCost,
      expense,
      notes,
      profitLoss: importedProfitLoss,
      cash,
      qris,
      deliveryTax,
      total: cash + qris + deliveryTax || received,
      transactions: sum(dayIncome.map((record) => record.transactionCount ?? 0)),
    };
  });
}

function withFormula(row: DailyReportRow): DailyReportRow {
  const productProfit = row.received - row.cogs;
  return {
    ...row,
    productProfit,
    profitLoss: productProfit - row.fixedCost - row.expense,
    total: row.cash + row.qris + row.deliveryTax || row.received,
  };
}

function rowsToFinanceRecords(rows: DailyReportRow[]) {
  const income = rows.map((row) => {
    const formulaRow = withFormula(row);
    return {
      id: `daily-income-${formulaRow.date}`,
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
      transactionCount: Math.round(formulaRow.transactions),
      source: 'Monthly Operations',
    } satisfies EditableIncomeRecord;
  });
  const expenses = rows.filter((row) => row.expense || row.notes).map((row) => ({
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
    cash: Math.round(row.cash),
    qris: Math.round(row.qris),
    deliveryTax: Math.round(row.deliveryTax),
    transactionCount: Math.round(row.transactions),
    source: 'Monthly Operations',
  } satisfies EditableExpenseRecord));

  return { income, expenses };
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

    return [withFormula({
      date,
      gross: Math.round(toNumber(rowValue(row, grossIndex))),
      discount: Math.round(toNumber(rowValue(row, discountIndex))),
      received: Math.round(toNumber(rowValue(row, receivedIndex))),
      cogs: Math.round(toNumber(rowValue(row, cogsIndex))),
      productProfit: 0,
      fixedCost: Math.round(toNumber(rowValue(row, fixedCostIndex))),
      expense: Math.round(toNumber(rowValue(row, expenseIndex))),
      notes: textValue(rowValue(row, noteIndex)),
      profitLoss: 0,
      cash: Math.round(toNumber(rowValue(row, cashIndex))),
      qris: Math.round(toNumber(rowValue(row, qrisIndex))),
      deliveryTax: Math.round(toNumber(rowValue(row, deliveryTaxIndex))),
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
  const [isEditing, setIsEditing] = useState(false);
  const [draftRows, setDraftRows] = useState<DailyReportRow[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [income, expenses] = await Promise.all([
          loadJsonRows<EditableIncomeRecord>(FINANCE_TABLES.income),
          loadJsonRows<EditableExpenseRecord>(FINANCE_TABLES.expenses),
        ]);
        if (income.length) setIncomeRecords(income.filter((record) => isValidDateString(record.date)));
        if (expenses.length) setExpenseRecords(expenses.filter((record) => isValidDateString(record.date)));
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

  const dailyRows = useMemo(() => buildDailyRows(incomeRecords, expenseRecords, selectedMonth), [expenseRecords, incomeRecords, selectedMonth]);
  const activeRows = isEditing ? draftRows.map(withFormula) : dailyRows;
  const activeDays = activeRows.filter((row) => row.gross || row.received || row.expense).length || 1;
  const summary = {
    cash: sum(activeRows.map((row) => row.cash)),
    qris: sum(activeRows.map((row) => row.qris)),
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
  };
  const totalNetProfit = summary.productProfit - summary.fixedCost - summary.expenses;
  const selectedLabel = selectedMonth ? format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy') : 'No Data';

  useEffect(() => {
    if (!isEditing) setDraftRows(dailyRows);
  }, [dailyRows, isEditing]);

  const saveRows = async (rows: DailyReportRow[]) => {
    const validRows = rows.map(withFormula).filter((row) => isValidDateString(row.date));
    const { income, expenses } = rowsToFinanceRecords(validRows);
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
      await saveRows(draftRows);
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
      await saveRows(importedRows);
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
          ) : (
            <Button type="button" onClick={() => { setDraftRows(dailyRows); setIsEditing(true); }} className="h-10 rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={WalletCards} label="Actual Cash" value={formatMoney(summary.cash)} />
        <MetricCard icon={WalletCards} label="Actual QRIS" value={formatMoney(summary.qris)} />
        <MetricCard icon={CalendarDays} label="Total Actual" value={formatMoney(summary.total)} />
        <MetricCard icon={BarChart3} label="Transactions" value={formatPlainNumber(summary.transactions)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <ReportSummaryCard
          monthLabel={selectedLabel}
          rows={[
            ['Average Daily Transactions', formatPlainNumber(summary.transactions / activeDays)],
            ['Average Daily Revenue', formatMoney(summary.gross / activeDays)],
            ['Average Product Profit', formatMoney(summary.productProfit / activeDays)],
            ['Product Profit', formatMoney(summary.productProfit)],
            ['Total Gross Revenue', formatMoney(summary.gross)],
            ['COGS', formatMoney(summary.cogs), 'danger'],
            ['Discount', formatMoney(summary.discount), 'danger'],
            ['Fixed Cost', formatMoney(summary.fixedCost), 'danger'],
            ['Other Expenses', formatMoney(summary.expenses), 'danger'],
            ['Total Net Profit', formatMoney(totalNetProfit), 'total'],
          ]}
        />
        <DailyReportTable
          rows={activeRows}
          isEditing={isEditing}
          onAddRow={() => setDraftRows((current) => [...current, withFormula({
            date: selectedMonth ? `${selectedMonth}-01` : new Date().toISOString().slice(0, 10),
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
            total: 0,
            transactions: 0,
          })])}
          onChangeRow={(index, updates) => setDraftRows((current) => current.map((row, rowIndex) => rowIndex === index ? withFormula({ ...row, ...updates }) : row))}
          onDeleteRow={(index) => setDraftRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}
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
  isEditing,
  onAddRow,
  onChangeRow,
  onDeleteRow,
}: {
  rows: DailyReportRow[];
  isEditing: boolean;
  onAddRow: () => void;
  onChangeRow: (index: number, updates: Partial<DailyReportRow>) => void;
  onDeleteRow: (index: number) => void;
}) {
  const columns = isEditing
    ? 'grid-cols-[104px_112px_96px_112px_96px_132px_104px_104px_180px_112px_96px_96px_96px_112px_96px_88px]'
    : 'grid-cols-[96px_128px_96px_128px_112px_156px_112px_112px_220px_112px_104px_104px_96px_112px_96px]';
  return (
    <Card className="overflow-x-auto rounded-sm border-border bg-card shadow-none">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {isEditing ? 'Editable daily inputs. Product Profit, Profit/Loss, and Total are formulas.' : 'Daily Detail'}
        </span>
        {isEditing && (
          <Button type="button" onClick={onAddRow} className="h-9 rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background">
            <Plus className="mr-2 h-4 w-4" />
            Add Day
          </Button>
        )}
      </div>
      <div className={isEditing ? 'min-w-[1680px]' : 'min-w-[1320px]'}>
        <div className={`grid ${columns} border-b border-border bg-muted/60 text-[10px] font-bold text-foreground`}>
          {['Date', 'Gross Revenue', 'Discount', 'Received', 'COGS', 'Product Profit', 'Fixed Cost', 'Expense', 'Notes', 'Profit/Loss', 'Cash', 'QRIS', 'Grab + Tax', 'Total', 'Transactions', ...(isEditing ? ['Action'] : [])].map((label) => (
            <span key={label} className="border-r border-border px-3 py-3 last:border-r-0">{label}</span>
          ))}
        </div>
        {rows.map((row, index) => (
          <div key={`${row.date}-${index}`} className={`${columns} grid border-b border-border/70 text-xs text-foreground`}>
            {isEditing ? (
              <>
                <EditCell><Input type="date" value={row.date} onChange={(event) => onChangeRow(index, { date: event.target.value })} className="h-8 rounded-sm border-border bg-background px-2 text-xs" /></EditCell>
                <NumberInput value={row.gross} onChange={(value) => onChangeRow(index, { gross: value })} />
                <NumberInput value={row.discount} onChange={(value) => onChangeRow(index, { discount: value })} />
                <NumberInput value={row.received} onChange={(value) => onChangeRow(index, { received: value })} />
                <NumberInput value={row.cogs} onChange={(value) => onChangeRow(index, { cogs: value })} />
                <FormulaCell value={formatMoney(row.productProfit)} />
                <NumberInput value={row.fixedCost} onChange={(value) => onChangeRow(index, { fixedCost: value })} />
                <NumberInput value={row.expense} onChange={(value) => onChangeRow(index, { expense: value })} />
                <EditCell><Input value={row.notes} onChange={(event) => onChangeRow(index, { notes: event.target.value })} className="h-8 rounded-sm border-border bg-background px-2 text-xs" /></EditCell>
                <FormulaCell value={formatMoney(row.profitLoss)} />
                <NumberInput value={row.cash} onChange={(value) => onChangeRow(index, { cash: value })} />
                <NumberInput value={row.qris} onChange={(value) => onChangeRow(index, { qris: value })} />
                <NumberInput value={row.deliveryTax} onChange={(value) => onChangeRow(index, { deliveryTax: value })} />
                <FormulaCell value={formatMoney(row.total)} />
                <NumberInput value={row.transactions} onChange={(value) => onChangeRow(index, { transactions: value })} />
                <EditCell><Button type="button" variant="outline" onClick={() => onDeleteRow(index)} className="h-8 rounded-sm border-red-900/50 bg-transparent px-3 text-[10px] uppercase tracking-widest text-red-500">Delete</Button></EditCell>
              </>
            ) : (
              <>
                <Cell>{format(parseISO(row.date), 'dd-MMM-yy')}</Cell>
                <MoneyCell value={row.gross} />
                <MoneyCell value={row.discount} />
                <MoneyCell value={row.received} />
                <MoneyCell value={row.cogs} />
                <MoneyCell value={row.productProfit} />
                <MoneyCell value={row.fixedCost} />
                <MoneyCell value={row.expense} />
                <Cell>{row.notes || '-'}</Cell>
                <MoneyCell value={row.profitLoss} negativeParens />
                <MoneyCell value={row.cash} />
                <MoneyCell value={row.qris} />
                <MoneyCell value={row.deliveryTax} />
                <MoneyCell value={row.total} />
                <Cell>{row.transactions || '-'}</Cell>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return <span className="min-h-10 border-r border-border/70 px-3 py-2 last:border-r-0">{children}</span>;
}

function EditCell({ children }: { children: ReactNode }) {
  return <span className="min-h-12 border-r border-border/70 p-2 last:border-r-0">{children}</span>;
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <EditCell>
      <Input
        type="number"
        value={value}
        onChange={(event) => onChange(toNumber(event.target.value))}
        className="h-8 rounded-sm border-border bg-background px-2 text-xs"
      />
    </EditCell>
  );
}

function FormulaCell({ value }: { value: string }) {
  return <span className="min-h-12 border-r border-border/70 bg-muted/40 px-3 py-3 font-mono text-xs text-muted-foreground">{value}</span>;
}

function MoneyCell({ value, negativeParens = false }: { value: number; negativeParens?: boolean }) {
  const formatted = value < 0 && negativeParens
    ? `(${formatMoney(Math.abs(value)).replace('Rp', '').trim()})`
    : formatMoney(value);
  return <Cell>{value ? formatted : '-'}</Cell>;
}
