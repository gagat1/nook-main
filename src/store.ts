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
  AuthCredentials,
  getShiftDurationMinutes
} from './types';
import { generateSchedules } from './lib/engine';
import { format, startOfWeek, endOfWeek, isWithinInterval, isSameDay } from 'date-fns';
import { isSupabaseConfigured } from './lib/supabase';
import { deleteJsonRow, loadJsonRows, replaceJsonRows, saveSingleton, upsertJsonRow, upsertJsonRows } from './lib/supabaseSync';

interface ScheduleState {
  employees: Employee[];
  shifts: ShiftTemplate[];
  leaves: LeaveRequest[];
  schedules: ScheduledShift[];
  constraints: ScheduleConstraint;
  theme: Theme;
  authCredentials: AuthCredentials;
  isSupabaseReady: boolean;
  syncFromSupabase: () => Promise<void>;
  updateConstraints: (constraints: ScheduleConstraint) => void;
  updateAuthCredentials: (credentials: AuthCredentials) => void;
  
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

const defaultAuthCredentials: AuthCredentials = {
  username: 'admin',
  password: 'admin',
  pin: '1234',
};

const TABLES = {
  employees: 'shift_employees',
  shifts: 'shift_templates',
  leaves: 'leave_requests',
  schedules: 'scheduled_shifts',
  settings: 'app_settings',
};

function syncError(error: unknown) {
  console.warn('Supabase sync skipped:', error);
}

function serializeSchedule(schedule: ScheduledShift): ScheduledShift {
  return { ...schedule, date: new Date(schedule.date) };
}

function serializeLeave(leave: LeaveRequest): LeaveRequest {
  return {
    ...leave,
    startDate: new Date(leave.startDate),
    endDate: new Date(leave.endDate),
  };
}

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
      authCredentials: defaultAuthCredentials,
      isSupabaseReady: false,

      syncFromSupabase: async () => {
        if (!isSupabaseConfigured) return;
        set({ isSupabaseReady: false });
        try {
          const [employees, shifts, leaves, schedules, settings] = await Promise.all([
            loadJsonRows<Employee>(TABLES.employees),
            loadJsonRows<ShiftTemplate>(TABLES.shifts),
            loadJsonRows<LeaveRequest>(TABLES.leaves),
            loadJsonRows<ScheduledShift>(TABLES.schedules),
            loadJsonRows<{ id: string; constraints?: ScheduleConstraint; theme?: Theme; authCredentials?: AuthCredentials }>(TABLES.settings),
          ]);

          const appSettings = settings.find((item) => item.id === 'app');
          const nextEmployees = employees.length ? employees : get().employees;
          const nextShifts = shifts.length ? shifts : get().shifts;
          const nextLeaves = leaves.length ? leaves.map(serializeLeave) : get().leaves;
          const nextSchedules = schedules.length ? schedules.map(serializeSchedule) : get().schedules;

          set((state) => ({
            employees: nextEmployees,
            shifts: nextShifts,
            leaves: nextLeaves,
            schedules: nextSchedules,
            constraints: appSettings?.constraints || state.constraints,
            theme: appSettings?.theme || state.theme,
            authCredentials: appSettings?.authCredentials || state.authCredentials,
            isSupabaseReady: true,
          }));

          if (!employees.length) void upsertJsonRows(TABLES.employees, nextEmployees).catch(syncError);
          if (!shifts.length) void upsertJsonRows(TABLES.shifts, nextShifts).catch(syncError);
          if (!leaves.length && nextLeaves.length) void upsertJsonRows(TABLES.leaves, nextLeaves).catch(syncError);
          if (!schedules.length && nextSchedules.length) void upsertJsonRows(TABLES.schedules, nextSchedules).catch(syncError);
          if (!appSettings) void saveSingleton(TABLES.settings, 'app', {
            constraints: get().constraints,
            theme: get().theme,
            authCredentials: get().authCredentials,
          }).catch(syncError);
          if (appSettings && !appSettings.authCredentials) void saveSingleton(TABLES.settings, 'app', {
            constraints: get().constraints,
            theme: get().theme,
            authCredentials: get().authCredentials,
          }).catch(syncError);
        } catch (error) {
          set({ isSupabaseReady: false });
          syncError(error);
        }
      },

