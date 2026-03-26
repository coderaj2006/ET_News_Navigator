/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        panel: '#151518',
        border: '#2a2a2e',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        text: {
          primary: '#f3f4f6',
          secondary: '#9ca3af',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
