/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gold: {
          100: '#fcf8e3',
          200: '#f7ebaf',
          300: '#f0d875',
          400: '#e5c143',
          500: '#D4AF37', // Metallic Gold
          600: '#b58e24',
          700: '#8c6b19',
          800: '#664d12',
          900: '#3d2d0a',
        },
        darkbg: '#0c0b09',
        darkcard: '#14120e',
      }
    },
  },
  plugins: [],
}
