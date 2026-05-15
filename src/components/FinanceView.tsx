import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart3, CalendarDays, Plus, ReceiptText, TrendingUp, Upload, Wallet } from 'lucide-react';
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
import { ExpenseRecord, IncomeRecord, nookExpenses, nookIncome } from '../data/nookFinance';
import { isSupabaseConfigured } from '../lib/supabase';
import { deleteJsonRow, loadJsonRows, replaceJsonRows, upsertJsonRow, upsertJsonRows } from '../lib/supabaseSync';

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

function monthKey(date: string) {
  return date.slice(0, 7);
}

function yearKey(date: string) {
  return date.slice(0, 4);
}

function excelSerialToDate(serial: number) {
  const epoch = new Date(Date.UTC(1899, 11, 30));
  epoch.setUTCDate(epoch.getUTCDate() + serial);
  return epoch.toISOString().slice(0, 10);
}

function normalizeDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') return excelSerialToDate(value);
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return '';
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

function withIncomeIds(records: IncomeRecord[], prefix: string): EditableIncomeRecord[] {
  return records.map((record, index) => ({ ...record, id: `${prefix}-${index}-${record.date}` }));
}

function withExpenseIds(records: ExpenseRecord[], prefix: string): EditableExpenseRecord[] {
  return records.map((record, index) => ({ ...record, id: `${prefix}-${index}-${record.date}` }));
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
    const net = toNumber(row[7]) || gross - tax - fee;

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
      note: textValue(row[8]),
    }];
  });
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
      if (saved) return JSON.parse(saved);
      const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-income') || '[]') as IncomeRecord[];
      return [...withIncomeIds(nookIncome, 'seed-income'), ...withIncomeIds(legacyManual, 'legacy-income')];
    } catch {
      return withIncomeIds(nookIncome, 'seed-income');
    }
  });
  const [expenseRecords, setExpenseRecords] = useState<EditableExpenseRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem('nook-finance-expense-records');
      if (saved) return JSON.parse(saved);
      const legacyManual = JSON.parse(window.localStorage.getItem('nook-manual-expenses') || '[]') as ExpenseRecord[];
      return [...withExpenseIds(nookExpenses, 'seed-expense'), ...withExpenseIds(legacyManual, 'legacy-expense')];
    } catch {
      return withExpenseIds(nookExpenses, 'seed-expense');
    }
  });

  useEffect(() => {
    window.localStorage.setItem('nook-finance-income-records', JSON.stringify(incomeRecords));
  }, [incomeRecords]);

  useEffect(() => {
    window.localStorage.setItem('nook-finance-expense-records', JSON.stringify(expenseRecords));
  }, [expenseRecords]);

  useEffect(() => {
    if (!isSupabaseConfigured || hasLoadedSupabase.current) return;
    hasLoadedSupabase.current = true;

    const seedIncome = incomeRecords;
    const seedExpenses = expenseRecords;

    void (async () => {
      try {
        const [supabaseIncome, supabaseExpenses] = await Promise.all([
          loadJsonRows<EditableIncomeRecord>(FINANCE_TABLES.income),
          loadJsonRows<EditableExpenseRecord>(FINANCE_TABLES.expenses),
        ]);

        if (supabaseIncome.length) setIncomeRecords(supabaseIncome);
        if (supabaseExpenses.length) setExpenseRecords(supabaseExpenses);

        if (!supabaseIncome.length && seedIncome.length) {
          await replaceJsonRows(FINANCE_TABLES.income, seedIncome);
        }
        if (!supabaseExpenses.length && seedExpenses.length) {
          await replaceJsonRows(FINANCE_TABLES.expenses, seedExpenses);
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

  const selectedMonthIncome = incomeRecords
    .filter((item) => monthKey(item.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date));
  const selectedMonthExpenses = expenseRecords
    .filter((item) => monthKey(item.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date));

  const yearlyMonthlyRows = useMemo(() => {
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

  const addIncome = (record: IncomeRecord) => {
    const nextRecord = { ...record, id: `manual-income-${Date.now()}` };
    setIncomeRecords((current) => [...current, nextRecord]);
    void upsertJsonRow(FINANCE_TABLES.income, nextRecord).catch(syncError);
    toast.success('Pemasukan ditambahkan');
  };

  const addExpense = (record: ExpenseRecord) => {
    const nextRecord = { ...record, id: `manual-expense-${Date.now()}` };
    setExpenseRecords((current) => [...current, nextRecord]);
    void upsertJsonRow(FINANCE_TABLES.expenses, nextRecord).catch(syncError);
    toast.success('Pengeluaran ditambahkan');
  };

  const updateIncome = (id: string, updates: Partial<IncomeRecord>) => {
    setIncomeRecords((current) => current.map((record) => {
      if (record.id !== id) return record;
      const nextRecord = { ...record, ...updates };
      void upsertJsonRow(FINANCE_TABLES.income, nextRecord).catch(syncError);
      return nextRecord;
    }));
    toast.success('Pemasukan diperbarui');
  };

  const updateExpense = (id: string, updates: Partial<ExpenseRecord>) => {
    setExpenseRecords((current) => current.map((record) => {
      if (record.id !== id) return record;
      const nextRecord = { ...record, ...updates };
      void upsertJsonRow(FINANCE_TABLES.expenses, nextRecord).catch(syncError);
      return nextRecord;
    }));
    toast.success('Pengeluaran diperbarui');
  };

  const deleteIncome = (id: string) => {
    setIncomeRecords((current) => current.filter((record) => record.id !== id));
    void deleteJsonRow(FINANCE_TABLES.income, id).catch(syncError);
    toast.info('Pemasukan dihapus');
  };

  const deleteExpense = (id: string) => {
    setExpenseRecords((current) => current.filter((record) => record.id !== id));
    void deleteJsonRow(FINANCE_TABLES.expenses, id).catch(syncError);
    toast.info('Pengeluaran dihapus');
  };

  const importExcel = async (file: File) => {
    try {
      const XLSX = await loadXlsxLibrary();
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const importedIncome = parseIncomeRows(readSheetRows(workbook, 'Pendapatan'));
      const importedExpenses = parseExpenseRows(readSheetRows(workbook, 'Pengeluaran'));

      if (!importedIncome.length && !importedExpenses.length) {
        toast.error('Tidak ada data Pendapatan/Pengeluaran yang terbaca');
        return;
      }

      setIncomeRecords((current) => [...current, ...importedIncome]);
      setExpenseRecords((current) => [...current, ...importedExpenses]);
      void Promise.all([
        upsertJsonRows(FINANCE_TABLES.income, importedIncome),
        upsertJsonRows(FINANCE_TABLES.expenses, importedExpenses),
      ]).catch(syncError);

      const latestDate = [...importedIncome.map((item) => item.date), ...importedExpenses.map((item) => item.date)].sort().at(-1);
      if (latestDate) {
        setSelectedMonth(monthKey(latestDate));
        setSelectedYear(yearKey(latestDate));
      }

      toast.success(`Import berhasil: ${importedIncome.length} pemasukan, ${importedExpenses.length} pengeluaran`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import Excel gagal');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">NOOK BREW.Finance</h1>
        <p className="text-4xl font-light tracking-tight text-foreground">Income & Expense Reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Income" value={formatMoney(totalFiveYear.income)} icon={Wallet} />
        <KpiCard title="Total Expense" value={formatMoney(totalFiveYear.expense)} icon={ReceiptText} />
        <KpiCard title="Net Profit" value={formatMoney(totalFiveYear.profit)} icon={TrendingUp} />
        <KpiCard title="Data Range" value={`${allMonths[0] || '-'} / ${allMonths[allMonths.length - 1] || '-'}`} icon={CalendarDays} />
      </div>

      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList variant="line" className="bg-transparent border-b border-border rounded-none h-10">
          <TabsTrigger value="monthly" className="uppercase text-[10px] tracking-widest px-5">Monthly</TabsTrigger>
          <TabsTrigger value="yearly" className="uppercase text-[10px] tracking-widest px-5">Yearly</TabsTrigger>
          <TabsTrigger value="five-year" className="uppercase text-[10px] tracking-widest px-5">5 Years</TabsTrigger>
          <TabsTrigger value="transactions" className="uppercase text-[10px] tracking-widest px-5">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-light tracking-tight">Monthly Report</h2>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px] bg-card border-border rounded-sm">
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
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-light tracking-tight">Yearly Report</h2>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px] bg-card border-border rounded-sm">
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
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-light tracking-tight">Income & Expense Entries</h2>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px] bg-card border-border rounded-sm">
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
            <TransactionPanel title="Pemasukan" rows={selectedMonthIncome.map((item) => ({
              id: item.id,
              date: item.date,
              name: item.product,
              category: item.category,
              gross: item.gross,
              adjustment: item.discount,
              fee: item.fee,
              amount: item.net,
              note: item.note,
            }))} tone="income" onUpdate={(id, updates) => updateIncome(id, {
              date: updates.date,
              product: updates.name,
              category: updates.category,
              gross: updates.gross,
              discount: updates.adjustment,
              fee: updates.fee,
              net: updates.gross - updates.adjustment - updates.fee,
              note: updates.note,
            })} onDelete={deleteIncome} />
            <TransactionPanel title="Pengeluaran" rows={selectedMonthExpenses.map((item) => ({
              id: item.id,
              date: item.date,
              name: item.item,
              category: item.category,
              gross: item.gross,
              adjustment: item.tax,
              fee: item.fee,
              amount: item.net,
              note: item.note,
            }))} tone="expense" onUpdate={(id, updates) => updateExpense(id, {
              date: updates.date,
              item: updates.name,
              category: updates.category,
              gross: updates.gross,
              tax: updates.adjustment,
              fee: updates.fee,
              net: updates.gross - updates.adjustment - updates.fee,
              note: updates.note,
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
    <Card className="bg-card border-border rounded-sm shadow-none overflow-hidden">
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
              Upload file dengan sheet Pendapatan dan Pengeluaran. Data akan ditambahkan ke laporan dan tersimpan ke Supabase jika koneksi aktif.
            </p>
          </div>
        </div>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-foreground px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-background hover:opacity-90">
          Pilih File Excel
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
    <Card className="bg-card border-border rounded-sm shadow-none overflow-hidden">
      <div className="border-b border-border bg-muted/20 px-6 py-5 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-foreground">Rincian Tahunan</span>
      </div>
      <div className="grid grid-cols-5 gap-4 border-b border-border px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
        <span>Bulan</span>
        <span>Pendapatan</span>
        <span>Pengeluaran</span>
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
  const title = isIncome ? 'Input Pemasukan' : 'Input Pengeluaran';
  const amountLabel = isIncome ? 'Nominal' : 'Nominal';
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
    const note = String(formData.get('note') || '').trim();

    if (!date || !name || !category || amount <= 0) {
      toast.error('Tanggal, nama, kategori, dan nominal wajib diisi');
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
        note,
      });
    } else {
      onSubmit({
        date,
        product: name,
        item: name,
        category,
        gross: amount,
        discount: 0,
        tax: adjustment,
        fee,
        net: amount - adjustment - fee,
        note,
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
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Tanggal</Label>
          <Input name="date" type="date" required className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Kategori</Label>
          <Input name="category" required placeholder={isIncome ? 'Nook Main' : 'Bahan Baku'} className="bg-background border-border rounded-sm h-11" />
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
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{isIncome ? 'Diskon' : 'Pajak'}</Label>
          <Input name="adjustment" type="number" min="0" defaultValue="0" className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Fee</Label>
          <Input name="fee" type="number" min="0" defaultValue="0" className="bg-background border-border rounded-sm h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Catatan</Label>
          <Input name="note" placeholder="Optional" className="bg-background border-border rounded-sm h-11" />
        </div>
        <Button type="submit" className="md:col-span-2 bg-foreground text-background hover:opacity-90 rounded-sm uppercase text-[10px] tracking-[0.2em] h-11">
          Tambahkan {isIncome ? 'Pemasukan' : 'Pengeluaran'}
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
  rows: Array<{ id: string; date: string; name: string; category: string; gross: number; adjustment: number; fee: number; amount: number; note: string }>;
  tone: 'income' | 'expense';
  onUpdate: (id: string, updates: { date: string; name: string; category: string; gross: number; adjustment: number; fee: number; note: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ date: '', name: '', category: '', gross: 0, adjustment: 0, fee: 0, note: '' });

  const beginEdit = (row: { id: string; date: string; name: string; category: string; gross: number; adjustment: number; fee: number; note: string }) => {
    setEditingId(row.id);
    setDraft({
      date: row.date,
      name: row.name,
      category: row.category,
      gross: row.gross,
      adjustment: row.adjustment,
      fee: row.fee,
      note: row.note,
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!draft.date || !draft.name.trim() || !draft.category.trim() || draft.gross <= 0) {
      toast.error('Tanggal, nama, kategori, dan nominal wajib diisi');
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
                    <Input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Kategori" />
                    <Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs md:col-span-2" placeholder="Nama transaksi" />
                    <Input type="number" value={draft.gross} onChange={(event) => setDraft((current) => ({ ...current, gross: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Nominal" />
                    <Input type="number" value={draft.adjustment} onChange={(event) => setDraft((current) => ({ ...current, adjustment: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder={tone === 'income' ? 'Diskon' : 'Pajak'} />
                    <Input type="number" value={draft.fee} onChange={(event) => setDraft((current) => ({ ...current, fee: Number(event.target.value) }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Fee" />
                    <Input value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} className="bg-background border-border rounded-sm h-10 text-xs" placeholder="Catatan" />
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-9 rounded-sm bg-transparent border-border text-[10px] uppercase tracking-widest">Cancel</Button>
                      <Button type="button" onClick={saveEdit} className="h-9 rounded-sm bg-foreground text-background text-[10px] uppercase tracking-widest">Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[88px_1fr_auto] gap-4">
                    <span className="text-[10px] text-muted-foreground font-mono">{format(parseISO(row.date), 'dd MMM')}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground truncate">{row.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{row.category}{row.note ? ` / ${row.note}` : ''}</p>
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
