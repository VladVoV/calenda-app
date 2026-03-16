import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import type { Task } from '@/types';
import { theme } from '@/utils/theme';

interface Props {
  task: Task;
  isDragging: boolean;
  isDimmed: boolean;
  onUpdate: (text: string) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

const Wrapper = styled.div<{ isDragging: boolean; isDimmed: boolean; color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 3px 5px;
  border-radius: ${theme.radii.md};
  border-left: 3px solid ${({ color }) => color};
  background: ${theme.colors.taskBg};
  font-size: ${theme.font.size.sm};
  cursor: grab;
  user-select: none;
  margin-bottom: 2px;
  opacity: ${({ isDragging }) => (isDragging ? 0.35 : 1)};
  filter: ${({ isDimmed }) => (isDimmed ? 'opacity(0.25)' : 'none')};
  transition: box-shadow 0.12s, opacity 0.12s;
  position: relative;

  &:hover {
    background: ${theme.colors.taskBgHover};
    box-shadow: ${theme.shadow.card};
  }

  &:hover .delete-btn {
    opacity: 1;
  }
`;

const Dot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
  margin-top: 3px;
`;

const Text = styled.span`
  flex: 1;
  line-height: 1.4;
  color: ${theme.colors.text};
  word-break: break-word;
  font-size: ${theme.font.size.sm};
`;

const EditArea = styled.textarea`
  flex: 1;
  font-size: ${theme.font.size.sm};
  border: none;
  outline: none;
  background: transparent;
  color: ${theme.colors.text};
  resize: none;
  font-family: inherit;
  line-height: 1.4;
  cursor: text;
`;

const DeleteBtn = styled.button`
  opacity: 0;
  font-size: 15px;
  cursor: pointer;
  border: none;
  background: none;
  color: ${theme.colors.textSubtle};
  flex-shrink: 0;
  line-height: 1;
  padding: 0 1px;
  transition: opacity 0.12s, color 0.12s;
  align-self: flex-start;

  &:hover {
    color: #ff5630;
  }
`;

export function TaskItem({
  task,
  isDragging,
  isDimmed,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textAreaRef.current) {
      const el = textAreaRef.current;
      el.focus();
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.text) onUpdate(trimmed);
    else if (!trimmed) onDelete();
    setEditing(false);
  }

  return (
    <Wrapper
      isDragging={isDragging}
      isDimmed={isDimmed}
      color={task.color}
      draggable={!editing}
      onDragStart={editing ? undefined : onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onDoubleClick={() => {
        setDraft(task.text);
        setEditing(true);
      }}
    >
      <Dot color={task.color} />

      {editing ? (
        <EditArea
          ref={textAreaRef}
          value={draft}
          rows={1}
          onChange={e => {
            setDraft(e.target.value);
            const el = e.target;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }}
          onBlur={commitEdit}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
            if (e.key === 'Escape') { setEditing(false); setDraft(task.text); }
          }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <Text>{task.text}</Text>
      )}

      {!editing && (
        <DeleteBtn
          className="delete-btn"
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Delete task"
        >
          ×
        </DeleteBtn>
      )}
    </Wrapper>
  );
}
