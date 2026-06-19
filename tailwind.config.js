/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e1a',
          900: '#0f1626',
          800: '#161f35',
          700: '#1e2a47',
          600: '#2a3a5f',
        },
        amber: {
          400: '#f0a868',
          500: '#e8954f',
          600: '#d97f3a',
        },
        slate: {
          50: '#f8f9fb',
          100: '#eef0f4',
          400: '#8b94a7',
          500: '#6b7488',
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}