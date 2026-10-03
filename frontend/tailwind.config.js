/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070C18',
          900: '#0B132B',
          800: '#151F38',
          700: '#1C2541',
          600: '#2A3656',
        },
        emeraldWater: {
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        tealCyan: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        coralAlert: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.3)',
        'glow-teal': '0 0 20px -3px rgba(20, 184, 166, 0.3)',
        'glow-coral': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
