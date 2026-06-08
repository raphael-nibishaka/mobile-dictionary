/** Design tokens aligned with the LexiDict style guide */
export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceSecondary: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    primary: '#6366F1',
    secondary: '#A855F7',
    error: '#EF4444',
    success: '#22C55E',
    cardShadow: 'rgba(99, 102, 241, 0.12)',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    border: '#475569',
    primary: '#818CF8',
    secondary: '#C084FC',
    error: '#F87171',
    success: '#4ADE80',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export const Gradients = {
  primary: ['#6366F1', '#A855F7'] as const,
  card: ['#6366F1', '#818CF8'] as const,
  wordOfDay: ['rgba(99, 102, 241, 0.85)', 'rgba(168, 85, 247, 0.9)'] as const,
};

export const BorderRadius = {
  card: 20,
  button: 20,
  pill: 999,
  input: 20,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
