import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#0F8B5F',
  primaryDark: '#0A5E43',
  background: '#F5F7F9',
  surface: '#FFFFFF',
  text: '#12231C',
  textSecondary: '#5C6B65',
  textMuted: '#8A9691',
  border: '#E3EAE6',
  primarySoft: '#E7F6EF',
  primaryMuted: '#D3EEE2',
  star: '#E2A312',
  white: '#FFFFFF',
  danger: '#B42318',
  shadow: '#0A5E43',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const shadows: { card: ViewStyle; soft: ViewStyle; header: ViewStyle } = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
};

export const typography: Record<string, TextStyle> = {
  hero: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  section: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.text,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};

export const appConfig = {
  name: 'Play More',
  tagline: 'Book your next game',
};
