import { addDays, differenceInMinutes, format, parse } from 'date-fns';

export type EmploymentType = 'Fulltime' | 'Parttime';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type ShiftPriority = 'High' | 'Medium' | 'Low';

export interface Employee {
  id: string;
  name: string;
  type: EmploymentType;
  color: string;
  isActive: boolean;
  dailyWage?: number; // Only for Parttime
  fixedOffDays: number[]; // 0-6 (Sun-Sat)
  preferredShiftIds: string[];
  coreShiftTargets?: {
    morning?: number;
    night?: number;
  };
}

export interface DayStaffing {
  dayOfWeek: number;
  minStaff: number;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string;
  minStaff: number;
  maxStaff: number;
  priority: ShiftPriority;
  isActive: boolean;
  daySpecificStaffing?: DayStaffing[];
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: 'Vacation' | 'Sick' | 'Personal' | 'Other' | 'ShiftRequest';
  status: LeaveStatus;
  preferredShiftId?: string;
  reason?: string;
}

export interface ScheduledShift {
  id: string;
  date: Date;
  shiftTemplateId: string;
  employeeId: string;
  isLocked: boolean;
}

export type Theme = 'dark' | 'light';

export interface ScheduleConstraint {
  maxConsecutiveDays: number;
  minRestHours: number;
  ftMaxShiftsPerWeek: number;
  ftMinShiftsPerWeek: number;
  ptMaxShiftsPerWeek: number;
  ptMinShiftsPerWeek: number;
  ptMaxHoursPerWeek: number;
  requireMorningNightEveryday: boolean;
}

export interface ScheduleStats {
  totalShifts: number;
  totalHours: number;
  nightShifts: number;
  weekendShifts: number;
  salary?: number;
}

export function getShiftDurationMinutes(startTime: string, endTime: string): number {
  const start = parse(startTime, 'HH:mm', new Date());
  let end = parse(endTime, 'HH:mm', new Date());
  
  if (end < start) {
    end = addDays(end, 1);
  }
  
  return differenceInMinutes(end, start);
}
