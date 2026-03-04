/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          coral: '#F97316',
          green: '#22C55E',
          amber: '#F59E0B',
          red: '#EF4444',
          blue: '#3B82F6',
        },
        surface: {
          bg: '#F8FAFB',
          card: '#FFFFFF',
          border: '#E5E7EB',
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        dark: {
          bg: '#111827',
          card: '#1F2937',
          border: '#374151',
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
