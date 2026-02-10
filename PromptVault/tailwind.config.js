/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/popup/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b', // zinc-950
        surface: '#18181b', // zinc-900
        border: '#27272a', // zinc-800
        primary: '#3b82f6', // blue-500
        primaryHover: '#2563eb', // blue-600
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
