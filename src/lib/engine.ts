import { 
  addDays, 
  eachDayOfInterval, 
  getDay, 
  isSameDay, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek,
  differenceInHours,
  parse
} from 'date-fns';
import { 
  Employee, 
  ShiftTemplate, 
  ScheduledShift, 
  LeaveRequest, 
  ScheduleConstraint,
  getShiftDurationMinutes
} from '../types';

export function generateSchedules(
  employees: Employee[],
  shifts: ShiftTemplate[],
  leaves: LeaveRequest[],
  existingSchedules: ScheduledShift[],
  startDate: Date,
  endDate: Date,
  constraints: ScheduleConstraint
): ScheduledShift[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const attemptCount = Math.max(36, Math.min(120, days.length * Math.max(4, employees.length) * 3));
  const candidates: { schedules: ScheduledShift[]; score: number }[] = [];

  for (let attempt = 0; attempt < attemptCount; attempt++) {
    const schedules = buildScheduleCandidate(
      employees,
      shifts,
      leaves,
      existingSchedules,
      days,
      constraints
    );
    candidates.push({
      schedules,
      score: scoreSchedule(schedules, employees, shifts, days),
    });
  }

  candidates.sort((a, b) => a.score - b.score);
  const topCandidates = candidates.slice(0, Math.min(8, candidates.length));
  return topCandidates[Math.floor(Math.random() * topCandidates.length)]?.schedules || [];
}

function buildScheduleCandidate(
  employees: Employee[],
  shifts: ShiftTemplate[],
  leaves: LeaveRequest[],
  existingSchedules: ScheduledShift[],
  days: Date[],
  constraints: ScheduleConstraint
): ScheduledShift[] {
  const newSchedules: ScheduledShift[] = [...existingSchedules.filter(s => s.isLocked)];
  
  // Sort shifts by priority (High -> Medium -> Low)
  const sortedShifts = [...shifts]
    .filter(s => s.isActive)
    .sort((a, b) => {
      // Rule 14: Mandatory Core Coverage boost
      if (constraints.requireMorningNightEveryday) {
        const isCoreA = isCoreShift(a);
        const isCoreB = isCoreShift(b);
        if (isCoreA && !isCoreB) return -1;
        if (!isCoreA && isCoreB) return 1;
      }

      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });

  // Keep track of assignments per day to prevent "one shift per day" rule
  const dailyWorkMap = new Map<string, Set<string>>(); // Date string -> Set of employee IDs

  // Pre-populate with locked shifts
  newSchedules.forEach(s => {
    const key = formatKey(s.date);
    if (!dailyWorkMap.has(key)) dailyWorkMap.set(key, new Set());
    dailyWorkMap.get(key)!.add(s.employeeId);
  });

  for (const day of days) {
    const dateKey = formatKey(day);
    if (!dailyWorkMap.has(dateKey)) dailyWorkMap.set(dateKey, new Set());
    const workersToday = dailyWorkMap.get(dateKey)!;

    const coreShifts = shuffleItems(sortedShifts.filter(isCoreShift));

    // Tier 1: Core coverage is mandatory when enabled.
    if (constraints.requireMorningNightEveryday) {
      for (const shift of coreShifts) {
        const currentStaffCount = newSchedules.filter(
          s => isSameDay(s.date, day) && s.shiftTemplateId === shift.id
        ).length;

        if (currentStaffCount >= 1) continue;

        assignBestAvailable(day, shift, employees, newSchedules, leaves, constraints, shifts, workersToday, dateKey, true);
      }
    }

    // Tier 2: Fill every active shift to its required minimum. A minimum of 0 is treated
    // as 1 so no active shift is left empty by default.
    const dailyShiftOrder = shuffleItems(sortedShifts);
    for (const shift of dailyShiftOrder) {
      const currentStaffCount = newSchedules.filter(
        s => isSameDay(s.date, day) && s.shiftTemplateId === shift.id
      ).length;

      const targetCount = getRequiredStaff(shift, day);
      
      for (let i = currentStaffCount; i < targetCount; i++) {
        const assigned = assignBestAvailable(day, shift, employees, newSchedules, leaves, constraints, shifts, workersToday, dateKey, false);
        if (!assigned) break;
      }
    }
  }

  return newSchedules;
}

