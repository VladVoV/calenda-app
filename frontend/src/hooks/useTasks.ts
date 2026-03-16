import { useState, useEffect, useCallback } from 'react';
import { tasksApi } from '@/api';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

type TaskMap = Record<string, Task[]>;

function toMap(tasks: Task[]): TaskMap {
  return tasks.reduce<TaskMap>((acc, t) => {
    if (!acc[t.dateKey]) acc[t.dateKey] = [];
    acc[t.dateKey].push(t);
    return acc;
  }, {});
}

function sortByOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

export function useTasks() {
  const [taskMap, setTaskMap] = useState<TaskMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tasksApi
      .getAll()
      .then(tasks => {
        const map = toMap(tasks);
        const sorted: TaskMap = {};
        Object.keys(map).forEach(k => { sorted[k] = sortByOrder(map[k]); });
        setTaskMap(sorted);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const createTask = useCallback(async (dto: CreateTaskDto) => {
    const tasks = taskMap[dto.dateKey] ?? [];
    const payload: CreateTaskDto = { ...dto, order: tasks.length };
    const created = await tasksApi.create(payload);
    setTaskMap(prev => ({
      ...prev,
      [dto.dateKey]: [...(prev[dto.dateKey] ?? []), created],
    }));
  }, [taskMap]);

  const updateTask = useCallback(async (id: string, dateKey: string, dto: UpdateTaskDto) => {
    const updated = await tasksApi.update(id, dto);
    setTaskMap(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).map(t => (t._id === id ? updated : t)),
    }));
  }, []);

  const deleteTask = useCallback(async (id: string, dateKey: string) => {
    await tasksApi.remove(id);
    setTaskMap(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).filter(t => t._id !== id),
    }));
  }, []);

  const moveTask = useCallback(
    async (
      taskId: string,
      sourceDateKey: string,
      targetDateKey: string,
      targetIndex: number
    ) => {
      setTaskMap(prev => {
        const next = { ...prev };
        const src = [...(next[sourceDateKey] ?? [])];
        const taskIdx = src.findIndex(t => t._id === taskId);
        if (taskIdx === -1) return prev;
        const [task] = src.splice(taskIdx, 1);

        const dst =
          sourceDateKey === targetDateKey ? src : [...(next[targetDateKey] ?? [])];

        dst.splice(targetIndex, 0, { ...task, dateKey: targetDateKey });

        next[sourceDateKey] = src.map((t, i) => ({ ...t, order: i }));
        next[targetDateKey] = dst.map((t, i) => ({ ...t, order: i }));

        return next;
      });

      setTaskMap(current => {
        const affectedKeys = new Set([sourceDateKey, targetDateKey]);
        const reorderPayload: Array<{ _id: string; order: number; dateKey: string }> = [];
        affectedKeys.forEach(key => {
          (current[key] ?? []).forEach(t => {
            reorderPayload.push({ _id: t._id, order: t.order, dateKey: key });
          });
        });
        tasksApi.reorder({ tasks: reorderPayload }).catch(console.error);
        return current;
      });
    },
    []
  );

  return { taskMap, loading, error, createTask, updateTask, deleteTask, moveTask };
}
