export interface Task {
  _id: string;
  text: string;
  color: string;
  dateKey: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  text: string;
  color?: string;
  dateKey: string;
  order?: number;
}

export interface UpdateTaskDto {
  text?: string;
  color?: string;
  order?: number;
  dateKey?: string;
}

export interface ReorderTasksDto {
  tasks: Array<{ _id: string; order: number; dateKey: string }>;
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  fixed: boolean;
}

export type HolidayMap = Record<string, Holiday[]>;

export interface CalendarDay {
  year: number;
  month: number;
  day: number;
  current: boolean;
  dateKey: string;
}

export type DragPayload = {
  taskId: string;
  sourceDateKey: string;
  sourceIndex: number;
};
