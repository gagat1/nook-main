import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  Lock, 
  Unlock, 
  AlertTriangle,
  Info,
  CalendarCheck2,
  CalendarRange
} from 'lucide-react';
import { useScheduleStore } from '../store';
import { 
  format, 
  addDays, 
  eachDayOfInterval, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  isWeekend,
  differenceInDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval
} from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScheduledShift } from '../types';
import { motion } from 'motion/react';

export function SchedulerView() {
  const { 
    employees, 
    shifts, 
    schedules, 
    generateAll, 
    clearSchedules, 
    updateSchedule, 
    deleteSchedule, 
    toggleLock,
    leaves
  } = useScheduleStore();

  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(addDays(startDate, 13)); // 2 weeks default
  
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ date: Date; employeeId: string } | null>(null);

  const days = useMemo(() => {
    try {
      return eachDayOfInterval({ start: startDate, end: endDate });
    } catch (e) {
      return [];
    }
  }, [startDate, endDate]);

  const weeks = useMemo(() => {
    const groups: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach((day, index) => {
      currentWeek.push(day);
      if (day.getDay() === 0 || index === days.length - 1) {
        groups.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return groups;
  }, [days]);

  const handleGenerate = () => {
    if (differenceInDays(endDate, startDate) > 31) {
      toast.error('Schedule range cannot exceed 31 days');
      return;
    }
    generateAll(startDate, endDate);
    toast.success('Schedule generated successfully');
    setIsGenerateOpen(false);
  };

  const getShiftInCell = (date: Date, employeeId: string) => {
    return schedules.find(s => isSameDay(new Date(s.date), date) && s.employeeId === employeeId);
  };

  const getDayViolations = (date: Date) => {
    const daySchedules = schedules.filter(s => isSameDay(new Date(s.date), date));
    const violations: { shiftId: string; type: 'under' | 'over'; message: string }[] = [];

    shifts.filter(s => s.isActive).forEach(shift => {
      const count = daySchedules.filter(s => s.shiftTemplateId === shift.id).length;
      const daySpecific = shift.daySpecificStaffing?.find(d => d.dayOfWeek === date.getDay());
      const targetStaff = Math.max(1, daySpecific ? daySpecific.minStaff : shift.minStaff);
      if (count < targetStaff) {
        violations.push({ shiftId: shift.id, type: 'under', message: `Understaffed: ${shift.name} (${count}/${targetStaff})` });
      } else if (count > shift.maxStaff) {
        violations.push({ shiftId: shift.id, type: 'over', message: `Overstaffed: ${shift.name} (${count}/${shift.maxStaff})` });
      }
    });

    return violations;
  };

  const handleManualAssignment = (shiftId: string | 'none') => {
    if (!editingCell) return;
    
    const existing = getShiftInCell(editingCell.date, editingCell.employeeId);
    
    if (shiftId === 'none') {
      if (existing) deleteSchedule(existing.id);
    } else {
      updateSchedule({
        id: existing?.id || Math.random().toString(36).substr(2, 9),
        date: editingCell.date,
        employeeId: editingCell.employeeId,
        shiftTemplateId: shiftId,
        isLocked: true // Manual assignments are locked by default
      });
    }
    
    setIsEditOpen(false);
    setEditingCell(null);
  };

  const getEmployeeStatus = (date: Date, empId: string) => {
    const leave = leaves.find(l => 
      l.employeeId === empId && 
      l.status === 'Approved' && 
      isWithinInterval(date, { start: l.startDate, end: l.endDate })
    );
    if (leave) return { type: 'leave', label: 'LEAVE', color: 'text-red-500 bg-red-500/10' };

    const emp = employees.find(e => e.id === empId);
    if (emp?.fixedOffDays.includes(date.getDay())) return { type: 'off', label: 'OFF', color: 'text-muted-foreground bg-muted/20' };

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground flex flex-wrap items-center gap-3 md:gap-4">
            Staff Scheduler <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border px-2 py-0.5 rounded-sm">V2.4</span>
          </h1>
          <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
             <div className="flex w-full bg-card border border-border rounded-sm p-1 sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => {
                    const start = startOfWeek(addDays(startDate, -7), { weekStartsOn: 1 });
                    setStartDate(start);
                    setEndDate(addDays(start, 13));
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex min-w-0 flex-1 items-center justify-center px-3 text-center text-xs uppercase tracking-widest font-medium text-muted-foreground sm:min-w-[240px] sm:px-6">
                  {format(startDate, 'MMM d')} — {format(endDate, 'MMM d, yyyy')}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => {
                    const start = startOfWeek(addDays(startDate, 7), { weekStartsOn: 1 });
                    setStartDate(start);
                    setEndDate(addDays(start, 13));
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
             </div>
             <Popover>
               <PopoverTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-transparent border-border text-muted-foreground hover:border-accent hover:text-foreground uppercase text-[10px] tracking-widest px-4 cursor-pointer inline-flex items-center")}>
                  <CalendarRange className="mr-2 h-3.5 w-3.5" /> Custom Range
               </PopoverTrigger>
               <PopoverContent className="w-auto p-4 bg-card border-border space-y-4">
                 <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                     <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">From</span>
                     <input 
                       type="date" 
                       value={format(startDate, 'yyyy-MM-dd')} 
                       onChange={(e) => setStartDate(new Date(e.target.value))}
                       className="bg-background border border-border text-foreground rounded-sm p-1 text-xs w-full"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">To</span>
                     <input 
                       type="date" 
                       value={format(endDate, 'yyyy-MM-dd')} 
                       onChange={(e) => setEndDate(new Date(e.target.value))}
                       className="bg-background border border-border text-foreground rounded-sm p-1 text-xs w-full"
                     />
                   </div>
                 </div>
               </PopoverContent>
             </Popover>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button variant="outline" onClick={() => clearSchedules()} className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-5 py-5 rounded-sm">
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Clear All
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              generateAll(startDate, endDate);
              toast.success('Schedule shuffled');
            }} 
            className="bg-transparent border-accent/20 text-accent hover:bg-accent/10 uppercase text-[10px] tracking-widest px-5 py-5 rounded-sm"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Shuffle
          </Button>
          <Button onClick={() => setIsGenerateOpen(true)} className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-6 py-5 rounded-sm shadow-none">
            <Sparkles className="mr-2 h-3.5 w-3.5" /> Generate Auto
          </Button>
        </div>
      </div>      <div className="space-y-10">
        {weeks.map((weekDays, weekIndex) => (
          <div key={weekIndex} className="border border-border bg-background rounded-sm overflow-hidden flex flex-col">
            <div className="p-3 bg-card border-b border-border flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-[10px] uppercase font-bold text-foreground tracking-[0.3em]">Week {weekIndex + 1}</span>
                <span className="h-4 w-px bg-border" />
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                  {format(weekDays[0], 'MMM d')} — {format(weekDays[weekDays.length - 1], 'MMM d, yyyy')}
                </span>
              </div>
              <div className="bg-background px-2 py-0.5 rounded-sm border border-border">
                <span className="text-[8px] text-muted-foreground font-mono tracking-tighter uppercase">{weekDays.length} DAYS</span>
              </div>
            </div>

            <ScrollArea className="w-full">
              <div className="min-w-[1200px]">
                <div 
                  className="grid" 
                  style={{ gridTemplateColumns: `140px repeat(${weekDays.length}, 1fr)` }}
                >
                  {/* Header Row */}
                  <div className="p-4 border-r border-b border-border bg-card sticky left-0 z-20 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Member</span>
                    <span className="text-[9px] text-muted-foreground/50 font-mono">{employees.length} TOTAL</span>
                  </div>
                  {weekDays.map(day => (
                    <div 
                      key={day.toISOString()} 
                      className={cn(
                        "p-4 text-center border-r border-b border-border bg-card flex flex-col items-center gap-1",
                        isWeekend(day) ? "bg-card/50" : "",
                        isSameDay(day, new Date()) ? "bg-accent" : ""
                      )}
                    >
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{format(day, 'EEE')}</span>
                      <span className={cn(
                        "text-2xl font-light tracking-tight",
                        isSameDay(day, new Date()) ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {format(day, 'd')}
                      </span>
                      {getDayViolations(day).length > 0 && (
                        <Popover>
                          <PopoverTrigger>
                            <div className="h-1 w-1 rounded-full bg-destructive mt-1 animate-pulse" />
                          </PopoverTrigger>
                          <PopoverContent className="bg-card border-border p-4 space-y-3 max-w-[240px] rounded-sm">
                            <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-2 border-b border-destructive/20 pb-1 italic">Staffing Conflicts</p>
                            {getDayViolations(day).map((v, i) => (
                              <div key={i} className="text-[9px] text-muted-foreground flex items-start gap-3 uppercase tracking-tighter leading-relaxed">
                                <span className="text-destructive">●</span>
                                {v.message}
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  ))}

                  {/* Employee Rows */}
                  {employees.map(emp => (
                    <div key={emp.id} className="contents group">
                      <div className="p-4 border-r border-b border-border flex items-center justify-between group-hover:bg-accent/50 transition-colors sticky left-0 bg-background z-10 w-[140px]">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold text-background border border-border" style={{ backgroundColor: emp.color, borderColor: emp.color }}>
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-medium text-foreground truncate">{emp.name}</span>
                            <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">{emp.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      {weekDays.map(day => {
                        const scheduled = getShiftInCell(day, emp.id);
                        const shiftTemplate = scheduled ? shifts.find(s => s.id === scheduled.shiftTemplateId) : null;
                        const status = getEmployeeStatus(day, emp.id);

                        return (
                          <div 
                            key={`${emp.id}-${day.toISOString()}`} 
                            className={cn(
                              "min-h-[100px] border-r border-b border-border p-2 flex items-center justify-center relative cursor-pointer group/cell transition-all",
                              isWeekend(day) ? "bg-card/30" : "hover:bg-card",
                              status && !scheduled ? "cursor-not-allowed" : ""
                            )}
                            onClick={() => {
                              if (!status || scheduled) {
                                setEditingCell({ date: day, employeeId: emp.id });
                                setIsEditOpen(true);
                              }
                            }}
                          >
                            {scheduled ? (
                              <motion.div 
                                layoutId={scheduled.id}
                                className="w-full h-full flex flex-col pt-0.5"
                              >
                                <div 
                                  className="relative h-full rounded-sm px-3 py-2.5 flex flex-col border-l-2"
                                  style={{ 
                                    backgroundColor: `${shiftTemplate?.color || '#333'}15`,
                                    borderColor: shiftTemplate?.color || '#333'
                                  }}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span 
                                      className="text-[9px] uppercase font-bold tracking-wider leading-none"
                                      style={{ color: shiftTemplate?.color }}
                                    >
                                      {shiftTemplate?.name}
                                    </span>
                                    {scheduled.isLocked && <Lock className="h-2 w-2 text-foreground/40 shrink-0" />}
                                  </div>
                                  <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground uppercase tracking-tighter leading-none mt-1">
                                    <span>{shiftTemplate?.startTime}</span>
                                    <span className="opacity-30">—</span>
                                    <span>{shiftTemplate?.endTime}</span>
                                  </div>

                                  <button 
                                    className="absolute top-1 right-1 h-4 w-4 text-muted-foreground opacity-0 group-hover/cell:opacity-100 flex items-center justify-center hover:text-foreground transition-all z-10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLock(scheduled.id);
                                    }}
                                  >
                                    {scheduled.isLocked ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                                  </button>
                                </div>
                              </motion.div>
                            ) : status ? (
                              <div className={cn("text-[9px] font-black tracking-[0.2em] px-3 py-4 rounded-sm border border-border text-center w-full uppercase", status.color)}>
                                {status.label}
                              </div>
                            ) : (
                              <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                <div className="h-1.5 w-1.5 rounded-full bg-border" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ))}
      </div>

      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="bg-card border border-border text-foreground max-w-md rounded-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-light tracking-tight text-foreground">
              <Sparkles className="h-5 w-5 text-foreground" /> 
              Intelligent Generation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2 text-xs uppercase tracking-widest leading-relaxed">
              Applying algorithmic fairness and constraint satisfaction for v2.4.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-background p-5 rounded-sm border border-border space-y-4 mt-6">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
              <span className="text-muted-foreground">Current Range:</span>
              <span className="text-foreground border-b border-border pb-0.5">{format(startDate, 'MMM d')} — {format(endDate, 'MMM d')}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
              <span className="text-muted-foreground">Personnel:</span>
              <span className="text-foreground border-b border-border pb-0.5">{employees.filter(e => e.isActive).length} OPERATIVES</span>
            </div>
          </div>
          <DialogFooter className="mt-8 gap-3">
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)} className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-6 py-5 rounded-sm">
              DISMISS
            </Button>
            <Button onClick={handleGenerate} className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-6 py-5 rounded-sm shadow-none">
              EXECUTE PLAN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border border-border text-foreground max-w-sm rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-tight uppercase text-foreground">Manual Assignment</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1 text-[10px] uppercase tracking-widest italic">
              {editingCell && (
                <span>{format(editingCell.date, 'EEEE, MMM d')} — {employees.find(e => e.id === editingCell.employeeId)?.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-6">
             {shifts.filter(s => s.isActive).map(shift => (
               <button
                 key={shift.id}
                 className="w-full flex items-center justify-between p-4 rounded-sm border border-border bg-background hover:bg-accent transition-all text-left group"
                 onClick={() => handleManualAssignment(shift.id)}
               >
                 <div className="flex items-center gap-4">
                    <div className="h-4 w-1 rounded-full" style={{ backgroundColor: shift.color }} />
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">{shift.name}</span>
                       <span className="text-[9px] text-muted-foreground font-mono tracking-widest">{shift.startTime} — {shift.endTime}</span>
                    </div>
                 </div>
                 <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
               </button>
             ))}
             <Button 
               variant="outline" 
               className="w-full mt-4 text-muted-foreground border-border bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 uppercase text-[9px] tracking-widest rounded-sm h-12"
               onClick={() => handleManualAssignment('none')}
             >
                Remove Current Assignment
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
