/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        // Mendefinisikan warna primary dan memastikan semua shade tersedia
        primary: {
          50: '#f9f5f2',
          100: '#f0e6df',
          200: '#e2cdbf',
          300: '#d0ae99',
          400: '#b98c6e',
          500: '#a27050',
          600: '#8d5a3c',
          700: '#7B4019', // Warna utama yang diinginkan
          800: '#663618',
          900: '#542d15',
          950: '#2d180b',
        },
        accent: {
          50: '#f7f2fa',
          100: '#eae0f2',
          200: '#d8bfe6',
          300: '#c493d7',
          400: '#a762c5',
          500: '#8d3ab3',
          600: '#78299e',
          700: '#611c82',
          800: '#4e1768',
          900: '#3e1352',
          950: '#24062f',
        },
        orange: {
          50: '#fffaf2',
          100: '#fef0d9',
          200: '#fdd9a8',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c', // Keemasan yang kamu mau
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        success: {
          50: '#f2fbf5',
          100: '#d9f4e2',
          200: '#b6e9c8',
          300: '#8bdbaa',
          400: '#5ecb88',
          500: '#35b768',
          600: '#259d56',
          700: '#1b7f45',
          800: '#166438',
          900: '#0f4d2c',
          950: '#062c17',
        },
        danger: {
          50: '#fef2f2',
          100: '#fde0e0',
          200: '#fbb8b8',
          300: '#f38c8c',
          400: '#e95e5e',
          500: '#dd3434',
          600: '#c22020',
          700: '#a01818',
          800: '#841515',
          900: '#6c1212',
          950: '#3b0707',
        },
        yellow: {
          50: '#fff9f0',
          100: '#fef0d5',
          200: '#fddb9e',
          300: '#fcc766',
          400: '#f9b236',
          500: '#f59e0b',
          600: '#d98008',
          700: '#b76607',
          800: '#945106',
          900: '#7a4205',
          950: '#401f02',
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0a0a0a',
        },
      }
    }
  },
  // Menambahkan plugin Flowbite untuk memastikan tema bekerja dengan komponen Flowbite
  plugins: [
    require('flowbite/plugin'),
  ]
};