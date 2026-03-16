import styled from '@emotion/styled';
import { MONTH_NAMES } from '@/utils/calendar';
import { theme } from '@/utils/theme';

interface Props {
  year: number;
  month: number;
  searchQuery: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSearch: (q: string) => void;
}

const Header = styled.header`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  box-shadow: ${theme.shadow.card};
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: ${theme.colors.text};
  min-width: 180px;
`;

const Btn = styled.button`
  padding: 5px 10px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.textMuted};
  transition: background 0.12s;
  line-height: 1;

  &:hover { background: ${theme.colors.bg}; }
  &:active { transform: scale(0.97); }
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  font-size: 13px;
  outline: none;
  min-width: 180px;
  font-family: inherit;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  transition: border-color 0.12s, box-shadow 0.12s;

  &:focus {
    border-color: ${theme.colors.borderFocus};
    box-shadow: 0 0 0 2px rgba(76,154,255,0.2);
  }

  &::placeholder { color: ${theme.colors.textSubtle}; }
`;

export function CalendarHeader({ year, month, searchQuery, onPrev, onNext, onToday, onSearch }: Props) {
  return (
    <Header>
      <NavGroup>
        <Btn onClick={onPrev} aria-label="Previous month">‹</Btn>
        <Btn onClick={onNext} aria-label="Next month">›</Btn>
      </NavGroup>
      <Title>{MONTH_NAMES[month]} {year}</Title>
      <Btn onClick={onToday}>Today</Btn>
      <SearchInput
        type="search"
        placeholder="Search tasks…"
        value={searchQuery}
        onChange={e => onSearch(e.target.value)}
        aria-label="Search tasks"
      />
    </Header>
  );
}
