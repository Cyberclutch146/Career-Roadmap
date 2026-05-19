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
        background: '#1e0f0f',
        surface: {
          DEFAULT: '#1e0f0f',
          dim: '#1e0f0f',
          bright: '#473533',
          container: {
            DEFAULT: '#2c1b1a',
            lowest: '#180a0a',
            low: '#271817',
            high: '#372625',
            highest: '#43302f',
          },
          variant: '#43302f',
          tint: '#ffb3ae',
        },
        // === Primary (Warm Coral/Rose) ===
        primary: {
          DEFAULT: '#ffb3ae',
          container: '#ff5354',
          fixed: '#ffdad7',
          'fixed-dim': '#ffb3ae',
        },
        'on-primary': {
          DEFAULT: '#68000d',
          container: '#5c000a',
          fixed: '#410005',
          'fixed-variant': '#930016',
        },
        'inverse-primary': '#ba1826',
        // === Secondary (Pink/Rose) ===
        secondary: {
          DEFAULT: '#ffb1c3',
          container: '#7b2944',
          fixed: '#ffd9e0',
          'fixed-dim': '#ffb1c3',
        },
        'on-secondary': {
          DEFAULT: '#5e122e',
          container: '#ff96b1',
          fixed: '#3f0019',
          'fixed-variant': '#7b2944',
        },
        // === Tertiary (Muted Lavender) ===
        tertiary: {
          DEFAULT: '#c8c5cb',
          container: '#919095',
          fixed: '#e4e1e7',
          'fixed-dim': '#c8c5cb',
        },
        'on-tertiary': {
          DEFAULT: '#303034',
          container: '#29292d',
          fixed: '#1b1b1f',
          'fixed-variant': '#47464b',
        },
        // === On-Surface/Text ===
        'on-surface': {
          DEFAULT: '#f9dcd9',
          variant: '#e4bebb',
        },
        'on-background': '#f9dcd9',
        // === Outline ===
        outline: {
          DEFAULT: '#ab8986',
          variant: '#5b403e',
        },
        // === Error ===
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        'on-error': {
          DEFAULT: '#690005',
          container: '#ffdad6',
        },
        // === Inverse ===
        'inverse-surface': '#f9dcd9',
        'inverse-on-surface': '#3e2c2b',

        // === Legacy aliases (for gradual migration) ===
        success: {
          DEFAULT: '#86d993',
          dark: '#2f9e44',
        },
        warning: '#ffc078',
        'success-dark': '#2f9e44',
      },
      fontFamily: {
        // Stitch design system fonts
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        label: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // Legacy aliases
        serif: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
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
        full: '9999px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.2)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.25)',
        lifted: '0 8px 24px rgba(0, 0, 0, 0.3)',
        glow: '0 4px 20px -6px rgba(255, 179, 174, 0.35)',
        'glow-secondary': '0 4px 20px -6px rgba(255, 177, 195, 0.25)',
        inner: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
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


