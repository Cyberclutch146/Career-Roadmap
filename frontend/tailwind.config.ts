import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === Core Surface System (Dark Mode) ===
        background: '#0a0a0b',
        surface: {
          DEFAULT: '#0a0a0b',
          dim: '#0a0a0b',
          bright: '#1c1c1e',
          container: {
            DEFAULT: '#141415',
            lowest: '#050506',
            low: '#0f0f10',
            high: '#1c1c1e',
            highest: '#2a2a2c',
          },
          variant: '#2a2a2c',
          tint: '#f59e0b',
        },
        // === Primary (Warm Amber) ===
        primary: {
          DEFAULT: '#f59e0b',
          container: '#d97706',
          fixed: '#fef3c7',
          'fixed-dim': '#f59e0b',
        },
        'on-primary': {
          DEFAULT: '#000000',
          container: '#000000',
          fixed: '#000000',
          'fixed-variant': '#000000',
        },
        'inverse-primary': '#b45309',
        // === Secondary (Orange) ===
        secondary: {
          DEFAULT: '#f97316',
          container: '#ea580c',
          fixed: '#ffedd5',
          'fixed-dim': '#f97316',
        },
        'on-secondary': {
          DEFAULT: '#000000',
          container: '#000000',
          fixed: '#000000',
          'fixed-variant': '#000000',
        },
        // === Tertiary (Muted Lavender / Gray) ===
        tertiary: {
          DEFAULT: '#71717a',
          container: '#3f3f46',
          fixed: '#e4e4e7',
          'fixed-dim': '#a1a1aa',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#ffffff',
          fixed: '#09090b',
          'fixed-variant': '#27272a',
        },
        // === On-Surface/Text ===
        'on-surface': {
          DEFAULT: '#fafafa',
          variant: '#a1a1aa',
        },
        'on-background': '#fafafa',
        // === Outline ===
        outline: {
          DEFAULT: '#52525b',
          variant: '#27272a',
        },
        // === Error ===
        error: {
          DEFAULT: '#ef4444',
          container: '#991b1b',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#fecaca',
        },
        // === Inverse ===
        'inverse-surface': '#fafafa',
        'inverse-on-surface': '#18181b',

        // === Legacy aliases (for gradual migration) ===
        success: {
          DEFAULT: '#d97706', // Amber 600 equivalent
          dark: '#b45309',    // Amber 700 equivalent
        },
        warning: '#f59e0b',
        'success-dark': '#b45309',
      },
      fontFamily: {
        // Stitch design system fonts
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        headline: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        label: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        // Legacy aliases
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['72px', { lineHeight: '80px', letterSpacing: '-0.04em', fontWeight: '800' }],
        'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '500' }],
      },
      spacing: {
        'stack-sm': '16px',
        'stack-md': '32px',
        'stack-lg': '64px',
        'margin-mobile': '20px',
        'margin-desktop': '80px',
        gutter: '24px',
        unit: '8px',
        'container-max': '1440px',
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        reading: '720px',
        dashboard: '1200px',
        'container-max': '1440px',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.4)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.5)',
        lifted: '0 8px 24px rgba(0, 0, 0, 0.6)',
        glow: '0 4px 16px -4px rgba(245, 158, 11, 0.25)',
        'glow-hover': '0 8px 24px -4px rgba(245, 158, 11, 0.4)',
        'glow-secondary': '0 4px 20px -6px rgba(249, 115, 22, 0.15)',
        inner: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


