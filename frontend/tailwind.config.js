/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050505',
          deep: '#030303',
          card: '#0D0D0D',
          elevated: '#141414',
          subtle: '#1A1A1A',
        },
        agri: {
          orange: '#FF6B00',
          'orange-glow': '#FF7A00',
          'orange-bright': '#FF8C1A',
          amber: '#F59E0B',
          green: '#10B981',
          'green-glow': '#34D399',
          danger: '#EF4444',
          warning: '#F59E0B',
        },
        surface: {
          border: 'rgba(255, 107, 0, 0.18)',
          'border-subtle': 'rgba(255, 255, 255, 0.08)',
          glass: 'rgba(13, 13, 13, 0.75)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'scan-line': 'scan 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-orange': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 107, 0, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 107, 0, 0.75)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
