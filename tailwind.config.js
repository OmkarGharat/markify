/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#10B981',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        gold: {
          DEFAULT: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
