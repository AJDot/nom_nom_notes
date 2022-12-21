const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: ({ theme }) => ({
        card: '0 2px 8px 0 rgb(0 0 0 / 30%)',
        input: `0 0 1px 0 ${theme.colors.gray[900]}`,
      }),
      borderColor: {
        transparent: 'transparent',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
        drag: 'height, margin, padding',
        background: 'background',
        transform: 'transform',
      },
      backgroundColor: {
        initial: 'initial',
      },
    },
    colors: {
      'black': {
        DEFAULT: 'rgb(var(--color-black) / <alpha-value>)',
      },
      'blue': {
        100: 'rgb(var(--color-blue-100) / <alpha-value>)',
        300: 'rgb(var(--color-blue-300) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-blue-500) / <alpha-value>)',
        500: 'rgb(var(--color-blue-500) / <alpha-value>)',
        700: 'rgb(var(--color-blue-700) / <alpha-value>)',
        900: 'rgb(var(--color-blue-900) / <alpha-value>)',
      },
      'red': {
        100: 'rgb(var(--color-red-100) / <alpha-value>)',
        300: 'rgb(var(--color-red-300) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-red-500) / <alpha-value>)',
        500: 'rgb(var(--color-red-500) / <alpha-value>)',
        700: 'rgb(var(--color-red-700) / <alpha-value>)',
        900: 'rgb(var(--color-red-900) / <alpha-value>)',
      },
      'green': {
        100: 'rgb(var(--color-green-100) / <alpha-value>)',
        300: 'rgb(var(--color-green-300) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-green-500) / <alpha-value>)',
        500: 'rgb(var(--color-green-500) / <alpha-value>)',
        700: 'rgb(var(--color-green-700) / <alpha-value>)',
        900: 'rgb(var(--color-green-900) / <alpha-value>)',
      },
      'orange': {
        DEFAULT: 'rgb(var(--color-orange-500) / <alpha-value>)',
        500: 'rgb(var(--color-orange-500) / <alpha-value>)',
      },
      'gray': {
        100: 'rgb(var(--color-gray-100) / <alpha-value>)',
        300: 'rgb(var(--color-gray-300) / <alpha-value>)',
        400: 'rgb(var(--color-gray-400) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-gray-500) / <alpha-value>)',
        500: 'rgb(var(--color-gray-500) / <alpha-value>)',
        900: 'rgb(var(--color-gray-900) / <alpha-value>)',
      },
      'white': {
        DEFAULT: 'rgb(var(--color-white) / <alpha-value>)',
      },
    },
    fontFamily: {
      sans: '"Josefin Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      serif: '"Josefin Slab", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    }
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.horizontal-tb': {
          'writing-mode': 'horizontal-tb',
        },
        '.vertical-rl': {
          'writing-mode': 'vertical-rl'
        },
        '.vertical-lr': {
          'writing-mode': 'vertical-lr'
        },
      })
      addUtilities({
        '.text-orient-upright': {
          'text-orientation': 'upright',
        },
      })
    })
  ],
}