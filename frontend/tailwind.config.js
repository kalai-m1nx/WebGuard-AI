/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#151C2C',
        primary: '#00D1FF',
        danger: '#FF3366',
        warning: '#FFB800',
        success: '#00E676',
        textMain: '#E2E8F0',
        textMuted: '#94A3B8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
