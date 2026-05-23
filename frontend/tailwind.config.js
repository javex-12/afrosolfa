/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#050505',
          zinc: '#0f0f0f',
          accent: '#10b981',
          'accent-dark': '#065f46',
          muted: '#737373',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient': "url('https://grainy-gradients.vercel.app/noise.svg'), radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent), radial-gradient(circle at bottom left, rgba(6, 95, 70, 0.1), transparent)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}