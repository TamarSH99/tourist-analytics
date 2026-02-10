import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 20,
    h1: { fontSize: 64 },
    h2: { fontSize: 56 },
    h3: { fontSize: 48 },
    h4: { fontSize: 40 },
    h5: { fontSize: 32 },
    h6: { fontSize: 28 },
    body1: { fontSize: 24 },
    body2: { fontSize: 22 },
    caption: { fontSize: 20 },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  // Custom chart colors
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Extended theme with custom chart colors
declare module '@mui/material/styles' {
  interface Theme {
    charts: {
      primary: string;
      primaryGradient: string;
      secondary: string;
      secondaryGradient: string;
      success: string;
      successGradient: string;
      grid: string;
      axis: string;
      tooltip: {
        background: string;
        border: string;
        shadow: string;
      };
      gradients: {
        blue: string[];
        red: string[];
        green: string[];
        purple: string[];
      };
    };
  }
  interface ThemeOptions {
    charts?: {
      primary?: string;
      primaryGradient?: string;
      secondary?: string;
      secondaryGradient?: string;
      success?: string;
      successGradient?: string;
      grid?: string;
      axis?: string;
      tooltip?: {
        background?: string;
        border?: string;
        shadow?: string;
      };
      gradients?: {
        blue?: string[];
        red?: string[];
        green?: string[];
        purple?: string[];
      };
    };
  }
}

theme.charts = {
  primary: theme.palette.primary.main,
  primaryGradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  secondary: theme.palette.secondary.main,
  secondaryGradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  success: theme.palette.success.main,
  successGradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
  grid: 'rgba(148, 163, 184, 0.2)',
  axis: theme.palette.grey[300],
  tooltip: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: `1px solid rgba(59, 130, 246, 0.2)`,
    shadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  gradients: {
    blue: [theme.palette.primary.main, theme.palette.primary.light],
    red: [theme.palette.secondary.main, theme.palette.secondary.light],
    green: [theme.palette.success.main, theme.palette.success.light],
    purple: ['#8b5cf6', '#a78bfa'],
  },
};

export default theme;