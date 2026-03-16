import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';
import { useTasks } from '@/hooks/useTasks';
import { useHolidays } from '@/hooks/useHolidays';
import { buildCalendarDays, WEEKDAY_LABELS } from '@/utils/calendar';
import { theme } from '@/utils/theme';
import type { DragPayload } from '@/types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  background: ${theme.colors.border};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  overflow: hidden;
  box-shadow: ${theme.shadow.card};
`;

const WeekdayLabel = styled.div`
  background: ${theme.colors.bg};
  padding: 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  letter-spacing: 0.5px;
`;

const ErrorBanner = styled.div`
  background: #fff8f6;
  border: 1px solid #ff5630;
  color: #ff5630;
  padding: 10px 16px;
  border-radius: ${theme.radii.md};
  font-size: 13px;
  margin-bottom: 10px;
`;

export function Calendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState<DragPayload | null>(null);

  const { taskMap, loading, error, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const holidays = useHolidays(viewYear);

  const calDays = buildCalendarDays(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const handleDrop = useCallback(
    (targetDateKey: string, targetIndex: number) => {
      if (!dragging) return;
      moveTask(dragging.taskId, dragging.sourceDateKey, targetDateKey, targetIndex);
      setDragging(null);
    },
    [dragging, moveTask]
  );

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: theme.colors.textMuted }}>Loading calendar…</div>;

  return (
    <div>
      {error && <ErrorBanner>Failed to load tasks: {error}</ErrorBanner>}

      <CalendarHeader
        year={viewYear}
        month={viewMonth}
        searchQuery={search}
        onPrev={prevMonth}
        onNext={nextMonth}
        onToday={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
        onSearch={setSearch}
      />

      <Grid>
        {WEEKDAY_LABELS.map(label => (
          <WeekdayLabel key={label}>{label}</WeekdayLabel>
        ))}

        {calDays.map(({ year, month, day, current, dateKey }) => (
          <DayCell
            key={dateKey}
            year={year}
            month={month}
            day={day}
            dateKey={dateKey}
            current={current}
            tasks={taskMap[dateKey] ?? []}
            holidays={holidays[dateKey] ?? []}
            searchQuery={search}
            draggingPayload={dragging}
            onTaskCreate={(dk, text, color) => createTask({ dateKey: dk, text, color })}
            onTaskUpdate={(id, dk, text) => updateTask(id, dk, { text })}
            onTaskDelete={(id, dk) => deleteTask(id, dk)}
            onDragStart={setDragging}
            onDrop={handleDrop}
            onDragEnd={() => setDragging(null)}
          />
        ))}
      </Grid>
    </div>
  );
}
