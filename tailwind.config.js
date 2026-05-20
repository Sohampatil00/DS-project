/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: 'rgb(var(--color-brand-900) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
        },
        amber: '#F59E0B',
        green: '#10B981',
        purple: '#8B5CF6',
        rose: '#F43F5E',
        text: {
          1: 'rgb(var(--color-text-1) / <alpha-value>)',
          2: 'rgb(var(--color-text-2) / <alpha-value>)',
        },
        borderAdaptive: 'rgb(var(--color-border-adaptive) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      spacing: {
        base: '4px',
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        input: '8px',
      },
      boxShadow: {
        layer: '0 1px 2px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)',
        glow: '0 0 80px rgba(37,99,235,0.3)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 60% 0%, #1B3A6B 0%, #0F172A 60%)',
        'cta-gradient': 'linear-gradient(135deg, #2563EB, #8B5CF6)',
        'free-gradient': 'linear-gradient(135deg, #10B981, #059669)',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
}