      setTheme: (theme) => {
        set({ theme });
        void saveSingleton(TABLES.settings, 'app', { constraints: get().constraints, theme, authCredentials: get().authCredentials }).catch(syncError);
      },
      updateConstraints: (constraints) => {
        set({ constraints });
        void saveSingleton(TABLES.settings, 'app', { constraints, theme: get().theme, authCredentials: get().authCredentials }).catch(syncError);
      },
      updateAuthCredentials: (authCredentials) => {
        set({ authCredentials });
        void saveSingleton(TABLES.settings, 'app', { constraints: get().constraints, theme: get().theme, authCredentials }).catch(syncError);
      },
      addEmployee: (emp) => {
        set((state) => ({ employees: [...state.employees, emp] }));
        void upsertJsonRow(TABLES.employees, emp).catch(syncError);
      },
      updateEmployee: (emp) => {
        set((state) => ({
          employees: state.employees.map((e) => (e.id === emp.id ? emp : e)),
        }));
        void upsertJsonRow(TABLES.employees, emp).catch(syncError);
      },
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          schedules: state.schedules.filter((s) => s.employeeId !== id),
          leaves: state.leaves.filter((l) => l.employeeId !== id),
        }));
        void Promise.all([
          deleteJsonRow(TABLES.employees, id),
          replaceJsonRows(TABLES.schedules, get().schedules),
          replaceJsonRows(TABLES.leaves, get().leaves),
        ]).catch(syncError);
      },

      addShift: (shift) => {
        set((state) => ({ shifts: [...state.shifts, shift] }));
        void upsertJsonRow(TABLES.shifts, shift).catch(syncError);
      },
      updateShift: (shift) => {
        set((state) => ({
          shifts: state.shifts.map((s) => (s.id === shift.id ? shift : s)),
        }));
        void upsertJsonRow(TABLES.shifts, shift).catch(syncError);
      },
      deleteShift: (id) => {
        set((state) => ({
          shifts: state.shifts.filter((s) => s.id !== id),
          schedules: state.schedules.filter((s) => s.shiftTemplateId !== id),
        }));
        void Promise.all([
          deleteJsonRow(TABLES.shifts, id),
          replaceJsonRows(TABLES.schedules, get().schedules),
        ]).catch(syncError);
      },
      duplicateShift: (id) => set((state) => {
        const original = state.shifts.find(s => s.id === id);
        if (!original) return state;
        const copy = { ...original, id: Math.random().toString(36).substr(2, 9), name: `${original.name} (Copy)` };
        void upsertJsonRow(TABLES.shifts, copy).catch(syncError);
        return { shifts: [...state.shifts, copy] };
      }),

      addLeave: (leave) => {
        set((state) => ({ leaves: [...state.leaves, leave] }));
        void upsertJsonRow(TABLES.leaves, leave).catch(syncError);
      },
      updateLeave: (leave) => {
        set((state) => ({
          leaves: state.leaves.map((l) => (l.id === leave.id ? leave : l)),
        }));
        void upsertJsonRow(TABLES.leaves, leave).catch(syncError);
      },
      deleteLeave: (id) => {
        set((state) => ({ leaves: state.leaves.filter((l) => l.id !== id) }));
        void deleteJsonRow(TABLES.leaves, id).catch(syncError);
      },

      updateSchedule: (schedule) => set((state) => {
        const exists = state.schedules.some(s => s.id === schedule.id);
        void upsertJsonRow(TABLES.schedules, schedule).catch(syncError);
        if (exists) {
          return { schedules: state.schedules.map(s => s.id === schedule.id ? schedule : s) };
        }
        return { schedules: [...state.schedules, schedule] };
      }),
      deleteSchedule: (id) => {
        set((state) => ({
          schedules: state.schedules.filter(s => s.id !== id)
        }));
        void deleteJsonRow(TABLES.schedules, id).catch(syncError);
      },
      toggleLock: (id) => {
        set((state) => ({
          schedules: state.schedules.map(s => s.id === id ? { ...s, isLocked: !s.isLocked } : s)
        }));
        const updated = get().schedules.find((schedule) => schedule.id === id);
        if (updated) void upsertJsonRow(TABLES.schedules, updated).catch(syncError);
      },

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
    void replaceJsonRows(TABLES.schedules, generated).catch(syncError);
  },
      clearSchedules: () => {
        set((state) => ({ schedules: state.schedules.filter(s => s.isLocked) }));
        void replaceJsonRows(TABLES.schedules, get().schedules).catch(syncError);
      },

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
          state.authCredentials = state.authCredentials || defaultAuthCredentials;
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
