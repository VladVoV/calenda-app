import axios from 'axios';
import type { Task, CreateTaskDto, UpdateTaskDto, ReorderTasksDto, Holiday } from '@/types';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

const http = axios.create({ baseURL: BASE });


export const tasksApi = {
  getAll(): Promise<Task[]> {
    return http.get<Task[]>('/tasks').then(r => r.data);
  },

  getByDateKey(dateKey: string): Promise<Task[]> {
    return http.get<Task[]>(`/tasks?dateKey=${dateKey}`).then(r => r.data);
  },

  create(dto: CreateTaskDto): Promise<Task> {
    return http.post<Task>('/tasks', dto).then(r => r.data);
  },

  update(id: string, dto: UpdateTaskDto): Promise<Task> {
    return http.patch<Task>(`/tasks/${id}`, dto).then(r => r.data);
  },

  remove(id: string): Promise<void> {
    return http.delete(`/tasks/${id}`).then(() => undefined);
  },

  reorder(dto: ReorderTasksDto): Promise<void> {
    return http.post('/tasks/reorder', dto).then(() => undefined);
  },
};


const holidayCache = new Map<string, Holiday[]>();

export async function fetchHolidays(year: number, countryCode = 'US'): Promise<Holiday[]> {
  const key = `${year}-${countryCode}`;
  if (holidayCache.has(key)) return holidayCache.get(key)!;

  const res = await axios.get<Holiday[]>(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
  );
  holidayCache.set(key, res.data);
  return res.data;
}
