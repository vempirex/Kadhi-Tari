/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        handwritten: ['"Dancing Script"', 'cursive'],
      },
      colors: {
        background: '#0a0a0c',
        card: 'rgba(20, 20, 23, 0.6)',
        primary: {
          DEFAULT: '#ff8ab0',
          light: '#ffb5cf',
          dark: '#e66a91',
        },
        secondary: {
          DEFAULT: '#ffd166',
          light: '#ffe199',
          dark: '#e6bc5c',
        },
        glow: {
          pink: 'rgba(255, 138, 176, 0.2)',
          yellow: 'rgba(255, 209, 102, 0.2)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'cinematic-gradient': 'radial-gradient(circle at top right, rgba(255, 138, 176, 0.1), transparent), radial-gradient(circle at bottom left, rgba(255, 209, 102, 0.05), transparent)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
