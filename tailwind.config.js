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
          900: '#0F172A',
          800: '#1E293B',
          700: '#1B3A6B',
          500: '#2563EB',
          300: '#93C5FD',
        },
        amber: '#F59E0B',
        green: '#10B981',
        purple: '#8B5CF6',
        rose: '#F43F5E',
        text: {
          1: '#F8FAFC',
          2: '#94A3B8',
        }
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
