import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Employee, 
  ShiftTemplate, 
  LeaveRequest, 
  ScheduledShift, 
  ScheduleConstraint,
  ScheduleStats,
  Theme,
  getShiftDurationMinutes
} from './types';
import { generateSchedules } from './lib/engine';
import { format, startOfWeek, endOfWeek, isWithinInterval, isSameDay } from 'date-fns';

interface ScheduleState {
  employees: Employee[];
  shifts: ShiftTemplate[];
  leaves: LeaveRequest[];
  schedules: ScheduledShift[];
  constraints: ScheduleConstraint;
  theme: Theme;
  
  // Actions
  setTheme: (theme: Theme) => void;
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  
  addShift: (shift: ShiftTemplate) => void;
  updateShift: (shift: ShiftTemplate) => void;
  deleteShift: (id: string) => void;
  duplicateShift: (id: string) => void;
  
  addLeave: (leave: LeaveRequest) => void;
  updateLeave: (leave: LeaveRequest) => void;
  deleteLeave: (id: string) => void;
  
  updateSchedule: (schedule: ScheduledShift) => void;
  deleteSchedule: (id: string) => void;
  toggleLock: (id: string) => void;
  
  generateAll: (
    startDate: Date,
    endDate: Date,
    filter?: { employeeIds?: string[]; days?: Date[] }
  ) => void;
  clearSchedules: () => void;
  
  getStats: (employeeId: string, startDate: Date, endDate: Date) => ScheduleStats;
}

const initialEmployees: Employee[] = [
  { id: '1', name: 'Sijo', type: 'Fulltime', color: '#3b82f6', isActive: true, fixedOffDays: [0], preferredShiftIds: ['morn'], coreShiftTargets: { morning: 3, night: 3 } },
  { id: '2', name: 'Rehan', type: 'Fulltime', color: '#10b981', isActive: true, fixedOffDays: [1], preferredShiftIds: ['morn'], coreShiftTargets: { morning: 3, night: 3 } },
  { id: '3', name: 'Zara', type: 'Fulltime', color: '#f59e0b', isActive: true, dailyWage: 70000, fixedOffDays: [0, 6], preferredShiftIds: ['night'], coreShiftTargets: { morning: 3, night: 3 } },
];

