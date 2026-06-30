/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          black: '#08070d',
          panel: '#0e0c16',
          purple: {
            DEFAULT: '#7c3aed',
            deep: '#4c1d95',
            glow: '#a855f7',
          },
          red: {
            DEFAULT: '#e11d48',
            glow: '#fb7185',
          },
          gold: '#f5b942',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cinema-radial':
          'radial-gradient(circle at 20% 0%, rgba(124,58,237,0.18), transparent 45%), radial-gradient(circle at 85% 15%, rgba(225,29,72,0.15), transparent 40%)',
        'purple-red': 'linear-gradient(135deg, #7c3aed 0%, #e11d48 100%)',
      },
      boxShadow: {
        glow: '0 0 30px -5px rgba(124,58,237,0.45)',
        'glow-red': '0 0 30px -5px rgba(225,29,72,0.5)',
        card: '0 10px 40px -10px rgba(0,0,0,0.6)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
