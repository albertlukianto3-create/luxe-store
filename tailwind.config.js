module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: { 950: '#0a0a0f', 900: '#101018', 800: '#171722', 700: '#22222f' }, gold: '#e8b85a' },
      fontFamily: { sans: ['var(--font-body)', 'sans-serif'], display: ['var(--font-display)', 'serif'] },
    },
  },
  plugins: [],
};
