/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
// const defaultTheme = require('tailwindcss/defaultTheme');
// const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        primary: {
          400: '#3C7A9C',
          300: '#6096B4',
          200: '#93BFCF',
          100: '#BDCDD6',
        },
        secondary: {
          DEFAULT: '#EEE9DA',
        },
        text: {
          DEFAULT: '#333333',
          light: '#6F6E6E',
          dark: '#2F2E41',
        },
      },
      backgroundImage: {
        'waves-pattern': "url('/img/background.png')",
      },
      fontFamily: {
        body: ['Raleway'],
        sans: ['Raleway'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