type RelaxationLevel = 'strict' | 'weekly-cap' | 'consecutive-days' | 'rest-hours' | 'fixed-off';
type CoreShiftType = 'morning' | 'night' | null;

function isCoreShift(shift: ShiftTemplate): boolean {
  return getCoreShiftType(shift) !== null;
}

function getCoreShiftType(shift: ShiftTemplate): CoreShiftType {
  const name = shift.name.toLowerCase();
  if (name.includes('morning') || name.includes('pagi')) return 'morning';
  if (name.includes('night') || name.includes('malam')) return 'night';
  return null;
}

function getRequiredStaff(shift: ShiftTemplate, day: Date): number {
  const daySpecific = shift.daySpecificStaffing?.find(d => d.dayOfWeek === getDay(day));
  return Math.max(1, daySpecific ? daySpecific.minStaff : shift.minStaff);
}

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function assignBestAvailable(
  day: Date,
  shift: ShiftTemplate,
  employees: Employee[],
  newSchedules: ScheduledShift[],
  leaves: LeaveRequest[],
  constraints: ScheduleConstraint,
  shifts: ShiftTemplate[],
  workersToday: Set<string>,
  dateKey: string,
  isMandatoryCore: boolean
): boolean {
  const relaxationLevels: RelaxationLevel[] = isMandatoryCore
    ? ['strict', 'weekly-cap', 'consecutive-days', 'rest-hours', 'fixed-off']
    : ['strict', 'weekly-cap', 'consecutive-days', 'rest-hours', 'fixed-off'];

  for (const relaxationLevel of relaxationLevels) {
    const eligibleEmployees = getEligibleEmployees(
      day,
      shift,
      employees,
      newSchedules,
      leaves,
      constraints,
      shifts,
      workersToday,
      relaxationLevel
    );

    if (eligibleEmployees.length > 0) {
      assignEmployee(day, shift, eligibleEmployees, newSchedules, workersToday, constraints, leaves, dateKey, shifts);
      return true;
    }
  }

  return false;
}

