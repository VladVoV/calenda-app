import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { TaskItem } from './TaskItem';
import type { Task, Holiday, DragPayload } from '@/types';
import { isToday } from '@/utils/calendar';
import { theme } from '@/utils/theme';
import { TASK_COLORS } from '@/utils/calendar';

interface Props {
  year: number;
  month: number;
  day: number;
  dateKey: string;
  current: boolean;
  tasks: Task[];
  holidays: Holiday[];
  searchQuery: string;
  draggingPayload: DragPayload | null;
  onTaskCreate: (dateKey: string, text: string, color: string) => void;
  onTaskUpdate: (id: string, dateKey: string, text: string) => void;
  onTaskDelete: (id: string, dateKey: string) => void;
  onDragStart: (payload: DragPayload) => void;
  onDrop: (targetDateKey: string, targetIndex: number) => void;
  onDragEnd: () => void;
}

const Cell = styled.div<{ current: boolean; today: boolean; dragOver: boolean }>`
  background: ${({ today }) => (today ? theme.colors.today : theme.colors.surface)};
  opacity: ${({ current }) => (current ? 1 : 0.55)};
  min-height: 120px;
  padding: 6px;
  position: relative;
  outline: ${({ dragOver }) => (dragOver ? `2px solid ${theme.colors.borderFocus}` : 'none')};
  outline-offset: -2px;
  transition: background 0.1s;
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const DayNumber = styled.span<{ today: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ today }) => (today ? '#ffffff' : theme.colors.textMuted)};
  background: ${({ today }) => (today ? theme.colors.todayAccent : 'transparent')};
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const AddBtn = styled.button`
  opacity: 0;
  font-size: 18px;
  line-height: 1;
  border: none;
  background: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 0 2px;
  border-radius: ${theme.radii.sm};
  transition: opacity 0.12s, background 0.12s;

  ${Cell}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${theme.colors.taskBg};
    color: ${theme.colors.text};
  }
`;

const HolidayTag = styled.div`
  background: ${theme.colors.holidayBg};
  color: ${theme.colors.holidayText};
  font-size: 10px;
  font-weight: 500;
  padding: 1px 5px;
  border-radius: ${theme.radii.sm};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewTaskInput = styled.input`
  width: 100%;
  border: 1px solid ${theme.colors.borderFocus};
  border-radius: ${theme.radii.md};
  padding: 3px 6px;
  font-size: 12px;
  outline: none;
  margin-top: 2px;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  font-family: inherit;
  box-shadow: 0 0 0 2px rgba(76,154,255,0.2);
`;

export function DayCell({
  year, month, day, dateKey, current,
  tasks, holidays, searchQuery,
  draggingPayload, onTaskCreate, onTaskUpdate,
  onTaskDelete, onDragStart, onDrop, onDragEnd,
}: Props) {
  const today = isToday(year, month, day);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const colorIdx = useRef(Math.floor(Math.random() * TASK_COLORS.length));
  const q = searchQuery.trim().toLowerCase();

  function commitAdd() {
    const text = newText.trim();
    if (text) {
      onTaskCreate(dateKey, text, TASK_COLORS[colorIdx.current++ % TASK_COLORS.length]);
    }
    setAdding(false);
    setNewText('');
  }

  function handleCellDragOver(e: React.DragEvent, idx?: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleCellDrop(e: React.DragEvent, targetIndex?: number) {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(dateKey, targetIndex ?? tasks.length);
  }

  return (
    <Cell
      current={current}
      today={today}
      dragOver={isDragOver && !draggingPayload?.sourceDateKey.includes(dateKey)}
      onDragOver={e => handleCellDragOver(e)}
      onDrop={e => handleCellDrop(e)}
      onDragLeave={() => setIsDragOver(false)}
    >
      <DayHeader>
        <DayNumber today={today}>{day}</DayNumber>
        <AddBtn
          title="Add task"
          onClick={() => { setAdding(true); setNewText(''); }}
        >
          +
        </AddBtn>
      </DayHeader>

      {holidays.map((h, i) => (
        <HolidayTag key={i} title={h.name}>{h.localName}</HolidayTag>
      ))}

      {tasks.map((task, idx) => (
        <TaskItem
          key={task._id}
          task={task}
          isDragging={draggingPayload?.taskId === task._id}
          isDimmed={Boolean(q && !task.text.toLowerCase().includes(q))}
          onUpdate={text => onTaskUpdate(task._id, dateKey, text)}
          onDelete={() => onTaskDelete(task._id, dateKey)}
          onDragStart={e => {
            e.stopPropagation();
            onDragStart({ taskId: task._id, sourceDateKey: dateKey, sourceIndex: idx });
          }}
          onDragOver={e => handleCellDragOver(e, idx)}
          onDrop={e => handleCellDrop(e, idx)}
          onDragEnd={onDragEnd}
        />
      ))}

      {adding && (
        <NewTaskInput
          placeholder="Task name…"
          value={newText}
          autoFocus
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') commitAdd();
            if (e.key === 'Escape') { setAdding(false); setNewText(''); }
          }}
          onBlur={commitAdd}
        />
      )}
    </Cell>
  );
}
