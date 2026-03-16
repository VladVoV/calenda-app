import { css } from '@emotion/react';

export const theme = {
  colors: {
    bg: '#f4f5f7',
    surface: '#ffffff',
    surfaceSunken: '#fafbfc',
    border: '#dfe1e6',
    borderFocus: '#4c9aff',
    text: '#172b4d',
    textMuted: '#6b778c',
    textSubtle: '#97a0af',
    today: '#fffbe6',
    todayAccent: '#0052cc',
    dragOver: '#deebff',
    holidayBg: '#fff0b3',
    holidayText: '#974f0c',
    taskBg: '#f4f5f7',
    taskBgHover: '#ebecf0',
  },
  radii: {
    sm: '3px',
    md: '4px',
    lg: '8px',
  },
  font: {
    base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    size: {
      xs: '10px',
      sm: '12px',
      md: '13px',
      base: '14px',
    },
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.1)',
    elevated: '0 3px 8px rgba(0,0,0,0.12)',
  },
};

export type Theme = typeof theme;

export const globalStyles = css`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #root {
    height: 100%;
  }
  body {
    font-family: ${theme.font.base};
    background: ${theme.colors.bg};
    color: ${theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }
`;
