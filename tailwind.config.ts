import type { Config } from 'tailwindcss'

export default {
  content: [
    './resources/**/*.{js,ts,jsx,tsx,svelte}',
    './resources/views/**/*.blade.php',
    './app/**/*.php',
    './storage/framework/views/*.php',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
} satisfies Config