// Helper: Filter eligible
function getEligibleEmployees(
  day: Date, 
  shift: ShiftTemplate, 
  employees: Employee[], 
  currentSchedules: ScheduledShift[],
  leaves: LeaveRequest[],
  constraints: ScheduleConstraint,
  allShifts: ShiftTemplate[],
  workersToday: Set<string>,
  relaxationLevel: RelaxationLevel = 'strict'
): Employee[] {
  return employees.filter(emp => {
    if (!emp.isActive) return false;
    
    // Rule 1: One shift per day
    if (workersToday.has(emp.id)) return false;

    // Rule 6: Fixed off days
    if (relaxationLevel !== 'fixed-off' && emp.fixedOffDays.includes(getDay(day))) return false;

    // Rule 11: Leave requests
    const isOnLeave = leaves.some(l => 
      l.employeeId === emp.id && 
      l.status === 'Approved' && 
      l.type !== 'ShiftRequest' &&
      isWithinInterval(day, { start: l.startDate, end: l.endDate })
    );
    if (isOnLeave) return false;

    // Rule 2 & 4: Max shifts per week & Min 1 day off
    const weekStart = startOfWeek(day, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(day, { weekStartsOn: 1 });
    const shiftsThisWeek = currentSchedules.filter(s => 
      s.employeeId === emp.id && 
      isWithinInterval(s.date, { start: weekStart, end: weekEnd })
    ).length;
    
    const maxShifts = emp.type === 'Fulltime' ? constraints.ftMaxShiftsPerWeek : constraints.ptMaxShiftsPerWeek;
    if (relaxationLevel === 'strict' && shiftsThisWeek >= maxShifts) return false;

    const coreShiftType = getCoreShiftType(shift);
    const weeklyCoreTarget = getCoreShiftTarget(emp, coreShiftType);
    if (
      (relaxationLevel === 'strict' || relaxationLevel === 'weekly-cap' || relaxationLevel === 'consecutive-days') &&
      weeklyCoreTarget !== undefined
    ) {
      const weeklyCoreCount = countWeeklyCoreShifts(emp.id, coreShiftType, currentSchedules, allShifts, weekStart, weekEnd);
      if (weeklyCoreCount >= weeklyCoreTarget) return false;
    }

    // Rule 12: Part-time Max Hours per week
    if (emp.type === 'Parttime' && relaxationLevel === 'strict') {
      const currentWeeklyShifts = currentSchedules.filter(s => 
        s.employeeId === emp.id && 
        isWithinInterval(s.date, { start: weekStart, end: weekEnd })
      );
      
      let totalWeeklyHours = 0;
      currentWeeklyShifts.forEach(s => {
        const t = allShifts.find(st => st.id === s.shiftTemplateId);
        if (t) {
          totalWeeklyHours += getShiftDurationMinutes(t.startTime, t.endTime) / 60;
        }
      });

      const newShiftDuration = getShiftDurationMinutes(shift.startTime, shift.endTime) / 60;
      if (totalWeeklyHours + newShiftDuration > constraints.ptMaxHoursPerWeek) return false;
    }

    // Rule 3: Max consecutive working days
    let consecutiveCount = 0;
    for (let d = 1; d <= constraints.maxConsecutiveDays; d++) {
      const prevDay = addDays(day, -d);
      const worked = currentSchedules.some(s => s.employeeId === emp.id && isSameDay(s.date, prevDay));
      if (worked) consecutiveCount++;
      else break;
    }
    if (
      (relaxationLevel === 'strict' || relaxationLevel === 'weekly-cap') &&
      consecutiveCount >= constraints.maxConsecutiveDays
    ) return false;

    // Rule 5: Min rest hours
    const prevDay = addDays(day, -1);
    const prevShift = currentSchedules.find(s => s.employeeId === emp.id && isSameDay(s.date, prevDay));
    if (prevShift) {
      const prevTemplate = allShifts.find(st => st.id === prevShift.shiftTemplateId);
      if (prevTemplate) {
        const prevEndStr = prevTemplate.endTime;
        const currStartStr = shift.startTime;
        
        const prevEndDate = parse(prevEndStr, 'HH:mm', prevDay);
        let currStartDate = parse(currStartStr, 'HH:mm', day);
        
        const prevStart = parse(prevTemplate.startTime, 'HH:mm', prevDay);
        let adjPrevEndDate = prevEndDate;
        if (prevEndDate < prevStart) {
          adjPrevEndDate = addDays(prevEndDate, 1);
        }

        const restHours = differenceInHours(currStartDate, adjPrevEndDate);
        if (
          (relaxationLevel === 'strict' || relaxationLevel === 'weekly-cap' || relaxationLevel === 'consecutive-days') &&
          restHours < constraints.minRestHours
        ) return false;
      }
    }

    return true;
  });
}

// Helper: Assign
function assignEmployee(
  day: Date,
  shift: ShiftTemplate,
  eligibleEmployees: Employee[],
  newSchedules: ScheduledShift[],
  workersToday: Set<string>,
  constraints: ScheduleConstraint,
  leaves: LeaveRequest[],
  dateKey: string,
  allShifts: ShiftTemplate[]
) {
  // Shuffle initially
  for (let i = eligibleEmployees.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligibleEmployees[i], eligibleEmployees[j]] = [eligibleEmployees[j], eligibleEmployees[i]];
  }

  // Sort by workload, preferences, and variety.
  eligibleEmployees.sort((a, b) => {
    return getAssignmentScore(a, day, shift, newSchedules, constraints, leaves, allShifts) -
      getAssignmentScore(b, day, shift, newSchedules, constraints, leaves, allShifts);
  });

  const selected = eligibleEmployees[0];
  const newAssignment: ScheduledShift = {
    id: `${dateKey}-${shift.id}-${selected.id}`,
    date: day,
    shiftTemplateId: shift.id,
    employeeId: selected.id,
    isLocked: false
  };

  newSchedules.push(newAssignment);
  workersToday.add(selected.id);
}

