/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F6F4EE',
        surface: '#FFFDF8',
        'surface-elevated': '#FFFFFF',
        'dark-text': '#17211D',
        'muted-text': '#68726D',
        border: '#D9D8D0',
        'border-focus': '#2F5D50',
        'primary-green': '#2F5D50',
        'primary-green-hover': '#24483E',
        'soft-green': '#E4ECE6',
        'warm-accent': '#B65331',
        'warm-accent-hover': '#984325',
        'soft-warm': '#F4E7DF',
        'card-bg': '#FDFBF7',
        'gate-accent': '#D9822B',
        'gate-phase': '#3D7A68',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(23, 33, 29, 0.05), 0 1px 2px rgba(23, 33, 29, 0.03)',
        'card': '0 2px 6px rgba(23, 33, 29, 0.04), 0 1px 3px rgba(23, 33, 29, 0.02)',
        'elevated': '0 10px 25px -5px rgba(23, 33, 29, 0.06), 0 8px 10px -6px rgba(23, 33, 29, 0.04)',
      },
    },
  },
  plugins: [],
}
