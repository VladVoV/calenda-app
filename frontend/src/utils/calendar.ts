import type { CalendarDay } from '@/types';

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const y = month === 0 ? year - 1 : year;
    const m = month === 0 ? 11 : month - 1;
    days.push({ year: y, month: m, day: d, current: false, dateKey: formatDateKey(y, m, d) });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ year, month, day: d, current: true, dateKey: formatDateKey(year, month, d) });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const y = month === 11 ? year + 1 : year;
    const m = month === 11 ? 0 : month + 1;
    days.push({ year: y, month: m, day: d, current: false, dateKey: formatDateKey(y, m, d) });
  }

  return days;
}

export function isToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TASK_COLORS = [
  '#0052cc', '#00875a', '#ff5630', '#6554c0',
  '#00b8d9', '#36b37e', '#ff7452', '#ffc400',
];

export function pickColor(idx: number): string {
  return TASK_COLORS[idx % TASK_COLORS.length];
}