function getAssignmentScore(
  employee: Employee,
  day: Date,
  shift: ShiftTemplate,
  schedules: ScheduledShift[],
  constraints: ScheduleConstraint,
  leaves: LeaveRequest[],
  allShifts: ShiftTemplate[]
): number {
  const weekStart = startOfWeek(day, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(day, { weekStartsOn: 1 });
  const weekSchedules = schedules.filter(s =>
    s.employeeId === employee.id &&
    isWithinInterval(s.date, { start: weekStart, end: weekEnd })
  );

  const totalCount = schedules.filter(s => s.employeeId === employee.id).length;
  const weekCount = weekSchedules.length;
  const minShifts = employee.type === 'Fulltime' ? constraints.ftMinShiftsPerWeek : constraints.ptMinShiftsPerWeek;
  const underMinimumBonus = weekCount < minShifts ? -40 : 0;
  const coreShiftType = getCoreShiftType(shift);
  const coreShiftTarget = getCoreShiftTarget(employee, coreShiftType);
  const coreShiftCount = countWeeklyCoreShifts(employee.id, coreShiftType, schedules, allShifts, weekStart, weekEnd);
  const coreTargetScore = coreShiftTarget === undefined
    ? 0
    : coreShiftCount < coreShiftTarget
      ? (coreShiftTarget - coreShiftCount) * -35
      : (coreShiftCount - coreShiftTarget + 1) * 70;

  let consecutiveDays = 0;
  for (let d = 1; d <= constraints.maxConsecutiveDays; d++) {
    const prevDay = addDays(day, -d);
    if (schedules.some(s => s.employeeId === employee.id && isSameDay(s.date, prevDay))) consecutiveDays++;
    else break;
  }

  const sameShiftRecently = [addDays(day, -1), addDays(day, -2)].some(prevDay =>
    schedules.some(s =>
      s.employeeId === employee.id &&
      s.shiftTemplateId === shift.id &&
      isSameDay(s.date, prevDay)
    )
  ) ? 24 : 0;

  const coreStreakPenalty = getCoreStreakPenalty(employee.id, coreShiftType, day, schedules, allShifts);

  const requestedShiftBonus = leaves.some(l =>
    l.employeeId === employee.id &&
    l.type === 'ShiftRequest' &&
    l.status === 'Approved' &&
    isWithinInterval(day, { start: l.startDate, end: l.endDate }) &&
    l.preferredShiftId === shift.id
  ) ? -18 : 0;

  const preferredShiftBonus = employee.preferredShiftIds.includes(shift.id) ? -3 : 0;
  const weekendLoad = [0, 6].includes(getDay(day))
    ? schedules.filter(s => {
      const scheduleDay = getDay(s.date);
      return s.employeeId === employee.id && (scheduleDay === 0 || scheduleDay === 6);
    }).length * 4
    : 0;

  const previousDayShift = schedules.find(s => s.employeeId === employee.id && isSameDay(s.date, addDays(day, -1)));
  const restPenalty = previousDayShift
    ? getRestPenalty(previousDayShift, shift, day, allShifts, constraints)
    : 0;

  return (
    totalCount * 6 +
    weekCount * 12 +
    consecutiveDays * 7 +
    sameShiftRecently +
    coreStreakPenalty +
    weekendLoad +
    restPenalty +
    coreTargetScore +
    underMinimumBonus +
    requestedShiftBonus +
    preferredShiftBonus +
    Math.random() * 12
  );
}

function getCoreStreakPenalty(
  employeeId: string,
  coreShiftType: CoreShiftType,
  day: Date,
  schedules: ScheduledShift[],
  allShifts: ShiftTemplate[]
): number {
  if (!coreShiftType) return 0;

  let streak = 0;
  for (let d = 1; d <= 3; d++) {
    const prevDay = addDays(day, -d);
    const prevSchedule = schedules.find(schedule =>
      schedule.employeeId === employeeId &&
      isSameDay(schedule.date, prevDay)
    );
    if (!prevSchedule) break;

    const prevShift = allShifts.find(shift => shift.id === prevSchedule.shiftTemplateId);
    if (!prevShift || getCoreShiftType(prevShift) !== coreShiftType) break;
    streak++;
  }

  if (streak === 0) return 0;
  return streak * streak * 38;
}

function scoreSchedule(
  schedules: ScheduledShift[],
  employees: Employee[],
  shifts: ShiftTemplate[],
  days: Date[]
): number {
  let score = 0;

  for (const day of days) {
    for (const shift of shifts.filter(item => item.isActive)) {
      const requiredStaff = getRequiredStaff(shift, day);
      const assignedCount = schedules.filter(schedule =>
        isSameDay(schedule.date, day) &&
        schedule.shiftTemplateId === shift.id
      ).length;

      if (assignedCount < requiredStaff) {
        score += (requiredStaff - assignedCount) * 10000;
      }
      if (assignedCount > shift.maxStaff) {
        score += (assignedCount - shift.maxStaff) * 2500;
      }
    }
  }

  for (const employee of employees) {
    let currentCoreType: CoreShiftType = null;
    let currentRun = 0;

    for (const day of days) {
      const schedule = schedules.find(item =>
        item.employeeId === employee.id &&
        isSameDay(item.date, day)
      );
      const shift = schedule ? shifts.find(item => item.id === schedule.shiftTemplateId) : undefined;
      const coreType = shift ? getCoreShiftType(shift) : null;

      if (coreType && coreType === currentCoreType) {
        currentRun++;
      } else {
        currentCoreType = coreType;
        currentRun = coreType ? 1 : 0;
      }

      if (currentRun > 1) {
        score += currentRun * currentRun * 420;
      }
    }

    const weekStarts = uniqueWeekStarts(days);
    for (const weekStart of weekStarts) {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      for (const coreType of ['morning', 'night'] as const) {
        const target = getCoreShiftTarget(employee, coreType);
        if (target === undefined) continue;

        const count = countWeeklyCoreShifts(employee.id, coreType, schedules, shifts, weekStart, weekEnd);
        score += Math.abs(count - target) * 90;
      }
    }
  }

  return score + Math.random() * 250;
}

function uniqueWeekStarts(days: Date[]): Date[] {
  const weekMap = new Map<string, Date>();

  days.forEach(day => {
    const weekStart = startOfWeek(day, { weekStartsOn: 1 });
    weekMap.set(formatKey(weekStart), weekStart);
  });

  return [...weekMap.values()];
}

function getCoreShiftTarget(employee: Employee, coreShiftType: CoreShiftType): number | undefined {
  if (!coreShiftType) return undefined;
  const target = employee.coreShiftTargets?.[coreShiftType];
  return typeof target === 'number' && target >= 0 ? target : undefined;
}

function countWeeklyCoreShifts(
  employeeId: string,
  coreShiftType: CoreShiftType,
  schedules: ScheduledShift[],
  allShifts: ShiftTemplate[],
  weekStart: Date,
  weekEnd: Date
): number {
  if (!coreShiftType) return 0;

  return schedules.filter(schedule => {
    if (schedule.employeeId !== employeeId) return false;
    if (!isWithinInterval(schedule.date, { start: weekStart, end: weekEnd })) return false;

    const shift = allShifts.find(item => item.id === schedule.shiftTemplateId);
    return shift ? getCoreShiftType(shift) === coreShiftType : false;
  }).length;
}

function getRestPenalty(
  previousShift: ScheduledShift,
  nextShift: ShiftTemplate,
  day: Date,
  allShifts: ShiftTemplate[],
  constraints: ScheduleConstraint
): number {
  const prevTemplate = allShifts.find(st => st.id === previousShift.shiftTemplateId);
  if (!prevTemplate) return 0;

  const prevDay = addDays(day, -1);
  const prevStart = parse(prevTemplate.startTime, 'HH:mm', prevDay);
  const prevEnd = parse(prevTemplate.endTime, 'HH:mm', prevDay);
  const adjustedPrevEnd = prevEnd < prevStart ? addDays(prevEnd, 1) : prevEnd;
  const nextStart = parse(nextShift.startTime, 'HH:mm', day);
  const restHours = differenceInHours(nextStart, adjustedPrevEnd);

  return restHours < constraints.minRestHours ? 100 : 0;
}

function formatKey(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return 'invalid-date';
  return d.toISOString().split('T')[0];
}
