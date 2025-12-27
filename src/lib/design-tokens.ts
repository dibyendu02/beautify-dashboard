/**
 * Centralized Design Tokens for Beautify Dashboard
 * 
 * This file contains all design constants used throughout the application
 * to ensure consistency and make global design changes easier.
 */

export const colors = {
    // Champagne Gold - Primary
    primary: {
        50: '#FAF8F3',
        100: '#F5F1E7',
        200: '#EBE3CF',
        300: '#E0D5B7',
        400: '#D6C79F',
        500: '#D4AF37', // Main
        600: '#B8961F',
        700: '#8A7017',
        800: '#5C4A0F',
        900: '#2E2508',
    },
    // Deep Navy - Secondary
    secondary: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B', // Main
        900: '#0F172A',
    },
    // Rose Gold - Accent
    accent: {
        500: '#E5446D',
        600: '#D0255D',
        700: '#B76E79', // Main
    },
    // Status Colors
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
} as const;

export const borderRadius = {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.625rem',   // 10px
    '2xl': '0.75rem', // 12px
    '3xl': '1rem',    // 16px
    full: '9999px',
} as const;

export const spacing = {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
} as const;

export const fontSize = {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
} as const;

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
} as const;

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export const transitions = {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
} as const;

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};
