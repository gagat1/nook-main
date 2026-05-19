/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useScheduleStore } from './store';
import {
  Users, 
  Calendar, 
  Clock, 
  ClipboardList, 
  LayoutDashboard, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  Banknote,
  TrendingUp,
  ReceiptText,
  Wrench,
  LogOut,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { SchedulerView } from './components/SchedulerView';
import { EmployeesView } from './components/EmployeesView';
import { ShiftsView } from './components/ShiftsView';
import { DashboardView } from './components/DashboardView';
import { LeaveView } from './components/LeaveView';
import { SettingsView } from './components/SettingsView';
import { CashCounterView } from './components/CashCounterView';
import { COGSView } from './components/COGSView';
import { FinanceView } from './components/FinanceView';
import { LoginView } from './components/LoginView';
import { MaintenanceView } from './components/MaintenanceView';
import { BusinessDataView } from './components/BusinessDataView';
import { MonthlyOperationsReportView } from './components/MonthlyOperationsReportView';

type View = 'dashboard' | 'scheduler' | 'employees' | 'shifts' | 'leave' | 'settings' | 'cashier' | 'cogs' | 'finance' | 'monthly-report' | 'business' | 'maintenance';

export default function App() {
  const { theme, setTheme, syncFromSupabase, isSupabaseReady } = useScheduleStore();
  const [currentView, setCurrentView] = useState<View>('scheduler');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('nook-authenticated') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    void syncFromSupabase();
  }, [syncFromSupabase]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const selectView = (view: View) => {
    setCurrentView(view);
    setIsMobileNavOpen(false);
  };
  const handleLogout = () => {
    window.sessionStorage.removeItem('nook-authenticated');
    setIsAuthenticated(false);
  };

  const navGroups: Array<{
    label: string;
    items: Array<{ id: View; label: string; icon: typeof LayoutDashboard }>;
  }> = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Scheduling',
      items: [
        { id: 'scheduler', label: 'Schedule', icon: Calendar },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'shifts', label: 'Shift Templates', icon: Clock },
        { id: 'leave', label: 'Time Off', icon: ClipboardList },
      ],
    },
    {
      label: 'Finance',
      items: [
        { id: 'finance', label: 'Finance', icon: ReceiptText },
        { id: 'monthly-report', label: 'Monthly Report', icon: FileSpreadsheet },
        { id: 'business', label: 'Business Data', icon: BookOpen },
      ],
    },
    {
      label: 'Tools',
      items: [
        { id: 'cashier', label: 'Cash Counter', icon: Banknote },
        { id: 'cogs', label: 'COGS Calc', icon: TrendingUp },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'settings', label: 'Protocol', icon: Settings },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
      ],
    },
  ];

  const navContent = (expanded: boolean) => (
    <>
      <div className="mb-8 md:mb-10">
        <AnimatePresence mode="wait">
          {expanded && (
            <motion.p
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className="text-2xl font-light tracking-tight"
            >
              Operations v2.4
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            {expanded ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground/50"
              >
                {group.label}
              </motion.p>
            ) : (
              <div className="mx-auto h-px w-7 bg-border" />
            )}
            <div className="space-y-3">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectView(item.id)}
                  className={cn(
                    "group flex w-full items-center rounded-sm transition-all duration-300",
                    expanded ? "gap-3" : "justify-center",
                    currentView === item.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    currentView === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] uppercase tracking-[0.1em] font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" theme={theme} />
        <LoginView onLogin={() => setIsAuthenticated(true)} />
      </>
    );
  }

  return (
    <div className={cn(
      "flex min-h-screen md:h-screen w-full font-sans overflow-hidden select-none bg-background text-foreground transition-colors duration-300",
      theme
    )}>
      <Toaster position="top-right" theme={theme} />
      
      <button
        onClick={() => setIsMobileNavOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.25, ease: 'circOut' }}
              className="flex h-full w-[min(82vw,320px)] flex-col border-r border-border bg-card p-6"
            >
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted-foreground"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              {navContent(true)}
              <div className="mt-8 space-y-3 border-t border-border pt-5">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-center rounded-sm p-2 text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-accent"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-20 hidden flex-col border-r border-border bg-card p-6 md:flex"
      >
        {navContent(isSidebarOpen)}

        <div className="mt-auto space-y-4 pt-6 border-t border-border">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-center rounded-sm p-2 text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-accent"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex w-full items-center justify-center rounded-sm p-2 text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-accent"
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <header className="min-h-20 border-b border-border flex flex-col gap-4 px-5 py-5 bg-background md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap items-center gap-4 pl-14 md:gap-8 md:pl-0">
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{currentView}</span>
              <span className="text-sm tracking-wide text-foreground opacity-80">Operational Interface</span>
            </div>
            <div className="hidden h-8 w-[1px] bg-border sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {isSupabaseReady ? 'Supabase Sync' : 'Local Sync'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 pl-14 md:pl-0">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-[11px] uppercase tracking-widest text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
            <button className="px-4 py-2 border border-border rounded-sm text-[11px] uppercase tracking-widest text-muted-foreground hover:border-foreground hover:text-foreground transition-all">
              v2.4.12-release
            </button>
          </div>
        </header>

        <div className="flex-1 w-full bg-background overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-[1600px] mx-auto p-4 pb-24 md:p-8 md:pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: 'circOut' }}
              >
                {currentView === 'dashboard' && <DashboardView />}
                {currentView === 'scheduler' && <SchedulerView />}
                {currentView === 'employees' && <EmployeesView />}
                {currentView === 'shifts' && <ShiftsView />}
                {currentView === 'leave' && <LeaveView />}
                {currentView === 'finance' && <FinanceView />}
                {currentView === 'monthly-report' && <MonthlyOperationsReportView />}
                {currentView === 'business' && <BusinessDataView />}
                {currentView === 'cashier' && <CashCounterView />}
                {currentView === 'cogs' && <COGSView />}
                {currentView === 'settings' && <SettingsView />}
                {currentView === 'maintenance' && <MaintenanceView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="hidden h-12 border-t border-border md:flex items-center px-8 justify-between text-[10px] uppercase tracking-widest text-muted-foreground bg-card">
          <div className="flex gap-6">
            <span>Security: <span className="text-emerald-500 border border-emerald-500/30 px-1 rounded-sm ml-1">LOCKED</span></span>
            <span>Latency: 12ms</span>
          </div>
          <div className="flex gap-4">
            <span className="opacity-40">© 2024 Shift.System</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
