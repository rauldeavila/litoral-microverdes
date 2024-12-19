/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        underline: {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' }
        },
        circle: {
          '0%': {
            'stroke-dasharray': '283',
            'stroke-dashoffset': '283',
          },
          '100%': {
            'stroke-dasharray': '283',
            'stroke-dashoffset': '0',
          }
        }
      },
      animation: {
        underline: 'underline 0.7s ease-out forwards',
        circle: 'circle 1s ease-out forwards'
      }
    },
  },
  plugins: [],
}