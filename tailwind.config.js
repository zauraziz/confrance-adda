/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#002366', dark: '#001029', deep: '#001a4d' },
        gold:  { DEFAULT: '#c9a55a', dark: '#8a6a2c' },
        cream: '#f7f6f1',
        ink:   '#0a1a3d',
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Fraunces', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
};
