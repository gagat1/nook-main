import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart3, CalendarDays, FileSpreadsheet, WalletCards } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseRecord, IncomeRecord, nookExpenses, nookIncome } from '../data/nookFinance';
import { loadJsonRows } from '../lib/supabaseSync';

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

function monthKey(date: string) {
  return date.slice(0, 7);
}

function isValidDateString(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const year = Number(date.slice(0, 4));
  return year >= 2000 && year <= 2100;
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
      productProfit,
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

export function MonthlyOperationsReportView() {
  const [incomeRecords, setIncomeRecords] = useState<EditableIncomeRecord[]>(loadLocalIncome);
  const [expenseRecords, setExpenseRecords] = useState<EditableExpenseRecord[]>(loadLocalExpenses);

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
  const activeDays = dailyRows.filter((row) => row.gross || row.received || row.expense).length || 1;
  const summary = {
    cash: sum(dailyRows.map((row) => row.cash)),
    qris: sum(dailyRows.map((row) => row.qris)),
    deliveryTax: sum(dailyRows.map((row) => row.deliveryTax)),
    total: sum(dailyRows.map((row) => row.total)),
    transactions: sum(dailyRows.map((row) => row.transactions)),
    gross: sum(dailyRows.map((row) => row.gross)),
    discount: sum(dailyRows.map((row) => row.discount)),
    received: sum(dailyRows.map((row) => row.received)),
    cogs: sum(dailyRows.map((row) => row.cogs)),
    productProfit: sum(dailyRows.map((row) => row.productProfit)),
    fixedCost: sum(dailyRows.map((row) => row.fixedCost)),
    expenses: sum(dailyRows.map((row) => row.expense)),
  };
  const totalNetProfit = summary.productProfit - summary.fixedCost - summary.expenses;
  const selectedLabel = selectedMonth ? format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy') : 'No Data';

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">NOOK BREW.Monthly Operations</h1>
          <p className="text-3xl font-light tracking-tight text-foreground md:text-4xl">Cash, QRIS & Profit Report</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full rounded-sm border-border bg-card md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-foreground">
            {months.map((month) => (
              <SelectItem key={month} value={month}>{format(parseISO(`${month}-01`), 'MMM yyyy')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <DailyReportTable rows={dailyRows} />
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

function DailyReportTable({ rows }: { rows: DailyReportRow[] }) {
  return (
    <Card className="overflow-x-auto rounded-sm border-border bg-card shadow-none">
      <div className="min-w-[1320px]">
        <div className="grid grid-cols-[96px_128px_96px_128px_112px_156px_112px_112px_220px_112px_104px_104px_96px_112px_96px] border-b border-border bg-muted/60 text-[10px] font-bold text-foreground">
          {['Date', 'Gross Revenue', 'Discount', 'Received', 'COGS', 'Product Profit', 'Fixed Cost', 'Expense', 'Notes', 'Profit/Loss', 'Cash', 'QRIS', 'Grab + Tax', 'Total', 'Transactions'].map((label) => (
            <span key={label} className="border-r border-border px-3 py-3 last:border-r-0">{label}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.date} className={row.gross || row.expense ? 'grid grid-cols-[96px_128px_96px_128px_112px_156px_112px_112px_220px_112px_104px_104px_96px_112px_96px] border-b border-border/70 text-xs text-foreground' : 'grid grid-cols-[96px_128px_96px_128px_112px_156px_112px_112px_220px_112px_104px_104px_96px_112px_96px] border-b border-border/70 bg-red-600 text-xs text-black'}>
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
          </div>
        ))}
      </div>
    </Card>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return <span className="min-h-10 border-r border-border/70 px-3 py-2 last:border-r-0">{children}</span>;
}

function MoneyCell({ value, negativeParens = false }: { value: number; negativeParens?: boolean }) {
  const formatted = value < 0 && negativeParens
    ? `(${formatMoney(Math.abs(value)).replace('Rp', '').trim()})`
    : formatMoney(value);
  return <Cell>{value ? formatted : '-'}</Cell>;
}
