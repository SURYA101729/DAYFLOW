/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1E3A5F',
          light: '#F0F4F8',
          accent: '#3498DB'
        },
        success: {
          DEFAULT: '#2ECC71'
        },
        warning: {
          DEFAULT: '#F39C12'
        },
        danger: {
          DEFAULT: '#E74C3C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(30, 58, 95, 0.08), 0 2px 12px -1px rgba(30, 58, 95, 0.04)',
        'premium-hover': '0 10px 30px -3px rgba(30, 58, 95, 0.12), 0 4px 18px -2px rgba(30, 58, 95, 0.06)',
      }
    },
  },
  plugins: [],
}
