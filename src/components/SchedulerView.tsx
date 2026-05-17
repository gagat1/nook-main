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
  CalendarRange,
  ImageDown
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
import { Employee, LeaveRequest, ScheduledShift, ShiftTemplate } from '../types';
import { motion } from 'motion/react';

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized.padEnd(6, '0');
  const value = Number.parseInt(full, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function fillRoundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function strokeRoundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.stroke();
}

function drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number, options: {
  color?: string;
  size?: number;
  weight?: string;
  align?: CanvasTextAlign;
  family?: string;
  maxWidth?: number;
}) {
  context.fillStyle = options.color || '#f5f5f5';
  context.textAlign = options.align || 'left';
  context.textBaseline = 'top';
  context.font = `${options.weight || '400'} ${options.size || 14}px ${options.family || 'Arial, sans-serif'}`;
  context.fillText(text, x, y, options.maxWidth);
}

async function shareOrDownload(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Staff Schedule' });
    return;
  }

  const imageUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(imageUrl);
}

async function exportScheduleCanvas({
  employees,
  shifts,
  schedules,
  leaves,
  weeks,
  startDate,
  endDate,
  filename,
}: {
  employees: Employee[];
  shifts: ShiftTemplate[];
  schedules: ScheduledShift[];
  leaves: LeaveRequest[];
  weeks: Date[][];
  startDate: Date;
  endDate: Date;
  filename: string;
}) {
  const memberWidth = 190;
  const dayWidth = 182;
  const rowHeight = 116;
  const dateHeaderHeight = 86;
  const weekHeaderHeight = 60;
  const gap = 32;
  const padding = 42;
  const weekWidth = memberWidth + Math.max(...weeks.map((week) => week.length), 1) * dayWidth;
  const width = weekWidth + padding * 2;
  const titleHeight = 96;
  const weekHeights = weeks.map(() => weekHeaderHeight + dateHeaderHeight + employees.length * rowHeight);
  const height = titleHeight + padding + weekHeights.reduce((total, item) => total + item, 0) + Math.max(0, weeks.length - 1) * gap + padding;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available');
  context.scale(scale, scale);

  context.fillStyle = '#050505';
  context.fillRect(0, 0, width, height);
  drawText(context, 'Nook Brew Staff Schedule', padding, padding, { size: 34, weight: '300' });
  drawText(context, `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`, padding, padding + 48, { size: 16, weight: '700', color: '#a3a3a3' });

  let y = padding + titleHeight;
  weeks.forEach((weekDays, weekIndex) => {
    const x = padding;
    const tableWidth = memberWidth + weekDays.length * dayWidth;
    const tableHeight = weekHeaderHeight + dateHeaderHeight + employees.length * rowHeight;

    context.fillStyle = '#171717';
    fillRoundRect(context, x, y, tableWidth, tableHeight, 8);
    context.strokeStyle = '#303030';
    context.lineWidth = 1;
    strokeRoundRect(context, x, y, tableWidth, tableHeight, 8);

    drawText(context, `WEEK ${weekIndex + 1}`, x + 24, y + 20, { size: 16, weight: '800', color: '#f5f5f5' });
    drawText(context, `${format(weekDays[0], 'MMM d')} - ${format(weekDays[weekDays.length - 1], 'MMM d, yyyy')}`, x + 120, y + 22, { size: 13, weight: '700', color: '#9ca3af' });

    const headerY = y + weekHeaderHeight;
    context.fillStyle = '#121212';
    context.fillRect(x, headerY, tableWidth, dateHeaderHeight);
    context.strokeStyle = '#303030';
    context.beginPath();
    context.moveTo(x, headerY);
    context.lineTo(x + tableWidth, headerY);
    context.moveTo(x, headerY + dateHeaderHeight);
    context.lineTo(x + tableWidth, headerY + dateHeaderHeight);
    context.stroke();

    drawText(context, 'MEMBER', x + 24, headerY + 32, { size: 13, weight: '800', color: '#a3a3a3' });
    weekDays.forEach((day, dayIndex) => {
      const dayX = x + memberWidth + dayIndex * dayWidth;
      context.strokeStyle = '#303030';
      context.beginPath();
      context.moveTo(dayX, headerY);
      context.lineTo(dayX, y + tableHeight);
      context.stroke();
      drawText(context, format(day, 'EEE').toUpperCase(), dayX + dayWidth / 2, headerY + 20, { size: 14, weight: '800', align: 'center', color: isWeekend(day) ? '#d4d4d4' : '#a3a3a3' });
      drawText(context, format(day, 'd'), dayX + dayWidth / 2, headerY + 42, { size: 30, weight: '300', align: 'center', color: '#f5f5f5' });
    });

    employees.forEach((employee, employeeIndex) => {
      const rowY = headerY + dateHeaderHeight + employeeIndex * rowHeight;
      context.strokeStyle = '#303030';
      context.beginPath();
      context.moveTo(x, rowY);
      context.lineTo(x + tableWidth, rowY);
      context.stroke();

      context.fillStyle = employee.color;
      context.beginPath();
      context.arc(x + 42, rowY + rowHeight / 2, 19, 0, Math.PI * 2);
      context.fill();
      drawText(context, employee.name.charAt(0).toUpperCase(), x + 42, rowY + rowHeight / 2 - 10, { size: 16, weight: '800', align: 'center', color: '#050505' });
      drawText(context, employee.name, x + 74, rowY + 38, { size: 16, weight: '700', color: '#f5f5f5', maxWidth: memberWidth - 86 });
      drawText(context, employee.type.toUpperCase(), x + 74, rowY + 62, { size: 10, weight: '800', color: '#a3a3a3', maxWidth: memberWidth - 86 });

      weekDays.forEach((day, dayIndex) => {
        const cellX = x + memberWidth + dayIndex * dayWidth;
        const schedule = schedules.find((item) => isSameDay(new Date(item.date), day) && item.employeeId === employee.id);
        const shift = schedule ? shifts.find((item) => item.id === schedule.shiftTemplateId) : null;
        const leave = leaves.find((item) => item.employeeId === employee.id && item.status === 'Approved' && isWithinInterval(day, { start: item.startDate, end: item.endDate }));
        const isOff = employee.fixedOffDays.includes(day.getDay());

        if (shift) {
          const cardX = cellX + 14;
          const cardY = rowY + 18;
          const cardWidth = dayWidth - 28;
          const cardHeight = rowHeight - 36;
          context.fillStyle = hexToRgba(shift.color, 0.16);
          fillRoundRect(context, cardX, cardY, cardWidth, cardHeight, 8);
          context.fillStyle = shift.color;
          fillRoundRect(context, cardX, cardY, 4, cardHeight, 8);
          drawText(context, shift.name.toUpperCase(), cardX + 18, cardY + 18, { size: 13, weight: '800', color: shift.color, maxWidth: cardWidth - 30 });
          drawText(context, `${shift.startTime} - ${shift.endTime}`, cardX + 18, cardY + 44, { size: 12, weight: '700', color: '#a3a3a3', maxWidth: cardWidth - 30 });
        } else if (leave || isOff) {
          drawText(context, leave ? 'LEAVE' : 'OFF', cellX + dayWidth / 2, rowY + 48, { size: 14, weight: '900', align: 'center', color: leave ? '#ef4444' : '#737373' });
        }
      });
    });

    y += tableHeight + gap;
  });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Schedule image could not be created')), 'image/png');
  });
  await shareOrDownload(blob, filename);
}

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
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      const filename = `nook-schedule-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.png`;
      await exportScheduleCanvas({
        employees,
        shifts,
        schedules,
        leaves,
        weeks,
        startDate,
        endDate,
        filename,
      });
      toast.success('Schedule image ready');
    } catch (error) {
      console.warn('Schedule export failed:', error);
      toast.error(error instanceof Error ? error.message : 'Schedule image export failed');
    } finally {
      setIsExporting(false);
    }
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
          <Button variant="outline" onClick={handleExportImage} disabled={isExporting} className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-5 py-5 rounded-sm">
            <ImageDown className="mr-2 h-3.5 w-3.5" /> {isExporting ? 'Exporting' : 'Export Image'}
          </Button>
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
      </div>      <div className="space-y-10 bg-background p-2">
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
