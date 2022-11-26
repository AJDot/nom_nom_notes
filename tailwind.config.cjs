/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        card: '0 2px 8px 0 rgb(0 0 0 / 30%)',
      },
      borderColor: {
        transparent: 'transparent',
      },
    },
    colors: {
      'black': {
        DEFAULT: '#000',
      },
      'blue': {
        100: '#a3cef2',
        300: '#72b1e6',
        DEFAULT: '#4d9ad9',
        700: '#72b1e6',
        900: '#0b6ab9',
      },
      'red': {
        DEFAULT: '#ff834e',
      },
      'green': {
        100: '#9ef4d1',
        300: '#6be8b6',
        DEFAULT: '#44dd9f',
        700: '#22d08a',
        900: '#00c073',
      },
      'orange': {
        DEFAULT: '#ffb54e',
      },
      'gray': {
        100: '#f8f8f8',
        300: '#c9c7c7',
        400: '#ddd',
        DEFAULT: '#9d9c9c',
        900: '#333',
      },
      'white': {
        DEFAULT: '#fff',
      },
    },
    fontFamily: {
      sans: '"Josefin Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      serif: '"Josefin Slab", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
  },
  plugins: [],
}