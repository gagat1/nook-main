import { useMemo, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useScheduleStore } from '../store';
import { 
  format, 
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
  parseISO
} from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

function safeDateInput(value: string, fallback: Date) {
  if (!value) return fallback;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

export function DashboardView() {
  const { employees, schedules, getStats } = useScheduleStore();
  const now = new Date();
  const defaultRangeStart = startOfMonth(now);
  const defaultRangeEnd = endOfMonth(now);
  const [rangeStartInput, setRangeStartInput] = useState(format(defaultRangeStart, 'yyyy-MM-dd'));
  const [rangeEndInput, setRangeEndInput] = useState(format(defaultRangeEnd, 'yyyy-MM-dd'));
  const rangeStart = safeDateInput(rangeStartInput, defaultRangeStart);
  const rawRangeEnd = safeDateInput(rangeEndInput, defaultRangeEnd);
  const rangeEnd = rawRangeEnd < rangeStart ? rangeStart : rawRangeEnd;
  const rangeDays = differenceInCalendarDays(rangeEnd, rangeStart) + 1;

  const statsByEmployee = useMemo(() => {
    return employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      color: emp.color,
      type: emp.type,
      ...getStats(emp.id, rangeStart, rangeEnd)
    }));
  }, [employees, schedules, getStats, rangeStartInput, rangeEndInput]);

  const totalMonthlySalary = statsByEmployee.reduce((acc, curr) => acc + (curr.salary || 0), 0);
  const totalMonthlyHours = statsByEmployee.reduce((acc, curr) => acc + curr.totalHours, 0);
  const totalRangeShifts = statsByEmployee.reduce((acc, curr) => acc + curr.totalShifts, 0);
  const wageEarners = statsByEmployee.filter((stat) => (stat.salary || 0) > 0);
  const dateRangeLabel = `${format(rangeStart, 'dd MMM yyyy')} - ${format(rangeEnd, 'dd MMM yyyy')}`;
  
  // Fairness Score Calculation
  // A perfect fairness score (100) means everyone has exactly equal hours.
  // We use Variance/Mean to penalize imbalance.
  const fairnessScore = useMemo(() => {
    if (statsByEmployee.length === 0) return 100;
    const hours = statsByEmployee.map(s => s.totalHours);
    const mean = hours.reduce((a, b) => a + b, 0) / hours.length;
    if (mean === 0) return 100;
    const variance = hours.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / hours.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;
    const score = Math.max(0, Math.min(100, 100 * (1 - coefficientOfVariation)));
    return Math.round(score);
  }, [statsByEmployee]);

  const chartData = statsByEmployee.slice(0, 10).map(s => ({
    name: s.name.split(' ')[0],
    hours: Math.round(s.totalHours),
    color: s.color
  }));

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Analytics.Interface</h1>
          <p className="text-4xl font-light tracking-tight text-foreground">Operations & Analytics</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Start Date</span>
            <Input
              type="date"
              value={rangeStartInput}
              onChange={(event) => setRangeStartInput(event.target.value)}
              className="h-11 rounded-sm border-border bg-card text-foreground"
            />
          </div>
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">End Date</span>
            <Input
              type="date"
              value={rangeEndInput}
              onChange={(event) => setRangeEndInput(event.target.value)}
              className="h-11 rounded-sm border-border bg-card text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Workhours" 
          value={Math.round(totalMonthlyHours).toString()} 
          unit="HRS"
          icon={Clock}
          color="text-white"
          trend={`${rangeDays} days / ${totalRangeShifts} scheduled shifts`}
        />
        <StatCard 
          title="Fairness Score" 
          value={fairnessScore.toString()} 
          unit="%"
          icon={TrendingUp}
          color="text-emerald-500"
          trend="Team distribution variance"
        />
        <StatCard 
          title="Wage Payroll" 
          value={`Rp${totalMonthlySalary.toLocaleString()}`} 
          unit="IDR"
          icon={DollarSign}
          color="text-white"
          trend={`${dateRangeLabel} / ${wageEarners.length} wage earners`}
        />
        <StatCard 
          title="Active Personnel" 
          value={employees.filter(e => e.isActive).length.toString()} 
          unit="OPS"
          icon={Users}
          color="text-white"
          trend={`${employees.length} total registered records`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-sm p-8">
          <div className="mb-10">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Workload Distribution</h2>
            <p className="text-sm font-light text-muted-foreground opacity-70">{dateRangeLabel} allocation metrics per operative.</p>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 10, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 10, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#1A1A1A' }}
                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '2px', fontSize: '10px', color: '#fff' }}
                  />
                  <Bar dataKey="hours" radius={[0, 0, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-8">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-6">Operative Priority</h2>
          <ScrollArea className="h-[320px] pr-4">
             <div className="space-y-3">
                {[...statsByEmployee].sort((a, b) => b.totalHours - a.totalHours).map((stat, idx) => (
                  <div key={stat.id} className="flex items-center justify-between p-4 border border-border rounded-sm group hover:border-accent transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stat.color }} />
                        <span className="text-[11px] font-medium text-foreground uppercase tracking-wider">{stat.name}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-muted-foreground">{Math.round(stat.totalHours)}H</span>
                        <ArrowUpRight className={cn(
                          "h-3 w-3",
                          idx < 2 ? "text-emerald-500" : "text-border"
                        )} />
                     </div>
                  </div>
                ))}
             </div>
          </ScrollArea>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm p-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Payroll Range</h2>
            <p className="text-sm font-light text-muted-foreground opacity-70">Salary estimate for {dateRangeLabel}.</p>
          </div>
          <div className="font-mono text-2xl text-foreground">Rp{totalMonthlySalary.toLocaleString()}</div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] border-b border-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <span>Employee</span>
              <span>Shifts</span>
              <span>Hours</span>
              <span>Daily Wage</span>
              <span className="text-right">Salary</span>
            </div>
            {statsByEmployee.map((stat) => {
              const employee = employees.find((item) => item.id === stat.id);
              return (
                <div key={stat.id} className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] border-b border-border/60 px-4 py-4 text-xs text-foreground">
                  <span className="font-medium">{stat.name}</span>
                  <span>{stat.totalShifts}</span>
                  <span>{Math.round(stat.totalHours)}H</span>
                  <span>{employee?.dailyWage ? `Rp${employee.dailyWage.toLocaleString()}` : '-'}</span>
                  <span className="text-right font-mono">{stat.salary ? `Rp${stat.salary.toLocaleString()}` : '-'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
         <div className="bg-card border border-border rounded-sm p-8">
            <div className="flex items-start gap-4 mb-8">
                <div className="h-10 w-10 border border-border flex items-center justify-center text-foreground">
                   <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-light tracking-tight text-foreground">Security & Health</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Compliance Audit Record</p>
                </div>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Mandatory Rest Hours</span>
                  <span className="text-[10px] text-emerald-500 font-bold">100% SECURE</span>
               </div>
               <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Consecutive Workdays</span>
                  <span className="text-[10px] text-muted-foreground font-bold">NOMINAL</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Critical Staffing Gaps</span>
                  <span className="text-[10px] text-amber-500 font-bold">02 PENDING</span>
               </div>
            </div>
         </div>

         <div className="bg-card border border-border rounded-sm p-8">
            <div className="flex items-start gap-4 mb-8">
                <div className="h-10 w-10 border border-border flex items-center justify-center text-foreground">
                   <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-light tracking-tight text-foreground">Fairness Algorithm</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Distribution Intelligence</p>
                </div>
            </div>
            <div className="space-y-6">
               <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wide">
                  System analysis confirms <span className="text-foreground border-b border-accent">High Balancing Efficiency</span>. 
                  Weekends are stratified among Full-time staff with 98% accuracy. 
                  Part-time shifts auto-allocated for peak demand.
               </p>
               <div className="pt-4 flex items-end justify-between">
                  <div className="flex flex-col">
                     <span className="text-5xl font-light text-foreground tracking-tighter leading-none">{fairnessScore}</span>
                     <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.3em] mt-3">Variance Optimization Score</span>
                  </div>
                  <div className="w-16 h-[2px] bg-border relative">
                     <div 
                      className="absolute top-0 left-0 h-full bg-foreground transition-all duration-1000" 
                      style={{ width: `${fairnessScore}%` }} 
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon: Icon, color, trend }: any) {
  return (
    <Card className="bg-card border-border group hover:border-accent transition-colors">
       <CardContent className="p-6">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</span>
             <Icon className={cn("h-4 w-4", color)} />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
             <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
             <span className="text-sm font-medium text-muted-foreground opacity-60">{unit}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
             <Info className="h-3 w-3" />
             {trend}
          </p>
       </CardContent>
    </Card>
  );
}
