/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        brand: {
          700: '#0f8a5f',
          600: '#16a34a',
          500: '#22c55e',
        },
        danger: {
          600: '#dc2626',
          500: '#ef4444',
        },
        bgdark: '#08303a',
        muted: '#6b7280',
        // Election 2026 Theme Colors
        'election-green': '#1FA757',
        'election-red': '#D62828',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