const initialShifts: ShiftTemplate[] = [
  { 
    id: 'morn', 
    name: 'Morning', 
    startTime: '07:00', 
    endTime: '15:00', 
    color: '#fbbf24', 
    minStaff: 1, 
    maxStaff: 2, 
    priority: 'High', 
    isActive: true,
    daySpecificStaffing: [
      { dayOfWeek: 0, minStaff: 2 }, // Sunday
      { dayOfWeek: 6, minStaff: 2 }, // Saturday
    ]
  },
  { id: 'night', name: 'Night', startTime: '14:00', endTime: '22:00', color: '#10b981', minStaff: 1, maxStaff: 2, priority: 'High', isActive: true },
];

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      employees: initialEmployees,
      shifts: initialShifts,
      leaves: [],
      schedules: [],
      constraints: {
        maxConsecutiveDays: 5,
        minRestHours: 11,
        ftMaxShiftsPerWeek: 6,
        ftMinShiftsPerWeek: 5,
        ptMaxShiftsPerWeek: 4,
        ptMinShiftsPerWeek: 2,
        ptMaxHoursPerWeek: 20,
        requireMorningNightEveryday: true,
      },
      theme: 'dark',

      setTheme: (theme) => set({ theme }),
      addEmployee: (emp) => set((state) => ({ employees: [...state.employees, emp] })),
      updateEmployee: (emp) => set((state) => ({
        employees: state.employees.map((e) => (e.id === emp.id ? emp : e)),
      })),
      deleteEmployee: (id) => set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
        schedules: state.schedules.filter((s) => s.employeeId !== id),
        leaves: state.leaves.filter((l) => l.employeeId !== id),
      })),

      addShift: (shift) => set((state) => ({ shifts: [...state.shifts, shift] })),
      updateShift: (shift) => set((state) => ({
        shifts: state.shifts.map((s) => (s.id === shift.id ? shift : s)),
      })),
      deleteShift: (id) => set((state) => ({
        shifts: state.shifts.filter((s) => s.id !== id),
        schedules: state.schedules.filter((s) => s.shiftTemplateId !== id),
      })),
      duplicateShift: (id) => set((state) => {
        const original = state.shifts.find(s => s.id === id);
        if (!original) return state;
        const copy = { ...original, id: Math.random().toString(36).substr(2, 9), name: `${original.name} (Copy)` };
        return { shifts: [...state.shifts, copy] };
      }),

      addLeave: (leave) => set((state) => ({ leaves: [...state.leaves, leave] })),
      updateLeave: (leave) => set((state) => ({
        leaves: state.leaves.map((l) => (l.id === leave.id ? leave : l)),
      })),
      deleteLeave: (id) => set((state) => ({ leaves: state.leaves.filter((l) => l.id !== id) })),

      updateSchedule: (schedule) => set((state) => {
        const exists = state.schedules.some(s => s.id === schedule.id);
        if (exists) {
          return { schedules: state.schedules.map(s => s.id === schedule.id ? schedule : s) };
        }
        return { schedules: [...state.schedules, schedule] };
      }),
      deleteSchedule: (id) => set((state) => ({
        schedules: state.schedules.filter(s => s.id !== id)
      })),
      toggleLock: (id) => set((state) => ({
        schedules: state.schedules.map(s => s.id === id ? { ...s, isLocked: !s.isLocked } : s)
      })),

  generateAll: (startDate, endDate, filter?: { employeeIds?: string[], days?: Date[] }) => {
    const { employees: allEmployees, shifts, leaves, schedules: currentSchedules, constraints } = get();
    
    // Filter employees if specified
    const targetEmployees = filter?.employeeIds 
      ? allEmployees.filter(e => filter.employeeIds!.includes(e.id))
      : allEmployees;

    // Filter days if specified
    const targetStartDate = filter?.days?.[0] || startDate;
    const targetEndDate = filter?.days?.[filter.days.length - 1] || endDate;

    const generated = generateSchedules(
      targetEmployees, 
      shifts, 
      leaves, 
      currentSchedules, 
      targetStartDate, 
      targetEndDate, 
      constraints
    );

    // Merge generated with current (keeping original for non-targeted entries if filter was used)
    if (filter) {
      set({ schedules: generated }); // generateSchedules already handles merging with existing schedules passed to it
    } else {
      set({ schedules: generated });
    }
  },
      clearSchedules: () => set((state) => ({ schedules: state.schedules.filter(s => s.isLocked) })),

      getStats: (employeeId, startDate, endDate) => {
        const { schedules, shifts, employees } = get();
        const emp = employees.find(e => e.id === employeeId);
        const empSchedules = schedules.filter(s => 
          s.employeeId === employeeId && 
          isWithinInterval(s.date, { start: startDate, end: endDate })
        );

        let totalHours = 0;
        let nightShifts = 0;
        let weekendShifts = 0;

        empSchedules.forEach(s => {
          const template = shifts.find(st => st.id === s.shiftTemplateId);
          if (template) {
            totalHours += getShiftDurationMinutes(template.startTime, template.endTime) / 60;
            if (template.startTime >= '18:00' || template.startTime <= '04:00') {
              nightShifts++;
            }
            const day = new Date(s.date).getDay();
            if (day === 0 || day === 6) {
              weekendShifts++;
            }
          }
        });

        const salary = emp?.dailyWage 
          ? emp.dailyWage * empSchedules.length 
          : undefined;

        return {
          totalShifts: empSchedules.length,
          totalHours,
          nightShifts,
          weekendShifts,
          salary
        };
      }
    }),
    {
      name: 'shift-shift-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.employees = (state.employees || []).map(e => ({
            ...e,
            coreShiftTargets: e.coreShiftTargets || { morning: 3, night: 3 },
          }));
          state.schedules = (state.schedules || []).map(s => ({ 
            ...s, 
            date: s.date instanceof Date ? s.date : new Date(s.date) 
          }));
          state.leaves = (state.leaves || []).map(l => ({ 
            ...l, 
            startDate: l.startDate instanceof Date ? l.startDate : new Date(l.startDate), 
            endDate: l.endDate instanceof Date ? l.endDate : new Date(l.endDate) 
          }));
        }
      }
    }
  )
);
